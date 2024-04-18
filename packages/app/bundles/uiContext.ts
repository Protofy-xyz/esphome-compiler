import { fetch, actionFetch, navigate, onRender, actionNavigate } from 'protolib/bundles/ui/context';
import flow from 'protolib/bundles/flow/context'
import os from 'protolib/bundles/os/context'
import deviceContext from 'protolib/bundles/devices/context/ui'
export const context = {
    fetch,
    actionFetch,
    navigate,
    flow,
    os,
    onRender,
    actionNavigate,
    ...deviceContext
}