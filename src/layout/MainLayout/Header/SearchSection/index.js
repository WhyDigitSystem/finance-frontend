import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material-UI components
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Third-party components
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// Project imports
import Transitions from 'ui-component/extended/Transitions';

// Assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';

// Screens list

const screens = [
  { name: 'Dashboard', path: '/' },
  { name: 'Set Tax Rate', path: '/Finance/SetTaxRate' },
  { name: 'Party', path: '/finance/partyMaster' },
  { name: 'Tax', path: '/finance/taxMaster' },
  { name: 'Taxes', path: '/Finance/Taxes' },
  { name: 'TCS Master', path: '/Finance/tcsMaster/TcsMaster' },
  { name: 'TDS', path: '/finance/tdsMaster/TdsMaster' },
  { name: 'HSN SAC', path: '/finance/HsnSacCode' },
  { name: 'Product Service', path: '/finance/ProductService' },
  { name: 'HSN SAC Codes Listing', path: '/Finance/HsnSacCodesListing' },
  { name: 'COA', path: '/finance/Group' },
  { name: 'Account', path: '/Finance/account/Account' },
  { name: 'Ex Rates', path: '/finance/daily/DailyRate' },
  { name: 'Sub Ledger Account', path: '/Finance/SubLedgerAccount' },
  { name: 'Cost Centre Value', path: '/finance/costcenter/CostCentre' },
  { name: 'Create Party', path: '/finance/createPartyMaster' },
  { name: 'Daily Rate', path: '/Finance/daily/DailyRate' },
  { name: 'Cost center', path: '/finance/chartOfCostcenter/ChartOfCostcenter' },
  { name: 'BRS Opening', path: '/finance/BRSOpening' },
  { name: 'AR Bill Balance', path: '/Finance/receiptAr/ArBillBalance' },
  { name: 'Cheque Book Master', path: '/Finance/chequeBookMaster/ChequeBookMaster' },
  { name: 'GL Opening Balance', path: '/Finance/glOpening/GlOpening' },
  { name: 'Fund Transfer', path: '/finance/FundTransfer' },
  { name: 'General Journal', path: '/finance/GeneralJournal/GeneralJournal' },
  { name: 'Receipt', path: '/finance/receipt/Receipt' },
  { name: 'AR Offset', path: '/finance/AR-adjustment' },
  { name: 'AR Outstanding', path: '/finance/AR-outstanding' },
  { name: 'AR Ageing', path: '/finance/AR-aging' },
  { name: 'Payment', path: '/finance/payment/Payment' },
  { name: 'AP Offset', path: '/finance/AP-adjustment' },
  { name: 'AP Outstanding with aging Report', path: '/finance/paymentRegister/PaymentRegister' },
  { name: 'AP Bill Balance', path: '/finance/payment/ApBillBalance' },
  { name: 'Reconcile Bank', path: '/finance/Reconcile/Reconcile' },
  { name: 'Receipt Register', path: '/Finance/receiptRegister/ReceiptRegister' },
  { name: 'Payment Register', path: '/Finance/paymentRegister/PaymentRegister' },
  { name: 'Reconciliation Summary', path: '/Finance/ReconciliationSummaryReport/ReconciliationSummary' },
  // { name: 'Document Type Master', path: '/Finance/DocumentTypeMaster' },
  // { name: 'Document Type Mapping Master', path: '/Finance/DocumentTypeMappingMaster' },
  // { name: 'Multiple Document Id Generation Master', path: '/Finance/MultipleDocumentIdGeneration' },
  { name: 'Doc Type', path: '/finance/DocumentType/documentType' },
  { name: 'Doc Mapping', path: '/finance/DocumentType/documentTypeMapping' },
  { name: 'Multi Doc', path: '/finance/DocumentType/multipleDocumentIdGeneration' },
  { name: 'Reconcile Cash', path: '/finance/Reconcile/ReconcileCash' },
  { name: 'Reconcile-FX', path: '/finance/Reconcile/ReconcileCorp' },
  { name: 'Card', path: '/finance/JobCard' },
  { name: 'New Entity', path: '/companysetup/createcompany' },
  { name: 'User Creation', path: '/admin/user-creation/userCreation' },
  { name: 'Company Setup', path: '/companysetup/companysetup' },
  { name: 'Country', path: '/basicMaster/country' },
  { name: 'State', path: '/basicMaster/state' },
  { name: 'City', path: '/basicMaster/city' },
  { name: 'Currency', path: '/basicMaster/currency' },
  { name: 'Region', path: '/basicMaster/RegionMaster' },
  { name: 'Department', path: '/basicMaster/Department' },
  { name: 'Designation', path: '/basicMaster/Designation' },
  { name: 'FinYear', path: '/basicMaster/finYear' },
  { name: 'Roles And Responsibilities', path: '/basicMaster/roles' },
  { name: 'Screens', path: '/basicMaster/ScreenNames' },
  { name: 'Employee', path: '/basicMaster/employee' },
  { name: 'Charges', path: '/finance/ChargeTypeRequest' },
  { name: 'Tax Invoice', path: '/finance/taxInvoice/taxInvoiceDetail' },
  { name: 'Credit Note', path: '/finance/creditNote/creditNoteDetail' },
  { name: 'Sales Register', path: '/finance/taxInvoice/TaxRegister' },
  { name: 'Cost Invoice', path: '/finance/costInvoice/CostInvoice' },
  { name: 'Debit Note', path: '/finance/costDebitNote/CostDebitNote' },
  { name: 'R Cost Invoice', path: '/finance/RCostInvoicegna/RCostInvoicegna' },
  { name: 'UR Cost Invoice', path: '/finance/UrCostInvoicegna/UrCostInvoicegna' },
  { name: 'Cost Register', path: '/finance/costInvoice/CostRegister' },
  { name: 'List Of Values', path: '/finance/listOfValues/listOfValues' },
  { name: 'Payment Voucher', path: '/finance/paymentVoucher/paymentVoucher' },
  { name: 'AR/AP Detail', path: '/Finance/ARAP-Details' },
  { name: 'AR/AP Adjustment', path: '/Finance/APAP-Adjustment' },
  { name: 'Adjustment Journal', path: '/finance/AdjustmentJournal' },
  { name: 'Deposit', path: '/finance/Deposit' },
  { name: 'Withdrawal', path: '/finance/Withdrawal' },
  { name: 'Customer', path: '/finance/customer' },
  { name: 'Vendor', path: '/finance/vendor' },
  { name: 'Party Ledger', path: '/finance/FinalReport/PartyLedger' },
  { name: 'Ledger Report', path: '/finance/FinalReport/LedgerReport' },
  { name: 'TrailBalance', path: '/finance/FinalReport/TrailBalance' },
  { name: 'Payment Register', path: '/finance/FinalReport/PaymentReport' },
  { name: 'Receipt Register', path: '/finance/FinalReport/ReceiptReport' },
  { name: 'Material Issue Manifest', path: '/docs/materialIssueManifest' },
  { name: 'Retrieval Manifest', path: '/docs/RetrievalIssueManifest' },
  { name: 'Asset Type', path: '/docs/assetType' },
  { name: 'Asset Category', path: '/docs/assetCategory' },
  { name: 'Create Asset', path: '/docs/createAsset' },
  { name: 'Create Kit', path: '/docs/createKit' },
  { name: 'Purchase Order', path: '/docs/purchaseOrder' },
  { name: 'Quotation', path: '/docs/Quotation' },
  { name: 'Contra Voucher', path: '/Finance/ContraVoucher' }
];

