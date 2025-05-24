import{b7 as Q,bv as X,al as I,r as U,ak as Y,j as t,b3 as nt}from"./index-BOycD4kd.js";import{B as ot}from"./Breadcrumb-BqJ4_UoQ.js";import{P as rt}from"./PageContainer-97CIqrJb.js";import{P as H}from"./ParentCard-MJIOvsrM.js";import{C as s}from"./ChildCard-1K0LK_Kd.js";import{S as l}from"./Stack-7R2xgwnv.js";import{B as n,a as et}from"./Button-DuWWTJ1w.js";import{c as _,g as tt,s as C,m as W,q as it,d as lt,e as at}from"./Typography-BDkkff4Z.js";import{u as st}from"./useId-B1jnamIH.js";import{c as ct}from"./composeClasses-O3bfDh63.js";import{I as E}from"./IconTrash-Cds8XG15.js";import{I as b}from"./IconSend-DeV5r_4E.js";import{T as d}from"./Tooltip-DKFlwfZ_.js";import{I as y}from"./IconButton-C9FWHOCN.js";import{I as u}from"./IconBell-CdaLrRJY.js";import{F as x}from"./Fab-CltzWDsW.js";import{I as dt}from"./IconPlus-CMHBvUCl.js";import{I as ut}from"./IconClipboard-CUaIFrjn.js";import{B as i}from"./ButtonGroup-CVs-6cD_.js";import{I as G,a as F,b as L}from"./IconPlayerSkipForward-7LATCj1h.js";import{c as q}from"./createReactComponent-DJ-alZeM.js";import{C as c}from"./CodeDialog-DS_2Fy2U.js";import{G as e}from"./Grid2-D56AonIH.js";import"./index-BwqtTtay.js";import"./Paper-CrmG5ZWt.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./Link-DehrJQLa.js";import"./Box-BXQ1zNTo.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./createStack-C9SkPHjo.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";function xt(r){return _("MuiCircularProgress",r)}tt("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const g=44,V=Q`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,K=Q`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`,ht=typeof V!="string"?X`
        animation: ${V} 1.4s linear infinite;
      `:null,pt=typeof K!="string"?X`
        animation: ${K} 1.4s ease-in-out infinite;
      `:null,mt=r=>{const{classes:o,variant:a,color:h,disableShrink:w}=r,m={root:["root",a,`color${I(h)}`],svg:["svg"],circle:["circle",`circle${I(a)}`,w&&"circleDisableShrink"]};return at(m,xt,o)},jt=C("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,o)=>{const{ownerState:a}=r;return[o.root,o[a.variant],o[`color${I(a.color)}`]]}})(W(({theme:r})=>({display:"inline-block",variants:[{props:{variant:"determinate"},style:{transition:r.transitions.create("transform")}},{props:{variant:"indeterminate"},style:ht||{animation:`${V} 1.4s linear infinite`}},...Object.entries(r.palette).filter(it()).map(([o])=>({props:{color:o},style:{color:(r.vars||r).palette[o].main}}))]}))),Bt=C("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(r,o)=>o.svg})({display:"block"}),gt=C("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,o)=>{const{ownerState:a}=r;return[o.circle,o[`circle${I(a.variant)}`],a.disableShrink&&o.circleDisableShrink]}})(W(({theme:r})=>({stroke:"currentColor",variants:[{props:{variant:"determinate"},style:{transition:r.transitions.create("stroke-dashoffset")}},{props:{variant:"indeterminate"},style:{strokeDasharray:"80px, 200px",strokeDashoffset:0}},{props:({ownerState:o})=>o.variant==="indeterminate"&&!o.disableShrink,style:pt||{animation:`${K} 1.4s ease-in-out infinite`}}]}))),bt=U.forwardRef(function(o,a){const h=Y({props:o,name:"MuiCircularProgress"}),{className:w,color:m="primary",disableShrink:R=!1,size:S=40,style:N,thickness:j=3.6,value:P=0,variant:$="indeterminate",...D}=h,v={...h,color:m,disableShrink:R,size:S,thickness:j,value:P,variant:$},T=mt(v),k={},B={},f={};if($==="determinate"){const z=2*Math.PI*((g-j)/2);k.strokeDasharray=z.toFixed(3),f["aria-valuenow"]=Math.round(P),k.strokeDashoffset=`${((100-P)/100*z).toFixed(3)}px`,B.transform="rotate(-90deg)"}return t.jsx(jt,{className:lt(T.root,w),style:{width:S,height:S,...B,...N},ownerState:v,ref:a,role:"progressbar",...f,...D,children:t.jsx(Bt,{className:T.svg,ownerState:v,viewBox:`${g/2} ${g/2} ${g} ${g}`,children:t.jsx(gt,{className:T.circle,style:k,ownerState:v,cx:g,cy:g,r:(g-j)/2,fill:"none",strokeWidth:j})})})});var M=q("align-center","IconAlignCenter",[["path",{d:"M4 6l16 0",key:"svg-0"}],["path",{d:"M8 12l8 0",key:"svg-1"}],["path",{d:"M6 18l12 0",key:"svg-2"}]]),O=q("align-left","IconAlignLeft",[["path",{d:"M4 6l16 0",key:"svg-0"}],["path",{d:"M4 12l10 0",key:"svg-1"}],["path",{d:"M4 18l14 0",key:"svg-2"}]]),A=q("align-right","IconAlignRight",[["path",{d:"M4 6l16 0",key:"svg-0"}],["path",{d:"M10 12l10 0",key:"svg-1"}],["path",{d:"M6 18l14 0",key:"svg-2"}]]);function yt(r){return _("MuiLoadingButton",r)}const p=tt("MuiLoadingButton",["root","label","loading","loadingIndicator","loadingIndicatorCenter","loadingIndicatorStart","loadingIndicatorEnd","endIconLoadingEnd","startIconLoadingStart"]),It=r=>{const{loading:o,loadingPosition:a,classes:h}=r,w={root:["root",o&&"loading"],label:["label"],startIcon:[o&&`startIconLoading${I(a)}`],endIcon:[o&&`endIconLoading${I(a)}`],loadingIndicator:["loadingIndicator",o&&`loadingIndicator${I(a)}`]},m=ct(w,yt,h);return{...h,...m}},wt=r=>r!=="ownerState"&&r!=="theme"&&r!=="sx"&&r!=="as"&&r!=="classes",ft=C(n,{shouldForwardProp:r=>wt(r)||r==="classes",name:"MuiLoadingButton",slot:"Root",overridesResolver:(r,o)=>[o.root,o.startIconLoadingStart&&{[`& .${p.startIconLoadingStart}`]:o.startIconLoadingStart},o.endIconLoadingEnd&&{[`& .${p.endIconLoadingEnd}`]:o.endIconLoadingEnd}]})(W(({theme:r})=>({display:"inline-flex",[`& .${p.startIconLoadingStart}, & .${p.endIconLoadingEnd}`]:{transition:r.transitions.create(["opacity"],{duration:r.transitions.duration.short}),opacity:0},variants:[{props:{loadingPosition:"center"},style:{transition:r.transitions.create(["background-color","box-shadow","border-color"],{duration:r.transitions.duration.short}),[`&.${p.loading}`]:{color:"transparent"}}},{props:({ownerState:o})=>o.loadingPosition==="start"&&o.fullWidth,style:{[`& .${p.startIconLoadingStart}, & .${p.endIconLoadingEnd}`]:{transition:r.transitions.create(["opacity"],{duration:r.transitions.duration.short}),opacity:0,marginRight:-8}}},{props:({ownerState:o})=>o.loadingPosition==="end"&&o.fullWidth,style:{[`& .${p.startIconLoadingStart}, & .${p.endIconLoadingEnd}`]:{transition:r.transitions.create(["opacity"],{duration:r.transitions.duration.short}),opacity:0,marginLeft:-8}}}]}))),St=C("span",{name:"MuiLoadingButton",slot:"LoadingIndicator",overridesResolver:(r,o)=>{const{ownerState:a}=r;return[o.loadingIndicator,o[`loadingIndicator${I(a.loadingPosition)}`]]}})(W(({theme:r})=>({position:"absolute",visibility:"visible",display:"flex",variants:[{props:{loadingPosition:"start",size:"small"},style:{left:10}},{props:({loadingPosition:o,ownerState:a})=>o==="start"&&a.size!=="small",style:{left:14}},{props:{variant:"text",loadingPosition:"start"},style:{left:6}},{props:{loadingPosition:"center"},style:{left:"50%",transform:"translate(-50%)",color:(r.vars||r).palette.action.disabled}},{props:{loadingPosition:"end",size:"small"},style:{right:10}},{props:({loadingPosition:o,ownerState:a})=>o==="end"&&a.size!=="small",style:{right:14}},{props:{variant:"text",loadingPosition:"end"},style:{right:6}},{props:({ownerState:o})=>o.loadingPosition==="start"&&o.fullWidth,style:{position:"relative",left:-10}},{props:({ownerState:o})=>o.loadingPosition==="end"&&o.fullWidth,style:{position:"relative",right:-10}}]}))),Z=C("span",{name:"MuiLoadingButton",slot:"Label",overridesResolver:(r,o)=>[o.label]})({display:"inherit",alignItems:"inherit",justifyContent:"inherit"}),J=U.forwardRef(function(o,a){const h=U.useContext(et),w=nt(h,o),m=Y({props:w,name:"MuiLoadingButton"}),{children:R,disabled:S=!1,id:N,loading:j=!1,loadingIndicator:P,loadingPosition:$="center",variant:D="text",...v}=m,T=st(N),k=P??t.jsx(bt,{"aria-labelledby":T,color:"inherit",size:16}),B={...m,disabled:S,loading:j,loadingIndicator:k,loadingPosition:$,variant:D},f=It(B),z=j?t.jsx(St,{className:f.loadingIndicator,ownerState:B,children:k}):null;return t.jsxs(ft,{disabled:S||j,id:T,ref:a,...v,variant:D,classes:f,ownerState:B,children:[B.loadingPosition==="end"?t.jsx(Z,{className:f.label,children:R}):z,B.loadingPosition==="end"?z:t.jsx(Z,{className:f.label,children:R})]})}),vt=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},justifyContent:"center",children:[t.jsx(n,{variant:"contained",color:"primary",children:"Primary"}),t.jsx(n,{variant:"contained",color:"secondary",children:"Secondary"}),t.jsx(n,{disabled:!0,children:"Disabled"}),t.jsx(n,{href:"#text-buttons",variant:"contained",color:"primary",children:"Link"})]}),Tt=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},justifyContent:"center",children:[t.jsx(n,{variant:"contained",color:"primary",children:"Primary"}),t.jsx(n,{variant:"contained",color:"secondary",children:"Secondary"}),t.jsx(n,{variant:"contained",color:"error",children:"Error"}),t.jsx(n,{variant:"contained",color:"warning",children:"Warning"}),t.jsx(n,{variant:"contained",color:"success",children:"Success"})]}),kt=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},justifyContent:"center",children:[t.jsx(J,{loading:!0,loadingIndicator:"Loading…",variant:"contained",color:"error",startIcon:t.jsx(E,{width:18}),children:"Left Icon"}),t.jsx(J,{loading:!0,variant:"contained",color:"secondary",endIcon:t.jsx(E,{width:18}),children:"Right Icon"})]}),Ct=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},alignItems:"center",justifyContent:"center",children:[t.jsx(n,{variant:"contained",size:"small",children:"Small"}),t.jsx(n,{variant:"contained",size:"medium",children:"Medium"}),t.jsx(n,{variant:"contained",size:"large",children:"Large"})]}),Pt=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},justifyContent:"center",children:[t.jsx(n,{variant:"outlined",color:"error",startIcon:t.jsx(E,{width:18}),children:"Left Icon"}),t.jsx(n,{variant:"outlined",color:"secondary",endIcon:t.jsx(b,{width:18}),children:"Right Icon"})]}),zt=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},alignItems:"center",justifyContent:"center",children:[t.jsx(n,{variant:"outlined",size:"small",children:"Small"}),t.jsx(n,{variant:"outlined",size:"medium",children:"Medium"}),t.jsx(n,{variant:"outlined",size:"large",children:"Large"})]}),Gt=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},justifyContent:"center",children:[t.jsx(n,{color:"primary",children:"Primary"}),t.jsx(n,{color:"secondary",children:"Secondary"}),t.jsx(n,{disabled:!0,children:"Disabled"}),t.jsx(n,{href:"#text-buttons",color:"primary",children:"Link"})]}),Ft=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},justifyContent:"center",children:[t.jsx(n,{color:"primary",children:"Primary"}),t.jsx(n,{color:"secondary",children:"Secondary"}),t.jsx(n,{color:"error",children:"Error"}),t.jsx(n,{color:"warning",children:"Warning"}),t.jsx(n,{color:"success",children:"Success"})]}),Lt=()=>t.jsxs(l,{spacing:1,direction:"row",justifyContent:"center",children:[t.jsx(n,{color:"error",startIcon:t.jsx(E,{width:18}),children:"Left Icon"}),t.jsx(n,{color:"secondary",endIcon:t.jsx(b,{width:18}),children:"Right Icon"})]}),Mt=()=>t.jsxs(l,{spacing:1,direction:"row",alignItems:"center",justifyContent:"center",children:[t.jsx(n,{size:"small",children:"Small"}),t.jsx(n,{size:"medium",children:"Medium"}),t.jsx(n,{size:"large",children:"Large"})]}),Ot=()=>t.jsxs(l,{spacing:1,direction:"row",justifyContent:"center",children:[t.jsx(d,{title:"Bell",children:t.jsx(y,{color:"primary","aria-label":"primary-bell",children:t.jsx(u,{width:18})})}),t.jsx(d,{title:"Bell",children:t.jsx(y,{color:"secondary","aria-label":"secondary-bell",children:t.jsx(u,{width:18})})}),t.jsx(d,{title:"Bell",children:t.jsx(y,{color:"error","aria-label":"error-bell",children:t.jsx(u,{width:18})})}),t.jsx(d,{title:"Bell",children:t.jsx(y,{color:"warning","aria-label":"warning-bell",children:t.jsx(u,{width:18})})}),t.jsx(d,{title:"Bell",children:t.jsx(y,{color:"success","aria-label":"success-bell",children:t.jsx(u,{width:18})})})]}),At=()=>t.jsxs(l,{spacing:1,direction:"row",justifyContent:"center",children:[t.jsx(d,{title:"Bell",children:t.jsx(y,{"aria-label":"small-bell",children:t.jsx(u,{width:16})})}),t.jsx(d,{title:"Bell",children:t.jsx(y,{size:"medium","aria-label":"medium-bell",children:t.jsx(u,{width:19})})}),t.jsx(d,{title:"Bell",children:t.jsx(y,{"aria-label":"large-bell",children:t.jsx(u,{width:21})})})]}),Rt=()=>t.jsxs(l,{spacing:1,direction:"row",justifyContent:"center",children:[t.jsx(d,{title:"Send",children:t.jsx(x,{color:"primary","aria-label":"send",children:t.jsx(b,{width:20})})}),t.jsx(d,{title:"Add",children:t.jsx(x,{color:"secondary","aria-label":"plus",children:t.jsx(dt,{width:20})})}),t.jsx(x,{disabled:!0,"aria-label":"clipboard",children:t.jsx(ut,{width:20})})]}),$t=()=>t.jsx(t.Fragment,{children:t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},justifyContent:"center",alignItems:"center",children:[t.jsx(d,{title:"Send",children:t.jsx(x,{color:"primary","aria-label":"send",children:t.jsx(b,{width:20})})}),t.jsx(d,{title:"Send",children:t.jsx(x,{color:"secondary","aria-label":"send",children:t.jsx(b,{width:20})})}),t.jsx(d,{title:"Send",children:t.jsx(x,{color:"warning","aria-label":"send",children:t.jsx(b,{width:20})})}),t.jsx(d,{title:"Send",children:t.jsx(x,{color:"error","aria-label":"send",children:t.jsx(b,{width:20})})}),t.jsx(d,{title:"Send",children:t.jsx(x,{color:"success","aria-label":"send",children:t.jsx(b,{width:20})})})]})}),Dt=()=>t.jsx(t.Fragment,{children:t.jsxs(l,{spacing:1,direction:"row",justifyContent:"center",children:[t.jsx(d,{title:"Bell",children:t.jsx(x,{size:"small",color:"primary","aria-label":"small-bell",children:t.jsx(u,{width:16})})}),t.jsx(d,{title:"Bell",children:t.jsx(x,{size:"medium",color:"secondary","aria-label":"medium-bell",children:t.jsx(u,{width:18})})}),t.jsx(d,{title:"Bell",children:t.jsx(x,{size:"large",color:"warning","aria-label":"large-bell",children:t.jsx(u,{width:20})})})]})}),Et=()=>t.jsxs(l,{spacing:1,children:[t.jsxs(i,{variant:"outlined","aria-label":"outlined button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{variant:"contained","aria-label":"outlined primary button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]})]}),Wt=()=>t.jsxs(l,{spacing:1,justifyContent:"center",children:[t.jsxs(i,{size:"small",variant:"outlined","aria-label":"outlined primary button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{variant:"outlined","aria-label":"outlined button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{size:"large",variant:"outlined","aria-label":"text button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]})]}),Nt=()=>t.jsxs(l,{spacing:1,direction:"row",children:[t.jsxs(i,{orientation:"vertical",variant:"contained","aria-label":"outlined primary button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{orientation:"vertical",variant:"outlined","aria-label":"outlined button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{orientation:"vertical",variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]})]}),Ut=()=>t.jsxs(l,{spacing:2,direction:{xs:"column",sm:"row",lg:"column"},justifyContent:"center",children:[t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"column",lg:"row"},children:[t.jsxs(i,{variant:"contained","aria-label":"outlined primary button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{variant:"contained",color:"secondary","aria-label":"outlined primary button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{variant:"contained",color:"error","aria-label":"outlined primary button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{color:"success",variant:"contained","aria-label":"outlined primary button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]})]}),t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"column",lg:"row"},children:[t.jsxs(i,{variant:"outlined","aria-label":"outlined button group",children:[t.jsx(n,{children:t.jsx(G,{width:18})}),t.jsx(n,{children:t.jsx(F,{width:18})}),t.jsx(n,{children:t.jsx(L,{width:18})})]}),t.jsxs(i,{variant:"outlined",color:"secondary","aria-label":"outlined button group",children:[t.jsx(n,{children:t.jsx(G,{width:18})}),t.jsx(n,{children:t.jsx(F,{width:18})}),t.jsx(n,{children:t.jsx(L,{width:18})})]}),t.jsxs(i,{variant:"outlined",color:"warning","aria-label":"outlined button group",children:[t.jsx(n,{children:t.jsx(G,{width:18})}),t.jsx(n,{children:t.jsx(F,{width:18})}),t.jsx(n,{children:t.jsx(L,{width:18})})]}),t.jsxs(i,{variant:"outlined",color:"error","aria-label":"outlined button group",children:[t.jsx(n,{children:t.jsx(G,{width:18})}),t.jsx(n,{children:t.jsx(F,{width:18})}),t.jsx(n,{children:t.jsx(L,{width:18})})]}),t.jsxs(i,{variant:"outlined",color:"success","aria-label":"outlined button group",children:[t.jsx(n,{children:t.jsx(G,{width:18})}),t.jsx(n,{children:t.jsx(F,{width:18})}),t.jsx(n,{children:t.jsx(L,{width:18})})]})]}),t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"column",lg:"row"},children:[t.jsxs(i,{variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:t.jsx(O,{width:18})}),t.jsx(n,{children:t.jsx(M,{width:18})}),t.jsx(n,{children:t.jsx(A,{width:18})})]}),t.jsxs(i,{color:"secondary",variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:t.jsx(O,{width:18})}),t.jsx(n,{children:t.jsx(M,{width:18})}),t.jsx(n,{children:t.jsx(A,{width:18})})]}),t.jsxs(i,{color:"warning",variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:t.jsx(O,{width:18})}),t.jsx(n,{children:t.jsx(M,{width:18})}),t.jsx(n,{children:t.jsx(A,{width:18})})]}),t.jsxs(i,{color:"error",variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:t.jsx(O,{width:18})}),t.jsx(n,{children:t.jsx(M,{width:18})}),t.jsx(n,{children:t.jsx(A,{width:18})})]}),t.jsxs(i,{color:"success",variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:t.jsx(O,{width:18})}),t.jsx(n,{children:t.jsx(M,{width:18})}),t.jsx(n,{children:t.jsx(A,{width:18})})]})]})]}),Vt=()=>t.jsxs(l,{spacing:1,direction:"column",justifyContent:"center",children:[t.jsxs(i,{variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{color:"secondary",variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]}),t.jsxs(i,{color:"error",variant:"text","aria-label":"text button group",children:[t.jsx(n,{children:"One"}),t.jsx(n,{children:"Two"}),t.jsx(n,{children:"Three"})]})]}),Kt=()=>t.jsxs(l,{spacing:1,direction:{xs:"column",sm:"row"},justifyContent:"center",children:[t.jsx(n,{variant:"outlined",color:"primary",children:"Primary"}),t.jsx(n,{variant:"outlined",color:"secondary",children:"Secondary"}),t.jsx(n,{variant:"outlined",color:"error",children:"Error"}),t.jsx(n,{variant:"outlined",color:"warning",children:"Warning"}),t.jsx(n,{variant:"outlined",color:"success",children:"Success"})]}),qt=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button variant="contained" color="primary">
      Primary
    </Button>
    <Button variant="contained" color="secondary">
      Secondary
    </Button>
    <Button disabled>Disabled</Button>
    <Button href="#text-buttons" variant="contained" color="primary">
      Link
    </Button>
</Stack>`})}),Ht=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button variant="contained" color="primary">
        Primary
    </Button>
    <Button variant="contained" color="secondary">
        Secondary
    </Button>
    <Button variant="contained" color="error">
        Error
    </Button>
    <Button variant="contained" color="warning">
        Warning
    </Button>
    <Button variant="contained" color="success">
        Success
    </Button>
