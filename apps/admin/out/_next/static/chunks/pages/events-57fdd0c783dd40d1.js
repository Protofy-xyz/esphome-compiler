(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7695],{56083:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/events",function(){return n(12218)}])},12218:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return b}});var r=n(52322),o=n(93976),s=n(40214),a=n(13997),i=n(50897),c=n(79562),l=n(31711);let d=e=>{let{trigger:t,children:n,...o}=e;return(0,r.jsxs)(l.u,{...o,children:[(0,r.jsx)(l.u.Trigger,{children:t}),(0,r.jsxs)(l.u.Content,{enterStyle:{x:0,y:-5,opacity:0,scale:.9},exitStyle:{x:0,y:-5,opacity:0,scale:.9},scale:1,x:0,y:0,opacity:1,animation:["quick",{opacity:{overshootClamping:!0}}],children:[(0,r.jsx)(l.u.Arrow,{}),(0,r.jsx)("p",{className:"  is_Paragraph _col-675002279 _dsp-inline _bxs-border-box _ww-break-word _mt-0px _mr-0px _mb-0px _ml-0px _ff-299667014 _fow-233016078 _ls-167743997 _fos-229441158 _lh-222976480 _ussel-auto font_body ",children:n})]})]})};n(76409);var u=n(1888),p=n(19034),h=n.n(p),m=n(83103),f=n(13043),y=n(1201);let g={},v="/adminapi/v1/events";var x={events:{component:e=>{var t;let{pageState:n,initialItems:l,pageSession:u}=e;return(0,y.G)(()=>'At this moment the user is browsing the events list page. The events list page allows to monitor system events. The list is updated automatically if any events occurs.\n            An event can be a user created, invalid login attempt, successful login, file edit, file create, file update, and also system object modification events, like "product created", or "product updated".\n            Events can be used to monitor the system, auditing pruposes, or to trigger API actions when a specific event happens.\n            Events contain a path, in the form of: x/y/z, where each part of the path describes a part of the event identify.\n            For example, a file creation event will be files/create/file. A directory creation would be files/create/directory.\n            Auth events can be auth/login/success and auth/login/error.\n            Events contain data, specific for the event type.\n            '+((null==l?void 0:l.isLoaded)?"Currently the system returned the following information: "+JSON.stringify(l.data):"")),(0,r.jsx)(s.D,{title:"Events",pageSession:u,children:(0,r.jsx)(a.V,{integratedChat:!0,hideAdd:!0,openMode:"view",sourceUrl:v,initialItems:l,numColumnsForm:1,name:"event",disableViewSelector:!1,defaultView:"list",rowIcon:m.l,columns:i.Z.columns(i.Z.column("path","path",!0,void 0,!0,"250px"),i.Z.column("user","user",!0,void 0,!0,"200px"),i.Z.column("from","from",!0,e=>(0,r.jsx)(c.A,{text:e.from,color:"$gray5"}),!0),i.Z.column("created","created",!0,e=>h()(e.created).format("YYYY-MM-DD HH:mm:ss"),!0,"200px"),i.Z.column("payload","payload",!1,e=>Object.keys(null!==(t=null==e?void 0:e.payload)&&void 0!==t?t:[]).length?Object.keys(e.payload).map((t,n)=>(0,r.jsx)(d,{trigger:(0,r.jsx)(c.A,{ml:n?"$2":"$0",text:t,color:"$color5"},t),children:JSON.stringify(e.payload[t])})):(0,r.jsx)(c.A,{text:"empty",color:"$gray5"}),!0,"200px"),i.Z.column("inspect","payload",!1,e=>(0,r.jsx)(f.Z,{onChange:()=>{},editable:!1,data:e.payload,collapsible:!0,compact:!1,defaultCollapsed:!0}))),model:o.Yq,pageState:n,icons:g})})},getServerSideProps:(0,u.eq)(v,["admin"],{orderBy:"created",orderDirection:"desc"})}},_=n(97729),w=n.n(_);function b(e){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(w(),{children:(0,r.jsx)("title",{children:"Protofy - Events"})}),(0,r.jsx)(x.events.component,{...e})]})}},43657:function(e,t,n){"use strict";n.d(t,{jb:function(){return r}});let r=(e,t)=>t},93976:function(e,t,n){"use strict";n.d(t,{Yq:function(){return u}});var r=n(30195),o=n(43657),s=n(75370),a=n(19034),i=n.n(a),c=n(54283);let l=r.z.object((0,o.jb)("schema",{path:r.z.string().search(),from:r.z.string().search(),user:r.z.string().generate(e=>"me").search(),payload:r.z.record(r.z.string(),r.z.any()).search(),created:r.z.string().generate(e=>i()().toISOString()).search()})),d=r.z.object({...s.Pp.shape,...l.shape});class u extends c.J{list(e){return e?JSON.stringify(this.data).toLowerCase().includes(e.toLowerCase())?this.read():void 0:this.read()}static _newInstance(e,t){return new u(e,t)}constructor(e,t){super(e,d,t)}}},76409:function(){}},function(e){e.O(0,[3950,3661,7205,6851,9927,8594,2029,6282,9884,995,1004,5552,5762,1773,3265,9401,9774,2888,179],function(){return e(e.s=56083)}),_N_E=e.O()}]);