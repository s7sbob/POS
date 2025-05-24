import{j as e,R as r}from"./index-BOycD4kd.js";import{d as h}from"./dayjs.min-DShFzOxq.js";import{P as y}from"./ParentCard-MJIOvsrM.js";import{C as o}from"./ChildCard-1K0LK_Kd.js";import{B as j}from"./Breadcrumb-BqJ4_UoQ.js";import{P as f}from"./PageContainer-97CIqrJb.js";import{C as m}from"./CodeDialog-DS_2Fy2U.js";import{G as i}from"./Grid2-D56AonIH.js";import{L as a,E as l}from"./AdapterDayjs-CDFA7hYo.js";import{M as T,D as k,T as D,r as s}from"./DateTimePicker-VgihX-tC.js";import"./Paper-CrmG5ZWt.js";import"./Typography-BDkkff4Z.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Box-BXQ1zNTo.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./useThemeProps-VRAKZLnh.js";import"./InputAdornment-BxJq-rlG.js";import"./useFormControl-Ds-I_R6P.js";import"./FormControl-CFGl-PZS.js";import"./utils-DoM3o7-Q.js";import"./TextField-B9e79Kv3.js";import"./formControlState-Dq1zat_P.js";import"./Select-Dz4F7h-J.js";import"./Menu-CFREcaP-.js";import"./Popover-COV8vM5j.js";import"./isHostComponent-DVu5iVWx.js";import"./debounce-Be36O1Ab.js";import"./List-C3Ip_mV3.js";import"./index-C-nkt2MJ.js";import"./Button-DuWWTJ1w.js";import"./DialogActions-CRJF81Ug.js";import"./ListItem-Hz3oRS8u.js";import"./listItemButtonClasses-Bk0utCM3.js";import"./Chip-BwUwR4nt.js";import"./Tabs-DbOBCdG5.js";import"./KeyboardArrowRight-ShSsL8sn.js";import"./MenuItem-BgV0zoqh.js";import"./listItemTextClasses-DqG0UCcK.js";const P=()=>e.jsx(e.Fragment,{children:e.jsx(m,{children:`
"use client";
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const CustomTextField = styled((props: any) => <TextField {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));

const [value3, setValue3] = React.useState<Dayjs | null>(
    dayjs("2018-01-01T00:00:00.000Z")
  );

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <MobileDateTimePicker
    onChange={(newValue) => {
      setValue3(newValue)
    }}
    slotProps={{
      textField: {
        fullWidth: true,
        variant: 'outlined',
        size: 'small',
        inputProps: { 'aria-label': 'basic date picker' },
      },
    }}
    value={value3}
  />
</LocalizationProvider>
`})}),g=()=>e.jsx(e.Fragment,{children:e.jsx(m,{children:`
"use client";
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const CustomTextField = styled((props: any) => <TextField {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));

const [value, setValue] = React.useState<Dayjs | null>(null);

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DateTimePicker
    slotProps={{
      textField: {
        fullWidth: true,
        size: 'small',
        sx: {
          "& .MuiSvgIcon-root": {
            width: "18px",
            height: "18px",
          },
          "& .MuiFormHelperText-root": {
            display: "none",
          },
        },
      },
    }}
    value={value}
    onChange={(newValue) => {
      setValue(newValue);
    }}
  />
</LocalizationProvider>
`})}),v=()=>e.jsx(e.Fragment,{children:e.jsx(m,{children:`
"use client";
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const CustomTextField = styled((props: any) => <TextField {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));

const [value2, setValue2] = React.useState<Dayjs | null>(null);

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <TimePicker
    value={value2}
    onChange={(newValue) => {
      setValue2(newValue)
    }}
    viewRenderers={{
      hours: renderTimeViewClock,
      minutes: renderTimeViewClock,
      seconds: renderTimeViewClock,
    }}
    slotProps={{
      textField: {
        size: 'small',
        fullWidth: true,
        sx: {
          '& .MuiSvgIcon-root': {
            width: '18px',
            height: '18px',
          },
          '& .MuiFormHelperText-root': {
            display: 'none',
          },
        },
      },
    }}
  />
</LocalizationProvider>
`})}),M=[{to:"/",title:"Home"},{title:"Date Time"}],Re=()=>{const[p,d]=r.useState(null),[n,u]=r.useState(null),[c,x]=r.useState(h("2018-01-01T00:00:00.000Z"));return e.jsxs(f,{title:"Date Time",description:"this is Date Time page",children:[e.jsx(j,{title:"Date Picker",items:M}),e.jsx(y,{title:"Date Time",children:e.jsxs(i,{container:!0,spacing:3,children:[e.jsx(i,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Basic",codeModel:e.jsx(P,{}),children:e.jsx(a,{dateAdapter:l,children:e.jsx(T,{onChange:t=>{x(t)},slotProps:{textField:{fullWidth:!0,variant:"outlined",size:"small",inputProps:{"aria-label":"basic date picker"}}},value:c})})})}),e.jsx(i,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Different Design",codeModel:e.jsx(g,{}),children:e.jsx(a,{dateAdapter:l,children:e.jsx(k,{slotProps:{textField:{fullWidth:!0,size:"small",sx:{"& .MuiSvgIcon-root":{width:"18px",height:"18px"},"& .MuiFormHelperText-root":{display:"none"}}}},value:p,onChange:t=>{d(t)}})})})}),e.jsx(i,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Timepicker",codeModel:e.jsx(v,{}),children:e.jsx(a,{dateAdapter:l,children:e.jsx(D,{value:n,onChange:t=>{u(t)},viewRenderers:{hours:s,minutes:s,seconds:s},slotProps:{textField:{size:"small",fullWidth:!0,sx:{"& .MuiSvgIcon-root":{width:"18px",height:"18px"},"& .MuiFormHelperText-root":{display:"none"}}}}})})})})]})})]})};export{Re as default};
