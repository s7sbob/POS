import{j as t,r as $,bf as le,R as O}from"./index-BOycD4kd.js";import{B as ne}from"./Breadcrumb-BqJ4_UoQ.js";import{P as se}from"./PageContainer-97CIqrJb.js";import{P as w}from"./ParentCard-MJIOvsrM.js";import{C as k}from"./CodeDialog-DS_2Fy2U.js";import{u as de}from"./Paper-CrmG5ZWt.js";import{g as J,s as _,i as E,j as m,e as X,c as K,T as ce}from"./Typography-BDkkff4Z.js";import{a as ue,C as he,b as me}from"./ChartsOverlay-D4Ozm1ER.js";import{d as pe,D as ge,b as Ce}from"./useChartContainerDimensions-B82M2TBf.js";import{b as Y,u as be,t as z,m as q,d as Q,k as W,z as Ae,R as xe,C as fe,a as Re}from"./ChartsAxisHighlight-BywgfQr8.js";import{d as Z,g as I}from"./getPercentageValue-BOxWk3Lu.js";import{u as ve}from"./useSkipAnimation-BxWud2x0.js";import{u as Pe}from"./useThemeProps-VRAKZLnh.js";import{S as ee}from"./Stack-7R2xgwnv.js";import{G}from"./Grid2-D56AonIH.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Box-BXQ1zNTo.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./ChartsText-LRNeksS5.js";import"./path-DyVhHtw_.js";import"./createStack-C9SkPHjo.js";const ye=["classes","color","cornerRadius","dataIndex","endAngle","id","innerRadius","isFaded","isHighlighted","onClick","outerRadius","paddingAngle","startAngle","highlightScope"];function je(e){return K("MuiPieArc",e)}J("MuiPieArc",["root","highlighted","faded"]);const Be=e=>{const{classes:a,id:i,isFaded:r,isHighlighted:o,dataIndex:l}=e,n={root:["root",`series-${i}`,`data-index-${l}`,o&&"highlighted",r&&"faded"]};return X(n,je,a)},Fe=_(Y.path,{name:"MuiPieArc",slot:"Root",overridesResolver:(e,a)=>a.arc})(({theme:e})=>({stroke:(e.vars||e).palette.background.paper,transition:"opacity 0.2s ease-in, fill 0.2s ease-in, filter 0.2s ease-in"}));function De(e){const{classes:a,color:i,cornerRadius:r,dataIndex:o,endAngle:l,id:n,innerRadius:s,isFaded:c,isHighlighted:g,onClick:C,outerRadius:x,paddingAngle:f,startAngle:d}=e,R=E(e,ye),h={id:n,dataIndex:o,classes:a,color:i,isFaded:c,isHighlighted:g},v=Be(h),y=be();return t.jsx(Fe,m({d:z([d,l,f,s,x,r],(u,P,b,p,A,B)=>Z().cornerRadius(B)({padAngle:b,startAngle:u,endAngle:P,innerRadius:p,outerRadius:A})),visibility:z([d,l],(u,P)=>u===P?"hidden":"visible"),onClick:C,cursor:C?"pointer":"unset",ownerState:h,className:v.root,fill:h.color,opacity:h.isFaded?.3:1,filter:h.isHighlighted?"brightness(120%)":"none",strokeWidth:1,strokeLinejoin:"round"},R,y({type:"pie",seriesId:n,dataIndex:o})))}const Le={keys:e=>e.id,from:({innerRadius:e,outerRadius:a,cornerRadius:i,startAngle:r,endAngle:o,paddingAngle:l,color:n,isFaded:s})=>({innerRadius:e,outerRadius:(e+a)/2,cornerRadius:i,startAngle:(r+o)/2,endAngle:(r+o)/2,paddingAngle:l,fill:n,opacity:s?.3:1}),leave:({innerRadius:e,startAngle:a,endAngle:i})=>({innerRadius:e,outerRadius:e,startAngle:(a+i)/2,endAngle:(a+i)/2}),enter:({innerRadius:e,outerRadius:a,startAngle:i,endAngle:r})=>({innerRadius:e,outerRadius:a,startAngle:i,endAngle:r}),update:({innerRadius:e,outerRadius:a,cornerRadius:i,startAngle:r,endAngle:o,paddingAngle:l,color:n,isFaded:s})=>({innerRadius:e,outerRadius:a,cornerRadius:i,startAngle:r,endAngle:o,paddingAngle:l,fill:n,opacity:s?.3:1}),config:{tension:120,friction:14,clamp:!0}},Ge={keys:e=>e.id,from:({innerRadius:e,outerRadius:a,arcLabelRadius:i,cornerRadius:r,startAngle:o,endAngle:l,paddingAngle:n})=>({innerRadius:e,outerRadius:(e+a)/2,cornerRadius:r,arcLabelRadius:i,startAngle:(o+l)/2,endAngle:(o+l)/2,paddingAngle:n,opacity:0}),leave:({innerRadius:e,startAngle:a,endAngle:i})=>({innerRadius:e,outerRadius:e,arcLabelRadius:e,startAngle:(a+i)/2,endAngle:(a+i)/2,opacity:0}),enter:({innerRadius:e,outerRadius:a,startAngle:i,endAngle:r,arcLabelRadius:o})=>({innerRadius:e,outerRadius:a,startAngle:i,endAngle:r,arcLabelRadius:o,opacity:1}),update:({innerRadius:e,outerRadius:a,cornerRadius:i,startAngle:r,endAngle:o,paddingAngle:l,arcLabelRadius:n})=>({innerRadius:e,outerRadius:a,cornerRadius:i,startAngle:r,endAngle:o,paddingAngle:l,arcLabelRadius:n,opacity:1}),config:{tension:120,friction:14,clamp:!0}};function te(e){const{id:a,data:i,faded:r,highlighted:o,paddingAngle:l=0,innerRadius:n=0,arcLabelRadius:s,outerRadius:c,cornerRadius:g=0}=e,{isFaded:C,isHighlighted:x}=q();return $.useMemo(()=>i.map((d,R)=>{const h={seriesId:a,dataIndex:R},v=x(h),y=!v&&C(h),u=m({additionalRadius:0},y&&r||v&&o||{}),P=Math.max(0,Math.PI*(u.paddingAngle??l)/180),b=Math.max(0,u.innerRadius??n),p=Math.max(0,u.outerRadius??c+u.additionalRadius),A=u.cornerRadius??g,B=u.arcLabelRadius??s??(b+p)/2;return m({},d,u,{isFaded:y,isHighlighted:v,paddingAngle:P,innerRadius:b,outerRadius:p,cornerRadius:A,arcLabelRadius:B})}),[g,n,c,l,s,i,r,o,C,x,a])}const Se=["slots","slotProps","innerRadius","outerRadius","cornerRadius","paddingAngle","id","highlighted","faded","data","onItemClick","skipAnimation"];function we(e){const{slots:a,slotProps:i,innerRadius:r=0,outerRadius:o,cornerRadius:l=0,paddingAngle:n=0,id:s,highlighted:c,faded:g={additionalRadius:-5},data:C,onItemClick:x,skipAnimation:f}=e,d=E(e,Se),R=te({innerRadius:r,outerRadius:o,cornerRadius:l,paddingAngle:n,id:s,highlighted:c,faded:g,data:C}),h=Q(R,m({},Le,{immediate:f})),{highlightScope:v}=q();if(C.length===0)return null;const y=(a==null?void 0:a.pieArc)??De;return t.jsx("g",m({},d,{children:h(({startAngle:u,endAngle:P,paddingAngle:b,innerRadius:p,outerRadius:A,cornerRadius:B},F,D,j)=>t.jsx(y,m({startAngle:u,endAngle:P,paddingAngle:b,innerRadius:p,outerRadius:A,cornerRadius:B,id:s,color:F.color,dataIndex:j,highlightScope:v,isFaded:F.isFaded,isHighlighted:F.isHighlighted,onClick:x&&(L=>{x(L,{type:"pie",seriesId:s,dataIndex:j},F)})},i==null?void 0:i.pieArc)))}))}const ke=["id","classes","color","startAngle","endAngle","paddingAngle","arcLabelRadius","innerRadius","outerRadius","cornerRadius","formattedArcLabel","isHighlighted","isFaded","style"];function Ie(e){return K("MuiPieArcLabel",e)}const Te=J("MuiPieArcLabel",["root","highlighted","faded"]),Ee=e=>{const{classes:a,id:i,isFaded:r,isHighlighted:o}=e,l={root:["root",`series-${i}`,o&&"highlighted",r&&"faded"]};return X(l,Ie,a)},Me=_(Y.text,{name:"MuiPieArcLabel",slot:"Root",overridesResolver:(e,a)=>a.root})(({theme:e})=>({fill:(e.vars||e).palette.text.primary,textAnchor:"middle",dominantBaseline:"middle",pointerEvents:"none"})),U=(e,a)=>(i,r,o,l,n)=>{if(!e)return 0;const[s,c]=Z().cornerRadius(n).centroid({padAngle:o,startAngle:i,endAngle:r,innerRadius:l,outerRadius:l});return a==="x"?s:c};function He(e){const{id:a,classes:i,color:r,startAngle:o,endAngle:l,paddingAngle:n,arcLabelRadius:s,cornerRadius:c,formattedArcLabel:g,isHighlighted:C,isFaded:x,style:f}=e,d=E(e,ke),h=Ee({id:a,classes:i,color:r,isFaded:x,isHighlighted:C});return t.jsx(Me,m({className:h.root},d,{style:m({x:z([o,l,n,s,c],U(g,"x")),y:z([o,l,n,s,c],U(g,"y"))},f),children:g}))}const ze=["arcLabel","arcLabelMinAngle","arcLabelRadius","cornerRadius","data","faded","highlighted","id","innerRadius","outerRadius","paddingAngle","skipAnimation","slotProps","slots"],$e=["startAngle","endAngle","paddingAngle","innerRadius","outerRadius","arcLabelRadius","cornerRadius"],_e=180/Math.PI;function Oe(e,a,i){var o;if(!e||(i.endAngle-i.startAngle)*_e<a)return null;switch(e){case"label":return W(i.label,"arc");case"value":return(o=i.value)==null?void 0:o.toString();case"formattedValue":return i.formattedValue;default:return e(m({},i,{label:W(i.label,"arc")}))}}function We(e){const{arcLabel:a,arcLabelMinAngle:i=0,arcLabelRadius:r,cornerRadius:o=0,data:l,faded:n={additionalRadius:-5},highlighted:s,id:c,innerRadius:g,outerRadius:C,paddingAngle:x=0,skipAnimation:f,slotProps:d,slots:R}=e,h=E(e,ze),v=te({innerRadius:g,outerRadius:C,arcLabelRadius:r,cornerRadius:o,paddingAngle:x,id:c,highlighted:s,faded:n,data:l}),y=Q(v,m({},Ge,{immediate:f}));if(l.length===0)return null;const u=(R==null?void 0:R.pieArcLabel)??He;return t.jsx("g",m({},h,{children:y((P,b)=>{let{startAngle:p,endAngle:A,paddingAngle:B,innerRadius:F,outerRadius:D,arcLabelRadius:j,cornerRadius:L}=P,T=E(P,$e);return t.jsx(u,m({startAngle:p,endAngle:A,paddingAngle:B,innerRadius:F,outerRadius:D,arcLabelRadius:j,cornerRadius:L,style:T,id:c,color:b.color,isFaded:b.isFaded,isHighlighted:b.isHighlighted,formattedArcLabel:Oe(a,i,b)},d==null?void 0:d.pieArcLabel))})}))}function N(e,a){const{height:i,width:r}=a,{cx:o,cy:l}=e,n=Math.min(r,i)/2,s=I(o??"50%",r),c=I(l??"50%",i);return{cx:s,cy:c,availableRadius:n}}function Ue(e){const{skipAnimation:a,slots:i,slotProps:r,onItemClick:o}=e,l=Ae(),{left:n,top:s,width:c,height:g}=$.useContext(pe),C=ve(a);if(l===void 0)return null;const{series:x,seriesOrder:f}=l;return t.jsxs("g",{children:[f.map(d=>{const{innerRadius:R,outerRadius:h,cornerRadius:v,paddingAngle:y,data:u,cx:P,cy:b,highlighted:p,faded:A}=x[d],{cx:B,cy:F,availableRadius:D}=N({cx:P,cy:b},{width:c,height:g}),j=I(h??D,D),L=I(R??0,D);return t.jsx("g",{transform:`translate(${n+B}, ${s+F})`,children:t.jsx(we,{innerRadius:L,outerRadius:j,cornerRadius:v,paddingAngle:y,id:d,data:u,skipAnimation:C,highlighted:p,faded:A,onItemClick:o,slots:i,slotProps:r})},d)}),f.map(d=>{const{innerRadius:R,outerRadius:h,arcLabelRadius:v,cornerRadius:y,paddingAngle:u,arcLabel:P,arcLabelMinAngle:b,data:p,cx:A,cy:B}=x[d],{cx:F,cy:D,availableRadius:j}=N({cx:A,cy:B},{width:c,height:g}),L=I(h??j,j),T=I(R??0,j),M=v===void 0?(L+T)/2:I(v,j);return t.jsx("g",{transform:`translate(${n+F}, ${s+D})`,children:t.jsx(We,{innerRadius:T,outerRadius:L??j,arcLabelRadius:M,cornerRadius:y,paddingAngle:u,id:d,data:p,skipAnimation:C,arcLabel:P,arcLabelMinAngle:b,slots:i,slotProps:r})},d)})]})}const Ne=["xAxis","yAxis","series","width","height","margin","colors","sx","tooltip","axisHighlight","skipAnimation","legend","topAxis","leftAxis","rightAxis","bottomAxis","children","slots","slotProps","onItemClick","loading","highlightedItem","onHighlightChange","className"],Ve={top:5,bottom:5,left:5,right:100},Je={top:5,bottom:5,left:100,right:5},S=$.forwardRef(function(a,i){const r=Pe({props:a,name:"MuiPieChart"}),{xAxis:o,yAxis:l,series:n,width:s,height:c,margin:g,colors:C,sx:x,tooltip:f={trigger:"item"},axisHighlight:d={x:"none",y:"none"},skipAnimation:R,legend:h,topAxis:v=null,leftAxis:y=null,rightAxis:u=null,bottomAxis:P=null,children:b,slots:p,slotProps:A,onItemClick:B,loading:F,highlightedItem:D,onHighlightChange:j,className:L}=r,T=E(r,Ne),M=le(),ie=m({},M?Je:Ve,g),re=m({direction:"column",position:{vertical:"middle",horizontal:M?"left":"right"}},h);return t.jsxs(xe,m({},T,{ref:i,series:n.map(H=>m({type:"pie"},H)),width:s,height:c,margin:ie,xAxis:o??[{id:ge,scaleType:"point",data:[...new Array(Math.max(...n.map(H=>H.data.length)))].map((H,oe)=>oe)}],yAxis:l,colors:C,sx:x,disableAxisListener:(f==null?void 0:f.trigger)!=="axis"&&(d==null?void 0:d.x)==="none"&&(d==null?void 0:d.y)==="none",highlightedItem:D,onHighlightChange:j,className:L,skipAnimation:R,children:[t.jsx(ue,{topAxis:v,leftAxis:y,rightAxis:u,bottomAxis:P,slots:p,slotProps:A}),t.jsx(Ue,{slots:p,slotProps:A,onItemClick:B}),t.jsx(he,{loading:F,slots:p,slotProps:A}),t.jsx(me,m({},re,{slots:p,slotProps:A})),t.jsx(fe,m({},d)),!F&&t.jsx(Re,m({},f,{slots:p,slotProps:A})),b]}))});function Xe(){return t.jsx(k,{children:`
'use client'
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material';

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'BasicPieChart ',
},
]; 


export default function BasicPieChart() {
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const Datacolor = theme.palette.error.main;
    return (
     

            <PieChart
                series={[
                    {
                        data: [
                            { id: 0, value: 10, label: 'series A', color: primary },
                            { id: 1, value: 15, label: 'series B', color: secondary },
                            { id: 2, value: 20, label: 'series C', color: Datacolor },
                        ],
                    },

                ]}
               
                height={300}
            />
     
    );
}
  `})}function Ke(){const e=de(),a=e.palette.primary.main,i=e.palette.secondary.main,r=e.palette.error.main;return t.jsx(w,{title:"Basic Chart",codeModel:t.jsx(Xe,{}),children:t.jsx(S,{series:[{data:[{id:0,value:10,label:"series A",color:a},{id:1,value:15,label:"series B",color:i},{id:2,value:20,label:"series C",color:r}]}],height:300})})}function Ye(){return t.jsx(k,{children:`
import React from "react";
import ParentCard from 'src/components/shared/ParentCard';
import TwoLevelPieCode from "../code/piechartcode/TwoLevelPieCode";
import { PieChart } from "@mui/x-charts/PieChart";

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'TwoLevelPieChart ',
},
]; 


function TwoLevelPieChart() {
    const data1 = [
      { label: "Group A", value: 400, color: "#5D87FF" },
      { label: "Group B", value: 300, color: "#0074BA" },
      { label: "Group C", value: 300, color: "#763EBD" },
      { label: "Group D", value: 200, color: "#0A7EA4" },
    ];
    const data2 = [
      { label: "A1", value: 100, color: "#01C0C8" },
      { label: "A2", value: 300, color: "#FA896B" },
      { label: "B1", value: 100, color: "#01C0C8" },
      { label: "B2", value: 80, color: "#0074BA" },
      { label: "B3", value: 40, color: "#49BEFF" },
      { label: "B4", value: 30, color: "#47D7BC" },
      { label: "B5", value: 50, color: "#FFCD56" },
      { label: "C1", value: 100, color: "#95CFD5" },
      { label: "C2", value: 200, color: "#CCDA4E" },
      { label: "D1", value: 150, color: "#0A7EA4" },
      { label: "D2", value: 50, color: "#FB9678" },
    ];
  
    return (
      
        <PieChart
          series={[
            {
              innerRadius: 0,
              outerRadius: 80,
              data: data1,
            },
            {
              innerRadius: 100,
              outerRadius: 120,
              data: data2,
            },
          ]}
          width={400}
          height={300}
          slotProps={{
            legend: { hidden: true },
          }}
        />
      
    );
  }
  
  export default TwoLevelPieChart;
  
`})}function qe(){const e=[{label:"Group A",value:400,color:"#5D87FF"},{label:"Group B",value:300,color:"#0074BA"},{label:"Group C",value:300,color:"#763EBD"},{label:"Group D",value:200,color:"#0A7EA4"}],a=[{label:"A1",value:100,color:"#01C0C8"},{label:"A2",value:300,color:"#FA896B"},{label:"B1",value:100,color:"#01C0C8"},{label:"B2",value:80,color:"#0074BA"},{label:"B3",value:40,color:"#49BEFF"},{label:"B4",value:30,color:"#47D7BC"},{label:"B5",value:50,color:"#FFCD56"},{label:"C1",value:100,color:"#95CFD5"},{label:"C2",value:200,color:"#CCDA4E"},{label:"D1",value:150,color:"#0A7EA4"},{label:"D2",value:50,color:"#FB9678"}];return t.jsx(w,{title:"TwoLevel Chart",codeModel:t.jsx(Ye,{}),children:t.jsx(S,{series:[{innerRadius:0,outerRadius:80,data:e},{innerRadius:100,outerRadius:120,data:a}],width:400,height:300,slotProps:{legend:{hidden:!0}}})})}function Qe(){return t.jsx(k,{children:`
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
  
const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'StraightAnglePieChart ',
},
]; 
    const data = [
        { label: 'Group A', value: 400, color: "#5D87FF" },
        { label: 'Group B', value: 300, color: "#0074BA" },
        { label: 'Group C', value: 300, color: "#01C0C8" },
        { label: 'Group D', value: 200, color: "#CCDA4E" },
        { label: 'Group E', value: 278, color: "#FB9678" },
        { label: 'Group F', value: 189, color: "#47D7BC" },
    ];
    
    export default function StraightAnglePieChart() {
    
            return (
            <PieChart
                series={[
                    {
                        startAngle: -90,
                        endAngle: 90,
                        data,
                    },
                ]}
                height={300}
            />
   
  )
}
  `})}function Ze(){const e=[{label:"Group A",value:400,color:"#5D87FF"},{label:"Group B",value:300,color:"#0074BA"},{label:"Group C",value:300,color:"#01C0C8"},{label:"Group D",value:200,color:"#CCDA4E"},{label:"Group E",value:278,color:"#FB9678"},{label:"Group F",value:189,color:"#49BEFF"}];return t.jsx(w,{title:"StraightAngle Chart",codeModel:t.jsx(Qe,{}),children:t.jsx(S,{series:[{startAngle:-90,endAngle:90,data:e}],height:300})})}function et(){return t.jsx(k,{children:`
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'TwoSimplePieChart ',
},
]; 

const data1 = [
    { label: 'Group A', value: 400, color: "#5D87FF" },
    { label: 'Group B', value: 300, color: "#0074BA" },
    { label: 'Group C', value: 300, color: "#763EBD" },
    { label: 'Group D', value: 200, color: "#0A7EA4" },
    { label: 'Group E', value: 278, color: "#01C0C8" },
    { label: 'Group F', value: 189, color: "#FA896B" },
];

const data2 = [
    { label: 'Group A', value: 2400, color: "#01C0C8" },
    { label: 'Group B', value: 4567, color: "#0074BA" },
    { label: 'Group C', value: 1398, color: "#49BEFF" },
    { label: 'Group D', value: 9800, color: "#47D7BC" },
    { label: 'Group E', value: 3908, color: "#FFCD56" },
    { label: 'Group F', value: 4800, color: "#95CFD5" },
];


export default function TwoSimplePieChart() {
    return (
      

            <PieChart
                series={[
                  {
                        outerRadius: 80,
                        data: data1,
                        cx: 100,
                        cy: 200,
                    },
                    {
                        data: data2,
                        cx: 300,
                        cy: 100,
                        innerRadius: 40,
                        outerRadius: 80,
                    },
                ]}
                height={300}
                slotProps={{
                    legend: { hidden: true },
                }}
            />
    
    );
}
         `})}const tt=[{label:"Group A",value:400,color:"#5D87FF"},{label:"Group B",value:300,color:"#0074BA"},{label:"Group C",value:300,color:"#763EBD"},{label:"Group D",value:200,color:"#0A7EA4"},{label:"Group E",value:278,color:"#01C0C8"},{label:"Group F",value:189,color:"#FA896B"}],at=[{label:"Group A",value:2400,color:"#01C0C8"},{label:"Group B",value:4567,color:"#0074BA"},{label:"Group C",value:1398,color:"#49BEFF"},{label:"Group D",value:9800,color:"#47D7BC"},{label:"Group E",value:3908,color:"#FFCD56"},{label:"Group F",value:4800,color:"#95CFD5"}];function it(){return t.jsx(w,{title:"TwoSimple Chart",codeModel:t.jsx(et,{}),children:t.jsx(S,{series:[{outerRadius:80,data:tt,cx:100,cy:200},{data:at,cx:300,cy:100,innerRadius:40,outerRadius:80}],height:300,slotProps:{legend:{hidden:!0}}})})}function rt(){return t.jsx(k,{children:`
import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'PieChartWithCustomizedLabel ',
},
]; 

const data = [
    { label: 'Group A', value: 400, color: '#5D87FF' },
    { label: 'Group B', value: 300, color: '#0074BA' },
    { label: 'Group C', value: 300, color: '#01C0C8' },
    { label: 'Group D', value: 200, color: '#CCDA4E' },
];

const sizing = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    legend: { hidden: true },
};
const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

const getArcLabel = (params: { value: number; }) => {
    const percent = params.value / TOTAL;
    return {(percent * 100).toFixed(0)}%;
};

            export default function PieChartWithCustomizedLabel() {
    return (
      
                <PieChart
                    series={[
                        {
                            outerRadius: 80,
                            data,
                            arcLabel: getArcLabel,
                        },
                    ]}
                    sx={{
                        [\`& .\${pieArcLabelClasses.root}\`]: {
                            fill: 'white',
                            fontSize: 14,
                        },
                    }}
                    {...sizing}
                />
      
            );
}
            `})}const ae=[{label:"Group A",value:400,color:"#5D87FF"},{label:"Group B",value:300,color:"#0074BA"},{label:"Group C",value:300,color:"#01C0C8"},{label:"Group D",value:200,color:"#CCDA4E"}],ot={margin:{right:5},width:200,height:200,legend:{hidden:!0}},lt=ae.map(e=>e.value).reduce((e,a)=>e+a,0),nt=e=>`${(e.value/lt*100).toFixed(0)}%`;function st(){return t.jsx(w,{title:"CustomizedLabel Chart",codeModel:t.jsx(rt,{}),children:t.jsx(S,{series:[{outerRadius:80,data:ae,arcLabel:nt}],sx:{[`& .${Te.root}`]:{fill:"white",fontSize:14}},...ot})})}function dt(){return t.jsx(k,{children:`
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';
const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'PieChartWithPaddingAngleChart ',
},
]; 


const data = [
    { label: 'Group A', value: 400, color: "#5D87FF" },
    { label: 'Group B', value: 300, color: "#FA896B" },
    { label: 'Group C', value: 300, color: "#FFCD56" },
    { label: 'Group D', value: 200, color: "#95CFD5" },
];

export default function PieChartWithPaddingAngleChart() {
    return (
     

            <Stack direction="row">
                <PieChart
                    series={[
                        {
                            paddingAngle: 5,
                            innerRadius: 60,
                            outerRadius: 80,
                            data,
                        },
                    ]}
                    margin={{ right: 5 }}
                    width={200}
                    height={200}
                    legend={{ hidden: true }}
                />
                <PieChart
                    series={[
                        {
                            startAngle: -90,
                            endAngle: 90,
                            paddingAngle: 5,
                            innerRadius: 60,
                            outerRadius: 80,
                            data,

                        },
                    ]}
                    margin={{ right: 5 }}
                    width={200}
                    height={200}
                    slotProps={{
                        legend: { hidden: true },
                    }}
                />
            </Stack>
    
    );
}

            `})}const V=[{label:"Group A",value:400,color:"#5D87FF"},{label:"Group B",value:300,color:"#FA896B"},{label:"Group C",value:300,color:"#FFCD56"},{label:"Group D",value:200,color:"#95CFD5"}];function ct(){return t.jsx(w,{title:"PaddingAngle Chart",codeModel:t.jsx(dt,{}),children:t.jsxs(ee,{direction:"row",children:[t.jsx(S,{series:[{paddingAngle:5,innerRadius:60,outerRadius:80,data:V}],margin:{right:5},width:200,height:200,legend:{hidden:!0}}),t.jsx(S,{series:[{startAngle:-90,endAngle:90,paddingAngle:5,innerRadius:60,outerRadius:80,data:V}],margin:{right:5},width:200,height:200,slotProps:{legend:{hidden:!0}}})]})})}function ut(){return t.jsx(k,{children:`
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'PieChartWithCenterLabelChart ',
},
]; 


const data = [
  { value: 5, label: 'A', color: '#5D87FF' },
  { value: 10, label: 'B', color: '#0074BA' },
  { value: 15, label: 'C', color: '#01C0C8' },
  { value: 20, label: 'D', color: '#CCDA4E' },
];

const size = {
  width: 400,
  height: 200,
};

const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
}));

function PieCenterLabel({ children }: any) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
        </StyledText>
    );
}

export default function PieChartWithCenterLabelChart() {
  return (
   

          <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
              <PieCenterLabel>Center label</PieCenterLabel>
          </PieChart>

  );
}


            `})}const ht=[{value:5,label:"A",color:"#5D87FF"},{value:10,label:"B",color:"#0074BA"},{value:15,label:"C",color:"#01C0C8"},{value:20,label:"D",color:"#CCDA4E"}],mt={width:400,height:200},pt=_("text")(({theme:e})=>({fill:e.palette.text.primary,textAnchor:"middle",dominantBaseline:"central",fontSize:20}));function gt({children:e}){const{width:a,height:i,left:r,top:o}=Ce();return t.jsx(pt,{x:r+a/2,y:o+i/2,children:e})}function Ct(){return t.jsx(w,{title:"CenterLabel Chart",codeModel:t.jsx(ut,{}),children:t.jsx(S,{series:[{data:ht,innerRadius:80}],...mt,children:t.jsx(gt,{children:"Center label"})})})}function bt(){return t.jsx(k,{children:`
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
      
const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'OnSeriesItemClickChart ',
},
]; 

const items = [
  { value: 10, label: 'Series A ( no Id )', color: '#CCDA4E' },
  { id: 'id_B', value: 15, label: 'Series B', color: '#0074BA' },
  { id: 'id_C', value: 20, label: 'Series C', color: '#01C0C8' },
];

const formatObject = (obj: null) => {
    if (obj === null) {
        return '  undefined';
    }
    return JSON.stringify(obj, null, 2)
        .split('
')
        .map((l) =>   {l})
        .join('
');
};
      export default function OnSeriesItemClickChart() {
  const [identifier, setIdentifier] = React.useState(null);
      const [id, setId] = React.useState(undefined);

        const handleClick = (event: any, itemIdentifier: any, item: any) => {
        setId(item.id);
        setIdentifier(itemIdentifier);
    };


      return (
   

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Typography
            component="pre"
            sx={{ maxWidth: { xs: '100%', md: '50%', flexShrink: 1 }, overflow: 'auto' }}
          >
            {\`item id: \${id ?? 'undefined'}

                 item identifier:
                 \${formatObject(identifier)}\`}
          </Typography>

          <PieChart
            series={[
              {
                data: items,
              },
            ]}
            onItemClick={handleClick}
            width={400}
            height={200}
            margin={{ right: 200 }}
          />
        </Stack>
 
      );
}


      `})}const At=[{value:10,label:"Series A ( no Id )",color:"#CCDA4E"},{id:"id_B",value:15,label:"Series B",color:"#0074BA"},{id:"id_C",value:20,label:"Series C",color:"#01C0C8"}],xt=e=>e===null?"  undefined":JSON.stringify(e,null,2).split(`
`).map(a=>`  ${a}`).join(`
`);function ft(){const[e,a]=O.useState(null),[i,r]=O.useState(void 0),o=(l,n,s)=>{r(s.id),a(n)};return t.jsx(w,{title:"OnSeriesItemClick Chart",codeModel:t.jsx(bt,{}),children:t.jsxs(ee,{direction:{xs:"column",md:"row"},alignItems:{xs:"flex-start",md:"center"},justifyContent:"space-between",sx:{width:"100%"},children:[t.jsx(ce,{component:"pre",sx:{maxWidth:{xs:"100%",md:"50%",flexShrink:1},overflow:"auto"},children:`item id: ${i??"undefined"}

                   item identifier:
                   ${xt(e)}`}),t.jsx(S,{series:[{data:At}],onItemClick:o,width:400,height:200,margin:{right:200}})]})})}const Rt=[{to:"/",title:"Home"},{title:"PieCharts "}],pa=()=>t.jsxs(se,{title:"PieCharts",description:"this is PieCharts ",children:[t.jsx(ne,{title:"PieCharts",items:Rt}),t.jsxs(G,{container:!0,spacing:3,children:[t.jsx(G,{size:{md:6},children:t.jsx(Ke,{})}),t.jsx(G,{size:{md:6},children:t.jsx(qe,{})}),t.jsx(G,{size:{md:6},children:t.jsx(Ze,{})}),t.jsx(G,{size:{md:6},children:t.jsx(it,{})}),t.jsx(G,{size:{md:6},children:t.jsx(st,{})}),t.jsx(G,{size:{md:6},children:t.jsx(Ct,{})}),t.jsx(G,{size:{md:6},children:t.jsx(ct,{})}),t.jsx(G,{size:{md:6},children:t.jsx(ft,{})})]})]});export{pa as default};