</Stack>`})}),Zt=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Stack } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import LoadingButton from '@mui/lab/LoadingButton';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <LoadingButton loading loadingIndicator="Loading…"
      variant="contained"
      color="error"
      startIcon={<IconTrash width={18} />}
    >
      Left Icon
    </LoadingButton >
    <LoadingButton loading
      variant="contained"
      color="secondary"
      endIcon={<IconTrash width={18} />}
    >
      Right Icon
    </LoadingButton >
</Stack>`})}),Jt=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center">
    <Button variant="contained" size="small">
      Small
    </Button>
    <Button variant="contained" size="medium">
      Medium
    </Button>
    <Button variant="contained" size="large">
      Large
    </Button>
</Stack>`})}),Qt=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button variant="outlined" color="primary">
      Primary
    </Button>
    <Button variant="outlined" color="secondary">
      Secondary
    </Button>
    <Button variant="outlined" color="error">
      Error
    </Button>
    <Button variant="outlined" color="warning">
      Warning
    </Button>
    <Button variant="outlined" color="success">
      Success
    </Button>
</Stack>`})}),Xt=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';
import { IconTrash, IconSend } from '@tabler/icons-react';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button
        variant="outlined"
        color="error"
        startIcon={<IconTrash width={18} />}
    >
        Left Icon
    </Button>
    <Button
        variant="outlined"
        color="secondary"
        endIcon={<IconSend width={18} />}
    >
        Right Icon
    </Button>
