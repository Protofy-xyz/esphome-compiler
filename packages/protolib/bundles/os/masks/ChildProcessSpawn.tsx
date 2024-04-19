import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { useRef } from 'react';

const ChildProcessSpawn = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(10)

    const params = [
        {
            "label": "command",
            "field": "param-1",
            "type": "input"
        },
        {
            "label": "args",
            "field": "param-2",
            "type": "input"
        },
        {
            "label": "options",
            "field": "param-3",
            "type": "input"
        }
    ]
    const fallbacks = [
        {
            "label": "stdout OnData (data)",
            "field": "param-4",
            "preText": "async (data) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        },
        {
            "label": "stderr OnData (data)",
            "field": "param-5",
            "preText": "async (data) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        },
        {
            "label": "OnClose (code)",
            "field": "param-6",
            "preText": "async (code) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        },
        {
            "label": "onError (err)",
            "field": "param-7",
            "preText": "async (err) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        }
    ]

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Child process spawn' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
            <div>
                <FallbackPortList node={node} fallbacks={fallbacks} startPosX={paramsRef?.current?.clientHeight} />
            </div>
        </Node>
    )
}

export default {
    id: 'ChildProcessSpawn',
    type: 'CallExpression',
    category: 'OS',
    keywords: ['executor', 'os', 'command'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os.spawn')
    },
    getComponent: (node, nodeData, children) => <ChildProcessSpawn node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges) => {
        childScope = filterCallback("4")(node, childScope, edges)
        childScope = filterCallback("5")(node, childScope, edges)
        childScope = filterCallback("6")(node, childScope, edges)
        childScope = filterCallback("7")(node, childScope, edges)
        return childScope
    },
    getInitialData: () => {
        return {
            to: 'context.os.spawn',
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