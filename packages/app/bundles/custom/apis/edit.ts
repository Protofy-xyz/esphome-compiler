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

import { v4 as uuidv4 } from "uuid";

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

  logger.info("Edit started");
  app.post("/api/v1/device/edit/:targetDevice", async (req, res) => {
    // console.log("YAml: ", req.body.yaml);
    const esphomePath = "../../data/esphome/";
    const compileSessionId = uuidv4();

    console.log(
      "🤖 ~ app.post ~ context.os.pathExists(esphomePath):",
      context.os.pathExists(esphomePath)
    );
    context.flow.switch(
      context.os.pathExists(esphomePath),
      false,
      "equals",
      async () => context.os.createFolder(esphomePath),
      null,
      null
    );
    context.os.fileWriter(
      esphomePath + req.params.targetDevice + "-" + compileSessionId + ".yaml",
      req.body.yaml,
      null
    );
    context.object.create(
      "compilation",
      {
        id: compileSessionId,
        done: false,
      },
      null,
      async (item) =>
        context.object.list(
          "compilation",
          0,
          50,
          null,
          async (items, numPages, totalItems) => console.log("Items", items),
          null
        ),
      null
    );
    res.send({ compileSessionId: compileSessionId });
  });
});
