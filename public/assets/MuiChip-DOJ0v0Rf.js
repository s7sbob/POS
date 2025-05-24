import{j as e,u as s,y as d,B as m}from"./index-BOycD4kd.js";import{B as u}from"./Breadcrumb-BqJ4_UoQ.js";import{P as x}from"./PageContainer-97CIqrJb.js";import{P as v}from"./ParentCard-MJIOvsrM.js";import{C as i}from"./ChildCard-1K0LK_Kd.js";import{I as n}from"./InlineItemCard-CluzQ6jA.js";import{C as c}from"./CodeDialog-DS_2Fy2U.js";import{G as o}from"./Grid2-D56AonIH.js";import{C as a}from"./Chip-BwUwR4nt.js";import{A as l}from"./Avatar-C06U4if4.js";import{c as D}from"./createReactComponent-DJ-alZeM.js";import{I as p}from"./IconCheck-mEIlIe48.js";import"./Typography-BDkkff4Z.js";import"./index-BwqtTtay.js";import"./Paper-CrmG5ZWt.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./Link-DehrJQLa.js";import"./Box-BXQ1zNTo.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";var h=D("checks","IconChecks",[["path",{d:"M7 12l5 5l10 -10",key:"svg-0"}],["path",{d:"M2 12l5 5m5 -5l5 -5",key:"svg-1"}]]),r=D("mood-happy","IconMoodHappy",[["path",{d:"M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",key:"svg-0"}],["path",{d:"M9 9l.01 0",key:"svg-1"}],["path",{d:"M15 9l.01 0",key:"svg-2"}],["path",{d:"M8 13a4 4 0 1 0 8 0h-8",key:"svg-3"}]]);const C=()=>e.jsx(e.Fragment,{children:e.jsx(c,{children:`

import React from 'react';
import { Avatar, Chip}  from '@mui/material';
import { IconMoodHappy } from '@tabler/icons-react';
import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip avatar={<Avatar>M</Avatar>} label="Default Filled" />
    <Chip avatar={<Avatar>M</Avatar>} label="Default Deletable" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={User1} />} label="Primary Filled" color="primary" />
    <Chip avatar={<Avatar alt="Natacha" src={User1} />} label="Primary Deletable" color="primary" onDelete={handleDelete} />
    <Chip icon={<IconMoodHappy />} label="Secondary Filled" color="secondary" />
    <Chip icon={<IconMoodHappy />} label="Secondary Deletable" color="secondary" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={User2} />} label="Default Filled" color="success" />
    <Chip avatar={<Avatar alt="Natacha" src={User2} />} label="Default Deletable" color="success" onDelete={handleDelete} />
    <Chip icon={<IconMoodHappy />} label="Default Filled" color="warning" />
    <Chip icon={<IconMoodHappy />} label="Default Deletable" color="warning" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={User3} />} label="Default Filled" color="error" />
    <Chip avatar={<Avatar alt="Natacha" src={User3} />} label="Default Deletable" color="error" onDelete={handleDelete} />
</InlineItemCard>`})}),j=()=>e.jsx(e.Fragment,{children:e.jsx(c,{children:`

import React from 'react';
import { 
Avatar, 
Chip, 
 }  from '@mui/material';
import { IconMoodHappy } from '@tabler/icons-react';

import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip variant="outlined" avatar={<Avatar>M</Avatar>} label="Default Filled" />
    <Chip variant="outlined" avatar={<Avatar>M</Avatar>} label="Default Deletable" onDelete={handleDelete} />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={User1} />} label="Default Filled" color="primary" />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={User1} />} label="Default Deletable" color="primary" onDelete={handleDelete} />
    <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Filled" color="secondary" />
    <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Deletable" color="secondary" onDelete={handleDelete} />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={User2} />} label="Default Filled" color="success" />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={User2} />} label="Default Deletable" color="success" onDelete={handleDelete} />
    <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Filled" color="warning" />
    <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Deletable" color="warning" onDelete={handleDelete} />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={User3} />} label="Default Filled" color="error" />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={User3} />} label="Default Deletable" color="error" onDelete={handleDelete} />
</InlineItemCard>`})}),I=()=>e.jsx(e.Fragment,{children:e.jsx(c,{children:`

import React from 'react';
import { 
Avatar, 
Chip, 
 }  from '@mui/material';
import { 
IconCheck, 
IconChecks } from '@tabler/icons-react';
import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip
        label="Custom Icon" color="primary" avatar={<Avatar >M</Avatar>}
        onDelete={handleDelete}
        deleteIcon={<IconCheck width={20} />}
    />
    <Chip
        label="Custom Icon" color="secondary" avatar={<Avatar >S</Avatar>}
        onDelete={handleDelete}
        deleteIcon={<IconChecks width={20} />}
    />
</InlineItemCard>`})}),b=()=>e.jsx(e.Fragment,{children:e.jsx(c,{children:`

import React from 'react';
import { 
Avatar, 
Chip, 
 }  from '@mui/material';
import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip
        label="Custom Icon" color="primary" avatar={<Avatar >M</Avatar>}
        onDelete={handleDelete}
        deleteIcon={<IconCheck width={20} />}
    />
    <Chip
        label="Custom Icon" color="secondary" avatar={<Avatar >S</Avatar>}
        onDelete={handleDelete}
        deleteIcon={<IconChecks width={20} />}
    />
</InlineItemCard>`})}),f=()=>e.jsx(e.Fragment,{children:e.jsx(c,{children:`

import React from 'react';
import { 
Avatar, 
Chip, 
}  from '@mui/material';
import { IconMoodHappy } from '@tabler/icons-react';
import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip
        label="Custom Icon" disabled avatar={<Avatar >M</Avatar>}
        onDelete={handleDelete}
    />
    <Chip
        label="Custom Icon" color="primary" disabled avatar={<Avatar >S</Avatar>}
        onDelete={handleDelete}
    />
</InlineItemCard>`})}),y=()=>e.jsx(e.Fragment,{children:e.jsx(c,{children:`

import React from 'react';
import { 
Avatar, 
Chip, 
}  from '@mui/material';
import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip label="Small" size="small" color="primary" />
    <Chip label="Normal" color="primary" />
</InlineItemCard>`})}),A=[{to:"/",title:"Home"},{title:"Chip"}],pe=()=>{const t=()=>{console.info("You clicked the delete icon.")};return e.jsxs(x,{title:"Chip",description:"this is Chip page",children:[e.jsx(u,{title:"Chip",items:A}),e.jsx(v,{title:"Accordion",children:e.jsxs(o,{container:!0,spacing:3,children:[e.jsx(o,{display:"flex",alignItems:"stretch",size:12,children:e.jsx(i,{title:"Filled",codeModel:e.jsx(C,{}),children:e.jsxs(n,{children:[e.jsx(a,{avatar:e.jsx(l,{children:"M"}),label:"Default Filled"}),e.jsx(a,{avatar:e.jsx(l,{children:"M"}),label:"Default Deletable",onDelete:t}),e.jsx(a,{avatar:e.jsx(l,{alt:"Natacha",src:s}),label:"Primary Filled",color:"primary"}),e.jsx(a,{avatar:e.jsx(l,{alt:"Natacha",src:s}),label:"Primary Deletable",color:"primary",onDelete:t}),e.jsx(a,{icon:e.jsx(r,{}),label:"Secondary Filled",color:"secondary"}),e.jsx(a,{icon:e.jsx(r,{}),label:"Secondary Deletable",color:"secondary",onDelete:t}),e.jsx(a,{avatar:e.jsx(l,{alt:"Natacha",src:d}),label:"Default Filled",color:"success"}),e.jsx(a,{avatar:e.jsx(l,{alt:"Natacha",src:d}),label:"Default Deletable",color:"success",onDelete:t}),e.jsx(a,{icon:e.jsx(r,{}),label:"Default Filled",color:"warning"}),e.jsx(a,{icon:e.jsx(r,{}),label:"Default Deletable",color:"warning",onDelete:t}),e.jsx(a,{avatar:e.jsx(l,{alt:"Natacha",src:m}),label:"Default Filled",color:"error"}),e.jsx(a,{avatar:e.jsx(l,{alt:"Natacha",src:m}),label:"Default Deletable",color:"error",onDelete:t})]})})}),e.jsx(o,{display:"flex",alignItems:"stretch",size:12,children:e.jsx(i,{title:"Outlined",codeModel:e.jsx(j,{}),children:e.jsxs(n,{children:[e.jsx(a,{variant:"outlined",avatar:e.jsx(l,{children:"M"}),label:"Default Filled"}),e.jsx(a,{variant:"outlined",avatar:e.jsx(l,{children:"M"}),label:"Default Deletable",onDelete:t}),e.jsx(a,{variant:"outlined",avatar:e.jsx(l,{alt:"Natacha",src:s}),label:"Default Filled",color:"primary"}),e.jsx(a,{variant:"outlined",avatar:e.jsx(l,{alt:"Natacha",src:s}),label:"Default Deletable",color:"primary",onDelete:t}),e.jsx(a,{variant:"outlined",icon:e.jsx(r,{}),label:"Default Filled",color:"secondary"}),e.jsx(a,{variant:"outlined",icon:e.jsx(r,{}),label:"Default Deletable",color:"secondary",onDelete:t}),e.jsx(a,{variant:"outlined",avatar:e.jsx(l,{alt:"Natacha",src:d}),label:"Default Filled",color:"success"}),e.jsx(a,{variant:"outlined",avatar:e.jsx(l,{alt:"Natacha",src:d}),label:"Default Deletable",color:"success",onDelete:t}),e.jsx(a,{variant:"outlined",icon:e.jsx(r,{}),label:"Default Filled",color:"warning"}),e.jsx(a,{variant:"outlined",icon:e.jsx(r,{}),label:"Default Deletable",color:"warning",onDelete:t}),e.jsx(a,{variant:"outlined",avatar:e.jsx(l,{alt:"Natacha",src:m}),label:"Default Filled",color:"error"}),e.jsx(a,{variant:"outlined",avatar:e.jsx(l,{alt:"Natacha",src:m}),label:"Default Deletable",color:"error",onDelete:t})]})})}),e.jsx(o,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:e.jsx(i,{title:"Custom Icon",codeModel:e.jsx(I,{}),children:e.jsxs(n,{children:[e.jsx(a,{label:"Custom Icon",color:"primary",avatar:e.jsx(l,{children:"M"}),onDelete:t,deleteIcon:e.jsx(p,{width:20})}),e.jsx(a,{label:"Custom Icon",color:"secondary",avatar:e.jsx(l,{children:"S"}),onDelete:t,deleteIcon:e.jsx(h,{width:20})})]})})}),e.jsx(o,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:e.jsx(i,{title:"Custom outlined Icon",codeModel:e.jsx(b,{}),children:e.jsxs(n,{children:[e.jsx(a,{label:"Custom Icon",variant:"outlined",color:"primary",avatar:e.jsx(l,{children:"M"}),onDelete:t,deleteIcon:e.jsx(p,{width:20})}),e.jsx(a,{label:"Custom Icon",variant:"outlined",color:"secondary",avatar:e.jsx(l,{children:"S"}),onDelete:t,deleteIcon:e.jsx(h,{width:20})})]})})}),e.jsx(o,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:e.jsx(i,{title:"Disabled",codeModel:e.jsx(f,{}),children:e.jsxs(n,{children:[e.jsx(a,{label:"Custom Icon",disabled:!0,avatar:e.jsx(l,{children:"M"}),onDelete:t}),e.jsx(a,{label:"Custom Icon",color:"primary",disabled:!0,avatar:e.jsx(l,{children:"S"}),onDelete:t})]})})}),e.jsx(o,{display:"flex",alignItems:"stretch",size:{xs:12,sm:6},children:e.jsx(i,{title:"Sizes",codeModel:e.jsx(y,{}),children:e.jsxs(n,{children:[e.jsx(a,{label:"Small",size:"small",color:"primary"}),e.jsx(a,{label:"Normal",color:"primary"})]})})})]})})]})};export{pe as default};