</Stack>`})}),Yt=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center">
    <Button variant="outlined" size="small">
      Small
    </Button>
    <Button variant="outlined" size="medium">
      Medium
    </Button>
    <Button variant="outlined" size="large">
      Large
    </Button>
</Stack>`})}),_t=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button disabled>Disabled</Button>
    <Button href="#text-buttons" color="primary">
      Link
    </Button>
</Stack>`})}),tn=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="error">Error</Button>
    <Button color="warning">Warning</Button>
    <Button color="success">Success</Button>
</Stack>`})}),nn=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';
import { IconTrash, IconSend } from '@tabler/icons-react';

<Stack spacing={1} direction="row" justifyContent="center">
    <Button color="error" startIcon={<IconTrash width={18} />}>
      Left Icon
    </Button>
    <Button color="secondary" endIcon={<IconSend width={18} />}>
      Right Icon
    </Button>
</Stack>`})}),on=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction="row" alignItems="center" justifyContent="center">
    <Button size="small">Small</Button>
    <Button size="medium">Medium</Button>
    <Button size="large">Large</Button>
</Stack>`})}),rn=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { IconButton, Tooltip, Stack } from '@mui/material';
import { IconBell } from '@tabler/icons-react';

<Stack spacing={1} direction="row" justifyContent="center">
    <Tooltip title="Bell">
      <IconButton color="primary" aria-label="primary-bell">
        <IconBell width={18} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Bell">
      <IconButton color="secondary" aria-label="secondary-bell">
        <IconBell width={18} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Bell">
      <IconButton color="error" aria-label="error-bell">
        <IconBell width={18} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Bell">
      <IconButton color="warning" aria-label="warning-bell">
        <IconBell width={18} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Bell">
      <IconButton color="success" aria-label="success-bell">
        <IconBell width={18} />
      </IconButton>
    </Tooltip>
