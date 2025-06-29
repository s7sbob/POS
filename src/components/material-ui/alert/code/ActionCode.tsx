import CodeDialog from 'src/components/shared/CodeDialog';
const ActionCode = () => {
  return (
    <>
      <CodeDialog>
        {`

import React from 'react';
import {
  Stack,
  Button
} from "@mui/material";

<Stack spacing={1}>
    <variant="filled" severity="warning">
        This is a success alert — check it out!
    </>
    <variant="filled"
        severity="info"
        action={
            <Button color="inherit" size="small">
                UNDO
            </Button>
        }
    >
        This is a success alert — check it out!
    </>
</Stack>`}
      </CodeDialog>
    </>
  );
};

export default ActionCode;
