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
import crypto from "crypto"; // Import the crypto module for hashing

const jsYaml = require("js-yaml");

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
    const esphomePath = "../../data/esphome/";

    // Compute the compileSessionId based on the hash of the YAML content
    const hash = crypto.createHash("sha256").update(req.body.yaml).digest("hex");
    const compileSessionId = hash.substring(0, 16); // Use the first 16 characters of the hash as the ID
    const fileName = req.params.targetDevice + "-" + compileSessionId;

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
    
    class LambdaString extends String {}
    const lambdaType = new jsYaml.Type('!lambda', {
      kind:   'scalar',
      // loading: every !lambda-tagged piece of YAML gets passed to construct()
      resolve: data => true,
      construct: data => new LambdaString(data),

      // dumping: only values instanceof LambdaString get represented
      instanceOf: LambdaString,
      represent: lambdaVal => lambdaVal.toString()
    });
    const customSchema = jsYaml.DEFAULT_SCHEMA.extend({
      explicit: [lambdaType],
    });

    const yamlObj = jsYaml.load(req.body.yaml, { schema: customSchema });
    yamlObj.esphome.build_path = "build/" + fileName;
    const yamlContent = jsYaml.dump(yamlObj, { lineWidth: -1, schema: customSchema })

    context.os.fileWriter(esphomePath + fileName + ".yaml", yamlContent, null);
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
