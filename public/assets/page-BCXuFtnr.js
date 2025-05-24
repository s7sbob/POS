import{j as e,R as E}from"./index-BOycD4kd.js";import{B as F}from"./Breadcrumb-BqJ4_UoQ.js";import{P as X}from"./PageContainer-97CIqrJb.js";import{P as y}from"./ParentCard-MJIOvsrM.js";import{C as f}from"./CodeDialog-DS_2Fy2U.js";import{u as C}from"./Paper-CrmG5ZWt.js";import{L as b,M as I,m as g}from"./LineChart-uexAtP8q.js";import{L as T,l as Y,d as P}from"./LineHighlightPlot-B_SWFsSN.js";import{n as w,y as S,o as H}from"./ChartsAxisHighlight-BywgfQr8.js";import{g as W,c as N,s as z,j as m,e as k}from"./Typography-BDkkff4Z.js";import{C as B}from"./ChartsText-LRNeksS5.js";import{b as v}from"./useChartContainerDimensions-B82M2TBf.js";import{c as U,d as G}from"./ChartsOverlay-D4Ozm1ER.js";import{a as _}from"./useChartId-BWKwJWVT.js";import{G as q}from"./Grid2-D56AonIH.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Box-BXQ1zNTo.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./path-DyVhHtw_.js";import"./useSkipAnimation-BxWud2x0.js";import"./useThemeProps-VRAKZLnh.js";import"./ChartsOnAxisClickHandler-CFtvsx7s.js";import"./ChartsGrid-CUWat_-J.js";function K(){return e.jsx(f,{children:`
            
'use client'

import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from "@mui/material";

   const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'SimpleLineChart ',
  },
]; 
function SimpleLineChart() {
  
    const monthlyProfits = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const monthlyRevenue = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = ["January", "February", "March", "April", "May", "June", "July"];


    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    return (
       

            <LineChart
                
                height={300}
                  series={[
                    { data: monthlyRevenue, label: 'Revenue', color: primary },
                    { data: monthlyProfits, label: 'Profits', color: secondary },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
            />
       
    )
}

export default SimpleLineChart
`})}function O(){const t=[4e3,3e3,2e3,2780,1890,2390,3490],r=[2400,1398,9800,3908,4800,3800,4300],a=["January","February","March","April","May","June","July"],i=C(),n=i.palette.primary.main,s=i.palette.secondary.main;return e.jsx(y,{title:"Simple Chart",codeModel:e.jsx(K,{}),children:e.jsx(b,{height:300,series:[{data:r,label:"Revenue",color:n},{data:t,label:"Profits",color:s}],xAxis:[{scaleType:"point",data:a}]})})}function Q(){return e.jsx(f,{children:`
'use client';
;
import { useTheme } from '@mui/material';
import { ChartContainer, LinePlot, MarkPlot } from '@mui/x-charts';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'TinyLineChart' },
];

function TinyLineChart() {
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = [
        'Page A',
        'Page B',
        'Page C',
        'Page D',
        'Page E',
        'Page F',
        'Page G',
    ];

    const theme = useTheme();
    const primary = theme.palette.primary.main;

    return (
        <ChartContainer
                width={800}
                height={300}
                series={[{ type: 'line', data: pData, color: primary }]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                disableAxisListener
            >
                <LinePlot />
                <MarkPlot />
            </ChartContainer>
    );
}

export default TinyLineChart;
`})}function V(){const t=[2400,1398,9800,3908,4800,3800,4300],r=["Page A","Page B","Page C","Page D","Page E","Page F","Page G"],i=C().palette.primary.main;return e.jsx(y,{title:"Tiny Chart",codeModel:e.jsx(Q,{}),children:e.jsxs(w,{width:800,height:300,series:[{type:"line",data:t,color:i}],xAxis:[{scaleType:"point",data:r}],disableAxisListener:!0,children:[e.jsx(T,{}),e.jsx(I,{})]})})}function J(t){return N("MuiChartsReferenceLine",t)}const M=W("MuiChartsReferenceLine",["root","vertical","horizontal","line","label"]),D=z("g")(({theme:t})=>({[`& .${M.line}`]:{fill:"none",stroke:(t.vars||t).palette.text.primary,shapeRendering:"crispEdges",strokeWidth:1,pointerEvents:"none"},[`& .${M.label}`]:m({fill:(t.vars||t).palette.text.primary,stroke:"none",pointerEvents:"none",fontSize:12},t.typography.body1)})),Z=({top:t,height:r,spacingY:a,labelAlign:i="middle"})=>{switch(i){case"start":return{y:t+a,style:{dominantBaseline:"hanging",textAnchor:"start"}};case"end":return{y:t+r-a,style:{dominantBaseline:"auto",textAnchor:"start"}};default:return{y:t+r/2,style:{dominantBaseline:"central",textAnchor:"start"}}}};function ee(t){return k({root:["root","vertical"],line:["line"],label:["label"]},J,t)}function te(t){const{x:r,label:a="",spacing:i=5,classes:n,labelAlign:s,lineStyle:c,labelStyle:u,axisId:h}=t,{top:d,height:p}=v(),o=S(h)(r);if(o===void 0)return null;const x=`M ${o} ${d} l 0 ${p}`,l=ee(n),j=typeof i=="object"?i.x??0:i,R=typeof i=="object"?i.y??0:i,L=m({x:o+j,text:a,fontSize:12},Z({top:d,height:p,spacingY:R,labelAlign:s}),{className:l.label});return e.jsxs(D,{className:l.root,children:[e.jsx("path",{d:x,className:l.line,style:c}),e.jsx(B,m({},L,{style:m({},L.style,u)}))]})}const ie=({left:t,width:r,spacingX:a,labelAlign:i="middle"})=>{switch(i){case"start":return{x:t+a,style:{dominantBaseline:"auto",textAnchor:"start"}};case"end":return{x:t+r-a,style:{dominantBaseline:"auto",textAnchor:"end"}};default:return{x:t+r/2,style:{dominantBaseline:"auto",textAnchor:"middle"}}}};function re(t){return k({root:["root","horizontal"],line:["line"],label:["label"]},J,t)}function ae(t){const{y:r,label:a="",spacing:i=5,classes:n,labelAlign:s,lineStyle:c,labelStyle:u,axisId:h}=t,{left:d,width:p}=v(),o=H(h)(r);if(o===void 0)return null;const x=`M ${d} ${o} l ${p} 0`,l=re(n),j=typeof i=="object"?i.x??0:i,R=typeof i=="object"?i.y??0:i,L=m({y:o-R,text:a,fontSize:12},ie({left:d,width:p,spacingX:j,labelAlign:s}),{className:l.label});return e.jsxs(D,{className:l.root,children:[e.jsx("path",{d:x,className:l.line,style:c}),e.jsx(B,m({},L,{style:m({},L.style,u)}))]})}function $(t){const{x:r,y:a}=t;if(r!==void 0&&a!==void 0)throw new Error("MUI X: The ChartsReferenceLine cannot have both `x` and `y` props set.");if(r===void 0&&a===void 0)throw new Error("MUI X: The ChartsReferenceLine should have a value in `x` or `y` prop.");return r!==void 0?e.jsx(te,m({},t)):e.jsx(ae,m({},t))}function ne(){return e.jsx(f,{children:`
    
'use client'
import * as React from 'react';
import {
    LineChart,
    lineElementClasses,
    markElementClasses,
} from '@mui/x-charts/LineChart';
import { useTheme } from "@mui/material";

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'DashedLineChart ',
},
]; export default function DashedLineChart() {
   
    const monthlyProfits = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const monthlyRevenue = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = ["January", "February", "March", "April", "May", "June", "July"];

    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    return (
            <LineChart
                
                height={300}
               series={[
                    { data: monthlyRevenue, label: "Revenue", id: "pvId", color: primary },
                    { data: monthlyProfits, label: "Profits", id: "uvId", color: secondary },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
               sx={\`
                \${\`& .\${lineElementClasses.root}, .\${markElementClasses.root}\`}: {
                    strokeWidth: 1,
                },
                \`.MuiLineElement-series-pvId\`: {
                    strokeDasharray: '5 5',
                },
                \`.MuiLineElement-series-uvId\`: {
                    strokeDasharray: '3 4 5 2',
                },
                \${\`& .\${markElementClasses.root}:not(.${g.highlighted})\`}: {
                    fill: '#fff',
                },
                \${\`& .\${markElementClasses.highlighted}\`}: {
                    stroke: 'none',
                },
            \`}
            />
      );
}
  `})}function se(){const t=[4e3,3e3,2e3,2780,1890,2390,3490],r=[2400,1398,9800,3908,4800,3800,4300],a=["January","February","March","April","May","June","July"],i=C(),n=i.palette.primary.main,s=i.palette.secondary.main;return e.jsx(y,{title:"Dashed Chart",codeModel:e.jsx(ne,{}),children:e.jsx(b,{height:300,series:[{data:r,label:"Revenue",id:"pvId",color:n},{data:t,label:"Profits",id:"uvId",color:s}],xAxis:[{scaleType:"point",data:a}],sx:{[`.${Y.root}, .${g.root}`]:{strokeWidth:1},".MuiLineElement-series-pvId":{strokeDasharray:"5 5"},".MuiLineElement-series-uvId":{strokeDasharray:"3 4 5 2"},[`.${g.root}:not(.${g.highlighted})`]:{fill:"#fff"},[`& .${g.highlighted}`]:{stroke:"none"}}})})}function oe(){return e.jsx(f,{children:`
  
"use client";
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from "@mui/material";

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'BiaxialLineChart ',
},
]; 
export default function BiaxialLineChart() {
    
    const monthlyProfits = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const monthlyRevenue = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = ["January", "February", "March", "April", "May", "June", "July"];


    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    return (
            <LineChart
                
                height={300}
               series={[
                    { data: monthlyRevenue, label: "Revenue", yAxisId: "leftAxisId", color: primary },
                    {
                        data: monthlyProfits,
                        label: "Profits",
                        yAxisId: "rightAxisId",
                        color: secondary,
                    },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
                rightAxis="rightAxisId"
            />
    );
}
`})}function le(){const t=[4e3,3e3,2e3,2780,1890,2390,3490],r=[2400,1398,9800,3908,4800,3800,4300],a=["January","February","March","April","May","June","July"],i=C(),n=i.palette.primary.main,s=i.palette.secondary.main;return e.jsx(y,{title:"Biaxial Chart",codeModel:e.jsx(oe,{}),children:e.jsx(b,{height:300,series:[{data:r,label:"Revenue",yAxisId:"leftAxisId",color:n},{data:t,label:"Profits",yAxisId:"rightAxisId",color:s}],xAxis:[{scaleType:"point",data:a}],yAxis:[{id:"leftAxisId"},{id:"rightAxisId"}],rightAxis:"rightAxisId"})})}function ce(){return e.jsx(f,{children:`
    
"use client";
import * as React from "react";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { LinePlot, MarkPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { useTheme } from "@mui/material";

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'LineChartWithReferenceLines ',
},
]; 
export default function LineChartWithReferenceLines() {
  const monthlyProfits = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const monthlyRevenue = [2400, 1398, 9800, 3908, 4800, 3800, 4300];

    const xLabels = ["January", "February", "March", "April", "May", "June", "July"];


  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const Linecolor = theme.palette.warning.main;

  return (
   
      <ChartContainer
        width={800}
        height={300}
        series={[
                    { data: monthlyRevenue, label: "Revenue", type: "line", color: primary },
                    { data: monthlyProfits, label: "Profits", type: "line", color: secondary },
                ]}
        xAxis={[{ scaleType: "point", data: xLabels }]}
      >
        <LinePlot />
        <MarkPlot />
        <ChartsReferenceLine
         x="March"
         label="Max Profits"
          lineStyle={{ stroke: Linecolor }}
        />
        <ChartsReferenceLine
          y={9800}
          label="Max"
          lineStyle={{ stroke: Linecolor }}
        />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
 
  );
}


`})}function me(){const t=[4e3,3e3,2e3,2780,1890,2390,3490],r=[2400,1398,9800,3908,4800,3800,4300],a=["January","February","March","April","May","June","July"],i=C(),n=i.palette.primary.main,s=i.palette.secondary.main,c=i.palette.warning.main;return e.jsx(y,{title:"ReferenceLine Chart",codeModel:e.jsx(ce,{}),children:e.jsxs(w,{width:800,height:300,series:[{data:r,label:"Revenue",type:"line",color:n},{data:t,label:"Profits",type:"line",color:s}],xAxis:[{scaleType:"point",data:a}],children:[e.jsx(T,{}),e.jsx(I,{}),e.jsx($,{x:"March",label:"Max Profits",lineStyle:{stroke:c}}),e.jsx($,{y:9800,label:"Max",lineStyle:{stroke:c}}),e.jsx(U,{}),e.jsx(G,{})]})})}function he(){return e.jsx(f,{children:`
'use client'
import * as React from 'react';
import { LineChart, AnimatedLine, AnimatedLineProps } from '@mui/x-charts/LineChart';
import { useChartId, useDrawingArea, useXScale } from '@mui/x-charts/hooks';

import ParentCard from 'src/components/shared/ParentCard';
import { useTheme } from "@mui/material";
import LinewithforecastCode from '../../code/linechartscode/LinewithforecastCode';
import { SxProps, Theme } from '@mui/system';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'LinewithforecastChart ',
  },
]; 

interface CustomAnimatedLineProps extends AnimatedLineProps {
    limit?: number;
    sxBefore?: SxProps<Theme>;
    sxAfter?: SxProps<Theme>;
}

function CustomAnimatedLine(props) {
  const { limit, sxBefore, sxAfter, ...other } = props;
  const { top, bottom, height, left, width } = useDrawingArea();
  const scale = useXScale();
  const chartId = useChartId();

  if (limit === undefined) {
    return <AnimatedLine {...other} />;
  }

  const limitPosition = scale(limit); // Convert value to x coordinate.

  if (limitPosition === undefined) {
    return <AnimatedLine {...other} />;
  }

  const clipIdLeft = \`\${chartId}-\${props.ownerState.id}-line-limit-\${limit}-1\`;
  const clipIdRight = \`\${chartId}-\${props.ownerState.id}-line-limit-\${limit}-2\`;

  return (
    <React.Fragment>
      {/* Clip to show the line before the limit */}
      <clipPath id={clipIdLeft}>
        <rect
          x={left}
          y={0}
          width={limitPosition - left}
          height={top + height + bottom}
        />
      </clipPath>
      {/* Clip to show the line after the limit */}
      <clipPath id={clipIdRight}>
        <rect
          x={limitPosition}
          y={0}
          width={left + width - limitPosition}
          height={top + height + bottom}
        />
      </clipPath>
      <g clipPath={\`url(#\${clipIdLeft})\`}>
        <AnimatedLine {...other} sx={sxBefore} />
      </g>
      <g clipPath={\`url(#\${clipIdRight})\`}>
        <AnimatedLine {...other} sx={sxAfter} />
      </g>
    </React.Fragment>
  );
}

export default function LinewithforecastChart() {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <LineChart
      series={[
        {
          type: 'line',
          data: [1, 2, 3, 4, 1, 2, 3, 4, 5],
          valueFormatter: (v, i) => \`\${v}\${i.dataIndex > 5 ? ' (estimated)' : ''}\`,
          color: primary,
        },
      ]}
      xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6, 7, 8] }]}
      height={200}
      width={400}
      slots={{ line: CustomAnimatedLine }}
      slotProps={{ line: { limit: 5, sxAfter: { strokeDasharray: '10 5' } } as any }}
    />
  );
}
`})}function de(t){const{limit:r,sxBefore:a,sxAfter:i,...n}=t,{top:s,bottom:c,height:u,left:h,width:d}=v(),p=S(),A=_();if(r===void 0)return e.jsx(P,{...n});const o=p(r);if(o===void 0)return e.jsx(P,{...n});const x=`${A}-${t.ownerState.id}-line-limit-${r}-1`,l=`${A}-${t.ownerState.id}-line-limit-${r}-2`;return e.jsxs(E.Fragment,{children:[e.jsx("clipPath",{id:x,children:e.jsx("rect",{x:h,y:0,width:o-h,height:s+u+c})}),e.jsx("clipPath",{id:l,children:e.jsx("rect",{x:o,y:0,width:h+d-o,height:s+u+c})}),e.jsx("g",{clipPath:`url(#${x})`,children:e.jsx(P,{...n,style:a})}),e.jsx("g",{clipPath:`url(#${l})`,children:e.jsx(P,{...n,style:i})})]})}function pe(){const r=C().palette.primary.main;return e.jsx(y,{title:"Forecast Chart",codeModel:e.jsx(he,{}),children:e.jsx(b,{series:[{type:"line",data:[1,2,3,4,1,2,3,4,5],valueFormatter:(a,i)=>`${a}${i.dataIndex>5?" (estimated)":""}`,color:r}],xAxis:[{data:[0,1,2,3,4,5,6,7,8]}],height:200,slots:{line:de},slotProps:{line:{limit:5,sxAfter:{strokeDasharray:"10 5"}}}})})}const ue=[{to:"/",title:"Home"},{title:"Mui Line Charts"}],ct=()=>e.jsxs(X,{title:"Mui Line Chart",description:"this is Mui Line Chart",children:[e.jsx(F,{title:"Mui Line  Chart",items:ue}),e.jsxs(q,{container:!0,spacing:3,children:[e.jsx(O,{}),e.jsx(V,{}),e.jsx(se,{}),e.jsx(le,{}),e.jsx(me,{}),e.jsx(pe,{})]})]});export{ct as default};
