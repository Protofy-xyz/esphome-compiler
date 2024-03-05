(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4176],{64848:function(e,a,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/databases/view",function(){return t(51507)}])},51507:function(e,a,t){"use strict";t.r(a),t.d(a,{default:function(){return o}});var s=t(52322),i=t(18038),n=t(97729),r=t.n(n);function o(e){let a=i.Z["databases/view"].component;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r(),{children:(0,s.jsx)("title",{children:"Protofy - View Database"})}),(0,s.jsx)(a,{...e})]})}},43657:function(e,a,t){"use strict";t.d(a,{jb:function(){return s}});let s=(e,a)=>a},18038:function(e,a,t){"use strict";t.d(a,{Z:function(){return A}});var s=t(52322),i=t(30195),n=t(75370),r=t(43657),o=t(54283);let d=n.V_.object({key:i.z.string(),value:i.z.any()}),l=n.V_.object((0,r.jb)("schema",{name:i.z.string().id().search().static(),entries:i.z.array(d).generate(()=>[])}));class u extends o.J{list(e){return e?JSON.stringify(this.data).toLowerCase().includes(e.toLowerCase())?this.read():void 0:this.read()}static _newInstance(e,a){return new u(e,a)}constructor(e,a){super(e,d,a,"Database")}}let c=o.$.createDerived("DatabaseModel",l,"databases","/api/v1/");var b=t(48115),p=t(40214),m=t(51813),h=t(13997),f=t(1888),v=t(5632),w=t(43260),x=t(2784),g=t(1050),y=t(78161),_=t(87656);let k=e=>{let{color:a="black",size:t=24,...i}=e;return(0,s.jsxs)(_.Svg,{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:`${a}`,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...i,children:[(0,s.jsx)(_.Ellipse,{cx:"12",cy:"5",rx:"9",ry:"3",stroke:`${a}`}),(0,s.jsx)(_.Path,{d:"M3 5v14c0 1.4 3 2.7 7 3",stroke:`${a}`}),(0,s.jsx)(_.Path,{d:"M3 12c0 1.2 2 2.5 5 3",stroke:`${a}`}),(0,s.jsx)(_.Path,{d:"M21 5v4",stroke:`${a}`}),(0,s.jsx)(_.Path,{d:"M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16",stroke:`${a}`}),(0,s.jsx)(_.Path,{d:"M12 12v4h4",stroke:`${a}`})]})};k.displayName="DatabaseBackup";let j=(0,x.memo)((0,y.H)(k));var S=t(1201);let C={},P="/adminapi/v1/databases",D=async e=>{let a=[];if(Array.isArray(e))a=e.map(e=>e.name);else if("string"==typeof e&&"*"===e)a=["*"];else if("object"==typeof e&&null!==e&&e.data)a=[e.data.name];else throw Error("Invalid input for extractIds");await b.bl.post("/adminapi/v1/backup/databases",a)};var A={databases:{component:e=>{var a,t;let{workspace:i,pageState:n,initialItems:r,pageSession:o}=e,d=(0,v.useRouter)(),[l,u]=(0,x.useState)(!1),[b,f]=(0,x.useState)(""),[w,y]=(0,x.useState)(""),[_,k]=(0,x.useState)(0),A={item:{buttonCaption:"Backup",title:"Create Backup",description:"Are you sure want to backup this database?"},bulk:{buttonCaption:"Backup",title:"Create Backups",description:"Are you sure want to backup "+_+" databases?"},global:{buttonCaption:"Backup all databases",title:"Create Backups",description:"Are you sure want to backup all databases?"}};return(0,S.G)(()=>"At this moment the user is browsing the databases list page. The databases list page allows to list the system databases. Databases are based on leveldb, and stored under /data/databases.\n            The user can use the database management page to view system databases, or can select a specific database from the list, and view the entries for the selected database.\n            The system databases store the information in key->value system, storing JSONs as the value. \n            The databases are used to store users, groups, and as a storage for any CRUD API created for a object.\n            To backup databases, just backup /data/databases folder. To reset a database, simply delete /data/databases/*databasename*.\n            Using a special file called initialData.json at the same directory of your API, automatic crud apis will load initialData.json contents into the database when creating the database the first time. \n            Be careful editing the databases manually, the application may break. \n            "+((null==r?void 0:r.isLoaded)?"Currently the system returned the following information: "+JSON.stringify(r.data):"")),(0,s.jsxs)(p.D,{title:"Databases",workspace:i,pageSession:o,children:[(0,s.jsx)(m.a,{acceptCaption:"Create Backup",setOpen:u,open:l,onAccept:async e=>{await D(b),e(!1)},title:null===(a=A[w])||void 0===a?void 0:a.title,description:null===(t=A[w])||void 0===t?void 0:t.description,w:400,children:(0,s.jsx)("div",{className:"  _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-1 _fg-1 _jc-center _ai-center "})}),(0,s.jsx)(h.V,{integratedChat:!0,rowIcon:g.x,sourceUrl:P,initialItems:r,numColumnsForm:1,name:"database",onSelectItem:e=>{d.push("databases/view?database="+e.getId())},model:c,pageState:n,icons:C,extraMenuActions:[{text:e=>A[e].buttonCaption,icon:j,action:e=>{let a="item";"*"==e?a="global":Array.isArray(e)&&(a="bulk",k(e.length)),y(a),f(e),u(!0)},isVisible:e=>!0,menus:["item","global","bulk"]}]})]})},getServerSideProps:(0,f.eq)(P)},"databases/view":{component:e=>{var a;let{workspace:t,pageState:i,sourceUrl:n,initialItems:r,pageSession:o,extraData:d}=e,l=(0,v.useRouter)(),[c,m]=(0,x.useState)(null),[f,g]=(0,x.useState)(r),[y,_]=(0,x.useState)(""),[k,j]=(0,x.useState)(1),[S,P]=(0,x.useState)(!1),[D,A]=(0,x.useState)(!1),N=null!==(a=l.query.database)&&void 0!==a?a:"",B=async()=>{g(await b.bl.fetch("/adminapi/v1/databases/"+N))},I=async(e,a)=>{if(a)m(null),f.data.shift();else{let a=await b.bl.get("/adminapi/v1/databases/"+N+"/"+e+"/delete");(null==a?void 0:a.isLoaded)&&"deleted"==a.data.result&&(await B(),j(k+1))}},$=async(e,a)=>{let t=await b.bl.post("/adminapi/v1/databases/"+N+"/"+a,e);return(null==t?void 0:t.isLoaded)&&(await B(),j(k+1)),m(null),t};return(0,s.jsx)(p.D,{title:N,workspace:t,pageSession:o,children:(0,s.jsx)(h.V,{integratedChat:!0,sourceUrl:"/adminapi/v1/databases/"+N,initialItems:f,numColumnsForm:1,name:N,pluralName:N,model:u,pageState:i,icons:C,disableViewSelector:!0,defaultView:"grid",dataTableGridProps:{itemMinWidth:500,overScanBy:1,getCard:(e,a)=>{let{_key:t,...i}=e;return(0,s.jsx)("div",{className:"  _ai-stretch _dsp-flex _fd-column _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-1 _pr-1481558152 _pl-1481558152 _pb-1316330145 _fg-1 ",children:(0,s.jsx)(w.I,{innerContainerProps:{maxWidth:700,$md:{maxWidth:450},$sm:{minWidth:"calc(100vw - 65px)",maxWidth:"calc(100vw - 65px)"},minWidth:300,p:"$3"},onDelete:I,onSave:e=>$(e,t),json:i,name:t,isTemplate:t==c},k)})}}},k)})},getServerSideProps:(0,f.eq)(e=>"/adminapi/v1/databases/"+e.query.database,["admin"])}};t(61394)},61394:function(){}},function(e){e.O(0,[8641,8081,4733,1335,8873,2859,6313,3950,9331,4092,9927,6116,9498,1967,5619,9884,995,1004,4152,8676,767,1773,8859,4305,9774,2888,179],function(){return e(e.s=64848)}),_N_E=e.O()}]);