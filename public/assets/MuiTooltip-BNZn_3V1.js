import{r as f,j as t}from"./index-BOycD4kd.js";import{I as Q}from"./InlineItemCard-CluzQ6jA.js";import{B as U}from"./Breadcrumb-BqJ4_UoQ.js";import{P as X}from"./PageContainer-97CIqrJb.js";import{P as Y}from"./ParentCard-MJIOvsrM.js";import{C as d}from"./ChildCard-1K0LK_Kd.js";import{C as m}from"./CodeDialog-DS_2Fy2U.js";import{u as _,s as R}from"./Typography-BDkkff4Z.js";import{T as o,t as F}from"./Tooltip-DKFlwfZ_.js";import{G as a}from"./Grid2-D56AonIH.js";import{S as j}from"./Stack-7R2xgwnv.js";import{I as C}from"./IconButton-C9FWHOCN.js";import{I as w}from"./IconTrash-Cds8XG15.js";import{B as i}from"./Button-DuWWTJ1w.js";import{F as S}from"./Fab-CltzWDsW.js";import{I as P}from"./IconPlus-CMHBvUCl.js";import{B as tt}from"./Box-BXQ1zNTo.js";import{F as ot}from"./Modal-CIgidMPB.js";import{u as it}from"./Paper-CrmG5ZWt.js";import{T as et,a as rt,g as b}from"./utils-C9LLcjVj.js";import{g as nt}from"./getReactElementRef-DEfyDt09.js";import"./index-BwqtTtay.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./DialogContent-Cg8VwAnA.js";import"./useId-B1jnamIH.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./Portal-Dipjj-39.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./createStack-C9SkPHjo.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";const lt={entering:{transform:"none"},entered:{transform:"none"}},at=f.forwardRef(function(s,W){const n=it(),A={enter:n.transitions.duration.enteringScreen,exit:n.transitions.duration.leavingScreen},{addEndListener:B,appear:L=!0,children:h,easing:v,in:y,onEnter:E,onEntered:k,onEntering:N,onExit:I,onExited:M,onExiting:D,style:x,timeout:T=A,TransitionComponent:Z=et,...q}=s,u=f.useRef(null),z=_(u,nt(h),W),l=e=>r=>{if(e){const c=u.current;r===void 0?e(c):e(c,r)}},G=l(N),V=l((e,r)=>{rt(e);const c=b({style:x,timeout:T,easing:v},{mode:"enter"});e.style.webkitTransition=n.transitions.create("transform",c),e.style.transition=n.transitions.create("transform",c),E&&E(e,r)}),$=l(k),H=l(D),J=l(e=>{const r=b({style:x,timeout:T,easing:v},{mode:"exit"});e.style.webkitTransition=n.transitions.create("transform",r),e.style.transition=n.transitions.create("transform",r),I&&I(e)}),K=l(M),O=e=>{B&&B(u.current,e)};return t.jsx(Z,{appear:L,in:y,nodeRef:u,onEnter:V,onEntered:$,onEntering:G,onExit:J,onExited:K,onExiting:H,addEndListener:O,timeout:T,...q,children:(e,r)=>f.cloneElement(h,{style:{transform:"scale(0)",visibility:e==="exited"&&!y?"hidden":void 0,...lt[e],...x,...h.props.style},ref:z,...r})})}),st=()=>t.jsx(t.Fragment,{children:t.jsx(m,{children:`

import React from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Button, Stack, Fab, Box } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import { IconPlus, IconTrash } from '@tabler/icons-react';

<Stack direction="row" spacing={2} alignItems="center">
    <Tooltip title="Delete">
        <IconButton>
            <IconTrash width={20} height={20} />
        </IconButton>
    </Tooltip>
    <Tooltip title="Add">
        <Button variant="outlined" color="primary">
            Button
        </Button>
    </Tooltip>
    <Tooltip title="Delete">
        <IconButton color="error">
            <IconTrash width={20} height={20} />
        </IconButton>
    </Tooltip>
    <Tooltip title="Add">
        <Fab color="secondary">
            <IconPlus width={20} height={20} />
        </Fab>
    </Tooltip>
</Stack>`})}),ct=()=>t.jsx(t.Fragment,{children:t.jsx(m,{children:`

import React from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Button, Stack, Fab, Box } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import { IconPlus } from '@tabler/icons-react';

<Box textAlign="center">
    <Tooltip title="Delete" arrow>
        <Fab color="secondary">
            <IconPlus width={20} height={20} />
        </Fab>
    </Tooltip>
</Box>
`})}),dt=()=>t.jsx(t.Fragment,{children:t.jsx(m,{children:`

import React from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Button, Stack, Fab, Box } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  ['& .{tooltipClasses.tooltip}']: {
    maxWidth: 500,
  },
});

const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  ['& .{tooltipClasses.tooltip}']: {
    maxWidth: 'none',
  },
});

const longText = '
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
';

import { IconPlus, IconTrash } from '@tabler/icons-react';

<Stack spacing={1} direction="row">
    <Tooltip title={longText}>
        <Button variant="outlined">Default Width [300px]</Button>
    </Tooltip>
    <CustomWidthTooltip title={longText}>
        <Button color="secondary" variant="outlined">Custom Width [500px]</Button>
    </CustomWidthTooltip>
    <NoMaxWidthTooltip title={longText}>
        <Button color="warning" variant="outlined">No wrapping</Button>
    </NoMaxWidthTooltip>
</Stack>`})}),mt=()=>t.jsx(t.Fragment,{children:t.jsx(m,{children:`

import React from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Button, Stack, Fab, Box } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';

<Stack spacing={1} direction="row">
    <Tooltip title="Add">
        <Button variant="outlined" color="primary">Grow</Button>
    </Tooltip>
    <Tooltip
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        title="Add"
    >
        <Button variant="outlined" color="secondary">Fade</Button>
    </Tooltip>
    <Tooltip TransitionComponent={Zoom} title="Add">
        <Button variant="outlined" color="warning">Zoom</Button>
    </Tooltip>
</Stack>`})}),pt=()=>t.jsx(t.Fragment,{children:t.jsx(m,{children:`

import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Tooltip title="Top Start" placement="top-start">
        <Button variant="outlined" color="primary">Top Start</Button>
    </Tooltip>
    <Tooltip title="Top" placement="top">
        <Button variant="outlined" color="secondary">Top</Button>
    </Tooltip>
    <Tooltip title="Top End" placement="top-end">
        <Button variant="outlined" color="warning">Top End</Button>
    </Tooltip>
    <Tooltip title="Left Start" placement="left-start">
        <Button variant="outlined" color="success">Left Start</Button>
    </Tooltip>
    <Tooltip title="Left" placement="left">
        <Button variant="outlined" color="error">Left</Button>
    </Tooltip>
    <Tooltip title="Left End" placement="left-end">
        <Button variant="outlined" color="primary">Left End</Button>
    </Tooltip>
    <Tooltip title="Right Start" placement="right-start">
        <Button variant="outlined" color="secondary">Right Start</Button>
    </Tooltip>
    <Tooltip title="Right" placement="right">
        <Button variant="outlined" color="warning">Right</Button>
    </Tooltip>
    <Tooltip title="Right End" placement="right-end">
        <Button variant="outlined" color="success">Right End</Button>
    </Tooltip>
    <Tooltip title="Bottom Start" placement="bottom-start">
        <Button variant="outlined" color="error">Bottom Start</Button>
    </Tooltip>
    <Tooltip title="Bottom" placement="bottom">
        <Button variant="outlined" color="primary">Bottom</Button>
    </Tooltip>
    <Tooltip title="Bottom End" placement="bottom-end">
        <Button variant="outlined" color="secondary">Bottom End</Button>
    </Tooltip>
</InlineItemCard>`})}),ut=[{to:"/",title:"Home"},{title:"Tooltip"}],ht=R(({className:p,...s})=>t.jsx(o,{...s,classes:{popper:p}}))({[`& .${F.tooltip}`]:{maxWidth:500}}),xt=R(({className:p,...s})=>t.jsx(o,{...s,classes:{popper:p}}))({[`& .${F.tooltip}`]:{maxWidth:"none"}}),g=`
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`,lo=()=>t.jsxs(X,{title:"Tooltip",description:"this is Tooltip page",children:[t.jsx(U,{title:"Tooltip",items:ut}),t.jsx(Y,{title:"Tooltip",children:t.jsxs(a,{container:!0,spacing:3,children:[t.jsx(a,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:t.jsx(d,{title:"Simple",codeModel:t.jsx(st,{}),children:t.jsxs(j,{direction:"row",spacing:2,alignItems:"center",children:[t.jsx(o,{title:"Delete",children:t.jsx(C,{children:t.jsx(w,{width:20,height:20})})}),t.jsx(o,{title:"Add",children:t.jsx(i,{variant:"outlined",color:"primary",children:"Button"})}),t.jsx(o,{title:"Delete",children:t.jsx(C,{color:"error",children:t.jsx(w,{width:20,height:20})})}),t.jsx(o,{title:"Add",children:t.jsx(S,{color:"secondary",children:t.jsx(P,{width:20,height:20})})})]})})}),t.jsx(a,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:t.jsx(d,{title:"Arrow",codeModel:t.jsx(ct,{}),children:t.jsx(tt,{textAlign:"center",children:t.jsx(o,{title:"Delete",arrow:!0,children:t.jsx(S,{color:"secondary",children:t.jsx(P,{width:20,height:20})})})})})}),t.jsx(a,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:t.jsx(d,{title:"Variable Width",codeModel:t.jsx(dt,{}),children:t.jsxs(j,{spacing:1,direction:"row",children:[t.jsx(o,{title:g,children:t.jsx(i,{variant:"outlined",children:"Default Width [300px]"})}),t.jsx(ht,{title:g,children:t.jsx(i,{color:"secondary",variant:"outlined",children:"Custom Width [500px]"})}),t.jsx(xt,{title:g,children:t.jsx(i,{color:"warning",variant:"outlined",children:"No wrapping"})})]})})}),t.jsx(a,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:t.jsx(d,{title:"Transitions",codeModel:t.jsx(mt,{}),children:t.jsxs(j,{spacing:1,direction:"row",children:[t.jsx(o,{title:"Add",children:t.jsx(i,{variant:"outlined",color:"primary",children:"Grow"})}),t.jsx(o,{TransitionComponent:ot,TransitionProps:{timeout:600},title:"Add",children:t.jsx(i,{variant:"outlined",color:"secondary",children:"Fade"})}),t.jsx(o,{TransitionComponent:at,title:"Add",children:t.jsx(i,{variant:"outlined",color:"warning",children:"Zoom"})})]})})}),t.jsx(a,{display:"flex",alignItems:"stretch",size:12,children:t.jsx(d,{title:"Positions",codeModel:t.jsx(pt,{}),children:t.jsxs(Q,{children:[t.jsx(o,{title:"Top Start",placement:"top-start",children:t.jsx(i,{variant:"outlined",color:"primary",children:"Top Start"})}),t.jsx(o,{title:"Top",placement:"top",children:t.jsx(i,{variant:"outlined",color:"secondary",children:"Top"})}),t.jsx(o,{title:"Top End",placement:"top-end",children:t.jsx(i,{variant:"outlined",color:"warning",children:"Top End"})}),t.jsx(o,{title:"Left Start",placement:"left-start",children:t.jsx(i,{variant:"outlined",color:"success",children:"Left Start"})}),t.jsx(o,{title:"Left",placement:"left",children:t.jsx(i,{variant:"outlined",color:"error",children:"Left"})}),t.jsx(o,{title:"Left End",placement:"left-end",children:t.jsx(i,{variant:"outlined",color:"primary",children:"Left End"})}),t.jsx(o,{title:"Right Start",placement:"right-start",children:t.jsx(i,{variant:"outlined",color:"secondary",children:"Right Start"})}),t.jsx(o,{title:"Right",placement:"right",children:t.jsx(i,{variant:"outlined",color:"warning",children:"Right"})}),t.jsx(o,{title:"Right End",placement:"right-end",children:t.jsx(i,{variant:"outlined",color:"success",children:"Right End"})}),t.jsx(o,{title:"Bottom Start",placement:"bottom-start",children:t.jsx(i,{variant:"outlined",color:"error",children:"Bottom Start"})}),t.jsx(o,{title:"Bottom",placement:"bottom",children:t.jsx(i,{variant:"outlined",color:"primary",children:"Bottom"})}),t.jsx(o,{title:"Bottom End",placement:"bottom-end",children:t.jsx(i,{variant:"outlined",color:"secondary",children:"Bottom End"})})]})})})]})})]});export{lo as default};
