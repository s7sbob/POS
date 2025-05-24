import{j as t}from"./index-BOycD4kd.js";import{C as p}from"./react-apexcharts.min-C573fTi_.js";import{P as g}from"./PageContainer-97CIqrJb.js";import{B as f}from"./Breadcrumb-BqJ4_UoQ.js";import{P as m}from"./ParentCard-MJIOvsrM.js";import{C as l}from"./CodeDialog-DS_2Fy2U.js";import{u as y}from"./Paper-CrmG5ZWt.js";import{G as e}from"./Grid2-D56AonIH.js";import"./Typography-BDkkff4Z.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Box-BXQ1zNTo.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";const x=()=>t.jsx(t.Fragment,{children:t.jsx(l,{children:`
import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import  Grid  from '@mui/material/Grid2';
import { Props } from 'react-apexcharts';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Doughtnut Chart',
  },
];

const DoughnutChart = () => {

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const warning = theme.palette.warning.main;

  // 1
  const optionsdoughnutchart: Props = {
    chart: {
      id: 'donut-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70px',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
    colors: [primary, primarylight, secondary, secondarylight, warning],
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };
  const seriesdoughnutchart = [45, 15, 27, 18, 35];

    return (
        <Chart
            options={optionsdoughnutchart}
            series={seriesdoughnutchart}
            type="donut"
            height="300px"
        />
    );
};

export default DoughnutChart;
`})}),C=()=>t.jsx(t.Fragment,{children:t.jsx(l,{children:`
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import  Grid  from '@mui/material/Grid2';
import { Props } from 'react-apexcharts';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Doughtnut Chart',
  },
];

const DoughnutChart = () => {

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const warning = theme.palette.warning.main;

  // 2
  const optionspiechart: Props = {
    chart: {
      id: 'pie-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70px',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
    colors: [primary, primarylight, secondary, secondarylight, warning],
    tooltip: {
      fillSeriesColor: false,
    },
  };
  const seriespiechart = [45, 15, 27, 18, 35];

  return (
    <Chart options={optionspiechart} series={seriespiechart} type="pie" height="300px" />
  );
};

export default DoughnutChart;
`})}),b=[{to:"/",title:"Home"},{title:"Doughtnut Chart"}],it=()=>{const r=y(),o=r.palette.primary.main,i=r.palette.primary.light,a=r.palette.secondary.main,s=r.palette.secondary.light,n=r.palette.warning.main,h={chart:{id:"donut-chart",fontFamily:"'Plus Jakarta Sans', sans-serif",foreColor:"#adb0bb"},dataLabels:{enabled:!1},plotOptions:{pie:{donut:{size:"70px"}}},legend:{show:!0,position:"bottom",width:"50px"},colors:[o,i,a,s,n],tooltip:{theme:"dark",fillSeriesColor:!1}},c=[45,15,27,18,35],d={chart:{id:"pie-chart",fontFamily:"'Plus Jakarta Sans', sans-serif",foreColor:"#adb0bb",toolbar:{show:!1}},dataLabels:{enabled:!1},plotOptions:{pie:{donut:{size:"70px"}}},legend:{show:!0,position:"bottom",width:"50px"},colors:[o,i,a,s,n],tooltip:{fillSeriesColor:!1}},u=[45,15,27,18,35];return t.jsxs(g,{title:"Doughnut & Pie Chart",description:"this is innerpage",children:[t.jsx(f,{title:"Doughtnut Chart",items:b}),t.jsxs(e,{container:!0,spacing:3,children:[t.jsx(e,{size:{lg:6,md:12,xs:12},children:t.jsx(m,{title:"Doughnut Charts",codeModel:t.jsx(x,{}),children:t.jsx(p,{options:h,series:c,type:"donut",height:"300px"})})}),t.jsx(e,{size:{lg:6,md:12,xs:12},children:t.jsx(m,{title:"Pie Charts",codeModel:t.jsx(C,{}),children:t.jsx(p,{options:d,series:u,type:"pie",height:"300px"})})})]})]})};export{it as default};
