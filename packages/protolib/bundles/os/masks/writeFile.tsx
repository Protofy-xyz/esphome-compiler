import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { useRef } from 'react';

const WriteFile = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(11)

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Write file' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'path', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'content', field: 'param-2', type: 'input' }]} />

            <div style={{ marginTop: "80px" }}>
                <FlowPort id={node.id} type='output' label='onError (err)' style={{ top: '200px' }} handleId={'onError (err)'} />
                <FallbackPort fallbackText="null" node={node} port={'param-3'} type={"target"} fallbackPort={'onError (err)'} portType={"_"} preText="async (err) => " postText="" />
            </div>
        </Node>
    )
}

export default {
    id: 'WriteFile',
    type: 'CallExpression',
    category: 'OS',
    keywords: ['fs', 'os', 'write', 'file'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os.fileWriter')
    },
    getComponent: (node, nodeData, children) => <WriteFile node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges)=> {
        childScope = filterCallback("3","onError (err)")(node,childScope,edges)
        return childScope
    },
    getInitialData: () => {
        return {
            to: 'context.os.fileWriter',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            },
            "param-2": {
                value: "",
                kind: "StringLiteral"
            },
            "param-3": {
                value: "null",
                kind: "Identifier"
            },
        }
    }
}