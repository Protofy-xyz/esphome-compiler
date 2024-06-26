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

import { Protofy } from 'protolib/base'
import { getAuth } from "protolib/api";
import { getLogger, API } from "protolib/base"
import { Application } from 'express';
import fs from 'fs'
import path from "path";

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "IOTRouter")

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

    app.get("/api/v1/device/download/:targetDevice", async (req, res) => {
        const targetDevice = req.params.targetDevice
        const compileSessionId = req.query.compileSessionId
        const fileName = targetDevice+"-"+compileSessionId
        res.sendFile(fileName+".bin", {root: "../../data/esphome/" })
    });
})
