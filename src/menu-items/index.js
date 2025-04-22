// import admin from './admin';
import ap from './ap';
import ar from './ar';
import basicMaster from './basicMaster';
import companySetup from './companySetup';
import dashboard from './dashboard';
import docs from './docs';
import finalReport from './FinalReport';
import finance from './finance';
import genTransaction from './GenTransaction';
import BankCash from './BankCash';
import Hidden from './Hidden';
// import { Hidden } from '@material-ui/core';

// Function to get menu items based on localStorage value
const getMenuItems = () => {
  const localStorageValue = localStorage.getItem('userType');

  // Define default menu items
  const defaultMenuItems = {
<<<<<<< HEAD
    items: [dashboard, companySetup, admin, basicMaster, genTransaction, ar, ap, finalReport, docs]
=======
    items: [dashboard, basicMaster, genTransaction, ar, ap, BankCash, finalReport, companySetup, docs, Hidden]
>>>>>>> 41a4875f600d64d081f0a6b6d27aeacf4fc9abd0
  };

  // Define menu items based on localStorage value
  switch (localStorageValue) {
    case 'ROLE_SUPER_ADMIN':
      return {
        items: [dashboard, companySetup, basicMaster]
      };
    case 'admin': // Correctly match the value
      return {
<<<<<<< HEAD
        items: [dashboard, companySetup, admin, basicMaster, genTransaction, ar, ap, finalReport, docs]
=======
        items: [dashboard, companySetup, basicMaster, genTransaction, ar, ap, finalReport, docs]
>>>>>>> 41a4875f600d64d081f0a6b6d27aeacf4fc9abd0
      };
    case 'SADMIN':
      return {
        items: [dashboard, companySetup]
      };
    // Add more cases as needed
    default:
      return defaultMenuItems; // Return default menu items if no match is found
  }
};

// Export default menu items
export default getMenuItems();
