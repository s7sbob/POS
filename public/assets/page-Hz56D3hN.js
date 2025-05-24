import{j as e}from"./index-BOycD4kd.js";import{B as p}from"./Breadcrumb-BqJ4_UoQ.js";import{P as a}from"./PageContainer-97CIqrJb.js";import{u as s}from"./useTreeViewApiRef-zY2284oa.js";import{P as l}from"./ParentCard-MJIOvsrM.js";import{C as c}from"./CodeDialog-DS_2Fy2U.js";import{S as d}from"./Stack-7R2xgwnv.js";import{B as n}from"./Button-DuWWTJ1w.js";import{B as u}from"./Box-BXQ1zNTo.js";import{S as x,T as i}from"./TreeItem-CsSR1AGh.js";import{G as I}from"./Grid2-D56AonIH.js";import"./Typography-BDkkff4Z.js";import"./index-BwqtTtay.js";import"./Paper-CrmG5ZWt.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./createStack-C9SkPHjo.js";import"./useThemeProps-VRAKZLnh.js";import"./Checkbox-DP-A8Ywf.js";import"./SwitchBase-CVR3uh3U.js";import"./useFormControl-Ds-I_R6P.js";import"./Collapse-Rb_8TpUG.js";function T(){return e.jsx(c,{children:`
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks/useTreeViewApiRef';

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'ApiMethodFocusItem ',
},
];
 
export default function ApiMethodFocusItem() {
    const apiRef = useTreeViewApiRef();
    const handleButtonClick = (event: React.SyntheticEvent<Element, Event>) => {
        apiRef.current?.focusItem(event, 'pickers');
    };

    return (
     
            <Stack spacing={2}>
                <div>
                    <Button onClick={handleButtonClick}>Focus pickers item</Button>
                </div>
                <Box sx={{ minHeight: 352, minWidth: 250 }}>
                    <SimpleTreeView apiRef={apiRef}>
                        <TreeItem itemId="grid" label="Data Grid">
                            <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
                            <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
                            <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
                        </TreeItem>
                        <TreeItem itemId="pickers" label="Date and Time Pickers">
                            <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
                            <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
                        </TreeItem>
                        <TreeItem itemId="charts" label="Charts">
                            <TreeItem itemId="charts-community" label="@mui/x-charts" />
                        </TreeItem>
                        <TreeItem itemId="tree-view" label="Tree View">
                            <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
                        </TreeItem>
                    </SimpleTreeView>
                </Box>
            </Stack>
 
    );
}

            `})}function h(){const t=s(),m=o=>{var r;(r=t.current)==null||r.focusItem(o,"pickers")};return e.jsx(l,{title:"FocusItem Treeview",codeModel:e.jsx(T,{}),children:e.jsxs(d,{spacing:2,children:[e.jsx("div",{children:e.jsx(n,{onClick:m,children:"Focus pickers item"})}),e.jsx(u,{sx:{minHeight:352,minWidth:250},children:e.jsxs(x,{apiRef:t,children:[e.jsxs(i,{itemId:"grid",label:"Data Grid",children:[e.jsx(i,{itemId:"grid-community",label:"@mui/x-data-grid"}),e.jsx(i,{itemId:"grid-pro",label:"@mui/x-data-grid-pro"}),e.jsx(i,{itemId:"grid-premium",label:"@mui/x-data-grid-premium"})]}),e.jsxs(i,{itemId:"pickers",label:"Date and Time Pickers",children:[e.jsx(i,{itemId:"pickers-community",label:"@mui/x-date-pickers"}),e.jsx(i,{itemId:"pickers-pro",label:"@mui/x-date-pickers-pro"})]}),e.jsx(i,{itemId:"charts",label:"Charts",children:e.jsx(i,{itemId:"charts-community",label:"@mui/x-charts"})}),e.jsx(i,{itemId:"tree-view",label:"Tree View",children:e.jsx(i,{itemId:"tree-view-community",label:"@mui/x-tree-view"})})]})})]})})}const f=[{to:"/",title:"Home"},{title:"SimpleTreeView "}],de=()=>e.jsxs(a,{title:"SimpleTreeView",description:"this is SimpleTreeView ",children:[e.jsx(p,{title:"SimpleTreeView",items:f}),e.jsx(I,{container:!0,spacing:3,children:e.jsx(h,{})})]});export{de as default};
