// assets
import {
  IconCashBanknote,
  IconDatabaseStar,
  IconKey,
  IconWorldPin,
  IconUserPlus,
  IconBuildingFactory2,
  IconIdBadge2,
  IconLayoutDashboard,
  IconBriefcase,
  IconMapQuestion
} from '@tabler/icons-react';
import {
  GroupsOutlined,
  PersonPinOutlined,
  ArchiveOutlined,
  ChecklistRtlOutlined,
  AccountBalanceWalletOutlined,
  AccountBalanceOutlined,
  QrCodeOutlined,
  AttachMoneyOutlined,
  RequestQuoteOutlined,
  BuildCircleOutlined,
  AccountTreeOutlined,
  PersonAddAlt1Outlined,
  Inventory2Outlined
} from '@mui/icons-material';

// constants
const icons = { IconKey };
const icons1 = { IconWorldPin };
const icons2 = { IconDatabaseStar };
const icons3 = { IconCashBanknote };
const icons4 = { IconBuildingFactory2 };
const icons5 = { IconUserPlus };
const icons6 = { IconIdBadge2 };
const icons7 = { IconLayoutDashboard };
const icons8 = { IconBriefcase };
const icons9 = { IconMapQuestion };
const icons10 = { GroupsOutlined };
const icons11 = { PersonPinOutlined };
const icons12 = { ArchiveOutlined };
const icons13 = { ChecklistRtlOutlined };
const icons14 = { AccountBalanceWalletOutlined };
const icons15 = { AccountBalanceOutlined };
const icons16 = { QrCodeOutlined };
const icons17 = { AttachMoneyOutlined };
const icons18 = { RequestQuoteOutlined };
const icons19 = { BuildCircleOutlined };
const icons20 = { AccountTreeOutlined };
const icons21 = { PersonAddAlt1Outlined };
const icons22 = { Inventory2Outlined };

// Get screen access from localStorage
const screenAccess = JSON.parse(localStorage.getItem('screenAccess'));

const hasScreenAccess = (screenId) => {
  const access = screenAccess?.[screenId];
  return access?.canRead || access?.canWrite || access?.canDelete;
};

