/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React from 'react';
import { Box, Stack, Button, Typography, FormGroup, FormControlLabel } from '@mui/material';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { Link } from 'react-router';

interface Props {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
  onSubmit: (phone: string, password: string) => void;   // <── هنا
}

const AuthLogin: React.FC<Props> = ({ subtitle, subtext, onSubmit }) => {
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(phone, password);
  };

  return (
    <>
      {subtext}

      <form onSubmit={handle}>
        <Stack spacing={2}>
          <Box>
            <CustomFormLabel htmlFor="phone">Phone</CustomFormLabel>
            <CustomTextField id="phone" fullWidth value={phone} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPhone(e.target.value)} />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomTextField id="password" type="password" fullWidth value={password} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)} />
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormGroup>
              <FormControlLabel control={<CustomCheckbox defaultChecked />} label="Remember me" />
            </FormGroup>
            <Typography component={Link} to="/auth/forgot-password" sx={{ color: 'primary.main', textDecoration: 'none' }}>
              Forgot password?
            </Typography>
          </Stack>

          <Button variant="contained" type="submit" fullWidth>Sign In</Button>
        </Stack>
      </form>

      {subtitle}
    </>
  );
};

export default AuthLogin;
