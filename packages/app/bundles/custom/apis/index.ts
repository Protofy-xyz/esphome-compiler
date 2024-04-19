import {Protofy} from 'protolib/base'
import CompileApi from "./Compile";
import EditApi from "./Edit";
import CompilationApi from "./Compilation";
const autoApis = Protofy("apis", {
    Compile: CompileApi,
    Edit: EditApi,
    Compilation: CompilationApi,
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}