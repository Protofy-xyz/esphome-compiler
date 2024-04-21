(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8774],{21599:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/objects",function(){return a(60356)}])},60356:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return y}});var r=a(52322),n=a(52415),i=a(99361),l=a(13997),s=a(50897),o=a(79562),c=a(1888),u=a(89560),d=a(66788),m=a(82695),p=a(37288),f=a(30195);let _={};var b={objects:{component:e=>{let{pageState:t,initialItems:a,pageSession:c}=e,{replace:b}=(0,m.N)(t);return(0,r.jsx)(i.D,{title:"Objects",pageSession:c,children:(0,r.jsx)(l.V,{integratedChat:!0,rowIcon:d.x,sourceUrl:"/adminapi/v1/objects",initialItems:a,numColumnsForm:1,name:"object",columns:s.Z.columns(s.Z.column("name",e=>e.name,"name",e=>(0,r.jsx)(p.sL,{id:"objects-datatable-"+e.name,children:(0,r.jsx)("span",{className:"  _ff-299667014 _dsp-inline _bxs-border-box _ww-break-word _whiteSpace-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _col-675002279 font_body ",children:e.name})})),s.Z.column("features",e=>e.features,"features",e=>Object.keys(e.features).map(e=>(0,r.jsx)(o.A,{text:e,color:"$gray5"})))),extraFieldsFormsAdd:{api:f.z.boolean().after("keys").label("automatic crud api").defaultValue(!0),adminPage:f.z.boolean().after("keys").label("admin page").defaultValue(!0)},model:n.Wk,pageState:t,icons:_,deleteable:e=>{if(!Array.isArray(e))return 0===Object.keys(e.data.features).length;for(let t of e)if(0!==Object.keys(t.features).length)return!1;return!0},extraMenuActions:[{text:"Edit Object file",icon:u.z,action:e=>{b("editFile",e.getDefaultSchemaFilePath())},isVisible:e=>!0}]})})},getServerSideProps:(0,c.eq)("/adminapi/v1/objects",["admin"],{orderBy:"name"})}};a(23399);var z=a(97729),h=a.n(z);function y(e){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(h(),{children:(0,r.jsx)("title",{children:"Protofy - Objects"})}),(0,r.jsx)(b.objects.component,{...e})]})}},52415:function(e,t,a){"use strict";a.d(t,{Wk:function(){return o}});var r=a(30195),n=a(54283);let i=r.z.object({id:r.z.string().search().id().generate(e=>e.name.charAt(0).toUpperCase()+e.name.slice(1)+"Model").hidden(),name:r.z.string().search().static(),features:r.z.any().generate({},!0).hidden(),keys:r.z.record(r.z.string().optional(),r.z.object({type:r.z.union([r.z.literal("string"),r.z.literal("number"),r.z.literal("boolean"),r.z.literal("array"),r.z.literal("object"),r.z.literal("record"),r.z.literal("union"),r.z.literal("date")]),params:r.z.array(r.z.string()).optional(),modifiers:r.z.array(r.z.object({name:r.z.union([r.z.literal("id"),r.z.literal("search"),r.z.literal("generate"),r.z.literal("display"),r.z.literal("optional"),r.z.literal("email"),r.z.literal("label"),r.z.literal("hint"),r.z.literal("static"),r.z.literal("min"),r.z.literal("max"),r.z.literal("secret"),r.z.literal("onCreate"),r.z.literal("onUpdate"),r.z.literal("onRead"),r.z.literal("onDelete"),r.z.literal("onList"),r.z.literal("name"),r.z.literal("picker"),r.z.literal("location")]),params:r.z.array(r.z.string()).optional()}).name("name")).optional()}).name("name")).generate({})}),l=r.z.object({...i.shape}),s=e=>({...e,keys:Object.keys(e.keys?e.keys:{}).reduce((t,a)=>({...t,[a]:{type:"string",...e.keys[a]}}),{})});class o extends n.J{getDefaultSchemaFilePath(){return o.getDefaultSchemaFilePath(this.data.name)}static load(e,t){return this._newInstance(e,t)}getSourceCode(){let e=this.data,t="{"+Object.keys(e.keys).reduce((t,a,r)=>{let n=e.keys[a];if("date"==n.type&&(!n.modifiers||!n.modifiers.find(e=>"datePicker"==e.name))){var i;n.modifiers=[...null!==(i=null==n?void 0:n.modifiers)&&void 0!==i?i:[],{name:"datePicker",params:[]}]}let l=n.modifiers?n.modifiers.reduce((e,t)=>e+"."+t.name+"("+(t.params&&t.params.length?t.params.join(","):"")+")",""):"";return t+"\n	"+a+": z."+n.type+"("+(n.params&&n.params.length?n.params.join(","):"")+")"+l+","},"").slice(0,-1)+"\n}";return t}static getDefaultSchemaFilePath(e){return"/packages/app/bundles/custom/objects/"+e+".ts"}create(e){let t=null!=e?e:this.getData(),a=s(t);return super.create(a)}update(e,t){let a=null!=t?t:e.data,r=s(a);return super.update(e,r)}static _newInstance(e,t){return new o(e,t)}constructor(e,t){super(e,l,t,"Object")}}},79562:function(e,t,a){"use strict";a.d(t,{A:function(){return o}});var r=a(52322),n=a(2784),i=a(37288),l=a(66160),s=a(28844);let o=e=>{let{loading:t,icon:a,text:o,bold:c,color:u,...d}=e;return(0,r.jsxs)(i.sL,{ai:"center",jc:"center",bc:null!=u?u:"$color5",p:2,px:"$3",br:25,...d,children:[a&&n.cloneElement(a,{size:20,strokeWidth:.7,color:"var(--color)"}),o&&(0,r.jsx)("span",{className:(0,s.Ej)("  is_SizableText _col-675002279 _ff-299667014 _fow-233016047 _ls-167743966 _fos-229441127 _lh-222976480 _dsp-inline _bxs-border-box _ww-break-word _whiteSpace-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _o-0d0t9746 font_body  "+(a?" _ml-1481558214":" _ml-1481558400")+" "+(c?" _fow-900":" _fow-400")),children:o}),t&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{className:"  is_Spacer _dsp-flex _ai-stretch _fd-column _fb-auto _bxs-border-box _pos-relative _mih-9px _miw-9px _fs-0 _pe-none _w-9px _h-9px "}),(0,r.jsx)(l.$,{color:"var(--color8)",scale:.7,size:"small"})]})]})};a(88440)},1888:function(e,t,a){"use strict";a.d(t,{F7:function(){return l},eq:function(){return s}});var r=a(46149),n=a(6429),i=a(48115);let l=e=>r.l.SSR?e:void 0;function s(e,t){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};return l(async l=>{var s,o,c,u,d,m;let p={itemsPerPage:parseInt(l.query.itemsPerPage)?parseInt(l.query.itemsPerPage):"",page:parseInt(l.query.page,10)?parseInt(l.query.page,10):"",search:null!==(s=l.query.search)&&void 0!==s?s:"",orderBy:null!==(o=l.query.orderBy)&&void 0!==o?o:"",orderDirection:null!==(c=l.query.orderDirection)&&void 0!==c?c:"",view:null!==(u=l.query.view)&&void 0!==u?u:"",item:null!==(d=l.query.item)&&void 0!==d?d:"",editFile:null!==(m=l.query.editFile)&&void 0!==m?m:"",..."function"==typeof a?await a(l):a},f="function"==typeof e?e(l):e;return(0,n.NA)(l,t,{sourceUrl:f,initialItems:await i.bl.get({url:(0,n.VM)(f,l),...p}),itemData:l.query.item?await i.bl.get((0,n.VM)(f+"/"+l.query.item,l)):"",extraData:{..."function"==typeof r?await r(l):r},pageState:{...p}})})}},88440:function(){},23399:function(){}},function(e){e.O(0,[8641,8081,4733,1335,8873,2859,6313,3950,1737,1871,1299,5712,1004,6698,2029,7817,9774,2888,179],function(){return e(e.s=21599)}),_N_E=e.O()}]);