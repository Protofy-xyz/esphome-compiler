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
import { buildDir as resolveBuildDir, artifactName, compileMessage } from "./compilerPaths";

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
    const { targetDevice, compileSessionId, projectId, network } = job.data;
    const fileName = artifactName(targetDevice, compileSessionId);
    const buildDirectory = resolveBuildDir(esphomeDataDir, targetDevice, compileSessionId, projectId);

    const pub = (payload: Record<string, unknown>) =>
      context.topicPub(`device/compile/${compileSessionId}`, JSON.stringify(payload));

    // --- DEBUG: estado del directorio de build ANTES de compilar ---
    const compileStart = Date.now();
    try {
      const exists = fs.existsSync(buildDirectory);
      console.log(`🔍 [PRE-COMPILE] buildDir: ${buildDirectory}`);
      console.log(`🔍 [PRE-COMPILE] exists: ${exists}`);
      if (exists) {
        const files = fs.readdirSync(buildDirectory);
        console.log(`🔍 [PRE-COMPILE] files in buildDir: ${files.join(', ')}`);
      }
      // Check parent .pioenvs dir for cached object files
      const pioenvDir = path.dirname(buildDirectory);
      if (fs.existsSync(pioenvDir)) {
        const pioFiles = fs.readdirSync(pioenvDir);
        console.log(`🔍 [PRE-COMPILE] files in .pioenvs/: ${pioFiles.join(', ')}`);
      }
      // Check build src dir for generated C++
      const srcDir = path.join(path.dirname(path.dirname(buildDirectory)), "src");
      if (fs.existsSync(srcDir)) {
        const srcFiles = fs.readdirSync(srcDir);
        console.log(`🔍 [PRE-COMPILE] src/ files: ${srcFiles.length} files`);
      }
    } catch (e) {
      console.log(`🔍 [PRE-COMPILE] error listing: ${e.message}`);
    }

    return new Promise((resolve, reject) => {
      context.os.spawn(
        "esphome",
        ["compile", fileName + ".yaml"],
        {
          cwd: "../../data/esphome",
          shell: true,
        },
        async (data) => {
          pub(compileMessage({ message: data, deviceName: targetDevice }, network));
        },
        async (data) => {
          pub(compileMessage({ message: data, deviceName: targetDevice }, network));
        },
        async (code) => {
          const elapsed = ((Date.now() - compileStart) / 1000).toFixed(1);
          console.log(`⏱️ [POST-COMPILE] exit code: ${code} | elapsed: ${elapsed}s | device: ${targetDevice} | projectId: ${projectId ?? 'none'}`);

          if (code == 0) {
            pub(compileMessage({ event: "exit", code: code, deviceName: targetDevice }, network));

            // --- DEBUG: estado del directorio de build DESPUÉS de compilar ---
            try {
              const files = fs.existsSync(buildDirectory) ? fs.readdirSync(buildDirectory) : [];
              console.log(`🔍 [POST-COMPILE] buildDir files: ${files.join(', ')}`);
              console.log(`🔍 [POST-COMPILE] looking for firmware.factory.bin: ${fs.existsSync(path.join(buildDirectory, 'firmware.factory.bin'))}`);
              console.log(`🔍 [POST-COMPILE] looking for firmware.bin: ${fs.existsSync(path.join(buildDirectory, 'firmware.bin'))}`);
            } catch (e) {
              console.log(`🔍 [POST-COMPILE] error listing: ${e.message}`);
            }

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
                path.join(buildDirectory, "firmware.factory.bin"),
                path.join(esphomeDataDir, `${fileName}.bin`)
              );

              await copyIfExists(
                path.join(buildDirectory, "firmware.elf"),
                path.join(esphomeDataDir, `${fileName}.elf`)
              );

              const otaCopied = await copyIfExists(
                path.join(buildDirectory, "firmware.bin"),
                path.join(esphomeDataDir, `${fileName}.ota.bin`)
              );

              if (!otaCopied) {
                pub(compileMessage({
                  message: "OTA binary not found (expected firmware.ota.bin)",
                  deviceName: targetDevice,
                }, network));
              }

              resolve();
            } catch (e) {
              reject(e);
            }
          } else {
            pub(compileMessage({ event: "exit", code: code, deviceName: targetDevice }, network));
            reject(new Error("Can't compile device"));
          }
        }
      );
    });
  });

  app.get("/api/v1/device/compile/:targetDevice", async (req, res) => {
    const targetDevice = req.params.targetDevice;
    const compileSessionId = String(req.query.compileSessionId ?? "");
    const projectId = req.query.projectId ? String(req.query.projectId) : undefined;
    const network = req.query.network ? String(req.query.network) : undefined;
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
        compileSessionId: compileSessionId,
        projectId: projectId,
        network: network,
      });

      context.topicPub(
        `device/compile/${compileSessionId}`,
        JSON.stringify(compileMessage({
          message: "Job added to queue",
          deviceName: targetDevice,
        }, network))
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
    const msg = compileMessage({
      message: "Job is now active",
      deviceName: job.data.targetDevice,
    }, job.data.network);
    context.topicPub(`device/compile/${job.data.compileSessionId}`, JSON.stringify({
        ...msg,
        position: 1, // Active job is always at the front of the line
        status: "active",
      })
    );
  });
  async function updateJobPositions() {
    // Broadcast updated positions
    for (let index = 0; index < jobOrder.length; index++) {
      const jobId = jobOrder[index];
      const job = await compileQueue.getJob(jobId);
      if (job && job.finishedOn==null) {
        const msg = compileMessage({
          message: "Queue update",
          deviceName: job.data.targetDevice,
        }, job.data.network);
        context.topicPub(`device/compile/${job.data.compileSessionId}`, JSON.stringify({
          ...msg,
          position: index + 1 - maxConcurrentCompilations,  // Convert index to 1-based position
          status: 'queued',
        }));
      }
    }
  }
  
});
