import {Protofy} from 'protolib/base'
import CompileApi from "./Compile";
import EditApi from "./Edit";
const autoApis = Protofy("apis", {
    Compile: CompileApi,
    Edit: EditApi
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}