</Stack>`})}),en=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { IconButton, Tooltip, Stack } from '@mui/material';
import { IconBell } from '@tabler/icons-react';

<Stack spacing={1} direction="row" justifyContent="center">
    <Tooltip title="Bell">
      <IconButton aria-label="small-bell">
        <IconBell width={16} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Bell">
      <IconButton size="medium" aria-label="medium-bell">
        <IconBell width={19} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Bell">
      <IconButton aria-label="large-bell">
        <IconBell width={21} />
      </IconButton>
    </Tooltip>
</Stack>`})}),ln=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Fab, Tooltip, Stack } from '@mui/material';
import { IconClipboard, IconPlus, IconSend } from '@tabler/icons-react';

<Stack spacing={1} direction="row" justifyContent="center">
    <Tooltip title="Send">
      <Fab color="primary" aria-label="send">
        <IconSend width={20} />
      </Fab>
    </Tooltip>
    <Tooltip title="Add">
      <Fab color="secondary" aria-label="plus">
        <IconPlus width={20} />
      </Fab>
    </Tooltip>
    <Fab disabled aria-label="clipboard">
      <IconClipboard width={20} />
    </Fab>
</Stack>`})}),an=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Fab, Tooltip, Stack } from '@mui/material';
import { IconSend } from '@tabler/icons-react';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center">
    <Tooltip title="Send">
        <Fab color="primary" aria-label="send">
          <IconSend width={20} />
        </Fab>
    </Tooltip>
    <Tooltip title="Send">
        <Fab color="secondary" aria-label="send">
          <IconSend width={20} />
        </Fab>
    </Tooltip>
    <Tooltip title="Send">
        <Fab color="warning" aria-label="send">
          <IconSend width={20} />
        </Fab>
    </Tooltip>
    <Tooltip title="Send">
        <Fab color="error" aria-label="send">
          <IconSend width={20} />
        </Fab>
    </Tooltip>
    <Tooltip title="Send">
        <Fab color="success" aria-label="send">
          <IconSend width={20} />
        </Fab>
    </Tooltip>
</Stack>`})}),sn=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Fab, Tooltip, Stack } from '@mui/material';
import { IconBell } from '@tabler/icons-react';

