import{j as e,r as x}from"./index-BOycD4kd.js";import{B as y}from"./Breadcrumb-BqJ4_UoQ.js";import{P as g}from"./PageContainer-97CIqrJb.js";import{P as v}from"./ParentCard-MJIOvsrM.js";import{C as l}from"./ChildCard-1K0LK_Kd.js";import{C as p}from"./CodeDialog-DS_2Fy2U.js";import{G as s}from"./Grid2-D56AonIH.js";import{A as r,a as o,b as i}from"./AccordionSummary-B3UPWmle.js";import{I as n}from"./IconChevronDown-D0HMaIl7.js";import{T as a}from"./Typography-BDkkff4Z.js";import{D as d}from"./Divider-CZ0X2mWw.js";import"./index-BwqtTtay.js";import"./Paper-CrmG5ZWt.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Box-BXQ1zNTo.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./Collapse-Rb_8TpUG.js";import"./dividerClasses-BAp1ZLUP.js";const A=()=>e.jsx(e.Fragment,{children:e.jsx(p,{children:`

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { IconChevronDown } from "@tabler/icons-react";

              <Accordion>
                <AccordionSummary
                  expandIcon={<IconChevronDown />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6">Accordion 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle1" color="textSecondary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
<Divider />
<Accordion>
    <AccordionSummary
        expandIcon={<IconChevronDown />}
        aria-controls="panel2a-content"
        id="panel2a-header"
    >
        <Typography variant="h6">Accordion 2</Typography>
    </AccordionSummary>
    <AccordionDetails>
        <Typography variant="subtitle1" color="textSecondary">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Suspendisse malesuada lacus ex, sit amet blandit leo
        lobortis eget.
        </Typography>
    </AccordionDetails>
    </Accordion>
    <Divider />
    <Accordion disabled>
    <AccordionSummary
        expandIcon={<IconChevronDown />}
        aria-controls="panel3a-content"
        id="panel3a-header"
    >
        <Typography variant="h6">Disabled Accordion</Typography>
    </AccordionSummary>
    </Accordion>`})}),j=()=>e.jsx(e.Fragment,{children:e.jsx(p,{children:`

import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { IconChevronDown } from "@tabler/icons-react";

<Accordion
    expanded={expanded === "panel1"}
    onChange={handleChange("panel1")}
    >
    <AccordionSummary
        expandIcon={<IconChevronDown />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
    >
        <Typography variant="h6" sx={{ width: "33%", flexShrink: 0 }}>
        General settings
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
        I am an accordion
        </Typography>
    </AccordionSummary>
    <AccordionDetails>
        <Typography variant="subtitle1" color="textSecondary">
        Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
        feugiat. Aliquam eget maximus est, id dignissim quam.
        </Typography>
    </AccordionDetails>
    </Accordion>
    <Accordion
    expanded={expanded === "panel2"}
    onChange={handleChange("panel2")}
    >
    <AccordionSummary
        expandIcon={<IconChevronDown />}
        aria-controls="panel2bh-content"
        id="panel2bh-header"
    >
        <Typography variant="h6" sx={{ width: "33%", flexShrink: 0 }}>
        Users
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
        You are currently not an owner
        </Typography>
    </AccordionSummary>
    <AccordionDetails>
        <Typography variant="subtitle1" color="textSecondary">
        Donec placerat, lectus sed mattis semper, neque lectus
        feugiat lectus, varius pulvinar diam eros in elit.
        Pellentesque convallis laoreet laoreet.
        </Typography>
    </AccordionDetails>
    </Accordion>
    <Accordion
    expanded={expanded === "panel3"}
    onChange={handleChange("panel3")}
    >
    <AccordionSummary
        expandIcon={<IconChevronDown />}
        aria-controls="panel3bh-content"
        id="panel3bh-header"
    >
        <Typography variant="h6" sx={{ width: "33%", flexShrink: 0 }}>
        Advanced settings
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
        Filtering has been entirely disabled for whole web server
        </Typography>
    </AccordionSummary>
    <AccordionDetails>
        <Typography variant="subtitle1" color="textSecondary">
        Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
        Integer sit amet egestas eros, vitae egestas augue. Duis vel
        est augue.
        </Typography>
    </AccordionDetails>
    </Accordion>
    <Accordion
    expanded={expanded === "panel4"}
    onChange={handleChange("panel4")}
    >
    <AccordionSummary
        expandIcon={<IconChevronDown />}
        aria-controls="panel4bh-content"
        id="panel4bh-header"
    >
        <Typography variant="h6" sx={{ width: "33%", flexShrink: 0 }}>
        Personal data
        </Typography>
    </AccordionSummary>
    <AccordionDetails>
        <Typography variant="subtitle1" color="textSecondary">
        Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
        Integer sit amet egestas eros, vitae egestas augue. Duis vel
        est augue.
        </Typography>
    </AccordionDetails>
    </Accordion>`})}),b=[{to:"/",title:"Home"},{title:"Accordion"}],le=()=>{const[t,h]=x.useState(!1),c=m=>(S,u)=>{h(u?m:!1)};return e.jsxs(g,{title:"Accordion",description:"this is Accordion page",children:[e.jsx(y,{title:"Accordion",items:b}),e.jsx(v,{title:"Accordion",children:e.jsxs(s,{container:!0,spacing:3,children:[e.jsx(s,{display:"flex",alignItems:"stretch",size:12,children:e.jsxs(l,{title:"Basic",codeModel:e.jsx(A,{}),children:[e.jsxs(r,{children:[e.jsx(o,{expandIcon:e.jsx(n,{}),"aria-controls":"panel1a-content",id:"panel1a-header",children:e.jsx(a,{variant:"h6",children:"Accordion 1"})}),e.jsx(i,{children:e.jsx(a,{variant:"subtitle1",color:"textSecondary",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."})})]}),e.jsx(d,{}),e.jsxs(r,{children:[e.jsx(o,{expandIcon:e.jsx(n,{}),"aria-controls":"panel2a-content",id:"panel2a-header",children:e.jsx(a,{variant:"h6",children:"Accordion 2"})}),e.jsx(i,{children:e.jsx(a,{variant:"subtitle1",color:"textSecondary",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."})})]}),e.jsx(d,{}),e.jsx(r,{disabled:!0,children:e.jsx(o,{expandIcon:e.jsx(n,{}),"aria-controls":"panel3a-content",id:"panel3a-header",children:e.jsx(a,{variant:"h6",children:"Disabled Accordion"})})})]})}),e.jsx(s,{display:"flex",alignItems:"stretch",size:12,children:e.jsxs(l,{title:"Controlled",codeModel:e.jsx(j,{}),children:[e.jsxs(r,{expanded:t==="panel1",onChange:c("panel1"),children:[e.jsxs(o,{expandIcon:e.jsx(n,{}),"aria-controls":"panel1bh-content",id:"panel1bh-header",children:[e.jsx(a,{variant:"h6",sx:{width:"33%",flexShrink:0},children:"General settings"}),e.jsx(a,{variant:"subtitle2",color:"textSecondary",children:"I am an accordion"})]}),e.jsx(i,{children:e.jsx(a,{variant:"subtitle1",color:"textSecondary",children:"Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget maximus est, id dignissim quam."})})]}),e.jsxs(r,{expanded:t==="panel2",onChange:c("panel2"),children:[e.jsxs(o,{expandIcon:e.jsx(n,{}),"aria-controls":"panel2bh-content",id:"panel2bh-header",children:[e.jsx(a,{variant:"h6",sx:{width:"33%",flexShrink:0},children:"Users"}),e.jsx(a,{variant:"subtitle2",color:"textSecondary",children:"You are currently not an owner"})]}),e.jsx(i,{children:e.jsx(a,{variant:"subtitle1",color:"textSecondary",children:"Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar diam eros in elit. Pellentesque convallis laoreet laoreet."})})]}),e.jsxs(r,{expanded:t==="panel3",onChange:c("panel3"),children:[e.jsxs(o,{expandIcon:e.jsx(n,{}),"aria-controls":"panel3bh-content",id:"panel3bh-header",children:[e.jsx(a,{variant:"h6",sx:{width:"33%",flexShrink:0},children:"Advanced settings"}),e.jsx(a,{variant:"subtitle2",color:"textSecondary",children:"Filtering has been entirely disabled for whole web server"})]}),e.jsx(i,{children:e.jsx(a,{variant:"subtitle1",color:"textSecondary",children:"Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue."})})]}),e.jsxs(r,{expanded:t==="panel4",onChange:c("panel4"),children:[e.jsx(o,{expandIcon:e.jsx(n,{}),"aria-controls":"panel4bh-content",id:"panel4bh-header",children:e.jsx(a,{variant:"h6",sx:{width:"33%",flexShrink:0},children:"Personal data"})}),e.jsx(i,{children:e.jsx(a,{variant:"subtitle1",color:"textSecondary",children:"Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros, vitae egestas augue. Duis vel est augue."})})]})]})})]})})]})};export{le as default};
