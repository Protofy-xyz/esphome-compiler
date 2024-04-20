import {Protofy} from 'protolib/base'
import CompileApi from "./compile";
import EditApi from "./edit";
import CompilationApi from "./compilation";
import EraseCompilationsApi from "./eraseCompilations";
import DownloadApi from "./download";
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