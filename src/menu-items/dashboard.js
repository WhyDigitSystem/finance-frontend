// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = {
  IconDashboard
};

// Get screen access from localStorage safely
const screenAccess = JSON.parse(localStorage.getItem('screenAccess') || '{}');

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboardChildren = [
  {
    id: 'dashboardNew',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard/dashboard',
    icon: icons.IconDashboard,
    breadcrumbs: false,
    visible: hasScreenAccess('DB') // Replace DB with your actual Screen ID
  }
].filter((item) => item.visible !== false);

const dashboard =
  dashboardChildren.length > 0
    ? {
        id: 'dashboard',
        type: 'group',
        children: dashboardChildren
      }
    : null;

export default dashboard;