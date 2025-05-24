import{j as e,R as u}from"./index-BOycD4kd.js";import{P as b}from"./ParentCard-MJIOvsrM.js";import{C as r}from"./ChildCard-1K0LK_Kd.js";import{B as S}from"./Breadcrumb-BqJ4_UoQ.js";import{P as C}from"./PageContainer-97CIqrJb.js";import{I as c,C as y}from"./CustomRangeSlider-C1xdKIAU.js";import{C as p}from"./CustomSlider-CZexdAnv.js";import{C as l}from"./CodeDialog-DS_2Fy2U.js";import{G as t}from"./Grid2-D56AonIH.js";import{B as o}from"./Box-BXQ1zNTo.js";import{T as x}from"./Typography-BDkkff4Z.js";import{I as h}from"./IconVolume-CU3jyseO.js";import{S as a,a as V}from"./Slider-B0nMAWx3.js";import{S as v}from"./Stack-7R2xgwnv.js";import"./Paper-CrmG5ZWt.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./visuallyHidden-Dan1xhjv.js";import"./isHostComponent-DVu5iVWx.js";import"./createStack-C9SkPHjo.js";const R=()=>e.jsx(e.Fragment,{children:e.jsx(l,{children:`
"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Slider } from '@mui/material';

const CustomSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-rail': {
    height: '9px',
    borderRadius: '9px',
    opacity: '1',
    backgroundColor: theme.palette.grey[200],
  },
  '& .MuiSlider-thumb': {
    borderRadius: '50%',
    backgroundColor: () => theme.palette.secondary.main,
    width: '23px',
    height: '23px',
  },
  '& .MuiSlider-track': {
    height: '9px',
    borderRadius: '9px',
  },
}));

<CustomSlider defaultValue={[30]}  />
`})}),k=()=>e.jsx(e.Fragment,{children:e.jsx(l,{children:`
"use client";
import React from "react";
import { Slider } from '@mui/material';
import { IconVolume, IconVolume2 } from '@tabler/icons-react';
import { Stack } from "@mui/system";
import { styled } from '@mui/material/styles';


const CustomSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-rail': {
    height: '9px',
    borderRadius: '9px',
    opacity: '1',
    backgroundColor: theme.palette.grey[200],
  },
  '& .MuiSlider-thumb': {
    borderRadius: '50%',
    backgroundColor: () => theme.palette.secondary.main,
    width: '23px',
    height: '23px',
  },
  '& .MuiSlider-track': {
    height: '9px',
    borderRadius: '9px',
  },
}));

const [value, setValue] = React.useState(30);
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);

 <Stack direction="row" spacing={1}>
    <IconVolume2 width={20} />
    <Slider aria-label="Volume" value={value} onChange={handleChange} />
    <IconVolume width={20} />
  </Stack>
`})}),w=()=>e.jsx(e.Fragment,{children:e.jsx(l,{children:`
"use client";

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { SliderValueLabelProps } from '@mui/material/Slider';
import {SliderThumb} from '@mui/material/Slider';

const CustomSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-rail': {
    height: '9px',
    borderRadius: '9px',
    opacity: '1',
    backgroundColor: theme.palette.grey[200],
  },
  '& .MuiSlider-thumb': {
    borderRadius: '50%',
    backgroundColor: () => theme.palette.secondary.main,
    width: '23px',
    height: '23px',
  },
  '& .MuiSlider-track': {
    height: '9px',
    borderRadius: '9px',
  },
}));

function AirbnbThumbComponent(props: SliderValueLabelProps) {
  const { children, ...other } = props;

  return (
    <SliderThumb {...other}>
      {children}
      <Box
        sx={{
          height: 9,
          width: '2px',
          backgroundColor: '#fff',
        }}
      />
      <Box
        sx={{
          height: '14px',
          width: '2px',
          backgroundColor: '#fff',
          ml: '2px',
        }}
      />
      <Box
        sx={{
          height: 9,
          width: '2px',
          backgroundColor: '#fff',
          ml: '2px',
        }}
      />
    </SliderThumb>
  );
}

<CustomRangeSlider
    slots={{ thumb: AirbnbThumbComponent }}
    getAriaLabel={(index: any) => (index === 0 ? 'Minimum price' : 'Maximum price')}
    defaultValue={[20, 40]}
/>
`})}),M=()=>e.jsx(e.Fragment,{children:e.jsx(l,{children:`
"use client";
import * as React from 'react';
import { Slider } from '@mui/material';

<Slider defaultValue={30}  />
`})}),I=()=>e.jsx(e.Fragment,{children:e.jsx(l,{children:`
"use client";
import * as React from 'react';
import { Slider } from '@mui/material';

<Slider disabled defaultValue={30}  />
`})}),T=()=>e.jsx(e.Fragment,{children:e.jsx(l,{children:`
"use client";

import { Slider } from '@mui/material';

const valuetext = (value: any) => {value}°C;

<Slider
    aria-label="Temperature"
    defaultValue={30}
    getAriaValueText={valuetext}
    valueLabelDisplay="auto"
    step={10}
    marks
    min={10}
    max={110}
/>
`})}),D=()=>e.jsx(e.Fragment,{children:e.jsx(l,{children:`
"use client";
import React from 'react';
import { Slider } from '@mui/material';

  function valuetext2(value: any) {
  return {value}°C;
}

  const [value2, setValue2] = React.useState([20, 37]);
  const handleChange2 = (event2: any, newValue2: any) => {
    setValue2(newValue2);
  };

<Slider
    getAriaLabel={() => 'Temperature range'}
    value={value2}
    onChange={handleChange2}
    valueLabelDisplay="auto"
    getAriaValueText={valuetext2}
/>
`})}),A=[{to:"/",title:"Home"},{title:"Slider"}],B=i=>`${i}°C`;function L(i){return`${i}°C`}function z(i){const{children:s,...m}=i;return e.jsxs(V,{...m,children:[s,e.jsx(o,{sx:{height:9,width:"2px",backgroundColor:"#fff"}}),e.jsx(o,{sx:{height:"14px",width:"2px",backgroundColor:"#fff",ml:"2px"}}),e.jsx(o,{sx:{height:9,width:"2px",backgroundColor:"#fff",ml:"2px"}})]})}const we=()=>{const[i,s]=u.useState(30),m=(d,n)=>{s(n)},[g,f]=u.useState([20,37]),j=(d,n)=>{f(n)};return e.jsxs(C,{title:"Slider",description:"this is Slider page",children:[e.jsx(S,{title:"Slider",items:A}),e.jsx(b,{title:"Slider",children:e.jsxs(t,{container:!0,spacing:3,children:[e.jsx(t,{display:"flex",alignItems:"stretch",size:{xs:12,lg:4,sm:6},children:e.jsx(r,{title:"Custom",codeModel:e.jsx(R,{}),children:e.jsx(p,{defaultValue:[30]})})}),e.jsx(t,{display:"flex",alignItems:"stretch",size:{xs:12,lg:4,sm:6},children:e.jsxs(r,{title:"Volume",codeModel:e.jsx(k,{}),children:[e.jsx(p,{defaultValue:30,"aria-label":"volume slider"}),e.jsxs(o,{display:"flex",alignItems:"center",children:[e.jsx(x,{children:e.jsx(c,{width:20})}),e.jsx(o,{ml:"auto",children:e.jsx(x,{children:e.jsx(h,{width:20})})})]})]})}),e.jsx(t,{display:"flex",alignItems:"stretch",size:{xs:12,lg:4,sm:6},children:e.jsx(r,{title:"Range",codeModel:e.jsx(w,{}),children:e.jsx(y,{slots:{thumb:z},getAriaLabel:d=>d===0?"Minimum price":"Maximum price",defaultValue:[20,40]})})}),e.jsx(t,{display:"flex",alignItems:"stretch",size:{xs:12,lg:4,sm:6},children:e.jsx(r,{title:"Default",codeModel:e.jsx(M,{}),children:e.jsx(a,{defaultValue:30})})}),e.jsx(t,{display:"flex",alignItems:"stretch",size:{xs:12,lg:4,sm:6},children:e.jsx(r,{title:"Disabled",codeModel:e.jsx(I,{}),children:e.jsx(a,{disabled:!0,defaultValue:30})})}),e.jsx(t,{display:"flex",alignItems:"stretch",size:{xs:12,lg:4,sm:6},children:e.jsx(r,{title:"Volume",children:e.jsxs(v,{direction:"row",spacing:1,children:[e.jsx(c,{width:20}),e.jsx(a,{"aria-label":"Volume",value:i,onChange:m}),e.jsx(h,{width:20})]})})}),e.jsx(t,{display:"flex",alignItems:"stretch",size:{xs:12,lg:4,sm:6},children:e.jsx(r,{title:"Discrete",codeModel:e.jsx(T,{}),children:e.jsx(a,{"aria-label":"Temperature",defaultValue:30,getAriaValueText:B,valueLabelDisplay:"auto",step:10,marks:!0,min:10,max:110})})}),e.jsx(t,{display:"flex",alignItems:"stretch",size:{xs:12,lg:4,sm:6},children:e.jsx(r,{title:"Range Default",codeModel:e.jsx(D,{}),children:e.jsx(a,{getAriaLabel:()=>"Temperature range",value:g,onChange:j,valueLabelDisplay:"auto",getAriaValueText:L})})})]})})]})};export{we as default};
