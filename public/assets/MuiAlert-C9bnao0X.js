import{j as t,R as d}from"./index-BOycD4kd.js";import{B as h}from"./Breadcrumb-BqJ4_UoQ.js";import{P as m}from"./PageContainer-97CIqrJb.js";import{P as p}from"./ParentCard-MJIOvsrM.js";import{C as r}from"./ChildCard-1K0LK_Kd.js";import{C as l}from"./CodeDialog-DS_2Fy2U.js";import{G as i}from"./Grid2-D56AonIH.js";import{S as s}from"./Stack-7R2xgwnv.js";import{A as e}from"./Alert-CkB7u9JX.js";import{A as n}from"./AlertTitle-Axu-QIOD.js";import{B as c}from"./Button-DuWWTJ1w.js";import{C as u}from"./Collapse-Rb_8TpUG.js";import{I as x}from"./IconButton-C9FWHOCN.js";import{I as f}from"./IconX-DtIYRj_S.js";import"./Typography-BDkkff4Z.js";import"./index-BwqtTtay.js";import"./Paper-CrmG5ZWt.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Box-BXQ1zNTo.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./toConsumableArray-BiloOGAC.js";import"./createStack-C9SkPHjo.js";import"./Close-D9PXX_a0.js";const j=()=>t.jsx(t.Fragment,{children:t.jsx(l,{children:`

import React from 'react';
import {
  Stack,
  Alert,
} from "@mui/material";

<Stack spacing={1}>
    <Alert variant="filled" severity="error">
        This is an error alert — check it out!
    </Alert>
    <Alert variant="filled" severity="warning">
        This is a warning alert — check it out!
    </Alert>
    <Alert variant="filled" severity="info">
        This is an info alert — check it out!
    </Alert>
    <Alert variant="filled" severity="success">
        This is a success alert — check it out!
    </Alert>
</Stack>`})}),v=()=>t.jsx(t.Fragment,{children:t.jsx(l,{children:`

import React from 'react';
import {
  Stack,
  Alert,
} from "@mui/material";

<Stack spacing={1}>
    <Alert variant="outlined" severity="error">
        This is an error alert — check it out!
    </Alert>
    <Alert variant="outlined" severity="warning">
        This is a warning alert — check it out!
    </Alert>
    <Alert variant="outlined" severity="info">
        This is an info alert — check it out!
    </Alert>
    <Alert variant="outlined" severity="success">
        This is a success alert — check it out!
    </Alert>
</Stack>`})}),A=()=>t.jsx(t.Fragment,{children:t.jsx(l,{children:`

import React from 'react';
import {
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";

<Stack spacing={1}>
    <Alert variant="filled" severity="error">
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
    </Alert>
    <Alert variant="filled" severity="warning">
        <AlertTitle>Warning</AlertTitle>
        This is a warning alert — <strong>check it out!</strong>
    </Alert>
    <Alert variant="filled" severity="info">
        <AlertTitle>Info</AlertTitle>
        This is an info alert — <strong>check it out!</strong>
    </Alert>
    <Alert variant="filled" severity="success">
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
    </Alert>
</Stack>`})}),g=()=>t.jsx(t.Fragment,{children:t.jsx(l,{children:`

import React from 'react';
import {
  Stack,
  Button,
  Alert,
} from "@mui/material";

<Stack spacing={1}>
    <Alert variant="filled" severity="warning">
        This is a success alert — check it out!
    </Alert>
    <Alert
        variant="filled"
        severity="info"
        action={
            <Button color="inherit" size="small">
                UNDO
            </Button>
        }
    >
        This is a success alert — check it out!
    </Alert>
</Stack>`})}),k=()=>t.jsx(t.Fragment,{children:t.jsx(l,{children:`

import * as React from 'react';
import {
  Stack,
  Button,
  IconButton,
  Collapse,
  Alert,
} from "@mui/material";

<Stack spacing={1}>
    <Collapse in={open}>
        <Alert
            variant="filled"
            severity="info"
            sx={{ mb: 1 }}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    <IconX width={20} />
                </IconButton>
            }
        >
            Close me!
        </Alert>
    </Collapse>
</Stack>
<Button
    disabled={open}
    variant="contained"
    onClick={() => {
        setOpen(true);
    }}
>
    Re-open
</Button>`})}),T=[{to:"/",title:"Home"},{title:"Alert"}],pt=()=>{const[a,o]=d.useState(!0);return t.jsxs(m,{title:"Alert",description:"this is Alert page",children:[t.jsx(h,{title:"Alert",items:T}),t.jsx(p,{title:"Alert",children:t.jsxs(i,{container:!0,spacing:3,children:[t.jsx(i,{display:"flex",alignItems:"stretch",size:12,children:t.jsx(r,{title:"Filled",codeModel:t.jsx(j,{}),children:t.jsxs(s,{spacing:1,children:[t.jsx(e,{variant:"filled",severity:"error",children:"This is an error alert — check it out!"}),t.jsx(e,{variant:"filled",severity:"warning",children:"This is a warning alert — check it out!"}),t.jsx(e,{variant:"filled",severity:"info",children:"This is an info alert — check it out!"}),t.jsx(e,{variant:"filled",severity:"success",children:"This is a success alert — check it out!"})]})})}),t.jsx(i,{display:"flex",alignItems:"stretch",size:12,children:t.jsx(r,{title:"Outlined",codeModel:t.jsx(v,{}),children:t.jsxs(s,{spacing:1,children:[t.jsx(e,{variant:"outlined",severity:"error",children:"This is an error alert — check it out!"}),t.jsx(e,{variant:"outlined",severity:"warning",children:"This is a warning alert — check it out!"}),t.jsx(e,{variant:"outlined",severity:"info",children:"This is an info alert — check it out!"}),t.jsx(e,{variant:"outlined",severity:"success",children:"This is a success alert — check it out!"})]})})}),t.jsx(i,{display:"flex",alignItems:"stretch",size:12,children:t.jsx(r,{title:"Description",codeModel:t.jsx(A,{}),children:t.jsxs(s,{spacing:1,children:[t.jsxs(e,{variant:"filled",severity:"error",children:[t.jsx(n,{children:"Error"}),"This is an error alert — ",t.jsx("strong",{children:"check it out!"})]}),t.jsxs(e,{variant:"filled",severity:"warning",children:[t.jsx(n,{children:"Warning"}),"This is a warning alert — ",t.jsx("strong",{children:"check it out!"})]}),t.jsxs(e,{variant:"filled",severity:"info",children:[t.jsx(n,{children:"Info"}),"This is an info alert — ",t.jsx("strong",{children:"check it out!"})]}),t.jsxs(e,{variant:"filled",severity:"success",children:[t.jsx(n,{children:"Success"}),"This is a success alert — ",t.jsx("strong",{children:"check it out!"})]})]})})}),t.jsx(i,{display:"flex",alignItems:"stretch",size:12,children:t.jsx(r,{title:"Action",codeModel:t.jsx(g,{}),children:t.jsxs(s,{spacing:1,children:[t.jsx(e,{variant:"filled",severity:"warning",children:"This is a success alert — check it out!"}),t.jsx(e,{variant:"filled",severity:"info",action:t.jsx(c,{color:"inherit",size:"small",children:"UNDO"}),children:"This is a success alert — check it out!"})]})})}),t.jsx(i,{display:"flex",alignItems:"stretch",size:12,children:t.jsxs(r,{title:"Transition",codeModel:t.jsx(k,{}),children:[t.jsx(s,{spacing:1,children:t.jsx(u,{in:a,children:t.jsx(e,{variant:"filled",severity:"info",sx:{mb:1},action:t.jsx(x,{"aria-label":"close",color:"inherit",size:"small",onClick:()=>{o(!1)},children:t.jsx(f,{width:20})}),children:"Close me!"})})}),t.jsx(c,{disabled:a,variant:"contained",onClick:()=>{o(!0)},children:"Re-open"})]})})]})})]})};export{pt as default};
