import { redirect } from 'react-router-dom';
import { isAuthValid } from 'src/utils/auth';

export const authLoader = () => {
  if (!isAuthValid()) return redirect('/auth/login');
  return null;  // مسموح
};
