import {Protofy} from 'protolib/base'
import { CompilationModel } from "./compilation";

export default Protofy("objects", {
    compilation: CompilationModel
})