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
const esphomeDataDir = path.join(root, "data", "esphome");
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

  const findExistingCompilationForDevice = async (targetDevice: string) => {
    const [activeJobs, waitingJobs, delayedJobs] = await Promise.all([
      compileQueue.getActive(),
      compileQueue.getWaiting(),
      compileQueue.getDelayed(),
    ]);

    const isSameDevice = (job: any) =>
      job?.data?.targetDevice === targetDevice && job?.finishedOn == null;

    const activeJob = activeJobs.find(isSameDevice);
    if (activeJob) return { job: activeJob, status: "active" as const };

    const queuedJob = [...waitingJobs, ...delayedJobs].find(isSameDevice);
    if (queuedJob) return { job: queuedJob, status: "queued" as const };

    return null;
  };

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
            const buildDir = path.join(
              esphomeDataDir,
              ".esphome",
              "build",
              fileName,
              ".pioenvs",
              targetDevice
            );

            const copyIfExists = async (src: string, dst: string) => {
              try {
                await fs.promises.access(src, fs.constants.F_OK);
                await fs.promises.copyFile(src, dst);
                return true;
              } catch {
                return false;
              }
            };

            try {
              await copyIfExists(
                path.join(buildDir, "firmware.factory.bin"),
                path.join(esphomeDataDir, `${fileName}.bin`)
              );

              await copyIfExists(
                path.join(buildDir, "firmware.elf"),
                path.join(esphomeDataDir, `${fileName}.elf`)
              );

              const otaCopied = await copyIfExists(
                path.join(buildDir, "firmware.bin"),
                path.join(esphomeDataDir, `${fileName}.ota.bin`)
              );

              if (!otaCopied) {
                context.topicPub(
                  `device/compile/${compileSessionId}`,
                  JSON.stringify({
                    message: "OTA binary not found (expected firmware.ota.bin)",
                    deviceName: targetDevice,
                  })
                );
              }

              resolve();
            } catch (e) {
              reject(e);
            }
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
    const compileSessionId = String(req.query.compileSessionId ?? "");
    if (!compileSessionId) {
      res.status(400).send({
        error: true,
        message: "Missing compileSessionId",
      });
      return;
    }
    try {
      const existing = await findExistingCompilationForDevice(targetDevice);
      if (existing) {
        res.status(409).send({
          status: "Compilation already running",
          running: true,
          deviceName: targetDevice,
          existingSessionId: existing.job?.data?.compileSessionId,
          existingJobId: existing.job?.id,
          existingStatus: existing.status,
        });
        return;
      }

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
