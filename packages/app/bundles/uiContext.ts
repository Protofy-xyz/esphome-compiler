import { fetch, actionFetch, navigate, onRender, actionNavigate } from 'protolib/bundles/ui/context';
import flow from 'protolib/bundles/flow/context'
import os from 'protolib/bundles/os/context'
import deviceContext from 'protolib/bundles/devices/context/ui'
import object from 'protolib/bundles/objects/context'
export const context = {
    fetch,
    actionFetch,
    navigate,
    flow,
    os,
    object,
    onRender,
    actionNavigate,
    ...deviceContext
}