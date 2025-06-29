// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { IconX } from "@tabler/icons-react";
import { Grid2 as Grid, Stack, Button, IconButton, CollapseTitle } from '@mui/material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import ChildCard from 'src/components/shared/ChildCard';

import FilledCode from "src/components/material-ui/alert/code/FilledCode";
import OutlinedCode from "src/components/material-ui/alert/code/OutlinedCode";
import DescriptionCode from "src/components/material-ui/alert/code/DescriptionCode";
import ActionCode from "src/components/material-ui/alert/code/ActionCode";
import TransitionCode from "src/components/material-ui/alert/code/TransitionCode";

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '',
  },
];

const Ex= () => {
  const [open, setOpen] = React.useState(true);

  return (
    (<PageContainer title="" description="this ispage">
      {/* breadcrumb */}
      <Breadcrumb title="" items={BCrumb} />
      {/* end breadcrumb */}
      {/* ------------------------- row 1 ------------------------- */}
      <ParentCard title="">
        <Grid container spacing={3}>
          {/* --------------------------------------------------------------------------------- */}
          {/* Filled*/}
          {/* --------------------------------------------------------------------------------- */}
          <Grid display="flex" alignItems="stretch" size={12}>
            <ChildCard title="Filled" codeModel={<FilledCode />}>
              <Stack spacing={1}>
                <variant="filled" severity="error">
                  This is an error alert — check it out!
                </>
                <variant="filled" severity="warning">
                  This is a warning alert — check it out!
                </>
                <variant="filled" severity="info">
                  This is an info alert — check it out!
                </>
                <variant="filled" severity="success">
                  This is a success alert — check it out!
                </>
              </Stack>
            </ChildCard>
          </Grid>
          {/* --------------------------------------------------------------------------------- */}
          {/* Outlined*/}
          {/* --------------------------------------------------------------------------------- */}
          <Grid display="flex" alignItems="stretch" size={12}>
            <ChildCard title="Outlined" codeModel={<OutlinedCode />}>
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
              </Stack>
            </ChildCard>
          </Grid>
          {/* --------------------------------------------------------------------------------- */}
          {/* Description*/}
          {/* --------------------------------------------------------------------------------- */}
          <Grid display="flex" alignItems="stretch" size={12}>
            <ChildCard title="Description" codeModel={<DescriptionCode />}>
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
              </Stack>
            </ChildCard>
          </Grid>
          {/* --------------------------------------------------------------------------------- */}
          {/* Action*/}
          {/* --------------------------------------------------------------------------------- */}
          <Grid display="flex" alignItems="stretch" size={12}>
            <ChildCard title="Action" codeModel={<ActionCode />}>
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
              </Stack>
            </ChildCard>
          </Grid>
          {/* --------------------------------------------------------------------------------- */}
          {/* Transition*/}
          {/* --------------------------------------------------------------------------------- */}
          <Grid display="flex" alignItems="stretch" size={12}>
            <ChildCard title="Transition" codeModel={<TransitionCode />}>
              <Stack spacing={1}>
                <Collapse in={open}>
                  <variant="filled"
                    severity="info"
                    sx={{ mb: 1 }}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <IconX width={20} />
                      </IconButton>
                    }
                  >
                    Close me!
                  </>
                </Collapse>
              </Stack>
              <Button
                disabled={open}
                variant="contained"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Re-open
              </Button>
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>)
  );
};

export default Ex;
