import { useRoutes } from 'react-router-dom';

// routes
import AdminRoute from './AdminRoute';
import AuthenticationRoutes from './AuthenticationRoutes';
import FinanceRoute from './FinanceRoute';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AuthenticationRoutes, FinanceRoute, AdminRoute]);
}
