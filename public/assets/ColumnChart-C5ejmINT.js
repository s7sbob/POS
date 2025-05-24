import{j as t}from"./index-BOycD4kd.js";import{C as n}from"./react-apexcharts.min-C573fTi_.js";import{P as p}from"./PageContainer-97CIqrJb.js";import{B as l}from"./Breadcrumb-BqJ4_UoQ.js";import{P as h}from"./ParentCard-MJIOvsrM.js";import{C as c}from"./CodeDialog-DS_2Fy2U.js";import{u as d}from"./Paper-CrmG5ZWt.js";import"./Grid2-D56AonIH.js";import"./Typography-BDkkff4Z.js";import"./Box-BXQ1zNTo.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";const u=()=>t.jsx(t.Fragment,{children:t.jsx(c,{children:`
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
    title: 'Column Chart',
  },
];

const ColumnChart = () => {

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;

  const optionscolumnchart: Props = {
    chart: {
      id: 'column-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: [primary, secondary, error],
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '20%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter(val: any) {
          return '$ {val} thousands';
        },
      },
      theme: 'dark',
    },
    grid: {
      show: false,
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
  };
  const seriescolumnchart: any = [
    {
      name: 'Desktop',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: 'Mobile',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: 'Other',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ];

  return (    
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="bar"
          height="300px"
        />      
  );
};

export default ColumnChart;

`})}),f=[{to:"/",title:"Home"},{title:"Column Chart"}],_=()=>{const r=d(),o=r.palette.primary.main,e=r.palette.secondary.main,a=r.palette.error.main,i={chart:{id:"column-chart",fontFamily:"'Plus Jakarta Sans', sans-serif",foreColor:"#adb0bb",toolbar:{show:!1}},colors:[o,e,a],plotOptions:{bar:{horizontal:!1,endingShape:"rounded",columnWidth:"20%"}},dataLabels:{enabled:!1},stroke:{show:!0,width:2,colors:["transparent"]},xaxis:{categories:["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"]},yaxis:{title:{text:"$ (thousands)"}},fill:{opacity:1},tooltip:{y:{formatter(m){return`$ ${m} thousands`}},theme:"dark"},grid:{show:!1},legend:{show:!0,position:"bottom",width:"50px"}},s=[{name:"Desktop",data:[44,55,57,56,61,58,63,60,66]},{name:"Mobile",data:[76,85,101,98,87,105,91,114,94]},{name:"Other",data:[35,41,36,26,45,48,52,53,41]}];return t.jsxs(p,{title:"Column Chart",description:"this is innerpage",children:[t.jsx(l,{title:"Column Chart",items:f}),t.jsx(h,{title:"Column Chart",codeModel:t.jsx(u,{}),children:t.jsx(n,{options:i,series:s,type:"bar",height:"300px"})})]})};export{_ as default};
