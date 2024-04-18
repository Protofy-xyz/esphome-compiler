import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { useRef } from 'react';

const CommandExecutor = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(10)

    // const params = [
    //     {
    //         "label": "command",
    //         "field": "param-1",
    //         "type": "input"
    //     },
    //     {
    //         "label": "args",
    //         "field": "param-2",
    //         "type": "input"
    //     },
    //     {
    //         "label": "options",
    //         "field": "param-3",
    //         "type": "input"
    //     }
    // ]
    // const fallbacks = [
    //     {
    //         "label": "stdout OnData (data)",
    //         "field": "param-4",
    //         "preText": "async () => ",
    //         "postText": ""
    //     },
    //     {
    //         "label": "stderr OnData (data)",
    //         "field": "param-5",
    //         "preText": "async () => ",
    //         "postText": ""
    //     },
    //     {
    //         "label": "OnClose (code)",
    //         "field": "param-6",
    //         "preText": "async () => ",
    //         "postText": ""
    //     },
    //     {
    //         "label": "onError (err)",
    //         "field": "param-7",
    //         "preText": "async () => ",
    //         "postText": ""
    //     }
    // ]

    // return (
    //     <Node
    //         icon={Cable}
    //         node={node}
    //         isPreview={!node.id}
    //         title='Command executer' color={color} id={node.id}
    //         skipCustom={true}
    //     >
    //         <div ref={paramsRef}>
    //             <NodeParams id={node.id} params={params} />
    //             {/* <CustomFieldsList node={node} nodeData={nodeData} fields={propsList} /> */}
    //         </div>
    //         <div>
    //             <FallbackPortList node={node} fallbacks={fallbacks} startPosX={paramsRef?.current?.clientHeight} type='output' />
    //         </div>
    //     </Node >
    // )
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Command executor' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'command', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: '[args]', field: 'param-2', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: '{options}', field: 'param-3', type: 'input' }]} />

            <div style={{ marginTop: "180px" }}>
                <FlowPort id={node.id} type='output' label='stdout OnData (data)' style={{ top: '250px' }} handleId={'stdout OnData (data)'} />
                <FallbackPort fallbackText="null" node={node} port={'param-4'} type={"target"} fallbackPort={'stdout OnData (data)'} portType={"_"} preText="async (data) => " postText="" />
                <FlowPort id={node.id} type='output' label='stderr OnData (data)' style={{ top: '300px' }} handleId={'stderr OnData (data)'} />
                <FallbackPort fallbackText="null" node={node} port={'param-5'} type={"target"} fallbackPort={'stderr OnData (data)'} portType={"_"} preText="async (data) => " postText="" />
                <FlowPort id={node.id} type='output' label='OnClose (code)' style={{ top: '350px' }} handleId={'OnClose (code)'} />
                <FallbackPort fallbackText="null" node={node} port={'param-6'} type={"target"} fallbackPort={'OnClose (code)'} portType={"_"} preText="async (code) => " postText="" />
                <FlowPort id={node.id} type='output' label='onError (err)' style={{ top: '400px' }} handleId={'onError (err)'} />
                <FallbackPort fallbackText="null" node={node} port={'param-7'} type={"target"} fallbackPort={'onError (err)'} portType={"_"} preText="async (err) => " postText="" />
            </div>
        </Node>
    )
}

export default {
    id: 'CommandExecutor',
    type: 'CallExpression',
    category: 'OS',
    keywords: ['executor', 'os', 'command'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os.command')
    },
    getComponent: (node, nodeData, children) => <CommandExecutor node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges)=> {
        childScope = filterCallback("4", "stdout OnData (data)")(node,childScope,edges)
        childScope = filterCallback("5", "stderr OnData (data)")(node,childScope,edges)
        childScope = filterCallback("6","OnClose (code)")(node,childScope,edges)
        childScope = filterCallback("7","onError (err)")(node,childScope,edges)
        return childScope
    },
    getInitialData: () => {
        return {
            to: 'context.os.command',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            },
            "param-2": {
                value: "",
                kind: "Identifier"
            },
            "param-3": {
                value: "",
                kind: "Identifier"
            },
            "param-4": {
                value: "null",
                kind: "Identifier"
            },
            "param-5": {
                value: "null",
                kind: "Identifier"
            },
            "param-6": {
                value: "null",
                kind: "Identifier"
            },
            "param-7": {
                value: "null",
                kind: "Identifier"
            }
        }
    }
}