<Stack spacing={1} direction="row" justifyContent="center">
    <Tooltip title="Bell">
        <Fab size="small" color="primary" aria-label="small-bell">
          <IconBell width={16} />
        </Fab>
    </Tooltip>
    <Tooltip title="Bell">
        <Fab size="medium" color="secondary" aria-label="medium-bell">
          <IconBell width={18} />
        </Fab>
    </Tooltip>
    <Tooltip title="Bell">
        <Fab size="large" color="warning" aria-label="large-bell">
          <IconBell width={20} />
        </Fab>
    </Tooltip>
</Stack>`})}),cn=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, ButtonGroup, Stack } from '@mui/material';

<Stack spacing={1} >
    <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
    </ButtonGroup>
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
    </ButtonGroup>
    <ButtonGroup variant="text" aria-label="text button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
    </ButtonGroup>
</Stack>`})}),dn=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, ButtonGroup, Stack } from '@mui/material';

<Stack spacing={1} justifyContent="center">
    <ButtonGroup size="small" variant="outlined" aria-label="outlined primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
    </ButtonGroup>
    <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
    </ButtonGroup>
    <ButtonGroup size="large" variant="outlined" aria-label="text button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
    </ButtonGroup>
</Stack>`})}),un=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
  "use client";
  
  import { Button, ButtonGroup, Stack } from '@mui/material';

  <Stack spacing={1} direction="row">
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical" variant="outlined" aria-label="outlined button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical" variant="text" aria-label="text button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
  </Stack>`})}),xn=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, ButtonGroup, Stack } from '@mui/material';

