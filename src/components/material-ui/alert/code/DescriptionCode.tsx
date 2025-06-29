import CodeDialog from 'src/components/shared/CodeDialog';
const DescriptionCode = () => {
  return (
    <>
      <CodeDialog>
        {`

import React from 'react';
import { StackTitle } from "@mui/material";

<Stack spacing={1}>
    <variant="filled" severity="error">
        <Title>Error</Title>
        This is an error alert — <strong>check it out!</strong>
    </>
    <variant="filled" severity="warning">
        <Title>Warning</Title>
        This is a warning alert — <strong>check it out!</strong>
    </>
    <variant="filled" severity="info">
        <Title>Info</Title>
        This is an info alert — <strong>check it out!</strong>
    </>
    <variant="filled" severity="success">
        <Title>Success</Title>
        This is a success alert — <strong>check it out!</strong>
    </>
</Stack>`}
      </CodeDialog>
    </>
  );
};

export default DescriptionCode;
