import{R as c,j as o}from"./index-BOycD4kd.js";import{B as u}from"./Breadcrumb-BqJ4_UoQ.js";import{P as x}from"./PageContainer-97CIqrJb.js";import{P}from"./ParentCard-MJIOvsrM.js";import{C as s}from"./ChildCard-1K0LK_Kd.js";import{B as y}from"./Button-DuWWTJ1w.js";import{P as m}from"./Popover-COV8vM5j.js";import{B as h}from"./Box-BXQ1zNTo.js";import{T as n}from"./Typography-BDkkff4Z.js";import{C as d}from"./CodeDialog-DS_2Fy2U.js";import{G as l}from"./Grid2-D56AonIH.js";import"./index-BwqtTtay.js";import"./Paper-CrmG5ZWt.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./isHostComponent-DVu5iVWx.js";import"./useSlot-C8hSq5RO.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./useId-B1jnamIH.js";import"./createChainedFunction-BO_9K8Jh.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./Portal-Dipjj-39.js";import"./debounce-Be36O1Ab.js";import"./Grow-DaxZ4x-g.js";import"./Tooltip-DKFlwfZ_.js";import"./Popper-CDUIbv4Q.js";import"./useControlled-CGXnS8Tc.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";const g=()=>{const[e,r]=c.useState(null),a=v=>{r(v.currentTarget)},i=()=>{r(null)},t=!!e,p=t?"simple-popover":void 0;return o.jsxs(o.Fragment,{children:[o.jsx(y,{"aria-describedby":p,variant:"contained",onClick:a,children:"Open Popover"}),o.jsx(m,{id:p,open:t,anchorEl:e,onClose:i,anchorOrigin:{vertical:"bottom",horizontal:"left"},children:o.jsxs(h,{p:2,children:[o.jsx(n,{variant:"h6",mb:1,children:"Basic Popover"}),o.jsx(n,{color:"textSecondary",children:"The component is built on top of the Modal component."})]})})]})},f=()=>{const[e,r]=c.useState(null),a=p=>{r(p.currentTarget)},i=()=>{r(null)},t=!!e;return o.jsxs(o.Fragment,{children:[o.jsx(n,{"aria-owns":t?"mouse-over-popover":void 0,"aria-haspopup":"true",onMouseEnter:a,onMouseLeave:i,children:"Hover with a Popover."}),o.jsx(m,{id:"mouse-over-popover",sx:{pointerEvents:"none"},open:t,anchorEl:e,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},onClose:i,disableRestoreFocus:!0,children:o.jsxs(h,{p:2,children:[o.jsx(n,{variant:"h6",mb:1,children:"Hover Popover"}),o.jsx(n,{color:"textSecondary",children:"The component is built on top of the Modal component."})]})})]})},j=()=>o.jsx(o.Fragment,{children:o.jsx(d,{children:`

import React from 'react';
import { 
    Popover, 
    Typography, 
    Button, 
    Box 
} from '@mui/material';


const [anchorEl, setAnchorEl] = React.useState(null);

const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
};

const open = Boolean(anchorEl);
const id = open ? 'simple-popover' : undefined;

return (
    <>
        <Button aria-describedby={id} variant="contained" onClick={handleClick}>
            Open Popover
        </Button>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        >
            <Box p={2}>
                <Typography variant="h6" mb={1}>
                    Basic Popover
                </Typography>
                <Typography color="textSecondary">
                    The component is built on top of the Modal component.
                </Typography>
            </Box>
        </Popover>
    </>
);`})}),C=()=>o.jsx(o.Fragment,{children:o.jsx(d,{children:`

import React from 'react';
import { 
  Popover, 
  Box, 
  Typography 
} from '@mui/material';


const [anchorEl, setAnchorEl] = React.useState(null);
a
const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
};

const handlePopoverClose = () => {
    setAnchorEl(null);
};

const open = Boolean(anchorEl);

return (
    <>
        <Typography
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
        >
            Hover with a Popover.
        </Typography>
        <Popover
            id="mouse-over-popover"
            sx={{
                pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
            <Box p={2}>
                <Typography variant="h6" mb={1}>
                    Hover Popover
                </Typography>
                <Typography color="textSecondary">
                    The component is built on top of the Modal component.
                </Typography>
            </Box>
      </Popover>
    </>
);`})}),E=[{to:"/",title:"Home"},{title:"Popover"}],mo=()=>o.jsxs(x,{title:"Popover",description:"this is Popover page",children:[o.jsx(u,{title:"Popover",items:E}),o.jsx(P,{title:"Popover",children:o.jsxs(l,{container:!0,spacing:3,children:[o.jsx(l,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:o.jsx(s,{title:"Click",codeModel:o.jsx(j,{}),children:o.jsx(g,{})})}),o.jsx(l,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:o.jsx(s,{title:"Hover",codeModel:o.jsx(C,{}),children:o.jsx(f,{})})})]})})]});export{mo as default};
