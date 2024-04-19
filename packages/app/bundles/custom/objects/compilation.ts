import { ProtoModel, SessionDataType, z } from "protolib/base";
import { Protofy, Schema, BaseSchema } from 'protolib/base'
import { getLogger } from 'protolib/base';

const logger = getLogger()
Protofy("features", {
    "AutoAPI": true
})

export const BaseCompilationSchema = Schema.object(Protofy("schema", {
    id: z.string().id(),
	done: z.boolean(), 
}))

export const CompilationSchema = Schema.object({
    ...BaseSchema.shape,
    ...BaseCompilationSchema.shape
});

export type CompilationType = z.infer<typeof CompilationSchema>;

export class CompilationModel extends ProtoModel<CompilationModel> {
    constructor(data: CompilationType, session?: SessionDataType, ) {
        super(data, CompilationSchema, session, "Compilation");
    }

    public static getApiOptions() {
        return {
            name: 'compilations',
            prefix: '/api/v1/'
        }
    }

    create(data?):CompilationModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): CompilationType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: CompilationModel, data?: CompilationType): CompilationModel {
        const result = super.update(updatedModel, data)
        return result
    }

	list(search?, session?, extraData?, params?): CompilationType[] {
        const result = super.list(search, session, extraData, params)
        return result
    }

    delete(data?): CompilationModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): CompilationModel {
        return new CompilationModel(data, session);
    }

    static load(data: any, session?: SessionDataType): CompilationModel {
        return this._newInstance(data, session);
    }
}
