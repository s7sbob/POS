import CodeDialog from 'src/components/shared/CodeDialog';
const OutlinedCode = () => {
  return (
    <>
      <CodeDialog>
        {`

import React from 'react';
import {
  Stack
} from "@mui/material";

<Stack spacing={1}>
    <variant="outlined" severity="error">
        This is an error alert — check it out!
    </>
    <variant="outlined" severity="warning">
        This is a warning alert — check it out!
    </>
    <variant="outlined" severity="info">
        This is an info alert — check it out!
    </>
    <variant="outlined" severity="success">
        This is a success alert — check it out!
    </>
</Stack>`}
      </CodeDialog>
    </>
  );
};

export default OutlinedCode;
