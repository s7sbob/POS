import{j as e,R as s}from"./index-BOycD4kd.js";import{B as A}from"./Breadcrumb-BqJ4_UoQ.js";import{P as E}from"./PageContainer-97CIqrJb.js";import{C as p}from"./CustomTextField-DGn70w9A.js";import{C as h}from"./CustomSelect-KGhokBm9.js";import{C as W}from"./CustomSlider-CZexdAnv.js";import{C as O,I as N}from"./CustomRangeSlider-C1xdKIAU.js";import{C as m}from"./CustomSwitch-C42mJ39Z.js";import{s as v,T as f}from"./Typography-BDkkff4Z.js";import{B as d}from"./Button-DuWWTJ1w.js";import{C as i}from"./CustomFormLabel-CTInyefh.js";import{C as x}from"./CustomCheckbox-DR_2Oekh.js";import{C as g}from"./CustomRadio-CnmelxqE.js";import{P as H}from"./ParentCard-MJIOvsrM.js";import{C as $}from"./CodeDialog-DS_2Fy2U.js";import{G as t}from"./Grid2-D56AonIH.js";import{M as a}from"./MenuItem-BgV0zoqh.js";import{L as y,E as j}from"./AdapterDayjs-CDFA7hYo.js";import{T as q,D as J}from"./DateTimePicker-VgihX-tC.js";import{R as k}from"./RadioGroup-BM3OKm4y.js";import{F as b}from"./FormControl-CFGl-PZS.js";import{F as l}from"./FormControlLabel-D8wW9e5M.js";import{B as n}from"./Box-BXQ1zNTo.js";import{I as K}from"./IconVolume-CU3jyseO.js";import{S as C}from"./Stack-7R2xgwnv.js";import{a as Q}from"./Slider-B0nMAWx3.js";import"./index-BwqtTtay.js";import"./Paper-CrmG5ZWt.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./TextField-B9e79Kv3.js";import"./useSlot-C8hSq5RO.js";import"./useId-B1jnamIH.js";import"./formControlState-Dq1zat_P.js";import"./useFormControl-Ds-I_R6P.js";import"./Select-Dz4F7h-J.js";import"./Menu-CFREcaP-.js";import"./Popover-COV8vM5j.js";import"./isHostComponent-DVu5iVWx.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./Portal-Dipjj-39.js";import"./debounce-Be36O1Ab.js";import"./Grow-DaxZ4x-g.js";import"./List-C3Ip_mV3.js";import"./utils-DoM3o7-Q.js";import"./useControlled-CGXnS8Tc.js";import"./Switch-C2fRenyJ.js";import"./SwitchBase-CVR3uh3U.js";import"./Checkbox-DP-A8Ywf.js";import"./Radio-CPXSUe59.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./Popper-CDUIbv4Q.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./listItemTextClasses-DqG0UCcK.js";import"./useThemeProps-VRAKZLnh.js";import"./InputAdornment-BxJq-rlG.js";import"./index-C-nkt2MJ.js";import"./DialogActions-CRJF81Ug.js";import"./ListItem-Hz3oRS8u.js";import"./listItemButtonClasses-Bk0utCM3.js";import"./Chip-BwUwR4nt.js";import"./dayjs.min-DShFzOxq.js";import"./Tabs-DbOBCdG5.js";import"./KeyboardArrowRight-ShSsL8sn.js";import"./FormGroup-BvSGhWlG.js";import"./createStack-C9SkPHjo.js";import"./visuallyHidden-Dan1xhjv.js";const U=v(d)(({theme:r})=>({backgroundColor:r.palette.grey[100]})),X=v(d)(({theme:r})=>({border:`1px solid ${r.palette.grey[100]}`,color:r.palette.text.primary,"&:hover":{border:r.palette.mode==="dark"?`1px solid ${r.palette.grey[200]}`:`1px solid ${r.palette.grey[300]}`,backgroundColor:r.palette.grey[100],color:r.palette.text.secondary}})),Y=()=>e.jsx(e.Fragment,{children:e.jsx($,{children:`

import * as React from 'react';
import {
  Grid2 as Grid,
  Box,
  Typography,
  FormControl,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Button,
  SliderValueLabelProps,
} from '@mui/material';
import { SliderThumb } from '@mui/material/Slider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { Select } from '@mui/material';
import { Slider } from '@mui/material';
import { Switch } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import Radio, { RadioProps } from '@mui/material/Radio';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Divider, Box } from '@mui/material';
import { useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';
import { IconVolume, IconVolume2 } from '@tabler/icons-react';
import { Stack } from '@mui/material';

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

const CustomSelect = styled((props: any) => <Select {...props} />)(({}) => ({}));

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

const CustomRangeSlider = styled(Slider)(({ theme }) => ({
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
  },
}));

const CustomSwitch = styled((props: any) => <Switch {...props} />)(({ theme }) => ({
  '&.MuiSwitch-root': {
    width: '68px',
    height: '49px',
  },
  '&  .MuiButtonBase-root': {
    top: '6px',
    left: '6px',
  },
  '&  .MuiButtonBase-root.Mui-checked .MuiSwitch-thumb': {
    backgroundColor: 'primary.main',
  },
  '& .MuiSwitch-thumb': {
    width: '18px',
    height: '18px',
    borderRadius: '6px',
  },

  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.grey[200],
    opacity: 1,
    borderRadius: '5px',
  },
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      '& + .MuiSwitch-track': {
        backgroundColor: 'primary',
        opacity: 0.18,
      },
    },
  },
}));

const CustomDisabledButton =  styled((Button))(({ theme })  => ({
  backgroundColor: theme.palette.grey[100]
}));

const CustomOutlinedButton = styled(Button)(({ theme }) => ({
  border: '1px solid {theme.palette.grey[100]}',
  color: theme.palette.text.primary,

  '&:hover': {
    border: theme.palette.mode === 'dark' ? '1px solid {theme.palette.grey[200]}' : '1px solid {theme.palette.grey[300]}' ,
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.secondary,
  },
}));

const CustomFormLabel = styled((props: any) => (
  <Typography
    variant="subtitle1"
    fontWeight={600}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '25px',
  display: 'block',
}));

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 19,
  height: 19,
  marginLeft: '4px',
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
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary : theme.palette.primary,
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.grey[100],
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  boxShadow: 'none',
  width: 19,
  height: 19,
  '&:before': {
    display: 'block',
    width: 19,
    height: 19,
    backgroundImage:
      "url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E")",
    content: '""',
  },
});


function CustomCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      disableRipple
      color={props.color ? props.color : 'default'}
      checkedIcon={
        <BpCheckedIcon
          sx={{
            backgroundColor: props.color ? '{props.color}.mai' : 'primary.main',
          }}
        />
      }
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}

const BpIcon2 = styled('span')(({ theme }) => ({
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

const BpCheckedIcon2 = styled(BpIcon2)(({ theme }) => ({
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
        <BpCheckedIcon2
          sx={{
            backgroundColor: props.color ? '{props.color}.main' : 'primary.main',
          }}
        />
      }
      icon={<BpIcon2 />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}

function CustomThumbComponent(props: SliderValueLabelProps) {
  const { children, ...other } = props;

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
  const [age, setAge] = React.useState('1');
  const [select1, setSelect] = React.useState('1');
  const [select2, setSelect2] = React.useState('1');

  const handleChange = (event: any) => {
    setAge(event.target.value);
  };
  const handleChange4 = (event2: any) => {
    setSelect(event2.target.value);
  };

  const handleChange5 = (event3: any) => {
    setSelect2(event3.target.value);
  };

 
  const [value, setValue] = React.useState(null);
  const [value2, setValue2] = React.useState(null);

  const [value3, setValue3] = React.useState(30);
  const handleChange6 = (event: any, newValue: any) => {
    setValue3(newValue);
  };

  return (
  <Grid container spacing={3}>
  <Grid
    size={{
      xs: 12,
      sm: 12,
      lg: 4
    }}>
    <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
    <CustomTextField id="name" placeholder="Enter text" variant="outlined" fullWidth />
    <CustomFormLabel htmlFor="demo-simple-select">Select Dropdown</CustomFormLabel>
    <CustomSelect
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={age}
      onChange={handleChange}
      fullWidth
    >
      <MenuItem value={1}>One</MenuItem>
      <MenuItem value={2}>Two</MenuItem>
      <MenuItem value={3}>Three</MenuItem>
    </CustomSelect>
  </Grid>

  {/* ----------------------------------- */}
  {/* column 2 */}
  {/* ----------------------------------- */}
  <Grid
    size={{
      xs: 12,
      sm: 12,
      lg: 4
    }}>
    <CustomFormLabel htmlFor="cname">Company Name</CustomFormLabel>
    <CustomTextField id="cname" placeholder="Enter text" variant="outlined" fullWidth />
    <CustomFormLabel htmlFor="time">Time</CustomFormLabel>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        value={value2}
        onChange={(newValue) => setValue2(newValue)}
        slotProps={{
          textField: {
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
  </Grid>

  {/* ----------------------------------- */}
  {/* column 3 */}
  {/* ----------------------------------- */}
  <Grid
    size={{
      xs: 12,
      sm: 12,
      lg: 4
    }}>
    <CustomFormLabel htmlFor="disabled">Industry Type</CustomFormLabel>
    <CustomTextField
      id="disabled"
      placeholder="Disabled filled"
      variant="outlined"
      fullWidth
      disabled
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.12) !important'
              : '#dee3e9 !important',
        },
      }}
    />
    <CustomFormLabel htmlFor="date">Date</CustomFormLabel>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        slotProps={{
          textField: {
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
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </LocalizationProvider>
  </Grid>

  {/* ----------------------------------- */}
  {/* column 4 */}
  {/* ----------------------------------- */}
  <Grid
    size={{
      xs: 12,
      sm: 12,
      lg: 12
    }}>
    <CustomFormLabel>Lorem ipsum dolor sit amet</CustomFormLabel>
    <RadioGroup aria-label="gender" defaultValue="radio1" name="radio-buttons-group">
      <Grid container>
        <Grid
          size={{
            xs: 12,
            sm: 4,
            lg: 4
          }}>
          <FormControl component="fieldset">
            <FormControlLabel value="radio1" control={<CustomRadio />} label="Male" />
          </FormControl>
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4,
            lg: 4
          }}>
          <FormControl component="fieldset">
            <FormControlLabel value="radio2" control={<CustomRadio />} label="Female" />
          </FormControl>
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4,
            lg: 4
          }}>
          <FormControl component="fieldset">
            <FormControlLabel value="radio3" control={<CustomRadio disabled />} label="Disabled" />
          </FormControl>
        </Grid>
      </Grid>
    </RadioGroup>
  </Grid>

  {/* ----------------------------------- */}
  {/* column 5 */}
  {/* ----------------------------------- */}
  <Grid
    size={{
      xs: 12,
      sm: 12,
      lg: 12
    }}>
    <CustomFormLabel>Industry Type</CustomFormLabel>
    <RadioGroup aria-label="gender" defaultValue="radio1" name="radio-buttons-group">
      <Grid container>
        <Grid
          size={{
            xs: 12,
            sm: 4,
            lg: 4
          }}>
          <FormControlLabel control={<CustomCheckbox defaultChecked />} label="Enter text" />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4,
            lg: 4
          }}>
          <FormControlLabel control={<CustomCheckbox />} label="Enter text" />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4,
            lg: 4
          }}>
          <FormControlLabel disabled control={<CustomCheckbox disabled />} label="Disabled" />
        </Grid>
      </Grid>
    </RadioGroup>
  </Grid>

  {/* ----------------------------------- */}
  {/* column 6 */}
  {/* ----------------------------------- */}
  <Grid
    size={{
      xs: 12,
      sm: 12,
      lg: 4
    }}>
    <CustomFormLabel>Slider</CustomFormLabel>
    <CustomRangeSlider
      slots={{ thumb: CustomThumbComponent }}
      getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
      defaultValue={[20, 40]}
    />
    <Grid container spacing={2} mt={1}>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 6
        }}>
        <CustomSelect id="range1" value={select1} onChange={handleChange4} fullWidth>
          <MenuItem value={1}>750</MenuItem>
          <MenuItem value={2}>850</MenuItem>
          <MenuItem value={3}>950</MenuItem>
        </CustomSelect>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 6
        }}>
        <CustomSelect id="rang2" value={select2} onChange={handleChange5} fullWidth>
          <MenuItem value={1}>950</MenuItem>
          <MenuItem value={2}>1050</MenuItem>
          <MenuItem value={3}>1150</MenuItem>
        </CustomSelect>
      </Grid>
    </Grid>
    <CustomFormLabel sx={{ mt: 3 }}>Volume</CustomFormLabel>
    <CustomSlider aria-label="Volume" value={value3} onChange={handleChange6} />
    <Box display="flex" alignItems="stretch">
      <Typography>
        <IconVolume2 width={20} />
      </Typography>
      <Box ml="auto">
        <Typography>
          <IconVolume width={20} />
        </Typography>
      </Box>
    </Box>
  </Grid>

  {/* ----------------------------------- */}
  {/* column 7 */}
  {/* ----------------------------------- */}
  <Grid
    size={{
      xs: 12,
      sm: 12,
      lg: 12
    }}>
    <CustomFormLabel>Switch</CustomFormLabel>
    <Grid container spacing={0}>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3
        }}>
        <FormControlLabel control={<CustomSwitch />} label="Enter text" />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3
        }}>
        <FormControlLabel control={<CustomSwitch defaultChecked />} label="Enter text" />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3
        }}>
        <FormControlLabel
          control={
            <CustomSwitch
              disabled
              sx={{
                '& .MuiSwitch-switchBase.Mui-disabled+.MuiSwitch-track': {
                  opacity: 1,
                },
              }}
            />
          }
          label="Disabled"
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3
        }}>
        <FormControlLabel
          control={
            <CustomSwitch
              defaultChecked
              disabled
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
                  opacity: 0.5,
                },
              }}
            />
          }
          label="Disabled"
        />
      </Grid>
    </Grid>

    {/* button */}
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" mt={2}>
      <Stack spacing={1} direction="row">
        <Button variant="contained" color="primary">Add New</Button>
        <CustomDisabledButton variant="contained" disabled>Add New</CustomDisabledButton>
        <CustomOutlinedButton variant="outlined">Add New</CustomOutlinedButton>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="secondary">Add New</Button>
        <Button variant="contained" color="success">Add New</Button>
      </Stack>
    </Stack>
  </Grid>
</Grid>
  );
`})});function Z(r){const{children:u,...c}=r;return e.jsxs(Q,{...c,children:[u,e.jsx(n,{sx:{height:9,width:"2px",backgroundColor:"#fff"}}),e.jsx(n,{sx:{height:"14px",width:"2px",backgroundColor:"#fff",ml:"2px"}}),e.jsx(n,{sx:{height:9,width:"2px",backgroundColor:"#fff",ml:"2px"}})]})}const Mt=()=>{const[r,u]=s.useState("1"),[c,S]=s.useState("1"),[w,F]=s.useState("1"),M=o=>{u(o.target.value)},I=o=>{S(o.target.value)},G=o=>{F(o.target.value)},[B,L]=s.useState(null),[T,z]=s.useState(null),[R,V]=s.useState(30),D=(o,P)=>{V(P)};return e.jsxs(E,{title:"Custom Form",description:"this is Custom Form page",children:[e.jsx(A,{title:"Custom Form",subtitle:"custom designed element"}),e.jsx(H,{title:"Custom Form",codeModel:e.jsx(Y,{}),children:e.jsxs(t,{container:!0,spacing:3,children:[e.jsxs(t,{size:{xs:12,sm:12,lg:4},children:[e.jsx(i,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",placeholder:"Enter text",variant:"outlined",fullWidth:!0}),e.jsx(i,{htmlFor:"demo-simple-select",children:"Select Dropdown"}),e.jsxs(h,{labelId:"demo-simple-select-label",id:"demo-simple-select",value:r,onChange:M,fullWidth:!0,children:[e.jsx(a,{value:1,children:"One"}),e.jsx(a,{value:2,children:"Two"}),e.jsx(a,{value:3,children:"Three"})]})]}),e.jsxs(t,{size:{xs:12,sm:12,lg:4},children:[e.jsx(i,{htmlFor:"cname",children:"Company Name"}),e.jsx(p,{id:"cname",placeholder:"Enter text",variant:"outlined",fullWidth:!0}),e.jsx(i,{htmlFor:"time",children:"Time"}),e.jsx(y,{dateAdapter:j,children:e.jsx(q,{value:T,onChange:o=>{z(o)},slotProps:{textField:{fullWidth:!0,sx:{"& .MuiSvgIcon-root":{width:"18px",height:"18px"},"& .MuiFormHelperText-root":{display:"none"}}}}})})]}),e.jsxs(t,{size:{xs:12,sm:12,lg:4},children:[e.jsx(i,{htmlFor:"disabled",children:"Industry Type"}),e.jsx(p,{id:"disabled",placeholder:"Disabled filled",variant:"outlined",fullWidth:!0,disabled:!0,sx:{"& .MuiOutlinedInput-notchedOutline":{borderColor:o=>`${o.palette.mode==="dark"?"rgba(255, 255, 255, 0.12) !important":"#dee3e9 !important"}`}}}),e.jsx(i,{htmlFor:"date",children:"Date"}),e.jsx(y,{dateAdapter:j,children:e.jsx(J,{slotProps:{textField:{fullWidth:!0,sx:{"& .MuiSvgIcon-root":{width:"18px",height:"18px"},"& .MuiFormHelperText-root":{display:"none"}}}},value:B,onChange:o=>{L(o)}})})]}),e.jsxs(t,{size:{xs:12,sm:12,lg:12},children:[e.jsx(i,{children:"Lorem ipsum dolor sit amet"}),e.jsx(k,{"aria-label":"gender",defaultValue:"radio1",name:"radio-buttons-group",children:e.jsxs(t,{container:!0,children:[e.jsx(t,{size:{xs:12,sm:4,lg:4},children:e.jsx(b,{component:"fieldset",children:e.jsx(l,{value:"radio1",control:e.jsx(g,{}),label:"Male"})})}),e.jsx(t,{size:{xs:12,sm:4,lg:4},children:e.jsx(b,{component:"fieldset",children:e.jsx(l,{value:"radio2",control:e.jsx(g,{}),label:"Female"})})}),e.jsx(t,{size:{xs:12,sm:4,lg:4},children:e.jsx(b,{component:"fieldset",children:e.jsx(l,{value:"radio3",control:e.jsx(g,{disabled:!0}),label:"Disabled"})})})]})})]}),e.jsxs(t,{size:{xs:12,sm:12,lg:12},children:[e.jsx(i,{children:"Industry Type"}),e.jsx(k,{"aria-label":"gender",defaultValue:"radio1",name:"radio-buttons-group",children:e.jsxs(t,{container:!0,children:[e.jsx(t,{size:{xs:12,sm:4,lg:4},children:e.jsx(l,{control:e.jsx(x,{defaultChecked:!0}),label:"Enter text"})}),e.jsx(t,{size:{xs:12,sm:4,lg:4},children:e.jsx(l,{control:e.jsx(x,{}),label:"Enter text"})}),e.jsx(t,{size:{xs:12,sm:4,lg:4},children:e.jsx(l,{disabled:!0,control:e.jsx(x,{disabled:!0}),label:"Disabled"})})]})})]}),e.jsxs(t,{size:{xs:12,sm:12,lg:4},children:[e.jsx(i,{children:"Slider"}),e.jsx(O,{slots:{thumb:Z},getAriaLabel:o=>o===0?"Minimum price":"Maximum price",defaultValue:[20,40]}),e.jsxs(t,{container:!0,spacing:2,mt:1,children:[e.jsx(t,{size:{xs:12,sm:6,lg:6},children:e.jsxs(h,{id:"range1",value:c,onChange:I,fullWidth:!0,children:[e.jsx(a,{value:1,children:"750"}),e.jsx(a,{value:2,children:"850"}),e.jsx(a,{value:3,children:"950"})]})}),e.jsx(t,{size:{xs:12,sm:6,lg:6},children:e.jsxs(h,{id:"rang2",value:w,onChange:G,fullWidth:!0,children:[e.jsx(a,{value:1,children:"950"}),e.jsx(a,{value:2,children:"1050"}),e.jsx(a,{value:3,children:"1150"})]})})]}),e.jsx(i,{sx:{mt:3},children:"Volume"}),e.jsx(W,{"aria-label":"Volume",value:R,onChange:D}),e.jsxs(n,{display:"flex",alignItems:"stretch",children:[e.jsx(f,{children:e.jsx(N,{width:20})}),e.jsx(n,{ml:"auto",children:e.jsx(f,{children:e.jsx(K,{width:20})})})]})]}),e.jsxs(t,{size:{xs:12,sm:12,lg:12},children:[e.jsx(i,{children:"Switch"}),e.jsxs(t,{container:!0,spacing:0,children:[e.jsx(t,{size:{xs:12,sm:6,lg:3},children:e.jsx(l,{control:e.jsx(m,{}),label:"Enter text"})}),e.jsx(t,{size:{xs:12,sm:6,lg:3},children:e.jsx(l,{control:e.jsx(m,{defaultChecked:!0}),label:"Enter text"})}),e.jsx(t,{size:{xs:12,sm:6,lg:3},children:e.jsx(l,{control:e.jsx(m,{disabled:!0,sx:{"& .MuiSwitch-switchBase.Mui-disabled+.MuiSwitch-track":{opacity:1}}}),label:"Disabled"})}),e.jsx(t,{size:{xs:12,sm:6,lg:3},children:e.jsx(l,{control:e.jsx(m,{defaultChecked:!0,disabled:!0,sx:{"& .MuiSwitch-switchBase.Mui-checked.Mui-disabled":{opacity:.5}}}),label:"Disabled"})})]}),e.jsxs(C,{direction:{xs:"column",sm:"row"},spacing:2,justifyContent:"space-between",mt:2,children:[e.jsxs(C,{spacing:1,direction:"row",children:[e.jsx(d,{variant:"contained",color:"primary",children:"Add New"}),e.jsx(U,{variant:"contained",disabled:!0,children:"Add New"}),e.jsx(X,{variant:"outlined",children:"Add New"})]}),e.jsxs(C,{direction:"row",spacing:1,children:[e.jsx(d,{variant:"contained",color:"secondary",children:"Add New"}),e.jsx(d,{variant:"contained",color:"success",children:"Add New"})]})]})]})]})})]})};export{Mt as default};
