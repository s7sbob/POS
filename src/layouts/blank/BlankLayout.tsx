import { Outlet } from 'react-router';
import TenantPrefixGuard from 'src/components/TenantPrefixGuard';
import LoadingBar from '../../LoadingBar';

const BlankLayout = () => (
  <>
    <LoadingBar />
    <TenantPrefixGuard>
      <Outlet />
    </TenantPrefixGuard>
  </>
);

export default BlankLayout;
