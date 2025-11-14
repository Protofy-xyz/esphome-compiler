/*
app is an express object, you can use app.get/app.post to create new endpoints
you can define newendpoints like:

app.get('/api/v1/testapi', (req, res) => {
    //you code goes here
    //reply with res.send(...)
})

the session argument is a session object, with the following shape:
{
    user: { admin: boolean, id: string, type: string },
    token: string,
    loggedIn: boolean
}

use the chat if in doubt
*/

import { Protofy } from "protolib/base";
import { getAuth } from "protolib/api";
import { getLogger, API } from "protolib/base";
import { Application } from "express";
import fs from "fs";
import path from "path";
import Bull from "bull";

const root = path.join(process.cwd(), "..", "..");
const logger = getLogger();

Protofy("type", "IOTRouter");

export default Protofy("code", async (app, context) => {
  ///PUT YOUR ROUTER LOGIC HERE
  //context.devicePub function allows to communicate with devices via mqtt
  //contextdeviceSub allows to receive notifications from devices via mqtt
  //app is a normal expressjs object
  //context.mqtt is a mqttclient connection

  // TODO refactor this example (message callback)
  //IoT device flow example:
  // context.deviceSub('testdevice', 'testbutton', (message) => {
  //     message == 'ON' ?
  //         context.devicePub('testdevice', 'switch', 'testrelay', 'OFF')
  //         : context.devicePub('testdevice', 'switch', 'testrelay', 'ON')
  // })

  const compileQueue = new Bull("compileQueue");

  const maxConcurrentCompilations = 5;

  compileQueue.process(maxConcurrentCompilations, async (job) => {
    const { targetDevice, compileSessionId } = job.data;
    const fileName = targetDevice + "-" + compileSessionId;

    return new Promise((resolve, reject) => {
      context.os.spawn(
        "esphome",
        ["compile", fileName + ".yaml"],
        {
          cwd: "../../data/esphome",
          shell: true,
        },
        async (data) => {
          context.topicPub('device/compile/'+compileSessionId, JSON.stringify({message: data, deviceName: targetDevice}));
        },
        async (data) => {
          context.topicPub('device/compile/'+compileSessionId, JSON.stringify({message: data, deviceName: targetDevice}));
        },
        async (code) => {
          if (code == 0) {
            context.topicPub('device/compile/'+compileSessionId, JSON.stringify({event: "exit", code: code, deviceName: targetDevice}));
            const fwOriginPath = '.esphome/build/'+ fileName + '/.pioenvs/' + targetDevice +'/firmware.factory.bin'
            const fwDestinationPath = fileName + '.bin'
            const elfOriginPath = '.esphome/build/'+ fileName + '/.pioenvs/' + targetDevice +'/firmware.elf'
            const elfDestinationPath = fileName + '.elf'
            context.os.spawn(
              "cp",
              [fwOriginPath, fwDestinationPath],
              {
                cwd: "../../data/esphome",
                shell: true,
              },
              null,
              null,
              null,
              null,
            )
            context.os.spawn(
              "cp",
              [elfOriginPath, elfDestinationPath],
              {
                cwd: "../../data/esphome",
                shell: true,
              },
              null,
              null,
              null,
              null,
            )
            resolve();
          } else {
            context.topicPub('device/compile/'+compileSessionId, JSON.stringify({event: "exit", code: code, deviceName: targetDevice}));
            reject(new Error("Can't compile device"));
          }
        }
      );
    });
  });

  app.get("/api/v1/device/compile/:targetDevice", async (req, res) => {
    const targetDevice = req.params.targetDevice;
    const compileSessionId = req.query.compileSessionId;
    try {
      const job = await compileQueue.add({
        targetDevice: targetDevice,
        compileSessionId: compileSessionId
      });

      context.topicPub(
        `device/compile/${compileSessionId}`,
        JSON.stringify({
          message: "Job added to queue",
          position: jobOrder.length, // Approximate position
          status: "queued",
          deviceName: targetDevice,
        })
      );

      res.status(202).send({ status: job, sessionId: compileSessionId });
    } catch (error) {
      res.status(500).send({
        status: "Failed to start compilation",
        error: true,
        message: "Internal Server Error",
      });
    }
  });

  let jobOrder = [];

  compileQueue.on("waiting", (jobId) => {
    // When a job is added to the waiting list, add it to our jobOrder array
    jobOrder.push(jobId);
    updateJobPositions();
  });

  compileQueue.on("completed", async (job) => {
    console.log("🤖 ~ compileQueue.on ~ job:", job);
    // When a job is completed, remove it from our jobOrder array
    jobOrder = jobOrder.filter((id) => id !== job.id);
    updateJobPositions();
    context.object.update(
      "compilation",
      job.data.compileSessionId,
      {
        done: true,
      },
      null,
      null,
      null
    );
  });

  compileQueue.on("active", (job) => {
    // Optionally handle active jobs separately if needed
    context.topicPub(`device/compile/${job.data.compileSessionId}`, JSON.stringify({
        message: "Job is now active",
        position: 1, // Active job is always at the front of the line
        status: "active",
        deviceName: job.data.targetDevice,
      })
    );
  });
  async function updateJobPositions() {
    // Broadcast updated positions
    for (let index = 0; index < jobOrder.length; index++) {
      const jobId = jobOrder[index];
      const job = await compileQueue.getJob(jobId);
      if (job && job.finishedOn==null) {
        context.topicPub(`device/compile/${job.data.compileSessionId}`, JSON.stringify({
          message: "Queue update",
          position: index + 1 - maxConcurrentCompilations,  // Convert index to 1-based position
          status: 'queued',
          deviceName: job.data.targetDevice,
        }));
      }
    }
  }
  
});
