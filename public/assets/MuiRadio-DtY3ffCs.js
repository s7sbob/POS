import{j as e,R as h}from"./index-BOycD4kd.js";import{P as u}from"./ParentCard-MJIOvsrM.js";import{C as s}from"./ChildCard-1K0LK_Kd.js";import{B as x}from"./Breadcrumb-BqJ4_UoQ.js";import{P as b}from"./PageContainer-97CIqrJb.js";import{C as a}from"./CustomRadio-CnmelxqE.js";import{B as d}from"./Box-BXQ1zNTo.js";import{F as n}from"./FormControlLabel-D8wW9e5M.js";import{R as l}from"./Radio-CPXSUe59.js";import{R as g}from"./RadioGroup-BM3OKm4y.js";import{C as p}from"./CodeDialog-DS_2Fy2U.js";import{G as c}from"./Grid2-D56AonIH.js";import"./Paper-CrmG5ZWt.js";import"./Typography-BDkkff4Z.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./formControlState-Dq1zat_P.js";import"./useSlot-C8hSq5RO.js";import"./useFormControl-Ds-I_R6P.js";import"./SwitchBase-CVR3uh3U.js";import"./useControlled-CGXnS8Tc.js";import"./createChainedFunction-BO_9K8Jh.js";import"./useId-B1jnamIH.js";import"./FormGroup-BvSGhWlG.js";import"./Tooltip-DKFlwfZ_.js";import"./Popper-CDUIbv4Q.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";const k=()=>e.jsxs(d,{textAlign:"center",children:[e.jsx(n,{value:"end",control:e.jsx(a,{color:"primary",checked:!0}),label:"Primary",labelPlacement:"end"}),e.jsx(n,{value:"end",control:e.jsx(a,{color:"secondary",checked:!0}),label:"Secondary",labelPlacement:"end"}),e.jsx(n,{value:"end",control:e.jsx(a,{color:"success",checked:!0}),label:"Success",labelPlacement:"end"}),e.jsx(n,{value:"end",control:e.jsx(a,{color:"error",checked:!0}),label:"Danger",labelPlacement:"end"}),e.jsx(n,{value:"end",control:e.jsx(a,{color:"warning",checked:!0}),label:"Warning",labelPlacement:"end"})]}),C=()=>{const[t,i]=h.useState(!0),r=o=>{i(o.target.checked)};return e.jsxs(d,{textAlign:"center",children:[e.jsx(l,{checked:t,onChange:r,inputProps:{"aria-label":"primary checkbox"}}),e.jsx(l,{disabled:!0,inputProps:{"aria-label":"disabled checked checkbox"}}),e.jsx(l,{color:"default",inputProps:{"aria-label":"checkbox with default color"}})]})},R=()=>{const[t,i]=h.useState(!0),r=o=>{i(o.target.checked)};return e.jsxs(d,{textAlign:"center",children:[e.jsx(l,{checked:t,onChange:r,color:"primary",inputProps:{"aria-label":"primary checkbox"}}),e.jsx(l,{checked:t,onChange:r,color:"secondary",inputProps:{"aria-label":"primary checkbox"}}),e.jsx(l,{checked:t,onChange:r,inputProps:{"aria-label":"primary checkbox"},sx:{color:o=>o.palette.success.main,"&.Mui-checked":{color:o=>o.palette.success.main}}}),e.jsx(l,{checked:t,onChange:r,inputProps:{"aria-label":"primary checkbox"},sx:{color:o=>o.palette.error.main,"&.Mui-checked":{color:o=>o.palette.error.main}}}),e.jsx(l,{checked:t,onChange:r,inputProps:{"aria-label":"primary checkbox"},sx:{color:o=>o.palette.warning.main,"&.Mui-checked":{color:o=>o.palette.warning.main}}})]})},f=()=>{const[t,i]=h.useState("a"),r=m=>{i(m.target.value)},o=m=>({checked:t===m,onChange:r,value:m,name:"size-radio-button-demo",inputProps:{"aria-label":m}});return e.jsxs(d,{textAlign:"center",children:[e.jsx(l,{...o("a"),size:"small"}),e.jsx(l,{...o("b")}),e.jsx(l,{...o("c"),sx:{"& .MuiSvgIcon-root":{fontSize:28}}})]})},j=()=>{const[t,i]=h.useState(!0),r=o=>{i(o.target.checked)};return e.jsxs(d,{textAlign:"center",children:[e.jsx(a,{checked:t,onChange:r,inputProps:{"aria-label":"primary checkbox"}}),e.jsx(a,{disabled:!0,inputProps:{"aria-label":"disabled checked checkbox"}}),e.jsx(a,{checked:!t,inputProps:{"aria-label":"checkbox with default color"}})]})},y=()=>e.jsx(d,{textAlign:"center",children:e.jsxs(g,{row:!0,"aria-label":"position",name:"position",defaultValue:"top",children:[e.jsx(n,{value:"top",control:e.jsx(a,{}),label:"Top",labelPlacement:"top"}),e.jsx(n,{value:"start",control:e.jsx(a,{}),label:"Start",labelPlacement:"start"}),e.jsx(n,{value:"bottom",control:e.jsx(a,{}),label:"Bottom",labelPlacement:"bottom"}),e.jsx(n,{value:"end",control:e.jsx(a,{}),label:"End"})]})}),P=()=>e.jsx(e.Fragment,{children:e.jsx(p,{children:`
"use client";
import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Radio, { RadioProps } from '@mui/material/Radio';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 21,
  height: 21,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px {theme.palette.grey[200]}'
      : 'inset 0 0 0 1px {theme.palette.grey[300]}',
  backgroundColor: 'transparent',
  '.Mui-focusVisible &': {
    outline:
      theme.palette.mode === 'dark'
        ? '0px auto {theme.palette.grey[200]}'
        : '0px auto  {theme.palette.grey[300]}',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.primary,
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.grey[100],
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  boxShadow: 'none',
  '&:before': {
    display: 'block',
    width: 21,
    height: 21,
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'radial-gradient({theme.palette.background.paper},{theme.palette.background.paper} 28%,transparent 32%)'
        : 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
}));

function CustomRadio(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={
        <BpCheckedIcon
          sx={{
            backgroundColor: props.color ? '{props.color}.main' : 'primary.main',
          }}
        />
      }
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}

const [checked, setChecked] = React.useState(true);

const handleChange = (event: any) => {
    setChecked(event.target.checked);
};

<Box textAlign="center">
    <CustomRadio
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
    />
    <CustomRadio disabled inputProps={{ 'aria-label': 'disabled checked checkbox' }} />
    <CustomRadio
        checked={!checked}
        inputProps={{ 'aria-label': 'checkbox with default color' }}
    />
</Box>`})}),B=()=>e.jsx(e.Fragment,{children:e.jsx(p,{children:`
"use client";

import { Box, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import Radio, { RadioProps } from '@mui/material/Radio';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 21,
  height: 21,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px {theme.palette.grey[200]}'
      : 'inset 0 0 0 1px {theme.palette.grey[300]}',
  backgroundColor: 'transparent',
  '.Mui-focusVisible &': {
    outline:
      theme.palette.mode === 'dark'
        ? '0px auto {theme.palette.grey[200]}'
        : '0px auto  {theme.palette.grey[300]}',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.primary,
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.grey[100],
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  boxShadow: 'none',
  '&:before': {
    display: 'block',
    width: 21,
    height: 21,
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'radial-gradient({theme.palette.background.paper},{theme.palette.background.paper} 28%,transparent 32%)'
        : 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
}));

function CustomRadio(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={
        <BpCheckedIcon
          sx={{
            backgroundColor: props.color ? '{props.color}.main' : 'primary.main',
          }}
        />
      }
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}


<Box textAlign="center">
    <FormControlLabel
        value="end"
        control={<CustomRadio color="primary" checked />}
        label="Primary"
        labelPlacement="end"
    />
    <FormControlLabel
        value="end"
        control={<CustomRadio color="secondary" checked />}
        label="Secondary"
        labelPlacement="end"
    />
    <FormControlLabel
        value="end"
        control={<CustomRadio color="success" checked />}
        label="Success"
        labelPlacement="end"
    />
    <FormControlLabel
        value="end"
        control={<CustomRadio color="error" checked />}
        label="Danger"
        labelPlacement="end"
    />
    <FormControlLabel
        value="end"
        control={<CustomRadio color="warning" checked />}
        label="Warning"
        labelPlacement="end"
    />
</Box>`})}),v=()=>e.jsx(e.Fragment,{children:e.jsx(p,{children:`
"use client";
import React from 'react';
import { Box, Radio } from '@mui/material';

const [checked, setChecked] = React.useState(true);

const handleChange = (event: any) => {
    setChecked(event.target.checked);
};

<Box textAlign="center">
    <Radio
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
    />
    <Radio disabled inputProps={{ 'aria-label': 'disabled checked checkbox' }} />
    <Radio color="default" inputProps={{ 'aria-label': 'checkbox with default color' }} />
</Box>`})}),S=()=>e.jsx(e.Fragment,{children:e.jsx(p,{children:`
"use client";

import React from 'react';
import { Box, Radio } from '@mui/material';

const [checked, setChecked] = React.useState(true);

const handleChange = (event: any) => {
    setChecked(event.target.checked);
};

<Box textAlign="center">
    <Radio
        checked={checked}
        onChange={handleChange}
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
    />
    <Radio
        checked={checked}
        onChange={handleChange}
        color="secondary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
    />
    <Radio
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        sx={{
            color: (theme) => theme.palette.success.main,
            '&.Mui-checked': {
                color: (theme) => theme.palette.success.main,
            },
        }}
    />
    <Radio
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        sx={{
            color: (theme) => theme.palette.error.main,
            '&.Mui-checked': {
                color: (theme) => theme.palette.error.main,
            },
        }}
    />
    <Radio
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        sx={{
            color: (theme) => theme.palette.warning.main,
            '&.Mui-checked': {
                color: (theme) => theme.palette.warning.main,
            },
        }}
    />
</Box>`})}),I=()=>e.jsx(e.Fragment,{children:e.jsx(p,{children:`
"use client";
import React from 'react';
import { Box, Radio } from '@mui/material';

const [selectedValue, setSelectedValue] = React.useState('a');
const handleChange2 = (event: any) => {
    setSelectedValue(event.target.value);
};
    
const controlProps = (item: any) => ({
    checked: selectedValue === item,
    onChange: handleChange2,
    value: item,
    name: 'size-radio-button-demo',
    inputProps: { 'aria-label': item },
});

<Box textAlign="center">
    <Radio {...controlProps('a')} size="small" />
    <Radio {...controlProps('b')} />
    <Radio
        {...controlProps('c')}
        sx={{
            '& .MuiSvgIcon-root': {
                fontSize: 28,
            },
        }}
    />
</Box>`})}),w=()=>e.jsx(e.Fragment,{children:e.jsx(p,{children:`
"use client";

import { Box, RadioGroup, FormControlLabel  } from '@mui/material';
import { styled } from '@mui/material/styles';
import Radio, { RadioProps } from '@mui/material/Radio';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 21,
  height: 21,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px {theme.palette.grey[200]}'
      : 'inset 0 0 0 1px {theme.palette.grey[300]}',
  backgroundColor: 'transparent',
  '.Mui-focusVisible &': {
    outline:
      theme.palette.mode === 'dark'
        ? '0px auto {theme.palette.grey[200]}'
        : '0px auto  {theme.palette.grey[300]}',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.primary,
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.grey[100],
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  boxShadow: 'none',
  '&:before': {
    display: 'block',
    width: 21,
    height: 21,
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'radial-gradient({theme.palette.background.paper},{theme.palette.background.paper} 28%,transparent 32%)'
        : 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
}));

function CustomRadio(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={
        <BpCheckedIcon
          sx={{
            backgroundColor: props.color ? '{props.color}.main' : 'primary.main',
          }}
        />
      }
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}

<Box textAlign="center">
    <RadioGroup row aria-label="position" name="position" defaultValue="top">
        <FormControlLabel value="top" control={<CustomRadio />} label="Top" labelPlacement="top" />
        <FormControlLabel
            value="start"
            control={<CustomRadio />}
            label="Start"
            labelPlacement="start"
        />
        <FormControlLabel
            value="bottom"
            control={<CustomRadio />}
            label="Bottom"
            labelPlacement="bottom"
        />
        <FormControlLabel value="end" control={<CustomRadio />} label="End" />
    </RadioGroup>
</Box>
`})}),F=[{to:"/",title:"Home"},{title:"Radio"}],je=()=>e.jsxs(b,{title:"Radio",description:"this is Radio page",children:[e.jsx(x,{title:"Radio",items:F}),e.jsx(u,{title:"Radio",children:e.jsxs(c,{container:!0,spacing:3,children:[e.jsx(c,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(s,{title:"Custom",codeModel:e.jsx(P,{}),children:e.jsx(j,{})})}),e.jsx(c,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(s,{title:"Color with Label",codeModel:e.jsx(B,{}),children:e.jsx(k,{})})}),e.jsx(c,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(s,{title:"Default",codeModel:e.jsx(v,{}),children:e.jsx(C,{})})}),e.jsx(c,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(s,{title:"Default Colors",codeModel:e.jsx(S,{}),children:e.jsx(R,{})})}),e.jsx(c,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(s,{title:"Sizes",codeModel:e.jsx(I,{}),children:e.jsx(f,{})})}),e.jsx(c,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(s,{title:"Position",codeModel:e.jsx(w,{}),children:e.jsx(y,{})})})]})})]});export{je as default};
