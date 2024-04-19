import {Protofy} from 'protolib/base'
import CompileApi from "./Compile";
import EditApi from "./Edit";
import CompilationApi from "./Compilation";
import EraseCompilationsApi from "./EraseCompilations";
import DownloadApi from "./Download";
const autoApis = Protofy("apis", {
    Compile: CompileApi,
    Edit: EditApi,
    Compilation: CompilationApi,
    EraseCompilations: EraseCompilationsApi,
    Download: DownloadApi
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}