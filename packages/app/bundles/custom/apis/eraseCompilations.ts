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

import { getAuth } from "protolib/api";
import { Protofy, API } from "protolib/base";
import { getLogger } from "protolib/base";
import { Application } from "express";
import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "..", "..");
const logger = getLogger();

Protofy("type", "CustomAPI");

export default Protofy("code", async (app: Application, context) => {
  //PUT YOUR API HERE
  //context.devicePub function allows to communicate with devices via mqtt
  //context.deviceSub allows to receive notifications from devices via mqtt
  //app is a normal expressjs object
  //context.mqtt is a mqttclient connection
  context.automation(
    app,
    async (params) => {
      await eraseCompilations();
    },
    "EraseCompilations"
  );
  context.createPeriodicSchedule(
    "00",
    "00",
    async () => await eraseCompilations(),
    "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
  );
  const eraseCompilations = async () => {
    context.object.list(
      "compilation",
      0,
      10000,
      null,
      async (items, numPages, totalItems) => {
        items.forEach((element) => {
          console.log(element);
          context.object.deleteObject(
            "compilation",
            element.id,
            null,
            null,
            null
          );
        });
      },
      null
    );
    context.os.spawn(
      "rm",
      ["-rf", "esphome"],
      {
        cwd: "../../data",
      },
      null,
      null,
      null,
      null
    );
  };
});
