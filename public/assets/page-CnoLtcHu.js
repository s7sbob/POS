import{j as e,r as u}from"./index-BOycD4kd.js";import{B as I}from"./Breadcrumb-BqJ4_UoQ.js";import{P as h}from"./PageContainer-97CIqrJb.js";import{C as l}from"./CodeDialog-DS_2Fy2U.js";import{P as s}from"./ParentCard-MJIOvsrM.js";import{S as o}from"./Stack-7R2xgwnv.js";import{B as n}from"./Button-DuWWTJ1w.js";import{B as p}from"./Box-BXQ1zNTo.js";import{S as c,T as i}from"./TreeItem-CsSR1AGh.js";import{u as T}from"./useTreeViewApiRef-zY2284oa.js";import{G as g}from"./Grid2-D56AonIH.js";import"./Typography-BDkkff4Z.js";import"./index-BwqtTtay.js";import"./Paper-CrmG5ZWt.js";import"./useSlotProps-TYhxs4KB.js";import"./IconCircle-CwxeJJOj.js";import"./createReactComponent-DJ-alZeM.js";import"./Link-DehrJQLa.js";import"./Tooltip-DKFlwfZ_.js";import"./useSlot-C8hSq5RO.js";import"./Popper-CDUIbv4Q.js";import"./useId-B1jnamIH.js";import"./Portal-Dipjj-39.js";import"./utils-C9LLcjVj.js";import"./getReactElementRef-DEfyDt09.js";import"./useControlled-CGXnS8Tc.js";import"./Grow-DaxZ4x-g.js";import"./IconButton-C9FWHOCN.js";import"./DialogContent-Cg8VwAnA.js";import"./Modal-CIgidMPB.js";import"./ownerWindow-dn6wgS8C.js";import"./createChainedFunction-BO_9K8Jh.js";import"./DialogTitle-CprCRf0c.js";import"./IconX-DtIYRj_S.js";import"./toConsumableArray-BiloOGAC.js";import"./Card-Bhf9_j_x.js";import"./CardHeader-DXleoe24.js";import"./Divider-CZ0X2mWw.js";import"./dividerClasses-BAp1ZLUP.js";import"./CardContent--aLPNTp8.js";import"./createStack-C9SkPHjo.js";import"./useThemeProps-VRAKZLnh.js";import"./Checkbox-DP-A8Ywf.js";import"./SwitchBase-CVR3uh3U.js";import"./useFormControl-Ds-I_R6P.js";import"./Collapse-Rb_8TpUG.js";function k(){return e.jsx(l,{children:`
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'ControlledExpansionTree ',
},
]; 


function ControlledExpansionTree() {
    const [expandedItems, setExpandedItems] = React.useState<any>([]);

    const handleExpandedItemsChange = (event: any, itemIds: any) => {
        setExpandedItems(itemIds);
    };

    const handleExpandClick = () => {
        setExpandedItems((oldExpanded: string | any[]) =>
            oldExpanded.length === 0
                ? [
                    'grid',
                    'grid-community',
                    'grid-pro',
                    'grid-premium',
                    'pickers',
                    'pickers-community',
                    'pickers-pro',
                    'charts',
                    'charts-community',
                    'tree-view',
                    'tree-view-community',
                ]
                : [],
        );
    };
    return (
            <Stack spacing={2}>
                <div>
                    <Button onClick={handleExpandClick}>
                        {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
                    </Button>
                </div>
                <Box sx={{ minHeight: 352, minWidth: 250 }}>
                    <SimpleTreeView
                        expandedItems={expandedItems}
                        onExpandedItemsChange={handleExpandedItemsChange}
                    >
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
     
    )
}

export default ControlledExpansionTree
              `})}function f(){const[t,m]=u.useState([]),a=(d,x)=>{m(x)},r=()=>{m(d=>d.length===0?["grid","grid-community","grid-pro","grid-premium","pickers","pickers-community","pickers-pro","charts","charts-community","tree-view","tree-view-community"]:[])};return e.jsx(s,{title:"Expansion Treeview",codeModel:e.jsx(k,{}),children:e.jsxs(o,{spacing:2,children:[e.jsx("div",{children:e.jsx(n,{onClick:r,children:t.length===0?"Expand all":"Collapse all"})}),e.jsx(p,{sx:{minHeight:352,minWidth:250},children:e.jsxs(c,{expandedItems:t,onExpandedItemsChange:a,children:[e.jsxs(i,{itemId:"grid",label:"Data Grid",children:[e.jsx(i,{itemId:"grid-community",label:"@mui/x-data-grid"}),e.jsx(i,{itemId:"grid-pro",label:"@mui/x-data-grid-pro"}),e.jsx(i,{itemId:"grid-premium",label:"@mui/x-data-grid-premium"})]}),e.jsxs(i,{itemId:"pickers",label:"Date and Time Pickers",children:[e.jsx(i,{itemId:"pickers-community",label:"@mui/x-date-pickers"}),e.jsx(i,{itemId:"pickers-pro",label:"@mui/x-date-pickers-pro"})]}),e.jsx(i,{itemId:"charts",label:"Charts",children:e.jsx(i,{itemId:"charts-community",label:"@mui/x-charts"})}),e.jsx(i,{itemId:"tree-view",label:"Tree View",children:e.jsx(i,{itemId:"tree-view-community",label:"@mui/x-tree-view"})})]})})]})})}function b(){return e.jsx(l,{children:`
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
            
const BCrumb = [
{
to: '/',
title: 'Home',
},
{
title: 'ApiMethodSetItemExpansion ',
},
]; 

export default function ApiMethodSetItemExpansion() {
    const apiRef = useTreeViewApiRef();

     const handleExpandClick = (event: React.SyntheticEvent<Element, Event>) => {
        if (apiRef.current) {
            apiRef.current.setItemExpansion(event, 'grid', true);
        }
    };

    const handleCollapseClick = (event: React.SyntheticEvent<Element, Event>) => {
        if (apiRef.current) {
            apiRef.current.setItemExpansion(event, 'grid', false);
        }
    };

    return (
            <Stack spacing={2}>
                <Stack spacing={2} direction="row">
                    <Button onClick={handleExpandClick}>Expand Data Grid</Button>
                    <Button onClick={handleCollapseClick}>Collapse Data Grid</Button>
                </Stack>
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


`})}function j(){const t=T(),m=r=>{t.current&&t.current.setItemExpansion(r,"grid",!0)},a=r=>{t.current&&t.current.setItemExpansion(r,"grid",!1)};return e.jsx(s,{title:"SetItemExpansion Treeview",codeModel:e.jsx(b,{}),children:e.jsxs(o,{spacing:2,children:[e.jsxs(o,{spacing:2,direction:"row",children:[e.jsx(n,{onClick:m,children:"Expand Data Grid"}),e.jsx(n,{onClick:a,children:"Collapse Data Grid"})]}),e.jsx(p,{sx:{minHeight:352,minWidth:250},children:e.jsxs(c,{apiRef:t,children:[e.jsxs(i,{itemId:"grid",label:"Data Grid",children:[e.jsx(i,{itemId:"grid-community",label:"@mui/x-data-grid"}),e.jsx(i,{itemId:"grid-pro",label:"@mui/x-data-grid-pro"}),e.jsx(i,{itemId:"grid-premium",label:"@mui/x-data-grid-premium"})]}),e.jsxs(i,{itemId:"pickers",label:"Date and Time Pickers",children:[e.jsx(i,{itemId:"pickers-community",label:"@mui/x-date-pickers"}),e.jsx(i,{itemId:"pickers-pro",label:"@mui/x-date-pickers-pro"})]}),e.jsx(i,{itemId:"charts",label:"Charts",children:e.jsx(i,{itemId:"charts-community",label:"@mui/x-charts"})}),e.jsx(i,{itemId:"tree-view",label:"Tree View",children:e.jsx(i,{itemId:"tree-view-community",label:"@mui/x-tree-view"})})]})})]})})}const w=[{to:"/",title:"Home"},{title:"SimpleTreeView "}],he=()=>e.jsxs(h,{title:"SimpleTreeView",description:"this is SimpleTreeView ",children:[e.jsx(I,{title:"SimpleTreeView",items:w}),e.jsxs(g,{container:!0,spacing:3,children:[e.jsx(f,{}),e.jsx(j,{})]})]});export{he as default};
