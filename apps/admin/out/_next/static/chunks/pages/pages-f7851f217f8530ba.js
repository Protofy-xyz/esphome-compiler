(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2158],{68918:function(e,t,s){"use strict";s.d(t,{d:function(){return l}});var a=s(78161),r=s(2784),o=s(87656),n=s(52322);let i=e=>{let{color:t="black",size:s=24,...a}=e;return(0,n.jsxs)(o.Svg,{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:`${t}`,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...a,children:[(0,n.jsx)(o.Path,{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",stroke:`${t}`}),(0,n.jsx)(o.Polyline,{points:"15 3 21 3 21 9",stroke:`${t}`}),(0,n.jsx)(o.Line,{x1:"10",x2:"21",y1:"14",y2:"3",stroke:`${t}`})]})};i.displayName="ExternalLink";let l=(0,r.memo)((0,a.H)(i))},17165:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/pages",function(){return s(12528)}])},12528:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return J}});var a=s(52322),r=s(30195),o=s(75370),n=s(54283);let i=o.V_.object({name:r.z.string().search().id(),route:r.z.string().search(),permissions:r.z.array(r.z.string()).label("Permissions").generate(()=>[]),web:r.z.boolean().defaultValue(!0),electron:r.z.boolean().defaultValue(!1),protected:r.z.boolean().defaultValue(!1).label("Require user")});class l extends n.J{getDefaultFilePath(){return"/packages/app/bundles/custom/pages/"+this.data.name+".tsx"}static _newInstance(e,t){return new l(e,t)}constructor(e,t){super(e,i,t,"Page")}}var d=s(13997),_=s(48115),c=s(40214),p=s(50897),x=s(71932),m=s(79562),u=s(1888),b=s(52026),f=s(89929),h=s(53763),j=s(8939),g=s(68918),w=s(89560),v=s(82695),N=s(6429),P=s(2784),k=s(6289),y=s(26887),$=s(5632),z=s(51813),C=s(66306),E=s(91838);let S="  _dsp-inline _bxs-border-box _ww-break-word _mt-0px _mr-0px _mb-0px _ml-0px _fow-600 _fos-16px _col-791969588 ",F=e=>{let{slides:t,lastButtonCaption:s,onFinish:r}=e,[o,n]=(0,P.useState)(0),i=t.length,l=o>1?o-1:0,d=o<i-1?o+1:null,_=t.filter((e,t)=>t<=o).map(e=>e.name).join(" / ");return(0,a.jsxs)(j.FA,{id:"admin-dataview-create-dlg",w:800,mah:700,p:"$3",f:1,children:[(0,a.jsxs)(j.sL,{id:"admin-eo",mt:"$4",justifyContent:"space-between",width:"100%",children:[(0,a.jsx)("div",{className:"  _ai-stretch _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-1 _fg-1 ",children:(0,a.jsx)("span",{className:S,children:_})}),(0,a.jsx)("div",{className:"  _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-1 _fg-1 _ai-flex-end ",children:(0,a.jsxs)("span",{className:S,children:["[",o+1,"/",i,"]"]})})]}),(0,a.jsx)(E.I,{children:(0,a.jsx)("div",{className:"  _ai-stretch _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0 ",children:(0,a.jsx)("span",{className:"  _dsp-inline _bxs-border-box _ww-break-word _mt-0px _mr-0px _mb-0px _ml-0px _fow-600 _fos-34px _col-549765294 ",children:t[o].title})})}),(0,a.jsx)("div",{className:"  _ai-stretch _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0 _mt-1316330269 ",children:t[o].component}),(0,a.jsxs)("div",{className:"  _dsp-flex _fd-row _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-1 _gap-40px _jc-center _mb-1316330238 _fg-1 _ai-flex-end ",children:[0!==o?(0,a.jsx)(C.zx,{w:250,onPress:e=>{e.stopPropagation(),o>0&&n(l)},children:"Back"}):(0,a.jsx)(a.Fragment,{}),(0,a.jsx)(E.I,{children:(0,a.jsx)(C.zx,{id:"admin-pages-add-btn",w:250,onPress:async e=>{e.stopPropagation(),d?n(d):r&&await r()},children:i===o+1?s:"Next"})})]})]})};s(6410);var V=s(24066),A=s(57643),I=s(82614),Z=s(22287),D=s(70396),L=e=>{let{template:t,isSelected:s,onPress:r,theme:o}=e,[n,i]=(0,P.useState)(!1),l="/images/templates/".concat(t,"-").concat(o,".png");return(0,a.jsx)(E.I,{children:(0,a.jsxs)(j.FA,{id:"pages-template-"+t,onPress:r,onHoverIn:()=>i(!0),onHoverOut:()=>i(!1),overflow:"hidden",borderWidth:s?"$1":"$0.5",borderColor:s?"$color7":"$gray8",cursor:"pointer",borderRadius:"$3",children:[(0,a.jsx)(Z.E,{source:{height:180,width:357,uri:l}}),(0,a.jsx)("div",{className:(0,D.concatClassName)(" _ai-stretch _dsp-flex _fd-column _fb-auto _bxs-border-box _mih-0px _miw-0px _fs-0  _zi-10000 _pos-absolute _r-1481558214 _t-1481558214  "+(n?" _dsp-block":" _dsp-none")),children:(0,a.jsx)(I.p,{target:"_blank",href:l,children:(0,a.jsx)(C.zx,{backgroundColor:"$color7",size:"$1.5",borderRadius:"$1",px:"$2",textProps:{size:"$1"},onPress:e=>{e.stopPropagation()},children:"preview"})})}),(0,a.jsx)("div",{className:"  _ai-stretch _dsp-flex _fd-row _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0 _jc-441309761 _btw-1481558338 _btc-791969557 _brc-791969557 _bbc-791969557 _blc-791969557 _bg-791969402 _pt-1481558276 _pb-1481558276 _pr-1481558214 _pl-1481558214 _bts-solid ",children:(0,a.jsx)("p",{className:"  is_Paragraph _col-675002279 _dsp-inline _bxs-border-box _ww-break-word _mt-0px _mr-0px _mb-0px _ml-0px _ff-299667014 _fow-233016140 _ls-167744059 _fos-229441220 _lh-222976573 _ussel-auto font_body ",children:t})})]})})};s(57117);var O=s(81974);let T={},H="/adminapi/v1/pages",B="/adminapi/v1/objects?all=1",R={blank:{},default:{},admin:{extraFields:e=>{var t;return{object:r.z.union([...e&&e.data?null===(t=e.data)||void 0===t?void 0:t.items.filter(e=>e.features&&e.features.AutoAPI).map(e=>r.z.literal(e.name)):[]]).after("route")}},extraValidation:e=>{if(!Object.keys(e).includes("object"))return{error:"object cant be empty"}}},landing:{},ecomerce:{},about:{},newsfeed:{}},W=e=>{let{children:t}=e;return(0,a.jsx)("div",{className:"  _dsp-flex _fd-row _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0 _jc-center _ai-center _gap-25px _fw-wrap ",children:t})},M=e=>{let{selected:t,setSelected:s}=e,r=(0,b.useThemeName)();return(0,a.jsxs)("div",{className:"  _ai-stretch _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0 ",children:[(0,a.jsx)(f.p,{mah:"500px",children:(0,a.jsx)(W,{children:Object.keys(R).map(e=>(0,a.jsx)(L,{theme:r,template:e,isSelected:t==e,onPress:()=>s(e)}))})}),(0,a.jsx)("span",{className:"  is_Spacer _ai-stretch _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-1316330176 _miw-1316330176 _fs-0 _w-1316330176 _h-1316330176 _pe-none _mb-1316330331 "})]})},U=e=>{let{data:t,setData:s,error:r,setError:o,objects:n}=e;return(0,a.jsx)(V.G,{externalErrorHandling:!0,error:r,setError:o,data:t,setData:s,name:"page",numColumns:2,mode:"add",title:"",model:l,extraFields:R[t.data.template].extraFields?R[t.data.template].extraFields(n):{}})};var q={pages:{component:e=>{var t;let{pageState:s,initialItems:o,pageSession:n,extraData:i}=e,u={data:{web:!0,electron:!1,protected:!1,template:"blank"}};(0,$.useRouter)();let{replace:f}=(0,v.N)(s),[N,C]=(0,P.useState)(null!==(t=null==i?void 0:i.objects)&&void 0!==t?t:(0,k.E)("pending")),[E,S]=(0,P.useState)(!1);(0,b.useThemeName)();let[V,I]=(0,P.useState)(u),Z=(0,h.Py)(),[L,W]=(0,P.useState)("");(0,A.rf)(()=>{W(""),I(u)},[E]),(0,y.a)(e=>{_.bl.get({url:B},e)},C,null==i?void 0:i.objects);let q=e=>{let t=O.T[document.location.hostname.split(".")[0]];return t&&t.baseUrl?t.baseUrl+e:e};return(0,a.jsxs)(c.D,{title:"Pages",pageSession:n,children:[(0,a.jsx)(z.a,{integratedChat:!0,p:"$2",pt:"$5",pl:"$5",setOpen:S,open:E,hideAccept:!0,description:"",children:(0,a.jsx)("div",{className:"  _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-1 _fg-1 _jc-center _ai-center ",children:(0,a.jsx)("div",{className:"  _ai-stretch _dsp-flex _fd-row _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0 _mr-1316330238 ",children:(0,a.jsx)(F,{lastButtonCaption:"Create",onFinish:async()=>{try{let e=l.load(V.data);if(R[V.data.template].extraValidation){let e=R[V.data.template].extraValidation(V.data);if(null==e?void 0:e.error)throw e.error}let t=await _.bl.post(H,e.create().getData());if(t.isError)throw t.error;S(!1),Z.show("Page created",{message:e.getId()})}catch(e){console.log("original error: ",e),W((0,k.E)("error",null,e instanceof r.z.ZodError?e.flatten():e))}},slides:[{name:"Create new page",title:"Select your Template",component:(0,a.jsx)(M,{selected:null==V?void 0:V.data.template,setSelected:e=>I({...V,data:{...V.data,template:e}})})},{name:"Configure your page",title:"Configure your page",component:(0,a.jsx)(U,{error:L,objects:N,setError:W,data:V,setData:I})}]})})})}),(0,a.jsx)(d.V,{integratedChat:!0,sourceUrl:H,initialItems:o,numColumnsForm:2,name:"page",rowIcon:()=>(0,a.jsx)(a.Fragment,{}),objectProps:{columnWidth:500},columns:p.Z.columns(p.Z.column("","",!0,e=>(0,a.jsx)("a",{href:q(e.route.startsWith("/")?e.route:"/"+e.route),target:"_blank",children:(0,a.jsx)(x.z,{Icon:g.d})}),!0,"50px"),p.Z.column("name","name",!0,e=>(0,a.jsx)(j.sL,{id:"pages-datatable-"+e.name,children:e.name})),p.Z.column("route","route",!0),p.Z.column("visibility","protected",!0,e=>e.protected?(0,a.jsx)(m.A,{text:"protected",color:"$gray5"}):(0,a.jsx)(m.A,{text:"public",color:"$color5"})),p.Z.column("permissions","permissions",!0,e=>e.permissions.map((e,t)=>(0,a.jsx)("div",{className:(0,D.concatClassName)(" _ai-stretch _dsp-flex _fd-row _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0  "+(t?" _ml-10px":" _ml-0px")),children:(0,a.jsx)(m.A,{text:e,color:"$gray5"})},t)))),onAddButton:()=>{S(!0)},extraMenuActions:[{text:"Edit Page file",icon:w.z,action:e=>{f("editFile",e.getDefaultFilePath())},isVisible:e=>!0}],model:l,pageState:s,icons:T})]})},getServerSideProps:(0,u.eq)(H,["admin"],{},async e=>({objects:await _.bl.get((0,N.VM)(B,e))}))}};s(73344);var X=s(97729),G=s.n(X);function J(e){return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(G(),{children:(0,a.jsx)("title",{children:"Protofy - Pages"})}),(0,a.jsx)(q.pages.component,{...e})]})}},57117:function(){},6410:function(){},73344:function(){}},function(e){e.O(0,[8641,8081,4733,1335,8873,2859,6313,3950,9331,4092,9927,6116,9498,1967,5619,9884,995,1004,4152,8676,767,1773,8859,4305,9774,2888,179],function(){return e(e.s=17165)}),_N_E=e.O()}]);