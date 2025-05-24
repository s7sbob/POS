import{j as t,R as b}from"./index-BOycD4kd.js";import{P as w}from"./PageContainer-97CIqrJb.js";import{B as C}from"./Breadcrumb-BqJ4_UoQ.js";import{C as F}from"./CodeDialog-DS_2Fy2U.js";import{C as a}from"./CustomTextField-DGn70w9A.js";import{C as j}from"./CustomCheckbox-DR_2Oekh.js";import{C as s}from"./CustomFormLabel-CTInyefh.js";import{P as B}from"./ParentCard-MJIOvsrM.js";import{B as i}from"./Box-BXQ1zNTo.js";import{S as A,a as L,b as T}from"./Stepper-DsJPnJFD.js";import{S as P}from"./Stack-7R2xgwnv.js";import{A as W}from"./Alert-CkB7u9JX.js";import{B as n}from"./Button-DuWWTJ1w.js";import{T as m}from"./Typography-BDkkff4Z.js";import{F as N}from"./FormControlLabel-D8wW9e5M.js";import"./Paper-CrmG5ZWt.js";import"./Grid2-D56AonIH.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./TextField-B9e79Kv3.js";import"./FormControl-CFGl-PZS.js";import"./utils-DoM3o7-Q.js";import"./useFormControl-Ds-I_R6P.js";import"./formControlState-Dq1zat_P.js";import"./Select-Dz4F7h-J.js";import"./Menu-CFREcaP-.js";import"./Popover-COV8vM5j.js";import"./isHostComponent-DVu5iVWx.js";import"./debounce-Be36O1Ab.js";import"./List-C3Ip_mV3.js";import"./Checkbox-DP-A8Ywf.js";import"./SwitchBase-CVR3uh3U.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./createStack-C9SkPHjo.js";import"./Close-D9PXX_a0.js";const R=()=>t.jsx(t.Fragment,{children:t.jsx(F,{children:`
"use client";
import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';

const steps = ['Account', 'Profile', 'Finish'];

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
        : '0px auto {theme.palette.grey[300]}',
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

const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step:any) => step === 1;

  const isStepSkipped = (step:any) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);

      return newSkipped;
    });
  };

  // eslint-disable-next-line consistent-return
  const handleSteps = (step: any) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <CustomFormLabel htmlFor="Name">Name</CustomFormLabel>
            <CustomTextField id="Name" variant="outlined" fullWidth />
            <CustomFormLabel htmlFor="Email">Email</CustomFormLabel>
            <CustomTextField id="Email" type="email" variant="outlined" fullWidth />
            <CustomFormLabel htmlFor="Password">Password</CustomFormLabel>
            <CustomTextField id="Password" type="password" variant="outlined" fullWidth />
          </Box>
        );
      case 1:
        return (
          <Box>
            <CustomFormLabel htmlFor="Fname">First Name</CustomFormLabel>
            <CustomTextField id="Fname" variant="outlined" fullWidth />
            <CustomFormLabel htmlFor="Lname">Last Name</CustomFormLabel>
            <CustomTextField id="Lname" type="text" variant="outlined" fullWidth />
            <CustomFormLabel htmlFor="Address">Address</CustomFormLabel>
            <CustomTextField id="Address" multiline rows={4} variant="outlined" fullWidth />
          </Box>
        );
      case 2:
        return (
          <Box pt={3}>
            <Typography variant="h5">Terms and condition</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Sard about this site or you have been to it, but you cannot figure out what it is or
              what it can do. MTA web directory isSard about this site or you have been to it, but
              you cannot figure out what it is or what it can do. MTA web directory is
            </Typography>
            <FormControlLabel
              control={<CustomCheckbox defaultChecked />}
              label="Agree with terms?"
            />
          </Box>
        );
      default:
        break;
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };


<Box width="100%">
    <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
                optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            if (isStepSkipped(index)) {
                stepProps.completed = false;
            }

            return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
            );
        })}
    </Stepper>
    {activeStep === steps.length ? (
        <>
            <Stack spacing={2} mt={3}>
                <Alert severity="success">
                  All steps completed - you&apos;re finished
                </Alert>

                <Box textAlign="right">
                  <Button onClick={handleReset} variant="contained" color="error">
                    Reset
                  </Button>
                </Box>
            </Stack>
        </>
    ) : (
        <>
            <Box>{handleSteps(activeStep)}</Box>

            <Box display="flex" flexDirection="row" mt={3}>
                <Button
                  color="inherit"
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box flex="1 1 auto" />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  variant="contained"
                  color={activeStep === steps.length - 1 ? 'success' : 'secondary'}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
        </>
    )}
</Box>
`})}),l=["Account","Profile","Finish"],Dt=()=>{const[o,p]=b.useState(0),[c,h]=b.useState(new Set),d=e=>e===1,u=e=>c.has(e),v=()=>{let e=c;u(o)&&(e=new Set(e.values()),e.delete(o)),p(r=>r+1),h(e)},y=()=>{p(e=>e-1)},k=()=>{if(!d(o))throw new Error("You can't skip a step that isn't optional.");p(e=>e+1),h(e=>{const r=new Set(e.values());return r.add(o),r})},f=e=>{switch(e){case 0:return t.jsxs(i,{children:[t.jsx(s,{htmlFor:"Name",children:"Name"}),t.jsx(a,{id:"Name",variant:"outlined",fullWidth:!0}),t.jsx(s,{htmlFor:"Email",children:"Email"}),t.jsx(a,{id:"Email",type:"email",variant:"outlined",fullWidth:!0}),t.jsx(s,{htmlFor:"Password",children:"Password"}),t.jsx(a,{id:"Password",type:"password",variant:"outlined",fullWidth:!0})]});case 1:return t.jsxs(i,{children:[t.jsx(s,{htmlFor:"Fname",children:"First Name"}),t.jsx(a,{id:"Fname",variant:"outlined",fullWidth:!0}),t.jsx(s,{htmlFor:"Lname",children:"Last Name"}),t.jsx(a,{id:"Lname",type:"text",variant:"outlined",fullWidth:!0}),t.jsx(s,{htmlFor:"Address",children:"Address"}),t.jsx(a,{id:"Address",multiline:!0,rows:4,variant:"outlined",fullWidth:!0})]});case 2:return t.jsxs(i,{pt:3,children:[t.jsx(m,{variant:"h5",children:"Terms and condition"}),t.jsx(m,{variant:"body2",sx:{mt:1},children:"Sard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory isSard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is"}),t.jsx(N,{control:t.jsx(j,{defaultChecked:!0}),label:"Agree with terms?"})]})}},g=()=>{p(0)};return t.jsxs(w,{children:[t.jsx(C,{title:"Form Wizard",subtitle:"this is Form Wizard page"}),t.jsx(B,{title:"Form Wizard",codeModel:t.jsx(R,{}),children:t.jsxs(i,{width:"100%",children:[t.jsx(A,{activeStep:o,children:l.map((e,r)=>{const x={},S={};return d(r)&&(S.optional=t.jsx(m,{variant:"caption",children:"Optional"})),u(r)&&(x.completed=!1),t.jsx(L,{...x,children:t.jsx(T,{...S,children:e})},e)})}),o===l.length?t.jsx(t.Fragment,{children:t.jsxs(P,{spacing:2,mt:3,children:[t.jsx(W,{severity:"success",children:"All steps completed - you're finished"}),t.jsx(i,{textAlign:"right",children:t.jsx(n,{onClick:g,variant:"contained",color:"error",children:"Reset"})})]})}):t.jsxs(t.Fragment,{children:[t.jsx(i,{children:f(o)}),t.jsxs(i,{display:"flex",flexDirection:"row",mt:3,children:[t.jsx(n,{color:"inherit",variant:"contained",disabled:o===0,onClick:y,sx:{mr:1},children:"Back"}),t.jsx(i,{flex:"1 1 auto"}),d(o)&&t.jsx(n,{color:"inherit",onClick:k,sx:{mr:1},children:"Skip"}),t.jsx(n,{onClick:v,variant:"contained",color:o===l.length-1?"success":"secondary",children:o===l.length-1?"Finish":"Next"})]})]})]})})]})};export{Dt as default};
