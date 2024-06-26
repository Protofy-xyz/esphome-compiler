/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import {Protofy} from 'protolib/base'
import {Objects} from 'app/bundles/objects'
import {DataView, API, AdminPage, PaginatedDataSSR } from 'protolib'
import { Tag } from '@tamagui/lucide-icons'
import { context } from "app/bundles/uiContext";
import { useRouter } from "next/router";

const Icons =  {}
const isProtected = Protofy("protected", true)
const {name, prefix} = Objects.compilation.getApiOptions()
const sourceUrl = prefix + name

export default {
    route: Protofy("route", "workspace/compilation"),
    component: ({pageState, initialItems, pageSession, extraData}:any) => {
        return (<AdminPage title="Compilation" pageSession={pageSession}>
            <DataView
                rowIcon={Tag}
                sourceUrl={sourceUrl}
                initialItems={initialItems}
                numColumnsForm={1}
                name="Compilation"
                model={Objects.compilation } 
                pageState={pageState}
                icons={Icons}
            />
        </AdminPage>)
    }, 
    getServerSideProps: PaginatedDataSSR(sourceUrl, isProtected?Protofy("permissions", ["admin"]):undefined)
}