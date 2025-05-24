import{j as t}from"./index-BOycD4kd.js";import{C as s}from"./react-apexcharts.min-C573fTi_.js";import{P as n}from"./PageContainer-97CIqrJb.js";import{B as m}from"./Breadcrumb-BqJ4_UoQ.js";import{P as p}from"./ParentCard-MJIOvsrM.js";import{C as l}from"./CodeDialog-DS_2Fy2U.js";import{u as h}from"./Paper-CrmG5ZWt.js";import"./Grid2-D56AonIH.js";import"./Typography-BDkkff4Z.js";import"./Box-BXQ1zNTo.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";const c=()=>t.jsx(t.Fragment,{children:t.jsx(l,{children:`
import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Props } from 'react-apexcharts';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Line Chart',
  },
];

const LineChart = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const optionslinechart: Props = {
    chart: {
      height: 350,
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      zoom: {
        type: 'x',
        enabled: true,
      },
      toolbar: {
        show: false,
      },
      shadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 1,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      title: {
        text: 'Month',
      },
    },
    grid: {
      show: false,
    },
    colors: [primary, secondary],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'straight',
      width: '2',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    tooltip: {
      theme: 'dark',
    },
  };
  const serieslinechart: any = [
    {
      name: 'High - 2013',
      data: [28, 29, 33, 36, 32, 32, 33],
    },
    {
      name: 'Low - 2013',
      data: [12, 11, 14, 18, 17, 13, 13],
    },
  ];

  return (
    <Chart
        options={optionslinechart}
        series={serieslinechart}
        type="line"
        height="308px"
        width={'90%'}
    />
  );
};

export default LineChart;`})}),d=[{to:"/",title:"Home"},{title:"Line Chart"}],Z=()=>{const e=h(),r=e.palette.primary.main,o=e.palette.secondary.main,i={chart:{height:350,type:"line",fontFamily:"'Plus Jakarta Sans', sans-serif",foreColor:"#adb0bb",zoom:{type:"x",enabled:!0},toolbar:{show:!1},shadow:{enabled:!0,color:"#000",top:18,left:7,blur:10,opacity:1}},xaxis:{categories:["Jan","Feb","Mar","Apr","May","Jun","Jul"],title:{text:"Month"}},grid:{show:!1},colors:[r,o],dataLabels:{enabled:!0},stroke:{curve:"straight",width:"2"},legend:{position:"top",horizontalAlign:"right",floating:!0,offsetY:-25,offsetX:-5},tooltip:{theme:"dark"}},a=[{name:"High - 2013",data:[28,29,33,36,32,32,33]},{name:"Low - 2013",data:[12,11,14,18,17,13,13]}];return t.jsxs(n,{title:"Line Chart",description:"this is innerpage",children:[t.jsx(m,{title:"Line Chart",items:d}),t.jsx(p,{title:"Line Chart",codeModel:t.jsx(c,{}),children:t.jsx(s,{options:i,series:a,type:"line",height:"308px",width:"90%"})})]})};export{Z as default};
