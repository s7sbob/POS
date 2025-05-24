import{j as t}from"./index-BOycD4kd.js";import{C as i}from"./react-apexcharts.min-C573fTi_.js";import{P as a}from"./PageContainer-97CIqrJb.js";import{B as s}from"./Breadcrumb-BqJ4_UoQ.js";import{P as m}from"./ParentCard-MJIOvsrM.js";import{C as p}from"./CodeDialog-DS_2Fy2U.js";import{u as n}from"./Paper-CrmG5ZWt.js";import"./Grid2-D56AonIH.js";import"./Typography-BDkkff4Z.js";import"./Box-BXQ1zNTo.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";const h=()=>t.jsx(t.Fragment,{children:t.jsx(p,{children:`
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
    title: 'Gradient Chart',
  },
];

const GredientChart = () => {

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  
  const optionsgredientchart: Props = {
    chart: {
      height: 350,
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.2)',
        top: 12,
        left: 4,
        blur: 3,
        opacity: 0.4,
      },
    },
    stroke: {
      width: 7,
      curve: 'smooth',
    },

    xaxis: {
      type: 'datetime',
      categories: [
        '1/11/2000',
        '2/11/2000',
        '3/11/2000',
        '4/11/2000',
        '5/11/2000',
        '6/11/2000',
        '7/11/2000',
        '8/11/2000',
        '9/11/2000',
        '10/11/2000',
        '11/11/2000',
        '12/11/2000',
        '1/11/2001',
        '2/11/2001',
        '3/11/2001',
        '4/11/2001',
        '5/11/2001',
        '6/11/2001',
      ],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [primary],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 4,
      opacity: 0.9,
      colors: [primary],
      strokeColor: '#fff',
      strokeWidth: 2,

      hover: {
        size: 7,
      },
    },
    yaxis: {
      min: 0,
      max: 40,
    },
    tooltip: {
      theme: 'dark',
    },
    grid: {
      show: false,
    },
  };
  const seriesgredientchart: any = [
    {
      name: 'Likes',
      data: [4, 3, 10, 9, 35, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5],
    },
  ];

    return (
        <Chart
            options={optionsgredientchart}
            series={seriesgredientchart}
            type="line"
            height="300px"
        />
    );
};

export default GredientChart;`})}),d=[{to:"/",title:"Home"},{title:"Gradient Chart"}],Y=()=>{const r=n().palette.primary.main,e={chart:{height:350,type:"line",fontFamily:"'Plus Jakarta Sans', sans-serif",foreColor:"#adb0bb",toolbar:{show:!1},dropShadow:{enabled:!0,color:"rgba(0,0,0,0.2)",top:12,left:4,blur:3,opacity:.4}},stroke:{width:7,curve:"smooth"},xaxis:{type:"datetime",categories:["1/11/2000","2/11/2000","3/11/2000","4/11/2000","5/11/2000","6/11/2000","7/11/2000","8/11/2000","9/11/2000","10/11/2000","11/11/2000","12/11/2000","1/11/2001","2/11/2001","3/11/2001","4/11/2001","5/11/2001","6/11/2001"]},fill:{type:"gradient",gradient:{shade:"dark",gradientToColors:[r],shadeIntensity:1,type:"horizontal",opacityFrom:1,opacityTo:.9,stops:[0,100,100,100]}},markers:{size:4,opacity:.9,colors:[r],strokeColor:"#fff",strokeWidth:2,hover:{size:7}},yaxis:{min:0,max:40},tooltip:{theme:"dark"},grid:{show:!1}},o=[{name:"Likes",data:[4,3,10,9,35,19,22,9,12,7,19,5,13,9,17,2,7,5]}];return t.jsxs(a,{title:"Gredient Chart",description:"this is innerpage",children:[t.jsx(s,{title:"Gradient Chart",items:d}),t.jsx(m,{title:"Gradient Chart",codeModel:t.jsx(h,{}),children:t.jsx(i,{options:e,series:o,type:"line",height:"300px"})})]})};export{Y as default};