// Dashboard menu items
const basicMaster = {
  id: 'basicMaster',
  title: '',
  caption: 'Master',
  type: 'group',
  children: [
    {
      id: 'basicMaster',
      title: 'Admin',
      type: 'collapse',
      icon: icons7.IconLayoutDashboard,
      children: [
        // Basic Master (conditional)
        ...(function () {
          const basicChildren = [
            {
              id: 'country',
              title: 'Country',
              type: 'item',
              url: '/basicMaster/country',
              icon: icons1.IconWorldPin,
              visible: hasScreenAccess('CU')
            },
            {
              id: 'state',
              title: 'State',
              type: 'item',
              url: '/basicMaster/state',
              icon: icons1.IconWorldPin,
              visible: hasScreenAccess('ST')
            },
            {
              id: 'city',
              title: 'City',
              type: 'item',
              url: '/basicMaster/city',
              icon: icons1.IconWorldPin,
              visible: hasScreenAccess('CY')
            },
            {
              id: 'currency',
              title: 'Currency',
              type: 'item',
              url: '/basicMaster/currency',
              icon: icons3.IconCashBanknote,
              visible: hasScreenAccess('CUR')
            },
            {
              id: 'region',
              title: 'Region',
              type: 'item',
              url: '/basicMaster/RegionMaster',
              icon: icons9.IconMapQuestion,
              visible: hasScreenAccess('RE')
            },
            {
              id: 'department',
              title: 'Department',
              type: 'item',
              url: '/basicMaster/Department',
              icon: icons4.IconBuildingFactory2,
              visible: hasScreenAccess('DEPT')
            },
            {
              id: 'designation',
              title: 'Designation',
              type: 'item',
              url: '/basicMaster/Designation',
              icon: icons6.IconIdBadge2,
              visible: hasScreenAccess('DES')
            },
            {
              id: 'employee',
              title: 'Employee',
              type: 'item',
              url: '/basicMaster/employee',
              icon: icons5.IconUserPlus,
              visible: hasScreenAccess('EMP')
            }
          ].filter((item) => item.visible !== false);

          return basicChildren.length
            ? [
                {
                  id: 'ar',
                  title: 'Basic Master',
                  type: 'collapse',
                  icon: icons2.IconDatabaseStar,
                  children: basicChildren
                }
              ]
            : [];
        })(),

        // Business Master (conditional)
        ...(function () {
          const businessChildren = [
            {
              id: 'partyMaster',
              title: 'Party',
              type: 'item',
              url: '/finance/partyMaster',
              icon: icons10.GroupsOutlined,
              visible: hasScreenAccess('PARTY')
            },
            {
              id: 'customer',
              title: 'Customer',
              type: 'item',
              url: '/finance/customer',
              icon: icons11.PersonPinOutlined,
              visible: hasScreenAccess('CUS')
            },
            {
              id: 'vendor',
              title: 'Vendor',
              type: 'item',
              url: '/finance/vendor',
              icon: icons12.ArchiveOutlined,
              visible: hasScreenAccess('VN')
            },
            {
              id: 'listOfValues',
              title: 'List Of Values',
              type: 'item',
              url: '/finance/listOfValues/listOfValues',
              icon: icons13.ChecklistRtlOutlined,
              visible: hasScreenAccess('LOV')
            },
            {
              id: 'group',
              title: 'COA',
              type: 'item',
              url: '/finance/Group',
              icon: icons14.AccountBalanceWalletOutlined,
              visible: hasScreenAccess('COA')
            },
            {
              id: 'tdsMaster',
              title: 'TDS',
              type: 'item',
              url: '/finance/tdsMaster/TdsMaster',
              icon: icons15.AccountBalanceOutlined,
              visible: hasScreenAccess('TDS')
            },
            {
              id: 'hsnSacCode',
              title: 'HSN SAC',
              type: 'item',
              url: '/finance/HsnSacCode',
              icon: icons16.QrCodeOutlined,
              visible: hasScreenAccess('HSNSACCODE')
            },
            {
              id: 'chargeTypeRequest',
              title: 'Charges',
              type: 'item',
              url: '/finance/ChargeTypeRequest',
              icon: icons17.AttachMoneyOutlined,
              visible: hasScreenAccess('CHARGES')
            },
            {
              id: 'taxMaster',
              title: 'Tax',
              type: 'item',
              url: '/finance/taxMaster',
              icon: icons18.RequestQuoteOutlined,
              visible: hasScreenAccess('TAX')
            },
            {
              id: 'productService',
              title: 'Product Service',
              type: 'item',
              url: '/finance/ProductService',
              icon: icons19.BuildCircleOutlined,
              visible: hasScreenAccess('PS')
            },
            {
              id: 'costCenter',
              title: 'Cost Center Values',
              type: 'item',
              url: '/finance/costcenter/CostCentre',
              icon: icons20.AccountTreeOutlined,
              visible: hasScreenAccess('CC')
            },
            {
              id: 'createPartyMaster',
              title: 'Create Party',
              type: 'item',
              url: '/finance/createPartyMaster',
              icon: icons21.PersonAddAlt1Outlined,
              visible: hasScreenAccess('CP')
            }
          ].filter((item) => item.visible !== false);

          return businessChildren.length
            ? [
                {
                  id: 'finance',
                  title: 'Business Master',
                  type: 'collapse',
                  icon: icons8.IconBriefcase,
                  children: businessChildren
                }
              ]
            : [];
        })()
      ].filter(Boolean) // ensure `children` of Admin is non-empty
    }
  ].filter((item) => item.children?.length > 0) // ensures Admin is also hidden if empty
};

export default basicMaster;
