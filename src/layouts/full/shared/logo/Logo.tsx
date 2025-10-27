import { FC } from 'react';
import { useSelector } from 'src/store/Store';
// Use Link and useParams from react-router-dom rather than react-router.
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material';
import FoodifyLogo from 'src/assets/images/logos/foodify-logo.png';
import { AppState } from 'src/store/Store';

const Logo: FC = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  // Extract the tenantId (company code) from the current route if present.
  // When navigating via the logo we stay within the same tenant by prefixing
  // the path with `/${tenantId}`.  If no tenantId is available we fall back
  // to the root path ("/").
  const params = useParams<{ tenantId?: string }>();
  // Create a styled Link whose dimensions depend on the current layout settings.
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
  }));

  // Regardless of theme (light/dark) or direction (LTR/RTL), always show the Foodify logo.
  return (
    <LinkStyled
      to={params.tenantId ? `/${params.tenantId}` : '/'}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FoodifyLogo as string}
        alt="Foodify Logo"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </LinkStyled>
  );
};

export default Logo;