<Stack spacing={1} direction="column" justifyContent="center">
    <ButtonGroup variant="text" aria-label="text button group">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
    <ButtonGroup color="secondary" variant="text" aria-label="text button group">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
    <ButtonGroup color="error" variant="text" aria-label="text button group">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
</Stack>`})}),hn=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
"use client";

import { Button, ButtonGroup, Stack } from '@mui/material';
import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward } from '@tabler/icons-react';

<Stack spacing={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }} justifyContent="center">
    <Stack spacing={1} direction={{ xs: 'column', sm: 'column', lg: 'row' }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup
          variant="contained"
          color="secondary"
          aria-label="outlined primary button group"
        >
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup variant="contained" color="error" aria-label="outlined primary button group">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <ButtonGroup
          color="success"
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
    </Stack>
    <Stack spacing={1} direction={{ xs: 'column', sm: 'column', lg: 'row' }}>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Button>
            <IconPlayerSkipBack width={18} />
          </Button>
          <Button>
            <IconPlayerPlay width={18} />
          </Button>
          <Button>
            <IconPlayerSkipForward width={18} />
          </Button>
        </ButtonGroup>
        <ButtonGroup variant="outlined" color="secondary" aria-label="outlined button group">
          <Button>
            <IconPlayerSkipBack width={18} />
          </Button>
          <Button>
            <IconPlayerPlay width={18} />
          </Button>
          <Button>
            <IconPlayerSkipForward width={18} />
          </Button>
        </ButtonGroup>
        <ButtonGroup variant="outlined" color="warning" aria-label="outlined button group">
          <Button>
            <IconPlayerSkipBack width={18} />
          </Button>
          <Button>
            <IconPlayerPlay width={18} />
          </Button>
          <Button>
            <IconPlayerSkipForward width={18} />
          </Button>
        </ButtonGroup>
        <ButtonGroup variant="outlined" color="error" aria-label="outlined button group">
          <Button>
            <IconPlayerSkipBack width={18} />
          </Button>
          <Button>
            <IconPlayerPlay width={18} />
          </Button>
          <Button>
            <IconPlayerSkipForward width={18} />
          </Button>
        </ButtonGroup>
        <ButtonGroup variant="outlined" color="success" aria-label="outlined button group">
          <Button>
            <IconPlayerSkipBack width={18} />
          </Button>
          <Button>
            <IconPlayerPlay width={18} />
          </Button>
          <Button>
            <IconPlayerSkipForward width={18} />
          </Button>
        </ButtonGroup>
      </Stack>
      <Stack spacing={1} direction={{ xs: 'column', sm: 'column', lg: 'row' }}>
        <ButtonGroup variant="text" aria-label="text button group">
          <Button>
            <IconAlignLeft width={18} />
          </Button>
          <Button>
            <IconAlignCenter width={18} />
          </Button>
          <Button>
            <IconAlignRight width={18} />
          </Button>
        </ButtonGroup>
        <ButtonGroup color="secondary" variant="text" aria-label="text button group">
          <Button>
            <IconAlignLeft width={18} />
          </Button>
          <Button>
            <IconAlignCenter width={18} />
          </Button>
          <Button>
            <IconAlignRight width={18} />
          </Button>
        </ButtonGroup>
        <ButtonGroup color="warning" variant="text" aria-label="text button group">
          <Button>
            <IconAlignLeft width={18} />
          </Button>
          <Button>
            <IconAlignCenter width={18} />
          </Button>
          <Button>
            <IconAlignRight width={18} />
          </Button>
        </ButtonGroup>
        <ButtonGroup color="error" variant="text" aria-label="text button group">
          <Button>
            <IconAlignLeft width={18} />
          </Button>
          <Button>
            <IconAlignCenter width={18} />
          </Button>
          <Button>
            <IconAlignRight width={18} />
          </Button>
        </ButtonGroup>
        <ButtonGroup color="success" variant="text" aria-label="text button group">
          <Button>
            <IconAlignLeft width={18} />
          </Button>
          <Button>
            <IconAlignCenter width={18} />
          </Button>
          <Button>
            <IconAlignRight width={18} />
          </Button>
        </ButtonGroup>
    </Stack>
</Stack>`})}),pn=[{to:"/",title:"Home"},{title:"Button"}],uo=()=>t.jsxs(rt,{title:"Buttons",description:"this is Buttons page",children:[t.jsx(ot,{title:"Button",items:pn}),t.jsxs(e,{container:!0,spacing:3,children:[t.jsx(e,{size:12,children:t.jsx(H,{title:"Buttons",children:t.jsxs(e,{container:!0,spacing:3,children:[t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Default",codeModel:t.jsx(qt,{}),children:t.jsx(vt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Colors",codeModel:t.jsx(Ht,{}),children:t.jsx(Tt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Loading Buttons",codeModel:t.jsx(Zt,{}),children:t.jsx(kt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Sizes",codeModel:t.jsx(Jt,{}),children:t.jsx(Ct,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Outlined",codeModel:t.jsx(Qt,{}),children:t.jsx(Kt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Outlined Icon",codeModel:t.jsx(Xt,{}),children:t.jsx(Pt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Outline Size",codeModel:t.jsx(Yt,{}),children:t.jsx(zt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Text",codeModel:t.jsx(_t,{}),children:t.jsx(Gt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Text Color",codeModel:t.jsx(tn,{}),children:t.jsx(Ft,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Text Icon",codeModel:t.jsx(nn,{}),children:t.jsx(Lt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Text Sizes",codeModel:t.jsx(on,{}),children:t.jsx(Mt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Icon Color",codeModel:t.jsx(rn,{}),children:t.jsx(Ot,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Icon Sizes",codeModel:t.jsx(en,{}),children:t.jsx(At,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"FAB",codeModel:t.jsx(ln,{}),children:t.jsx(Rt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"FAB Color",codeModel:t.jsx(an,{}),children:t.jsx($t,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"FAB Size",codeModel:t.jsx(sn,{}),children:t.jsx(Dt,{})})})]})})}),t.jsx(e,{size:12,children:t.jsx(H,{title:"Button Group",children:t.jsxs(e,{container:!0,spacing:3,children:[t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Default",codeModel:t.jsx(cn,{}),children:t.jsx(Et,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Sizes",codeModel:t.jsx(dn,{}),children:t.jsx(Wt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Verical",codeModel:t.jsx(un,{}),children:t.jsx(Nt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6},children:t.jsx(s,{title:"Text",codeModel:t.jsx(xn,{}),children:t.jsx(Vt,{})})}),t.jsx(e,{display:"flex",alignItems:"stretch",size:12,children:t.jsx(s,{title:"Color",codeModel:t.jsx(hn,{}),children:t.jsx(Ut,{})})})]})})})]})]});export{uo as default};
