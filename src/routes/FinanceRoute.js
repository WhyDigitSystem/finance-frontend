import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// login option 3 routing
// const Fin1 = Loadable(lazy(() => import('views/Finance')));
const SetTaxRate = Loadable(lazy(() => import('views/Finance/SetTaxRate')));
const TaxMaster = Loadable(lazy(() => import('views/Finance/TaxMaster')));
const Taxes = Loadable(lazy(() => import('views/Finance/Taxes')));
const TcsMaster = Loadable(lazy(() => import('views/Finance/tcsMaster/TcsMaster')));
const TdsMaster = Loadable(lazy(() => import('views/Finance/tdsMaster/TdsMaster')));
const HsnSacCode = Loadable(lazy(() => import('views/Finance/HsnSacCode')));
const HsnSacCodesListing = Loadable(lazy(() => import('views/Finance/HsnSacCodesListing')));
const Group = Loadable(lazy(() => import('views/Finance/Group')));
const Account = Loadable(lazy(() => import('views/Finance/account/Account')));
const ExRates = Loadable(lazy(() => import('views/Finance/ExRates')));
const SubLedgerAccount = Loadable(lazy(() => import('views/Finance/SubLedgerAcount')));
const CostCentre = Loadable(lazy(() => import('views/Finance/costcenter/CostCentre')));
const Daily = Loadable(lazy(() => import('views/Finance/daily/DailyRate')));
const ChartOfCostcenter = Loadable(lazy(() => import('views/Finance/chartOfCostcenter/ChartOfCostcenter')));
const BRSOpening = Loadable(lazy(() => import('views/Finance/BRSOpening')));
const ArApBill = Loadable(lazy(() => import('views/Finance/ArApBill')));
const ChequeBookMaster = Loadable(lazy(() => import('views/Finance/chequeBookMaster/ChequeBookMaster')));
const GLOpeningBalance = Loadable(lazy(() => import('views/Finance/glOpening/GlOpening')));
const FundTransfer = Loadable(lazy(() => import('views/Finance/FundTransfer')));
const GeneralJournal = Loadable(lazy(() => import('views/Finance/GeneralJournal/GeneralJournal')));
const Receipt = Loadable(lazy(() => import('views/Finance/receipt/Receipt')));
const Payment = Loadable(lazy(() => import('views/Finance/payment/Payment')));
const Reconcile = Loadable(lazy(() => import('views/Finance/Reconcile/Reconcile')));
const ReceiptRegister = Loadable(lazy(() => import('views/Finance/receiptRegister/ReceiptRegister')));
const PaymentRegister = Loadable(lazy(() => import('views/Finance/paymentRegister/PaymentRegister')));
const ReconciliationSummary = Loadable(lazy(() => import('views/Finance/ReconciliationSummaryReport/ReconciliationSummary')));
const CompanySetup = Loadable(lazy(() => import('views/company/index')));
const Country = Loadable(lazy(() => import('views/basicMaster/country')));
const State = Loadable(lazy(() => import('views/basicMaster/state')));
const City = Loadable(lazy(() => import('views/basicMaster/city')));
const Currency = Loadable(lazy(() => import('views/basicMaster/currency')));
const FinYear = Loadable(lazy(() => import('views/basicMaster/finYear')));
const Branch = Loadable(lazy(() => import('views/company/branch')));
const Roles = Loadable(lazy(() => import('views/basicMaster/roles')));
const Employee = Loadable(lazy(() => import('views/basicMaster/employee')));
const ChargeTypeRequest = Loadable(lazy(() => import('views/Finance/ChargeTypeRequest')));
// const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const FinanceRoute = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/company',
      element: <CompanySetup />
    },
    {
      path: '/company/branch',
      element: <Branch />
    },
    {
      path: '/Finance/SetTaxRate',
      element: <SetTaxRate />
    },
    {
      path: '/Finance/TaxMaster',
      element: <TaxMaster />
    },
    {
      path: '/Finance/Taxes',
      element: <Taxes />
    },
    {
      path: '/Finance/tcsMaster/TcsMaster',
      element: <TcsMaster />
    },
    {
      path: '/Finance/tdsMaster/TdsMaster',
      element: <TdsMaster />
    },
    {
      path: '/Finance/HsnSacCode',
      element: <HsnSacCode />
    },
    {
      path: '/Finance/HsnSacCodesListing',
      element: <HsnSacCodesListing />
    },
    {
      path: '/Finance/Group',
      element: <Group />
    },
    {
      path: '/Finance/account/Account',
      element: <Account />
    },
    {
      path: '/Finance/ExRates',
      element: <ExRates />
    },
    {
      path: '/Finance/SubLedgerAccount',
      element: <SubLedgerAccount />
    },
    {
      path: '/Finance/costcenter/CostCentre',
      element: <CostCentre />
    },
    {
      path: '/Finance/daily/DailyRate',
      element: <Daily />
    },
    {
      path: '/Finance/chartOfCostcenter/ChartOfCostcenter',
      element: <ChartOfCostcenter />
    },
    {
      path: '/Finance/BRSOpening',
      element: <BRSOpening />
    },
    {
      path: '/Finance/ArApBill',
      element: <ArApBill />
    },
    {
      path: '/Finance/chequeBookMaster/ChequeBookMaster',
      element: <ChequeBookMaster />
    },
    {
      path: '/Finance/glOpening/GlOpening',
      element: <GLOpeningBalance />
    },
    {
      path: '/Finance/FundTransfer',
      element: <FundTransfer />
    },
    {
      path: '/Finance/GeneralJournal/GeneralJournal',
      element: <GeneralJournal />
    },
    {
      path: '/Finance/receipt/Receipt',
      element: <Receipt />
    },
    {
      path: '/Finance/payment/Payment',
      element: <Payment />
    },
    {
      path: '/Finance/Reconcile/Reconcile',
      element: <Reconcile />
    },
    {
      path: '/Finance/receiptRegister/ReceiptRegister',
      element: <ReceiptRegister />
    },
    {
      path: '/Finance/paymentRegister/PaymentRegister',
      element: <PaymentRegister />
    },
    {
      path: '/Finance/ReconciliationSummaryReport/ReconciliationSummary',
      element: <ReconciliationSummary />
    },
    {
      path: '/basicMaster/country',
      element: <Country />
    },
    {
      path: '/basicMaster/state',
      element: <State />
    },
    {
      path: '/basicMaster/city',
      element: <City />
    },
    {
      path: '/basicMaster/currency',
      element: <Currency />
    },
    {
      path: '/basicMaster/finYear',
      element: <FinYear />
    },
    {
      path: '/basicMaster/roles',
      element: <Roles />
    },
    {
      path: '/basicMaster/employee',
      element: <Employee />
    },
    {
      path: '/Finance/ChargeTypeRequest',
      element: <ChargeTypeRequest />
    }
  ]
};

export default FinanceRoute;
