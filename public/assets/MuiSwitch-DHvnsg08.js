import{j as e}from"./index-BOycD4kd.js";import{P as m}from"./ParentCard-MJIOvsrM.js";import{C as o}from"./ChildCard-1K0LK_Kd.js";import{B as d}from"./Breadcrumb-BqJ4_UoQ.js";import{P as x}from"./PageContainer-97CIqrJb.js";import{C as c}from"./CustomSwitch-C42mJ39Z.js";import{B as i}from"./Box-BXQ1zNTo.js";import{S as t}from"./Switch-C2fRenyJ.js";import{F as n}from"./FormGroup-BvSGhWlG.js";import{F as l}from"./FormControlLabel-D8wW9e5M.js";import{C as s}from"./CodeDialog-DS_2Fy2U.js";import{G as r}from"./Grid2-D56AonIH.js";import"./Paper-CrmG5ZWt.js";import"./Typography-BDkkff4Z.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./SwitchBase-CVR3uh3U.js";import"./useFormControl-Ds-I_R6P.js";import"./useControlled-CGXnS8Tc.js";import"./formControlState-Dq1zat_P.js";import"./useSlot-C8hSq5RO.js";import"./Tooltip-DKFlwfZ_.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";const h=()=>e.jsxs(i,{textAlign:"center",children:[e.jsx(c,{checked:!0}),e.jsx(c,{}),e.jsx(c,{disabled:!0,defaultChecked:!0}),e.jsx(c,{disabled:!0})]}),u=()=>e.jsxs(i,{textAlign:"center",children:[e.jsx(t,{defaultChecked:!0}),e.jsx(t,{}),e.jsx(t,{disabled:!0,defaultChecked:!0}),e.jsx(t,{disabled:!0})]}),p=()=>e.jsx(i,{textAlign:"center",children:e.jsxs(n,{children:[e.jsx(l,{control:e.jsx(t,{defaultChecked:!0}),label:"Label"}),e.jsx(l,{disabled:!0,control:e.jsx(t,{}),label:"Disabled"})]})}),j=()=>e.jsxs(i,{textAlign:"center",children:[e.jsx(t,{defaultChecked:!0,size:"small"}),e.jsx(t,{defaultChecked:!0})]}),f=()=>e.jsxs(i,{textAlign:"center",children:[e.jsx(t,{defaultChecked:!0}),e.jsx(t,{defaultChecked:!0,color:"secondary"}),e.jsx(t,{defaultChecked:!0,color:"error"}),e.jsx(t,{defaultChecked:!0,color:"warning"}),e.jsx(t,{defaultChecked:!0,color:"success"}),e.jsx(t,{defaultChecked:!0,color:"default"})]}),b=()=>e.jsx(i,{textAlign:"center",children:e.jsxs(n,{"aria-label":"position",row:!0,children:[e.jsx(l,{value:"top",control:e.jsx(t,{color:"primary"}),label:"Top",labelPlacement:"top"}),e.jsx(l,{value:"start",control:e.jsx(t,{color:"primary"}),label:"Start",labelPlacement:"start"}),e.jsx(l,{value:"bottom",control:e.jsx(t,{color:"primary"}),label:"Bottom",labelPlacement:"bottom"}),e.jsx(l,{value:"end",control:e.jsx(t,{color:"primary"}),label:"End",labelPlacement:"end"})]})}),a=()=>e.jsx(e.Fragment,{children:e.jsx(s,{children:`
"use client";

import { Box, Switch } from '@mui/material';

<Box textAlign="center">
    <Switch defaultChecked />
    <Switch defaultChecked color="secondary" />
    <Switch defaultChecked color="error" />
    <Switch defaultChecked color="warning" />
    <Switch defaultChecked color="success" />
    <Switch defaultChecked color="default" />
</Box>
`})}),C=()=>e.jsx(e.Fragment,{children:e.jsx(s,{children:`
"use client";

import { Box, Switch } from '@mui/material';

<Box textAlign="center">
    <Switch defaultChecked />
    <Switch />
    <Switch disabled defaultChecked />
    <Switch disabled />
</Box>
`})}),S=()=>e.jsx(e.Fragment,{children:e.jsx(s,{children:`
"use client";

import { Box, Switch, FormGroup, FormControlLabel } from '@mui/material';

<Box textAlign="center">
    <FormGroup>
        <FormControlLabel control={<Switch defaultChecked />} label="Label" />
        <FormControlLabel disabled control={<Switch />} label="Disabled" />
    </FormGroup>
</Box>
`})}),w=()=>e.jsx(e.Fragment,{children:e.jsx(s,{children:`
"use client";

import { Box, Switch } from '@mui/material';

<Box textAlign="center">
    <Switch defaultChecked size="small" />
    <Switch defaultChecked />
</Box>
`})}),g=()=>e.jsx(e.Fragment,{children:e.jsx(s,{children:`
"use client";

import { Box, Switch, FormGroup, FormControlLabel } from '@mui/material';

<Box textAlign="center">
    <FormGroup aria-label="position" row>
        <FormControlLabel
            value="top"
            control={<Switch color="primary" />}
            label="Top"
            labelPlacement="top"
        />
        <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Start"
            labelPlacement="start"
        />
        <FormControlLabel
            value="bottom"
            control={<Switch color="primary" />}
            label="Bottom"
            labelPlacement="bottom"
        />
        <FormControlLabel
            value="end"
            control={<Switch color="primary" />}
            label="End"
            labelPlacement="end"
        />
    </FormGroup>
</Box>
`})}),k=[{to:"/",title:"Home"},{title:"Switch"}],ue=()=>e.jsxs(x,{title:"Switch",description:"this is Switch page",children:[e.jsx(d,{title:"Switch",items:k}),e.jsx(m,{title:"Switch",children:e.jsxs(r,{container:!0,spacing:3,children:[e.jsx(r,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Custom",codeModel:e.jsx(a,{}),children:e.jsx(h,{})})}),e.jsx(r,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Default",codeModel:e.jsx(C,{}),children:e.jsx(u,{})})}),e.jsx(r,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Default with Label",codeModel:e.jsx(S,{}),children:e.jsx(p,{})})}),e.jsx(r,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Sizes",codeModel:e.jsx(w,{}),children:e.jsx(j,{})})}),e.jsx(r,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Default Colors",codeModel:e.jsx(a,{}),children:e.jsx(f,{})})}),e.jsx(r,{display:"flex",alignItems:"stretch",size:{xs:12,lg:6,sm:6},children:e.jsx(o,{title:"Placement",codeModel:e.jsx(g,{}),children:e.jsx(b,{})})})]})})]});export{ue as default};
