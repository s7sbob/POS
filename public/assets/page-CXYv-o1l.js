import{r as te,j as e}from"./index-BOycD4kd.js";import{B as re}from"./Breadcrumb-BqJ4_UoQ.js";import{P as se}from"./PageContainer-97CIqrJb.js";import{P as h}from"./ParentCard-MJIOvsrM.js";import{C as x}from"./CodeDialog-DS_2Fy2U.js";import{u}from"./Paper-CrmG5ZWt.js";import{i as ie,j as t}from"./Typography-BDkkff4Z.js";import{B as oe}from"./BarPlot-D8MM2Hb7.js";import{C as ne,a as ce,b as le}from"./ChartsOverlay-D4Ozm1ER.js";import{D as de,a as me}from"./useChartContainerDimensions-B82M2TBf.js";import{u as pe}from"./useId-B1jnamIH.js";import{u as he}from"./useThemeProps-VRAKZLnh.js";import{R as xe,C as ue,a as ke}from"./ChartsAxisHighlight-BywgfQr8.js";import{C as ye,a as Ce}from"./ChartsOnAxisClickHandler-CFtvsx7s.js";import{C as be}from"./ChartsGrid-CUWat_-J.js";import{G as d}from"./Grid2-D56AonIH.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Box-BXQ1zNTo.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./useChartId-BWKwJWVT.js";import"./useSkipAnimation-BxWud2x0.js";import"./ChartsText-LRNeksS5.js";const ge=["xAxis","yAxis","series","width","height","margin","colors","dataset","sx","tooltip","onAxisClick","axisHighlight","legend","grid","topAxis","leftAxis","rightAxis","bottomAxis","children","slots","slotProps","skipAnimation","loading","layout","onItemClick","highlightedItem","onHighlightChange","borderRadius","barLabel","className"],We=s=>{const{xAxis:i,yAxis:o,series:a,width:r,height:n,margin:y,colors:C,dataset:W,sx:A,tooltip:m,onAxisClick:B,axisHighlight:c,legend:P,grid:l,topAxis:j,leftAxis:T,rightAxis:G,bottomAxis:S,children:L,slots:b,slotProps:g,skipAnimation:V,loading:w,layout:R,onItemClick:H,highlightedItem:M,onHighlightChange:z,borderRadius:_,barLabel:N,className:E}=s,X=ie(s,ge),D=`${pe()}-clip-path`,f=R==="horizontal"||R===void 0&&a.some(p=>p.layout==="horizontal"),I={scaleType:"band",data:Array.from({length:Math.max(...a.map(p=>(p.data??W??[]).length))},(p,ae)=>ae)},Y=t({},X,{series:a.map(p=>t({type:"bar"},p,{layout:f?"horizontal":"vertical"})),width:r,height:n,margin:y,colors:C,dataset:W,xAxis:i??(f?void 0:[t({id:de},I)]),yAxis:o??(f?[t({id:me},I)]:void 0),sx:A,highlightedItem:M,onHighlightChange:z,disableAxisListener:(m==null?void 0:m.trigger)!=="axis"&&(c==null?void 0:c.x)==="none"&&(c==null?void 0:c.y)==="none"&&!B,className:E,skipAnimation:V}),$={onItemClick:H,slots:b,slotProps:g,borderRadius:_,barLabel:N},F={onAxisClick:B},K={vertical:l==null?void 0:l.vertical,horizontal:l==null?void 0:l.horizontal},O={clipPath:`url(#${D})`},U={id:D},q={slots:b,slotProps:g,loading:w},J={topAxis:j,leftAxis:T,rightAxis:G,bottomAxis:S,slots:b,slotProps:g},Q=t({},f?{y:"band"}:{x:"band"},c),Z=t({},P,{slots:b,slotProps:g}),ee=t({},m,{slots:b,slotProps:g});return{chartContainerProps:Y,barPlotProps:$,axisClickHandlerProps:F,gridProps:K,clipPathProps:U,clipPathGroupProps:O,overlayProps:q,chartsAxisProps:J,axisHighlightProps:Q,legendProps:Z,tooltipProps:ee,children:L}},k=te.forwardRef(function(i,o){const a=he({props:i,name:"MuiBarChart"}),{chartContainerProps:r,barPlotProps:n,axisClickHandlerProps:y,gridProps:C,clipPathProps:W,clipPathGroupProps:A,overlayProps:m,chartsAxisProps:B,axisHighlightProps:c,legendProps:P,tooltipProps:l,children:j}=We(a);return e.jsxs(xe,t({ref:o},r,{children:[a.onAxisClick&&e.jsx(ye,t({},y)),e.jsx(be,t({},C)),e.jsxs("g",t({},A,{children:[e.jsx(oe,t({},n)),e.jsx(ne,t({},m)),e.jsx(ue,t({},c))]})),e.jsx(ce,t({},B)),e.jsx(le,t({},P)),!a.loading&&e.jsx(ke,t({},l)),e.jsx(Ce,t({},W)),j]}))});function Be(){return e.jsx(x,{children:`
            
'use client'
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material';

   const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'SimpleBarChart ',
  },
]; 

export default function SimpleBarChart() {

    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
      const xLabels = [
    "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"
  ];

    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    return (
      
            <BarChart
                height={300}
                borderRadius={6}
                series={[
                    { data: pData, label: 'Page Views', id: 'pvId', color: primary },
                    { data: uData, label: ' Visitors', id: 'uvId', color: secondary },
                ]}
              xAxis={[{
                    data: xLabels, scaleType: 'band',
                    categoryGapRatio: 0.8,
                    barGapRatio: 0.8
                } as any]}
            />
   
    );
}
`})}function v(){const s=[4e3,3e3,2e3,2780,1890,2390,3490],i=[2400,1398,9800,3908,4800,3800,4300],o=["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7"],a=u(),r=a.palette.primary.main,n=a.palette.secondary.main;return e.jsx(h,{title:"Simple Chart",codeModel:e.jsx(Be,{}),children:e.jsx(k,{height:300,borderRadius:6,series:[{data:i,label:"Page Views",id:"pId",color:r},{data:s,label:" Visitors",id:"uId",color:n}],xAxis:[{data:o,scaleType:"band",categoryGapRatio:.8,barGapRatio:.8}]})})}function fe(){return e.jsx(x,{children:`
"use client"

import React from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from "@mui/material/styles";

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'StackedBarChart ',
},
];

function StackedBarChart() {

    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
      const xLabels = [
    "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"
  ];

    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    return (
      
            <BarChart
                height={300}
                borderRadius={6}
                series={[
                    { data: pData, label: 'Page Views', id: 'pvId', stack: 'total', color: primary },
                    { data: uData, label: 'Visitors', id: 'uvId', stack: 'total', color: secondary },
                ]}
                  xAxis={[{
                    data: xLabels, scaleType: 'band', categoryGapRatio: 0.8,
                    barGapRatio: 0.8
                } as any]}
            />
    
    )
}

export default StackedBarChart;
`})}function Ae(){const s=[4e3,3e3,2e3,2780,1890,2390,3490],i=[2400,1398,9800,3908,4800,3800,4300],o=["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7"],a=u(),r=a.palette.primary.main,n=a.palette.secondary.main;return e.jsx(h,{title:"Stacked Chart",codeModel:e.jsx(fe,{}),children:e.jsx(k,{height:300,borderRadius:6,series:[{data:i,label:"Page Views",id:"pvId",stack:"total",color:r},{data:s,label:"Visitors",id:"uvId",stack:"total",color:n}],xAxis:[{data:o,scaleType:"band",categoryGapRatio:.8,barGapRatio:.8}]})})}function Pe(){return e.jsx(x,{children:`
    
'use client'
;
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material';

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'MixedBarChart ',
},
]; 
function MixedBarChart() {
    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const amtData = [2400, 2210, 2290, 2000, 2181, 2500, 2100];

    const xLabels = [
    "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"
  ];
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const light = theme.palette.success.main;

    return (
            <BarChart
               borderRadius={6}
                height={300}
                series={[
                    { data: pData, label: 'Page Views', stack: 'stack1', color: primary },
                    { data: amtData, label: ' Visitors', color: success },
                    { data: uData, label: 'Revenue ', stack: 'stack1', color: secondary },
                ]}
              xAxis={[{
                    data: xLabels, scaleType: 'band', categoryGapRatio: 0.8,
                    barGapRatio: 0.8
                } as any]}
            />

    )
}

export default MixedBarChart
`})}function je(){const s=[4e3,3e3,2e3,2780,1890,2390,3490],i=[2400,1398,9800,3908,4800,3800,4300],o=[2400,2210,2290,2e3,2181,2500,2100],a=["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7"],r=u(),n=r.palette.primary.main,y=r.palette.secondary.main,C=r.palette.success.main;return e.jsx(h,{title:"Mixed Chart",codeModel:e.jsx(Pe,{}),children:e.jsx(k,{borderRadius:6,height:300,series:[{data:i,label:"Page Views",stack:"stack1",color:n},{data:o,label:" Visitors",color:C},{data:s,label:"Revenue ",stack:"stack1",color:y}],xAxis:[{data:a,scaleType:"band",categoryGapRatio:.8,barGapRatio:.8}]})})}function Re(){return e.jsx(x,{children:`
            
'use client'
;
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material';

   const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'PositiveAndNegativeBarChart ',
  },
]; 


function PositiveAndNegativeBarChart() {
    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, -9800, 3908, 4800, -3800, 4300];

      const xLabels = [
    "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"
  ];
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const success = theme.palette.success.main;

    return (

            <BarChart
              
                height={300}
                borderRadius={6}
                series={[
                    {
                        data: pData,
                        label: 'Page Views',
                        color: primary
                    },
                    {
                        data: uData,
                        label: ' Visitors',
                        color: success
                    },
                ]}
               xAxis={[
                    {
                        data: xLabels,
                        scaleType: 'band',
                        categoryGapRatio: 0.8,
                        barGapRatio: 0.8
                    } as any,
                ]}
                yAxis={[{ max: 10000 }]}
            />
    )
}

export default PositiveAndNegativeBarChart

`})}function De(){const s=[4e3,3e3,2e3,2780,1890,2390,3490],i=[2400,1398,-9800,3908,4800,-3800,4300],o=["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7"],a=u(),r=a.palette.primary.main,n=a.palette.success.main;return e.jsx(h,{title:"Positive And Negative Chart",codeModel:e.jsx(Re,{}),children:e.jsx(k,{height:300,borderRadius:6,series:[{data:i,label:"Page Views",color:r},{data:s,label:" Visitors",color:n}],xAxis:[{data:o,scaleType:"band",categoryGapRatio:.8,barGapRatio:.8}],yAxis:[{max:1e4}]})})}function Ie(){return e.jsx(x,{children:`
  
'use client'

import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material';


const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'BarChartStackedBySignChart ',
},
]; 


function BarChartStackedBySignChart() {
  const pData = [2400, 1398, -9800, 3908, 4800, -3800, 4300];
  const uData = [4000, -3000, -2000, 2780, -1890, 2390, 3490];

  const xLabels = [
    "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"
  ];
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  return (
   
      <BarChart
      borderRadius={6}
        height={300}
        series={[
          { data: pData, label: 'Page Views', id: 'pvId', stack: 'stack1', color: primary },
          { data: uData, label: 'Visitors', id: 'uvId', stack: 'stack1', color: secondary },
        ]}
        xAxis={[{
          data: xLabels, scaleType: "band",
          categoryGapRatio: 0.8,
          barGapRatio: 0.8
        } as any]}
      />
 
  )
}

export default BarChartStackedBySignChart

`})}function ve(){const s=[2400,1398,-9800,3908,4800,-3800,4300],i=[4e3,-3e3,-2e3,2780,-1890,2390,3490],o=["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7"],a=u(),r=a.palette.primary.main,n=a.palette.secondary.main;return e.jsx(h,{title:"StackedBySign Chart",codeModel:e.jsx(Ie,{}),children:e.jsx(k,{borderRadius:6,height:300,series:[{data:s,label:"Page Views",id:"pvId",stack:"stack1",color:r},{data:i,label:" Visitors",id:"uvId",stack:"stack1",color:n}],xAxis:[{data:o,scaleType:"band",categoryGapRatio:.8,barGapRatio:.8}]})})}function Te(){return e.jsx(x,{children:`
  
'use client'
;
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material';

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'BiaxialBarChart ',
},
]; 
function BiaxialBarChart() {
    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];

     const xLabels = [
      "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"
  ];

    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    return (
            <BarChart
              borderRadius={6}
                height={300}
                series={[
                    {
                        data: pData,
                        label: "Page Views",
                        id: "pvId",
                        color: primary,

                        yAxisId: "leftAxisId",
                    },
                    {
                        data: uData,
                        label: "Visitors",
                        id: "uvId",
                        color: secondary,

                        yAxisId: "rightAxisId",
                    },
                ]}
               xAxis={[{
                    data: xLabels, scaleType: "band", categoryGapRatio: 0.8,
                    barGapRatio: 0.8
                } as any]}
                yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
                rightAxis="rightAxisId"
            />
    );
}

export default BiaxialBarChart;

`})}function Ge(){const s=[4e3,3e3,2e3,2780,1890,2390,3490],i=[2400,1398,9800,3908,4800,3800,4300],o=["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7"],a=u(),r=a.palette.primary.main,n=a.palette.secondary.main;return e.jsx(h,{title:"Biaxial Chart",codeModel:e.jsx(Te,{}),children:e.jsx(k,{borderRadius:6,height:300,series:[{data:i,label:"Page Views",id:"pvId",color:r,yAxisId:"leftAxisId"},{data:s,label:"Visitors",id:"uvId",color:n,yAxisId:"rightAxisId"}],xAxis:[{data:o,scaleType:"band",categoryGapRatio:.8,barGapRatio:.8}],yAxis:[{id:"leftAxisId"},{id:"rightAxisId"}],rightAxis:"rightAxisId"})})}const Se=[{to:"/",title:"Home"},{title:"Bar Charts"}],Ra=()=>e.jsxs(se,{title:"Bar Chart",description:"this is Bar Chart",children:[e.jsx(re,{title:"Bar Chart",items:Se}),e.jsxs(d,{container:!0,spacing:3,children:[e.jsx(d,{size:{md:6},children:e.jsx(v,{})}),e.jsx(d,{size:{md:6},children:e.jsx(je,{})}),e.jsx(d,{size:{md:6},children:e.jsx(De,{})}),e.jsx(d,{size:{md:6},children:e.jsx(ve,{})}),e.jsx(d,{size:{md:6},children:e.jsx(Ge,{})}),e.jsx(d,{size:{md:6},children:e.jsx(Ae,{})}),e.jsx(d,{size:{md:6},children:e.jsx(v,{})})]})]});export{Ra as default};
