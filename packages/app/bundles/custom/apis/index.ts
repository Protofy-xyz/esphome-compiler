import {Protofy} from 'protolib/base'
import CompileApi from "./compile";
import EditApi from "./edit";
import CompilationApi from "./compilation";
import EraseCompilationsApi from "./eraseCompilations";
import DownloadApi from "./download";
import EsphomeApi from "./Esphome";

const autoApis = Protofy("apis", {
    Compile: CompileApi,
    Edit: EditApi,
    Compilation: CompilationApi,
    EraseCompilations: EraseCompilationsApi,
    Download: DownloadApi,
    Esphome: EsphomeApi
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}