// Styled Components
const PopperStyle = styled(Popper)(({ theme }) => ({
  zIndex: 1300, // Higher than default to ensure it overlays other components
  width: '100%',
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  position: 'absolute'
}));

const OutlineInputStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 434,
  marginLeft: 16,
  paddingLeft: 16,
  paddingRight: 16,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('lg')]: {
    width: 250
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 4,
    background: '#fff'
  }
}));

const HeaderAvatarStyle = styled(Avatar)(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  '&:hover': {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.light
  }
}));

const SearchResultsPaper = styled(Paper)(({ theme }) => ({
  maxHeight: 300,
  overflowY: 'auto',
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius
}));

// Mobile Search Component
const MobileSearch = ({ value, setValue, popupState }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSearch = (screen) => {
    navigate(screen.path);
    setValue(''); // Clear the search input value
    popupState.close(); // Close the popup after selection
  };

  const filteredScreens = screens.filter((screen) => screen.name.toLowerCase().includes(value.toLowerCase()));

  return (
    <>
      <OutlineInputStyle
        id="input-search-header"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
            <ButtonBase sx={{ borderRadius: '12px', mr: 1 }}>
              <HeaderAvatarStyle variant="rounded">
                <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
              </HeaderAvatarStyle>
            </ButtonBase>
            <ButtonBase sx={{ borderRadius: '12px' }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  background: theme.palette.orange.light,
                  color: theme.palette.orange.dark,
                  '&:hover': {
                    background: theme.palette.orange.dark,
                    color: theme.palette.orange.light
                  }
                }}
                {...bindToggle(popupState)}
              >
                <IconX stroke={1.5} size="1.3rem" />
              </Avatar>
            </ButtonBase>
          </InputAdornment>
        }
        aria-describedby="search-helper-text"
        inputProps={{ 'aria-label': 'search' }}
      />
      {value && filteredScreens.length > 0 && (
        <SearchResultsPaper>
          <List>
            {filteredScreens.map((screen) => (
              <ListItem key={screen.path} disablePadding>
                <ListItemButton onClick={() => handleSearch(screen)}>
                  <ListItemText primary={screen.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </SearchResultsPaper>
      )}
      {value && filteredScreens.length === 0 && (
        <SearchResultsPaper>
          <List>
            <ListItem>
              <ListItemText primary="No results found" />
            </ListItem>
          </List>
        </SearchResultsPaper>
      )}
    </>
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  popupState: PropTypes.object.isRequired
};

// Desktop Search Component
const DesktopSearch = ({ value, setValue }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSearch = (screen) => {
    navigate(screen.path);
    setValue(''); // Clear the search input value
    window.location.reload(); // Optional: Consider if you really need to reload the page
  };

  const filteredScreens = screens.filter((screen) => screen.name.toLowerCase().includes(value.toLowerCase()));

  return (
    <Box sx={{ position: 'relative' }}>
      <OutlineInputStyle
        id="input-search-header"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        sx={{ width: "250px", height: '35px' }} // Adjust width as needed
        startAdornment={
          <InputAdornment position="start">
            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
            <ButtonBase sx={{ borderRadius: '12px', mr: 1 }}>
              <HeaderAvatarStyle variant="rounded" sx={{height: '25px', width: '25px'}}>
                <IconAdjustmentsHorizontal stroke={1.5} size="1.1rem" />
              </HeaderAvatarStyle>
            </ButtonBase>
          </InputAdornment>
        }
        aria-describedby="search-helper-text"
        inputProps={{ 'aria-label': 'search' }}
      />
      {value && (
        <SearchResultsPaper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            ml: 2,
            zIndex: 1600
          }}
        >
          <List>
            {filteredScreens.length > 0 ? (
              filteredScreens.map((screen) => (
                <ListItem key={screen.path} disablePadding>
                  <ListItemButton onClick={() => handleSearch(screen)}>
                    <ListItemText primary={screen.name} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No results found" />
              </ListItem>
            )}
          </List>
        </SearchResultsPaper>
      )}
    </Box>

  );
};

DesktopSearch.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired
};

// Main SearchSection Component
const SearchSection = () => {
  const [value, setValue] = useState('');
  const theme = useTheme();

  return (
    <>
      {/* Mobile Search */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
        <PopupState variant="popper" popupId="mobile-search-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                  <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                    <IconSearch stroke={1.5} size="1.2rem" />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </Box>
              <PopperStyle {...bindPopper(popupState)} transition placement="bottom-start">
                {({ TransitionProps }) => (
                  <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                    <Card
                      sx={{
                        background: '#fff',
                        [theme.breakpoints.down('sm')]: {
                          border: 0,
                          boxShadow: 'none'
                        },
                        width: '100%'
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item xs>
                            <MobileSearch value={value} setValue={setValue} popupState={popupState} />
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </Transitions>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>

      {/* Desktop Search */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
        <DesktopSearch value={value} setValue={setValue} />
      </Box>
    </>
  );
};

export default SearchSection;
