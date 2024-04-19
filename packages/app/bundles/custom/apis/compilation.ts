import { Objects } from "app/bundles/objects";
import { AutoAPI } from 'protolib/api'
import { Protofy, API } from 'protolib/base'
import { Application } from 'express';
import { getLogger } from "protolib/base"
import { getAuth } from "protolib/api";
import fs from 'fs'
import path from "path";

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "compilation")
const {name, prefix} = Objects.compilation.getApiOptions()

const CompilationAPI = AutoAPI({
    modelName: name,
    modelType: Objects.compilation,
    initialData: {},
    prefix: prefix
})

export default Protofy("code", async (app:Application, context) => {
    CompilationAPI(app, context) 
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/Compilation', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */      
})