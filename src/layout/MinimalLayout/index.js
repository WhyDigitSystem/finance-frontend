import { Outlet } from 'react-router-dom';

// project imports
import Customization from '../SupportCenter/Index';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => (
  <>
    <Outlet />
    <Customization />
  </>
);

export default MinimalLayout;
