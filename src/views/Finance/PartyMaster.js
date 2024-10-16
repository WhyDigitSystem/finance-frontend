import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useRef, useState, useMemo, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tabs, Tab } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ActionButton from 'utils/ActionButton';
import { getAllActiveCountries, getAllActiveCurrency } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

export const PartyMaster = () => {
  const [currencies, setCurrencies] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [formData, setFormData] = useState({
    accountName: '',
    accountNo: '',
    accountType: '',
    accountsType: '',
    active: true,
    addressOfBranch: '',
    agentName: '',
    airWayBillCode: '',
    airlineCode: '',
    branch: '',
    businessCategory: '',
    businessCategory1: '',
    businessType: '',
    caf: '',
    carrierCode: '',
    company: '',
    compoundingScheme: '',
    controllingOffice: '',
    country: '',
    createdBy: loginUserName,
    creditDays: '',
    creditLimit: '',
    currency: '',
    customerCategory: '',
    customerCoordinator: '',
    customerCoordinator1: '',
    customerType: '',
    gstPartyName: '',
    gstRegistration: '',
    ifscCode: '',
    nameOfBank: '',
    orgId: orgId,
    panName: '',
    panNo: '',
    partyCode: '',
    partyName: '',
    // partyAddressDTO: [
    //   {
    //     addressType: '',
    //     addressLine1: '',
    //     addressLine2: '',
    //     addressLine3: '',
    //     businessPlace: '',
    //     cityName: '',
    //     contactEmail: '',
    //     contactPerson: '',
    //     contactPhoneNo: '',
    //     id: 0,
    //     pincode: '',
    //     state: '',
    //     stateGstIn: ''
    //   }
    // ],
    // partyChargesExemptionDTO: [
    //   {
    //     charge: '',
    //     id: 0,
    //     tdsSection: ''
    //   }
    // ],
    // partyCurrencyMappingDTO: [
    //   {
    //     id: 0,
    //     transactionCurrency: ''
    //   }
    // ],
    // partyDetailsOfDirectorsDTO: [
    //   {
    //     designation: '',
    //     email: '',
    //     id: 0,
    //     name: '',
    //     phone: ''
    //   }
    // ],
    // partyPartnerTaggingDTO: [
    //   {
    //     id: 0,
    //     partnerName: ''
    //   }
    // ],
    // partySalesPersonTaggingDTO: [
    //   {
    //     effectiveFrom: '',
    //     effectiveTill: '',
    //     empCode: '',
    //     id: 0,
    //     salesBranch: '',
    //     salesPerson: ''
    //   }
    // ],
    // partySpecialTDSDTO: [
    //   {
    //     edPercentage: '',
    //     id: 0,
    //     rateForm: '',
    //     rateTo: '',
    //     surPercentage: '',
    //     tdsCertificateNo: '',
    //     tdsPercentage: '',
    //     tdsSection: ''
    //   }
    // ],
    // partyStateDTO: [
    //   {
    //     contactEmail: 0,
    //     contactPerson: '',
    //     contactPhoneNo: '',
    //     gstIn: '',
    //     id: 0,
    //     state: '',
    //     stateCode: true,
    //     stateNo: ''
    //   }
    // ],
    // partyTdsExemptedDTO: [
    //   {
    //     finYear: '',
    //     id: 0,
    //     tdsExemptedCertificate: '',
    //     value: ''
    //   }
    // ],
    partyVendorEvaluationDTO: {
      commonAgreedTerms: '',
      // id: 0,
      justification: '',
      slaPoints: '',
      whatBasisVendorSelected: '',
      whoBroughtVendor: ''
    },
    partyType: '',
    psu: '',
    remarks: '',
    salesPerson: '',
    salesPerson1: '',
    supplierType: '',
    swift: '',
    tanNo: ''
  });
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const listViewColumns = [
    { accessorKey: 'partyType', header: 'Party Type', size: 140 },
    { accessorKey: 'partyCode', header: 'Party Code', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'company', header: 'Company', size: 140 }
  ];

  const handleView = () => {
    setListView(!listView);
  };

  const [fieldErrors, setFieldErrors] = useState({
    accountType: '',
    accountName: '',
    accountNo: '',
    accountsType: '',
    active: true,
    addressOfBranch: '',
    agentName: '',
    airWayBillCode: '',
    airlineCode: '',
    branch: '',
    businessCategory: '',
    businessCategory1: '',
    businessType: '',
    caf: '',
    carrierCode: '',
    company: '',
    compoundingScheme: '',
    controllingOffice: '',
    country: '',
    createdBy: '',
    creditDays: '',
    creditLimit: '',
    currency: '',
    customerCategory: '',
    customerCoordinator: '',
    customerCoordinator1: '',
    customerType: '',
    gstPartyName: '',
    gstRegistration: '',
    ifscCode: '',
    nameOfBank: '',
    panName: '',
    panNo: '',
    partyCode: '',
    partyName: '',
    partyType: '',
    // partyAddressDTO: [
    //   {
    //     addressType: '',
    //     addressLine1: '',
    //     addressLine2: '',
    //     addressLine3: '',
    //     businessPlace: '',
    //     cityName: '',
    //     contactEmail: '',
    //     contactPerson: '',
    //     contactPhoneNo: '',
    //     id: 0,
    //     pincode: '',
    //     state: '',
    //     stateGstIn: ''
    //   }
    // ],
    // partyChargesExemptionDTO: [
    //   {
    //     charge: '',
    //     id: 0,
    //     tdsSection: ''
    //   }
    // ],
    // partyCurrencyMappingDTO: [
    //   {
    //     id: 0,
    //     transactionCurrency: ''
    //   }
    // ],
    // partyDetailsOfDirectorsDTO: [
    //   {
    //     designation: '',
    //     email: '',
    //     id: 0,
    //     name: '',
    //     phone: ''
    //   }
    // ],
    // partyPartnerTaggingDTO: [
    //   {
    //     id: 0,
    //     partnerName: ''
    //   }
    // ],
    // partySalesPersonTaggingDTO: [
    //   {
    //     effectiveFrom: '',
    //     effectiveTill: '',
    //     empCode: '',
    //     id: 0,
    //     salesBranch: '',
    //     salesPerson: ''
    //   }
    // ],
    // partySpecialTDSDTO: [
    //   {
    //     edPercentage: '',
    //     id: 0,
    //     rateForm: '',
    //     rateTo: '',
    //     surPercentage: '',
    //     tdsCertificateNo: '',
    //     tdsPercentage: '',
    //     tdsSection: ''
    //   }
    // ],
    // partyStateDTO: [
    //   {
    //     contactEmail: 0,
    //     contactPerson: '',
    //     contactPhoneNo: '',
    //     gstIn: '',
    //     id: 0,
    //     state: '',
    //     stateCode: true,
    //     stateNo: ''
    //   }
    // ],
    // partyTdsExemptedDTO: [
    //   {
    //     finYear: '',
    //     id: 0,
    //     tdsExemptedCertificate: '',
    //     value: ''
    //   }
    // ],
    partyVendorEvaluationDTO: {
      commonAgreedTerms: '',
      id: 0,
      justification: '',
      slaPoints: '',
      whatBasisVendorSelected: '',
      whoBroughtVendor: ''
    },
    psu: '',
    remarks: '',
    salesPerson: '',
    salesPerson1: '',
    supplierType: '',
    swift: '',
    tanNo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);

        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getAllCountries();
    getPartyMasterByOrgId();
  }, []);

  const getAllCountries = async () => {
    try {
      const countryData = await getAllActiveCountries(orgId);
      setCountryList(countryData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const getPartyMasterByOrgId = async () => {
    try {
      const response = await apiCalls('get', `master/getPartyMasterByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.partyMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPartyMasterById = async (row) => {
    console.log('THE SELECTED getPartyMasterById IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `master/getPartyMasterById?id=${row.original.id}`);
      console.log('API Response:', response);
      if (response.status === true) {
        setListView(false);
        const particularMaster = response.paramObjectsMap.partyMasterVO[0];
        console.log('THE PARTICULAR CUSTOMER IS:', particularMaster);
        setFormData({
          accountName: particularMaster.accountName,
          accountNo: particularMaster.accountNo || '',
          accountType: particularMaster.accountType,
          accountsType: particularMaster.accountsType,
          active: particularMaster.active === true,
          addressOfBranch: particularMaster.addressOfBranch,
          agentName: particularMaster.agentName,
          airWayBillCode: particularMaster.airWayBillCode,
          airlineCode: particularMaster.airlineCode,
          branch: particularMaster.branch,
          businessCategory: particularMaster.businessCategory,
          businessCategory1: particularMaster.businessCategory1,
          businessType: particularMaster.businessType,
          caf: particularMaster.caf,
          carrierCode: particularMaster.carrierCode,
          company: particularMaster.company,
          compoundingScheme: particularMaster.compoundingScheme,
          controllingOffice: particularMaster.controllingOffice,
          country: particularMaster.country,
          creditDays: particularMaster.creditDays,
          creditLimit: particularMaster.creditLimit,
          currency: particularMaster.currency,
          customerCategory: particularMaster.customerCategory,
          customerCoordinator: particularMaster.customerCoordinator,
          customerCoordinator1: particularMaster.customerCoordinator1,
          customerType: particularMaster.customerType,
          gstPartyName: particularMaster.gstPartyName,
          gstRegistration: particularMaster.gstRegistration,
          ifscCode: particularMaster.ifscCode,
          nameOfBank: particularMaster.nameOfBank,
          panName: particularMaster.panName,
          panNo: particularMaster.panNo,
          partyCode: particularMaster.partyCode,
          partyName: particularMaster.partyName,
          partyType: particularMaster.partyType,
          psu: particularMaster.psu,
          salesPerson: particularMaster.salesPerson,
          salesPerson1: particularMaster.salesPerson1,
          supplierType: particularMaster.supplierType,
          swift: particularMaster.swift,
          tanNo: particularMaster.tanNo
        });
        setPartyStateData(
          particularMaster.partyStateVO.map((detail) => ({
            id: detail.id,
            state: detail.state || '',
            gstIn: detail.gstIn || '',
            stateNo: detail.stateNo || '',
            contactPerson: detail.contactPerson || '',
            contactPhoneNo: detail.contactPhoneNo || '',
            contactEmail: detail.contactEmail || '',
            stateCode: detail.stateCode || ''
          }))
        );
        setPartyAddressData(
          particularMaster.partyAddressVO.map((detail) => ({
            id: detail.id,
            addressType: detail.addressType || '',
            addressLine1: detail.addressLine1 || '',
            addressLine2: detail.addressLine2 || '',
            addressLine3: detail.addressLine3 || '',
            businessPlace: detail.businessPlace || '',
            cityName: detail.cityName || '',
            contactEmail: detail.contactEmail || '',
            contactPerson: detail.contactPerson || '',
            contactPhoneNo: detail.contactPhoneNo || '',
            pincode: detail.pincode || '',
            state: detail.state || '',
            stateGstIn: detail.stateGstIn || ''
          }))
        );
        setPartyDetailsOfDirectors(
          particularMaster.partyDetailsOfDirectorsVO.map((detail) => ({
            id: detail.id,
            name: detail.name || '',
            designation: detail.designation || '',
            phone: detail.phone || '',
            email: detail.email || ''
          }))
        );
        setPartySpecialTDS(
          particularMaster.partySpecialTDSVO.map((detail) => ({
            id: detail.id,
            edPercentage: detail.edPercentage || '',
            rateForm: detail.rateForm || '',
            rateTo: detail.rateTo || '',
            surPercentage: detail.surPercentage || '',
            tdsCertificateNo: detail.tdsCertificateNo || '',
            tdsPercentage: detail.tdsPercentage || '',
            tdsSection: detail.tdsSection || ''
          }))
        );
        setPartyChargesExemption(
          particularMaster.partyChargesExemptionVO.map((detail) => ({
            id: detail.id,
            tdsSection: detail.tdsSection || '',
            charge: detail.charge || ''
          }))
        );
        setPartyCurrencyMapping(
          particularMaster.partyCurrencyMappingVO.map((detail) => ({
            id: detail.id,
            transactionCurrency: detail.transactionCurrency || ''
          }))
        );
        setPartySalesPersonTagging(
          particularMaster.partySalesPersonTaggingVO.map((detail) => ({
            id: detail.id,
            salesPerson: detail.salesPerson || '',
            empCode: detail.empCode || '',
            salesBranch: detail.salesBranch || '',
            effectiveFrom: detail.effectiveFrom || '',
            effectiveTill: detail.effectiveTill || ''
          }))
        );
        setPartyTdsExempted(
          particularMaster.partyTdsExemptedVO.map((detail) => ({
            id: detail.id,
            tdsExemptedCertificate: detail.tdsExemptedCertificate || '',
            value: detail.value || '',
            finYear: detail.finYear || ''
          }))
        );
        setPartyPartnerTagging(
          particularMaster.partyPartnerTaggingVO.map((detail) => ({
            id: detail.id,
            partnerName: detail.partnerName || ''
          }))
        );
        // setFormData(
        //   particularMaster.partyVendorEvaluationVO.map((detail) => ({
        //     id: detail.id,
        //     commonAgreedTerms: detail.commonAgreedTerms || '',
        //     justification: detail.justification || '',
        //     slaPoints: detail.slaPoints || '',
        //     whatBasisVendorSelected: detail.whatBasisVendorSelected || '',
        //     whoBroughtVendor: detail.whoBroughtVendor || '',
        //   }))
        // );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  //   setFieldErrors({ ...fieldErrors, [name]: '' });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the name belongs to the nested partyVendorEvaluationDTO
    if (name in formData.partyVendorEvaluationDTO) {
      setFormData({
        ...formData,
        partyVendorEvaluationDTO: {
          ...formData.partyVendorEvaluationDTO,
          [name]: value
        }
      });
    } else {
      // For other top-level form fields
      setFormData({ ...formData, [name]: value });
    }

    // Clear field errors for the respective field
    setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  const handleClear = () => {
    setEditId('');
    setFormData({
      accountType: '',
      accountName: '',
      accountNo: '',
      accountsType: '',
      active: true,
      addressOfBranch: '',
      agentName: '',
      airWayBillCode: '',
      airlineCode: '',
      branch: '',
      businessCategory: '',
      businessCategory1: '',
      businessType: '',
      caf: '',
      carrierCode: '',
      company: '',
      compoundingScheme: '',
      controllingOffice: '',
      country: '',
      createdBy: '',
      creditDays: '',
      creditLimit: '',
      currency: '',
      customerCategory: '',
      customerCoordinator: '',
      customerCoordinator1: '',
      customerType: '',
      gstPartyName: '',
      gstRegistration: '',
      // id: 0,
      ifscCode: '',
      nameOfBank: '',
      orgId: orgId,
      panName: '',
      panNo: '',
      partyCode: '',
      partyName: '',
      partyType: '',
      // partyAddressDTO: [
      //   {
      //     addressType: '',
      //     addressLine1: '',
      //     addressLine2: '',
      //     addressLine3: '',
      //     businessPlace: '',
      //     cityName: '',
      //     contactEmail: '',
      //     contactPerson: '',
      //     contactPhoneNo: '',
      //     id: 0,
      //     pincode: '',
      //     state: '',
      //     stateGstIn: ''
      //   }
      // ],
      // partyChargesExemptionDTO: [
      //   {
      //     charge: '',
      //     id: 0,
      //     tdsSection: ''
      //   }
      // ],
      // partyCurrencyMappingDTO: [
      //   {
      //     id: 0,
      //     transactionCurrency: ''
      //   }
      // ],
      // partyDetailsOfDirectorsDTO: [
      //   {
      //     designation: '',
      //     email: '',
      //     id: 0,
      //     name: '',
      //     phone: ''
      //   }
      // ],
      // partyPartnerTaggingDTO: [
      //   {
      //     id: 0,
      //     partnerName: ''
      //   }
      // ],
      // partySalesPersonTaggingDTO: [
      //   {
      //     effectiveFrom: '',
      //     effectiveTill: '',
      //     empCode: '',
      //     id: 0,
      //     salesBranch: '',
      //     salesPerson: ''
      //   }
      // ],
      // partySpecialTDSDTO: [
      //   {
      //     edPercentage: '',
      //     id: 0,
      //     rateForm: '',
      //     rateTo: '',
      //     surPercentage: '',
      //     tdsCertificateNo: '',
      //     tdsPercentage: '',
      //     tdsSection: ''
      //   }
      // ],
      // partyStateDTO: [
      //   {
      //     contactEmail: 0,
      //     contactPerson: '',
      //     contactPhoneNo: '',
      //     gstIn: '',
      //     id: 0,
      //     state: '',
      //     stateCode: true,
      //     stateNo: ''
      //   }
      // ],
      // partyTdsExemptedDTO: [
      //   {
      //     finYear: '',
      //     id: 0,
      //     tdsExemptedCertificate: '',
      //     value: ''
      //   }
      // ],
      partyVendorEvaluationDTO: {
        commonAgreedTerms: '',
        id: 0,
        justification: '',
        slaPoints: '',
        whatBasisVendorSelected: '',
        whoBroughtVendor: ''
      },
      psu: '',
      remarks: '',
      salesPerson: '',
      salesPerson1: '',
      supplierType: '',
      swift: '',
      tanNo: ''
    });
    setFieldErrors({
      accountType: '',
      accountName: '',
      accountNo: '',
      accountsType: '',
      active: true,
      addressOfBranch: '',
      agentName: '',
      airWayBillCode: '',
      airlineCode: '',
      branch: '',
      businessCategory: '',
      businessCategory1: '',
      businessType: '',
      caf: '',
      carrierCode: '',
      company: '',
      compoundingScheme: '',
      controllingOffice: '',
      country: '',
      createdBy: '',
      creditDays: '',
      creditLimit: '',
      currency: '',
      customerCategory: '',
      customerCoordinator: '',
      customerCoordinator1: '',
      customerType: '',
      gstPartyName: '',
      gstRegistration: '',
      ifscCode: '',
      nameOfBank: '',
      panName: '',
      panNo: '',
      partyCode: '',
      partyName: '',
      partyType: '',
      psu: '',
      remarks: '',
      salesPerson: '',
      salesPerson1: '',
      supplierType: '',
      swift: '',
      tanNo: ''
    });
    setPartyStateData([
      {
        state: '',
        gstIn: '',
        stateNo: '',
        contactPerson: '',
        contactPhoneNo: '',
        contactEmail: '',
        stateCode: ''
      }
    ]);
    setPartyStateDataErrors([]);
    setPartyAddressData([
      {
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        businessPlace: '',
        cityName: '',
        contactEmail: '',
        contactPerson: '',
        contactPhoneNo: '',
        pincode: '',
        state: '',
        stateGstIn: ''
      }
    ]);
    setPartyDetailsErrors([]);
    setPartyDetailsOfDirectors([
      {
        name: '',
        designation: '',
        phone: '',
        email: ''
      }
    ]);
    setPartySpecialTDSErrors([]);
    setPartySpecialTDS([
      {
        edPercentage: '',
        rateForm: '',
        rateTo: '',
        surPercentage: '',
        tdsCertificateNo: '',
        tdsPercentage: '',
        tdsSection: ''
      }
    ]);
    setPartyChargesExemptionErrors([]);
    setPartyChargesExemption([
      {
        tdsSection: '',
        charge: ''
      }
    ]);
    setPartyCurrencyMappingErrors([]);
    setPartyCurrencyMapping([
      {
        transactionCurrency: ''
      }
    ]);
    setPartySalesPersonErrors([]);
    setPartySalesPersonTagging([
      {
        salesPerson: '',
        empCode: '',
        salesBranch: '',
        effectiveFrom: '',
        effectiveTill: ''
      }
    ]);
    setPartyTdsErrors([]);
    setPartyTdsExempted([
      {
        tdsExemptedCertificate: '',
        valueTds: '',
        finYear: ''
      }
    ]);
    setPartyPartnerErrors([]);
    setPartyPartnerTagging([
      {
        partnerName: ''
      }
    ]);
  };

  const [partyStateData, setPartyStateData] = useState([
    {
      sNo: 1,
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      contactEmail: '',
      stateCode: ''
    }
  ]);

  const [partyStateDataErrors, setPartyStateDataErrors] = useState([
    {
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      contactEmail: '',
      stateCode: ''
    }
  ]);

  const handleAddRowPartyState = () => {
    const newRow = {
      sNo: Date.now(),
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      contactEmail: '',
      stateCode: ''
    };
    setPartyStateData([...partyStateData, newRow]);
    setPartyStateDataErrors([
      ...partyStateDataErrors,
      {
        state: '',
        gstIn: '',
        stateNo: '',
        contactPerson: '',
        contactPhoneNo: '',
        contactEmail: '',
        stateCode: ''
      }
    ]);
  };

  const handleDeleteRowPartyState = (id) => {
    setPartyStateData(partyStateData.filter((row) => row.id !== id));
    setPartyStateDataErrors(partyStateDataErrors.filter((_, index) => index !== id - 1));
  };
  const [partyAddressData, setPartyAddressData] = useState([
    {
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      cityName: '',
      contactEmail: '',
      contactPerson: '',
      contactPhoneNo: '',
      pincode: '',
      state: '',
      stateGstIn: ''
    }
  ]);

  const [partyAddressDataErrors, setPartyAddressDataErrors] = useState([
    {
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      cityName: '',
      contactEmail: '',
      contactPerson: '',
      contactPhoneNo: '',
      pincode: '',
      state: '',
      stateGstIn: ''
    }
  ]);

  const handleAddRowPartyAddress = () => {
    const newRow = {
      sNo: Date.now(),
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      cityName: '',
      contactEmail: '',
      contactPerson: '',
      contactPhoneNo: '',
      pincode: '',
      state: '',
      stateGstIn: ''
    };
    setPartyAddressData([...partyAddressData, newRow]);
    setPartyAddressDataErrors([
      ...partyAddressDataErrors,
      {
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        businessPlace: '',
        cityName: '',
        contactEmail: '',
        contactPerson: '',
        contactPhoneNo: '',
        pincode: '',
        state: '',
        stateGstIn: ''
      }
    ]);
  };

  const handleDeleteRowPartyAddress = (id) => {
    setPartyAddressData(partyAddressData.filter((row) => row.id !== id));
    setPartyAddressDataErrors(partyAddressDataErrors.filter((_, index) => index !== id - 1));
  };

  const [partyDetailsOfDirectors, setPartyDetailsOfDirectors] = useState([
    {
      sNo: 1,
      name: '',
      designation: '',
      phone: '',
      email: ''
    }
  ]);

  const [partyDetailsErrors, setPartyDetailsErrors] = useState([
    {
      name: '',
      designation: '',
      phone: '',
      email: ''
    }
  ]);

  const handleAddRowDetailsOfDPO = () => {
    const newRow = {
      sNo: Date.now(),
      name: '',
      designation: '',
      phone: '',
      email: ''
    };
    setPartyDetailsOfDirectors([...partyDetailsOfDirectors, newRow]);
    setPartyDetailsErrors([
      ...partyDetailsErrors,
      {
        name: '',
        designation: '',
        phone: '',
        email: ''
      }
    ]);
  };

  const handleDeleteRowDetailsOfDPO = (id) => {
    setPartyDetailsOfDirectors(partyDetailsOfDirectors.filter((row) => row.id !== id));
    setPartyDetailsErrors(partyDetailsErrors.filter((_, index) => index !== id - 1));
  };

  const [partySpecialTDS, setPartySpecialTDS] = useState([
    {
      sNo: 1,
      edPercentage: '',
      rateForm: '',
      rateTo: '',
      surPercentage: '',
      tdsCertificateNo: '',
      tdsPercentage: '',
      tdsSection: ''
    }
  ]);

  const [partySpecialTDSErrors, setPartySpecialTDSErrors] = useState([
    {
      edPercentage: '',
      rateForm: '',
      rateTo: '',
      surPercentage: '',
      tdsCertificateNo: '',
      tdsPercentage: '',
      tdsSection: ''
    }
  ]);

  const handleAddRowSpecialTdsWhTaxDetail = () => {
    const newRow = {
      sNo: Date.now(),
      edPercentage: '',
      rateForm: '',
      rateTo: '',
      surPercentage: '',
      tdsCertificateNo: '',
      tdsPercentage: '',
      tdsSection: ''
    };
    setPartySpecialTDS([...partySpecialTDS, newRow]);
    setPartySpecialTDSErrors([
      ...partySpecialTDSErrors,
      {
        edPercentage: '',
        rateForm: '',
        rateTo: '',
        surPercentage: '',
        tdsCertificateNo: '',
        tdsPercentage: '',
        tdsSection: ''
      }
    ]);
  };

  const handleDeleteRowSpecialTdsWhTaxDetail = (id) => {
    setPartySpecialTDS(partySpecialTDS.filter((row) => row.id !== id));
    setPartySpecialTDSErrors(partySpecialTDSErrors.filter((_, index) => index !== id - 1));
  };

  const [partyChargesExemption, setPartyChargesExemption] = useState([
    {
      sNo: Date.now(),
      tdsSection: '',
      charge: ''
    }
  ]);

  const [partyChargesExemptionErrors, setPartyChargesExemptionErrors] = useState([
    {
      tdsSection: '',
      charge: ''
    }
  ]);

  const handleAddRowChargesExemption = () => {
    const newRow = {
      sNo: Date.now(),
      tdsSection: '',
      charge: ''
    };
    setPartyChargesExemption([...partyChargesExemption, newRow]);
    setPartyChargesExemptionErrors([
      ...partyChargesExemptionErrors,
      {
        tdsSection: '',
        charge: ''
      }
    ]);
  };

  const handleDeleteRowChargesExemption = (id) => {
    setPartyChargesExemption(partyChargesExemption.filter((row) => row.id !== id));
    setPartyChargesExemptionErrors(partyChargesExemptionErrors.filter((_, index) => index !== id - 1));
  };

  const [partyCurrencyMapping, setPartyCurrencyMapping] = useState([
    {
      sNo: Date.now(),
      transactionCurrency: ''
    }
  ]);

  const [partyCurrencyMappingErrors, setPartyCurrencyMappingErrors] = useState([
    {
      transactionCurrency: ''
    }
  ]);

  const handleAddRowCurrencyMapping = () => {
    const newRow = {
      sNo: Date.now(),
      transactionCurrency: ''
    };
    setPartyCurrencyMapping([...partyCurrencyMapping, newRow]);
    setPartyCurrencyMappingErrors([
      ...partyCurrencyMappingErrors,
      {
        transactionCurrency: ''
      }
    ]);
  };

  const handleDeleteRowCurrencyMapping = (id) => {
    setPartyCurrencyMapping(partyCurrencyMapping.filter((row) => row.id !== id));
    setPartyCurrencyMappingErrors(partyCurrencyMappingErrors.filter((_, index) => index !== id - 1));
  };

  const [partySalesPersonTagging, setPartySalesPersonTagging] = useState([
    {
      sNo: Date.now(),
      effectiveFrom: '',
      effectiveTill: '',
      empCode: '',
      salesBranch: '',
      salesPerson: ''
    }
  ]);

  const [partySalesPersonErrors, setPartySalesPersonErrors] = useState([
    {
      salesPerson: '',
      empCode: '',
      salesBranch: '',
      effectiveFrom: '',
      effectiveTill: ''
    }
  ]);

  const handleAddRowSalesPerson = () => {
    const newRow = {
      sNo: Date.now(),
      effectiveFrom: '',
      effectiveTill: '',
      empCode: '',
      salesBranch: '',
      salesPerson: ''
    };
    setPartySalesPersonTagging([...partySalesPersonTagging, newRow]);
    setPartySalesPersonErrors([
      ...partySalesPersonErrors,
      {
        effectiveFrom: '',
        effectiveTill: '',
        empCode: '',
        salesBranch: '',
        salesPerson: ''
      }
    ]);
  };

  const handleDeleteRowSalesPerson = (id) => {
    setPartySalesPersonTagging(partySalesPersonTagging.filter((row) => row.id !== id));
    setPartySalesPersonErrors(partySalesPersonErrors.filter((_, index) => index !== id - 1));
  };

  const [partyTdsExempted, setPartyTdsExempted] = useState([
    {
      sNo: Date.now(),
      finYear: '',
      tdsExemptedCertificate: '',
      value: ''
    }
  ]);

  const [partyTdsErrors, setPartyTdsErrors] = useState([
    {
      finYear: '',
      tdsExemptedCertificate: '',
      value: ''
    }
  ]);

  const handleAddRowTdsExempted = () => {
    const newRow = {
      sNo: Date.now(),
      finYear: '',
      tdsExemptedCertificate: '',
      value: ''
    };
    setPartyTdsExempted([...partyTdsExempted, newRow]);
    setPartyTdsErrors([
      ...partyTdsErrors,
      {
        finYear: '',
        tdsExemptedCertificate: '',
        value: ''
      }
    ]);
  };

  const handleDeleteRowTdsExempted = (id) => {
    setPartyTdsExempted(partyTdsExempted.filter((row) => row.id !== id));
    setPartyTdsErrors(partyTdsErrors.filter((_, index) => index !== id - 1));
  };

  const [partyPartnerTagging, setPartyPartnerTagging] = useState([
    {
      sNo: Date.now(),
      partnerName: ''
    }
  ]);

  const [partyPartnerErrors, setPartyPartnerErrors] = useState([
    {
      partnerName: ''
    }
  ]);

  const handleAddRowPartnerTagging = () => {
    const newRow = {
      sNo: Date.now(),
      partnerName: ''
    };
    setPartyPartnerTagging([...partyPartnerTagging, newRow]);
    setPartyPartnerErrors([
      ...partyPartnerErrors,
      {
        partnerName: ''
      }
    ]);
  };

  const handleDeleteRowPartnerTagging = (id) => {
    setPartyPartnerTagging(partyPartnerTagging.filter((row) => row.id !== id));
    setPartyPartnerErrors(partyPartnerErrors.filter((_, index) => index !== id - 1));
  };

  const [partyVendorEvaluation, setPartyVendorEvaluation] = useState([
    {
      sNo: Date.now(),
      commonAgreedTerms: '',
      justification: '',
      slaPoints: '',
      whatBasisVendorSelected: '',
      whoBroughtVendor: ''
    }
  ]);

  const [partyVendorErrors, setPartyVendorErrors] = useState([
    {
      commonAgreedTerms: '',
      justification: '',
      slaPoints: '',
      whatBasisVendorSelected: '',
      whoBroughtVendor: ''
    }
  ]);

  const handleSave = async () => {
    const errors = {};
    if (!formData.partyType) {
      errors.partyType = 'Party Type is required';
    }
    if (!formData.partyCode) {
      errors.partyCode = 'Party Code is required';
    }
    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }
    if (!formData.gstPartyName) {
      errors.gstPartyName = 'Gst Party Name is required';
    }
    if (!formData.customerType) {
      errors.customerType = 'Customer Type is required';
    }
    if (!formData.company) {
      errors.company = 'Company is required';
    }
    if (!formData.customerCategory) {
      errors.customerCategory = 'Customer Category is required';
    }
    if (!formData.agentName) {
      errors.agentName = 'Agent Name is required';
    }
    if (!formData.accountsType) {
      errors.accountsType = 'Accounts Type is required';
    }
    if (!formData.businessType) {
      errors.businessType = 'Business Type is required';
    }
    if (!formData.carrierCode) {
      errors.carrierCode = 'Carrier Code is required';
    }
    if (!formData.supplierType) {
      errors.supplierType = 'Supplier Type is required';
    }
    if (!formData.salesPerson) {
      errors.salesPerson = 'Sales Person is required';
    }
    if (!formData.customerCoordinator) {
      errors.customerCoordinator = 'Customer Coordinator is required';
    }
    if (!formData.accountName) {
      errors.accountName = 'Account Name is required';
    }
    if (!formData.gstRegistration) {
      errors.gstRegistration = 'Gst Registration is required';
    }
    if (!formData.creditLimit) {
      errors.creditLimit = 'Credit Limit is required';
    }
    if (!formData.creditDays) {
      errors.creditDays = 'Credit Days is required';
    }
    if (!formData.panNo) {
      errors.panNo = 'Pan No is required';
    }
    if (!formData.controllingOffice) {
      errors.controllingOffice = 'Controlling Office is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.panName) {
      errors.panName = 'Pan Name is required';
    }
    if (!formData.airWayBillCode) {
      errors.airWayBillCode = 'AirWay Bill Code is required';
    }
    if (!formData.airlineCode) {
      errors.airlineCode = 'AirLine Code is required';
    }
    if (!formData.tanNo) {
      errors.tanNo = 'Tan No is required';
    }
    if (!formData.businessCategory) {
      errors.businessCategory = 'Business Category is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    if (!formData.caf) {
      errors.caf = 'Caf is required';
    }
    // if (!formData.remarks) {
    //   errors.remarks = 'Remarks is required';
    // }
    if (!formData.compoundingScheme) {
      errors.compoundingScheme = 'Compounding Scheme is required';
    }
    if (!formData.psu) {
      errors.psu = 'Psu is required';
    }
    if (!formData.nameOfBank) {
      errors.nameOfBank = 'Name of Bank is required';
    }
    if (!formData.branch) {
      errors.branch = 'Branch is required';
    }
    if (!formData.addressOfBranch) {
      errors.addressOfBranch = 'Address of Branch is required';
    }
    if (!formData.accountNo) {
      errors.accountNo = 'Account No is required';
    }
    if (!formData.accountType) {
      errors.accountType = 'Account Type is required';
    }
    if (!formData.ifscCode) {
      errors.ifscCode = 'Ifsc Code is required';
    }
    if (!formData.swift) {
      errors.swift = 'Swift is required';
    }

    // if (!errors.partyVendorEvaluationDTO) {
    //   errors.partyVendorEvaluationDTO = {};
    // }
    // if (!formData.partyVendorEvaluationDTO.whoBroughtVendor) {
    //   errors.partyVendorEvaluationDTO.whoBroughtVendor = 'Who Brought Vendor is required';
    // }
    // if (!formData.partyVendorEvaluationDTO.whatBasisVendorSelected) {
    //   errors.partyVendorEvaluationDTO.whatBasisVendorSelected = 'What Basis Vendor Selected is required';
    // }
    // if (!formData.partyVendorEvaluationDTO.justification) {
    //   errors.partyVendorEvaluationDTO.justification = 'Justification is required';
    // }
    // if (!formData.partyVendorEvaluationDTO.slaPoints) {
    //   errors.partyVendorEvaluationDTO.slaPoints = 'SLA Points is required';
    // }
    // if (!formData.partyVendorEvaluationDTO.commonAgreedTerms) {
    //   errors.partyVendorEvaluationDTO.commonAgreedTerms = 'Common Agreed Terms is required';
    // }

    let partyStateDataValid = true;
    const newTableErrors = partyStateData.map((row) => {
      const rowErrors = {};
      if (!row.state) {
        rowErrors.state = 'State is required';
        partyStateDataValid = false;
      }
      if (!row.gstIn) {
        rowErrors.gstIn = 'Gst In is required';
        partyStateDataValid = false;
      }
      if (!row.stateNo) {
        rowErrors.stateNo = 'State No is required';
        partyStateDataValid = false;
      }
      if (!row.contactPerson) {
        rowErrors.contactPerson = 'Contact Person is required';
        partyStateDataValid = false;
      }
      if (!row.contactPhoneNo) {
        rowErrors.contactPhoneNo = 'Contact Phone No is required';
        partyStateDataValid = false;
      }
      if (!row.contactEmail) {
        rowErrors.contactEmail = 'Contact Email is required';
        partyStateDataValid = false;
      }
      if (!row.stateCode) {
        rowErrors.stateCode = 'State Code is required';
        partyStateDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setPartyStateDataErrors(newTableErrors);

    let partyAddressDataValid = true;
    const newTableErrors1 = partyAddressData.map((row) => {
      const rowErrors = {};
      if (!row.state) {
        rowErrors.state = 'State is required';
        partyAddressDataValid = false;
      }
      if (!row.businessPlace) {
        rowErrors.businessPlace = 'Business Place is required';
        partyAddressDataValid = false;
      }
      if (!row.stateGstIn) {
        rowErrors.stateGstIn = 'State GstIn is required';
        partyAddressDataValid = false;
      }
      if (!row.cityName) {
        rowErrors.cityName = 'City Name is required';
        partyAddressDataValid = false;
      }
      if (!row.addressType) {
        rowErrors.addressType = 'Address Type is required';
        partyAddressDataValid = false;
      }
      if (!row.addressLine1) {
        rowErrors.addressLine1 = 'Address Line1 is required';
        partyAddressDataValid = false;
      }
      if (!row.addressLine2) {
        rowErrors.addressLine2 = 'Address Line2 is required';
        partyAddressDataValid = false;
      }
      if (!row.addressLine3) {
        rowErrors.addressLine3 = 'Address Line3 is required';
        partyAddressDataValid = false;
      }
      if (!row.pincode) {
        rowErrors.pincode = 'Pin Code is required';
        partyAddressDataValid = false;
      }
      if (!row.contact) {
        rowErrors.contact = 'Contact is required';
        partyAddressDataValid = false;
      }

      return rowErrors;
    });
    setPartyAddressDataErrors(newTableErrors1);

    let partyDetailsOfDirectorsValid = true;
    const newTableErrors2 = partyDetailsOfDirectors.map((row) => {
      const rowErrors = {};
      if (!row.name) {
        rowErrors.name = 'Name is required';
        partyDetailsOfDirectorsValid = false;
      }
      if (!row.designation) {
        rowErrors.designation = 'Designation is required';
        partyDetailsOfDirectorsValid = false;
      }
      if (!row.phone) {
        rowErrors.phone = 'Phone is required';
        partyDetailsOfDirectorsValid = false;
      }
      if (!row.email) {
        rowErrors.email = 'Email is required';
        partyDetailsOfDirectorsValid = false;
      }

      return rowErrors;
    });
    setPartyDetailsErrors(newTableErrors2);

    let partySpecialTDSValid = true;
    const newTableErrors3 = partySpecialTDS.map((row) => {
      const rowErrors = {};
      if (!row.tdsSection) {
        rowErrors.tdsSection = 'Tds Section is required';
        partySpecialTDSValid = false;
      }
      if (!row.rateForm) {
        rowErrors.rateForm = 'Rate From is required';
        partySpecialTDSValid = false;
      }
      if (!row.rateTo) {
        rowErrors.rateTo = 'Rate To is required';
        partySpecialTDSValid = false;
      }
      if (!row.tdsPercentage) {
        rowErrors.tdsPercentage = 'Tds % is required';
        partySpecialTDSValid = false;
      }
      if (!row.surPercentage) {
        rowErrors.surPercentage = 'Sur % is required';
        partySpecialTDSValid = false;
      }
      if (!row.edPercentage) {
        rowErrors.edPercentage = 'Ed % is required';
        partySpecialTDSValid = false;
      }
      if (!row.tdsCertificateNo) {
        rowErrors.tdsCertificateNo = 'Tds Certificate No is required';
        partySpecialTDSValid = false;
      }

      return rowErrors;
    });
    setPartySpecialTDSErrors(newTableErrors3);

    let partyChargesExemptionValid = true;
    const partyChargesExemptionErrors = partyChargesExemption.map((row) => {
      const rowErrors = {};
      if (!row.tdsSection) {
        rowErrors.tdsSection = 'Tds Section is required';
        partyChargesExemptionValid = false;
      }
      if (!row.charge) {
        rowErrors.charge = 'Charge is required';
        partyChargesExemptionValid = false;
      }

      return rowErrors;
    });
    setPartyChargesExemptionErrors(partyChargesExemptionErrors);

    let partyCurrencyMappingValid = true;
    const partyCurrencyMappingErrors = partyCurrencyMapping.map((row) => {
      const rowErrors = {};
      if (!row.transactionCurrency) {
        rowErrors.transactionCurrency = 'Transaction Currency is required';
        partyCurrencyMappingValid = false;
      }

      return rowErrors;
    });
    setPartyCurrencyMappingErrors(partyCurrencyMappingErrors);

    let partySalesPersonTaggingValid = true;
    const newTableErrors4 = partySalesPersonTagging.map((row) => {
      const rowErrors = {};
      if (!row.salesPerson) {
        rowErrors.salesPerson = 'Sales Person is required';
        partySalesPersonTaggingValid = false;
      }
      if (!row.empCode) {
        rowErrors.empCode = 'Emp Code is required';
        partySalesPersonTaggingValid = false;
      }
      if (!row.salesBranch) {
        rowErrors.salesBranch = 'Sales Branch is required';
        partySalesPersonTaggingValid = false;
      }
      if (!row.effectiveFrom) {
        rowErrors.effectiveFrom = 'Effective From is required';
        partySalesPersonTaggingValid = false;
      }
      if (!row.effectiveTill) {
        rowErrors.effectiveTill = 'Effective Till is required';
        partySalesPersonTaggingValid = false;
      }

      return rowErrors;
    });
    setPartySalesPersonErrors(newTableErrors4);

    let partyTdsExemptedValid = true;
    const newTableErrors5 = partyTdsExempted.map((row) => {
      const rowErrors = {};
      if (!row.tdsExemptedCertificate) {
        rowErrors.tdsExemptedCertificate = 'Tds Exempted Certificate is required';
        partyTdsExemptedValid = false;
      }
      if (!row.value) {
        rowErrors.value = 'Value is required';
        partyTdsExemptedValid = false;
      }
      if (!row.finYear) {
        rowErrors.finYear = 'Fin Year is required';
        partyTdsExemptedValid = false;
      }

      return rowErrors;
    });
    setPartyTdsErrors(newTableErrors5);

    let partyPartnerTaggingValid = true;
    const newTableErrors6 = partyPartnerTagging.map((row) => {
      const rowErrors = {};
      if (!row.partnerName) {
        rowErrors.partnerName = 'Partner Name is required';
        partyPartnerTaggingValid = false;
      }

      return rowErrors;
    });
    setPartyPartnerErrors(newTableErrors6);

    if (
      Object.keys(errors).length === 0 &&
      partyStateDataValid &&
      partyAddressDataValid &&
      partyDetailsOfDirectorsValid &&
      partySpecialTDSValid &&
      partySalesPersonTaggingValid &&
      partyTdsExemptedValid &&
      partyChargesExemptionValid &&
      partyCurrencyMappingValid &&
      partyPartnerTaggingValid
    ) {
      const partyAddressDTO = partyAddressData.map((row) => ({
        addressType: row.addressType,
        addressLine1: row.addressLine1,
        addressLine2: row.addressLine2,
        addressLine3: row.addressLine3,
        businessPlace: row.businessPlace,
        cityName: row.cityName,
        contactEmail: row.contactEmail,
        contactPerson: row.contactPerson,
        contactPhoneNo: row.contactPhoneNo,
        pincode: row.pincode,
        state: row.state,
        stateGstIn: row.stateGstIn
      }));

      const partyStateDTO = partyStateData.map((row) => ({
        contactEmail: row.contactEmail,
        contactPerson: row.contactPerson,
        contactPhoneNo: row.contactPhoneNo,
        gstIn: row.gstIn,
        state: row.state,
        stateCode: row.stateCode,
        stateNo: row.stateNo
      }));

      const partyDetailsOfDirectorsDTO = partyDetailsOfDirectors.map((row) => ({
        designation: row.designation,
        email: row.email,
        name: row.name,
        phone: row.phone
      }));

      const partySpecialTDSDTO = partySpecialTDS.map((row) => ({
        edPercentage: row.edPercentage,
        rateForm: row.rateForm,
        rateTo: row.rateTo,
        surPercentage: row.surPercentage,
        tdsCertificateNo: row.tdsCertificateNo,
        tdsPercentage: row.tdsPercentage,
        tdsSection: row.tdsSection
      }));

      const partyChargesExemptionDTO = partyChargesExemption.map((row) => ({
        charge: row.charge,
        tdsSection: row.tdsSection
      }));

      const partyCurrencyMappingDTO = partyCurrencyMapping.map((row) => ({
        transactionCurrency: row.transactionCurrency
      }));

      const partySalesPersonTaggingDTO = partySalesPersonTagging.map((row) => ({
        effectiveFrom: row.effectiveFrom,
        effectiveTill: row.effectiveTill,
        empCode: row.empCode,
        salesBranch: row.salesBranch,
        salesPerson: row.salesPerson
      }));
      const partyTdsExemptedDTO = partyTdsExempted.map((row) => ({
        finYear: row.finYear,
        tdsExemptedCertificate: row.tdsExemptedCertificate,
        value: row.value
      }));
      const partyPartnerTaggingDTO = partyPartnerTagging.map((row) => ({
        partnerName: row.partnerName
      }));

      const saveData = {
        ...(editId && { id: editId }),
        ...formData,
        partyAddressDTO,
        partyStateDTO,
        partyDetailsOfDirectorsDTO,
        partySpecialTDSDTO,
        partyChargesExemptionDTO,
        partyCurrencyMappingDTO,
        partySalesPersonTaggingDTO,
        partyTdsExemptedDTO,
        partyPartnerTaggingDTO
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('put', `master/updateCreatePartyMaster`, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Party Master Updated Successfully' : 'Party Master created successfully');
          handleClear();
          getPartyMasterByOrgId();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Party Master creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred while saving the Party Master');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} margin="0 10px 0 10px" />
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getPartyMasterById} />
          </div>
        ) : (
          <>
            <div className="row d-flex ml">
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.partyType}>
                  <InputLabel id="partyType">Party Type</InputLabel>
                  <Select labelId="partyType" label="Party Type" name="partyType" value={formData.partyType} onChange={handleInputChange}>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.partyType && <FormHelperText>{fieldErrors.partyType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="partyCode"
                  fullWidth
                  name="partyCode"
                  label="Party Code"
                  size="small"
                  value={formData.partyCode}
                  onChange={handleInputChange}
                  error={fieldErrors.partyCode}
                  helperText={fieldErrors.partyCode}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="partyName"
                  fullWidth
                  name="partyName"
                  label="Party Name"
                  size="small"
                  value={formData.partyName}
                  onChange={handleInputChange}
                  error={fieldErrors.partyName}
                  helperText={fieldErrors.partyName}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="gstPartyName"
                  fullWidth
                  name="gstPartyName"
                  label="GST Party Name"
                  size="small"
                  value={formData.gstPartyName}
                  onChange={handleInputChange}
                  error={fieldErrors.gstPartyName}
                  helperText={fieldErrors.gstPartyName}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="customerType"
                  fullWidth
                  name="customerType"
                  label="Customer Type"
                  size="small"
                  value={formData.customerType}
                  onChange={handleInputChange}
                  error={fieldErrors.customerType}
                  helperText={fieldErrors.customerType}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.company}>
                  <InputLabel id="company">Company</InputLabel>
                  <Select labelId="company" label="Company" name="company" value={formData.company} onChange={handleInputChange}>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.company && <FormHelperText>{fieldErrors.company}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.customerCategory}>
                  <InputLabel id="customerCategory">Customer Category</InputLabel>
                  <Select
                    labelId="customerCategory"
                    label="Customer Category"
                    name="customerCategory"
                    value={formData.customerCategory}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.customerCategory && <FormHelperText>{fieldErrors.customerCategory}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-4 mb-3">
                <TextField
                  id="agentName"
                  fullWidth
                  name="agentName"
                  label="Agent Name"
                  size="small"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  error={fieldErrors.agentName}
                  helperText={fieldErrors.agentName}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.accountsType}>
                  <InputLabel id="accountsType">Accounts Type</InputLabel>
                  <Select
                    labelId="accountsType"
                    label="Accounts Type"
                    name="accountsType"
                    value={formData.accountsType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.accountsType && <FormHelperText>{fieldErrors.accountsType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.businessType}>
                  <InputLabel id="businessType">Business Type</InputLabel>
                  <Select
                    labelId="businessType"
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.businessType && <FormHelperText>{fieldErrors.businessType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="carrierCode"
                  fullWidth
                  name="carrierCode"
                  label="Carrier Code"
                  size="small"
                  value={formData.carrierCode}
                  onChange={handleInputChange}
                  error={fieldErrors.carrierCode}
                  helperText={fieldErrors.carrierCode}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.supplierType}>
                  <InputLabel id="supplierType">Supplier Type</InputLabel>
                  <Select
                    labelId="supplierType"
                    label="Supplier Type"
                    name="supplierType"
                    value={formData.supplierType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.supplierType && <FormHelperText>{fieldErrors.supplierType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="salesPerson"
                  fullWidth
                  name="salesPerson"
                  label="Sales Person"
                  size="small"
                  value={formData.salesPerson}
                  onChange={handleInputChange}
                  error={fieldErrors.salesPerson}
                  helperText={fieldErrors.salesPerson}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="salesPerson1"
                  fullWidth
                  name="salesPerson1"
                  // label="salesPerson1"
                  size="small"
                  value={formData.salesPerson1}
                  onChange={handleInputChange}
                  error={fieldErrors.salesPerson1}
                  helperText={fieldErrors.salesPerson1}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="customerCoordinator"
                  fullWidth
                  name="customerCoordinator"
                  label="Customer Coordinator"
                  size="small"
                  value={formData.customerCoordinator}
                  onChange={handleInputChange}
                  error={fieldErrors.customerCoordinator}
                  helperText={fieldErrors.customerCoordinator}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="customerCoordinator1"
                  fullWidth
                  name="customerCoordinator1"
                  size="small"
                  value={formData.customerCoordinator1}
                  onChange={handleInputChange}
                  error={fieldErrors.customerCoordinator1}
                  helperText={fieldErrors.customerCoordinator1}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.accountName}>
                  <InputLabel id="accountName">Account Name</InputLabel>
                  <Select
                    labelId="accountName"
                    label="Account Name"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.accountName && <FormHelperText>{fieldErrors.accountName}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.gstRegistration}>
                  <InputLabel id="gstRegistration">GST Registered</InputLabel>
                  <Select
                    labelId="gstRegistration"
                    label="GST Registered"
                    name="gstRegistration"
                    value={formData.gstRegistration}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.gstRegistration && <FormHelperText>{fieldErrors.gstRegistration}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="creditLimit"
                  fullWidth
                  name="creditLimit"
                  label="Credit Limit"
                  size="small"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  error={fieldErrors.creditLimit}
                  helperText={fieldErrors.creditLimit}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="creditDays"
                  fullWidth
                  name="creditDays"
                  label="Credit Days"
                  size="small"
                  value={formData.creditDays}
                  onChange={handleInputChange}
                  error={fieldErrors.creditDays}
                  helperText={fieldErrors.creditDays}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="panNo"
                  fullWidth
                  name="panNo"
                  label="PAN No"
                  size="small"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  error={fieldErrors.panNo}
                  helperText={fieldErrors.panNo}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="controllingOffice"
                  fullWidth
                  name="controllingOffice"
                  label="Controlling Office"
                  size="small"
                  value={formData.controllingOffice}
                  onChange={handleInputChange}
                  error={fieldErrors.controllingOffice}
                  helperText={fieldErrors.controllingOffice}
                />
              </div>

              <div className="col-md-4 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    {
                      <span>
                        Currency <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Currency"
                    onChange={handleInputChange}
                    name="currency"
                    value={formData.currency}
                  >
                    {currencies.map((item) => (
                      <MenuItem key={item.id} value={item.currency}>
                        {item.currency}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>Currency is required</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="panName"
                  fullWidth
                  name="panName"
                  label="Pan Name"
                  size="small"
                  value={formData.panName}
                  onChange={handleInputChange}
                  error={fieldErrors.panName}
                  helperText={fieldErrors.panName}
                />
              </div>

              <div className="col-md-4 mb-3">
                <TextField
                  id="airWayBillCode"
                  fullWidth
                  name="airWayBillCode"
                  label="Air Way Bill Code"
                  size="small"
                  value={formData.airWayBillCode}
                  onChange={handleInputChange}
                  error={fieldErrors.airWayBillCode}
                  helperText={fieldErrors.airWayBillCode}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="airlineCode"
                  fullWidth
                  name="airlineCode"
                  label="AirLine Code"
                  size="small"
                  value={formData.airlineCode}
                  onChange={handleInputChange}
                  error={fieldErrors.airlineCode}
                  helperText={fieldErrors.airlineCode}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="tanNo"
                  fullWidth
                  name="tanNo"
                  label="TAN No"
                  size="small"
                  value={formData.tanNo}
                  onChange={handleInputChange}
                  error={fieldErrors.tanNo}
                  helperText={fieldErrors.tanNo}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.businessCategory}>
                  <InputLabel id="businessCategory">Business Category</InputLabel>
                  <Select
                    labelId="businessCategory"
                    label="Business Category"
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.businessCategory && <FormHelperText>{fieldErrors.businessCategory}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="businessCategory1"
                  fullWidth
                  name="businessCategory1"
                  size="small"
                  value={formData.businessCategory1}
                  onChange={handleInputChange}
                  error={fieldErrors.businessCategory1}
                  helperText={fieldErrors.businessCategory1}
                />
              </div>

              <div className="col-md-4 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.country}>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select labelId="country-label" label="Country" value={formData.country} onChange={handleInputChange} name="country">
                    {Array.isArray(countryList) &&
                      countryList?.map((row) => (
                        <MenuItem key={row.id} value={row.countryName}>
                          {row.countryName}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.country && <FormHelperText>{fieldErrors.country}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.caf}>
                  <InputLabel id="caf">CAF</InputLabel>
                  <Select labelId="caf" label="CAF" name="caf" value={formData.caf} onChange={handleInputChange}>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.caf && <FormHelperText>{fieldErrors.caf}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="remarks"
                  fullWidth
                  name="remarks"
                  label="Remarks"
                  size="small"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  error={fieldErrors.remarks}
                  helperText={fieldErrors.remarks}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.compoundingScheme}>
                  <InputLabel id="compoundingScheme">Compounding Scheme</InputLabel>
                  <Select
                    labelId="compoundingScheme"
                    label="Compounding Scheme"
                    name="compoundingScheme"
                    value={formData.compoundingScheme}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.compoundingScheme && <FormHelperText>{fieldErrors.compoundingScheme}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-4 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.psu}>
                  <InputLabel id="psu">PSU / Government Organization</InputLabel>
                  <Select labelId="psu" label="PSU / Government Organization" name="psu" value={formData.psu} onChange={handleInputChange}>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.psu && <FormHelperText>{fieldErrors.gender}</FormHelperText>}
                </FormControl>
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-start" style={{ marginBottom: '10px' }}>
              <h6 className="col-md-12" style={{ backgroundColor: '#ECEEF4', padding: '10px' }}>
                Bank Details
              </h6>
            </div>
            <div className="row d-flex">
              <div className="col-md-4 mb-3">
                <TextField
                  id="nameOfBank"
                  fullWidth
                  name="nameOfBank"
                  label="Name of Bank"
                  size="small"
                  value={formData.nameOfBank}
                  onChange={handleInputChange}
                  error={fieldErrors.nameOfBank}
                  helperText={fieldErrors.nameOfBank}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="branch"
                  fullWidth
                  name="branch"
                  label="Branch"
                  size="small"
                  value={formData.branch}
                  onChange={handleInputChange}
                  error={fieldErrors.branch}
                  helperText={fieldErrors.branch}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="addressOfBranch"
                  fullWidth
                  name="addressOfBranch"
                  label="Address of Bank"
                  size="small"
                  value={formData.addressOfBranch}
                  onChange={handleInputChange}
                  error={fieldErrors.addressOfBranch}
                  helperText={fieldErrors.addressOfBranch}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="accountNo"
                  fullWidth
                  name="accountNo"
                  label="Account No"
                  size="small"
                  value={formData.accountNo}
                  onChange={handleInputChange}
                  error={fieldErrors.accountNo}
                  helperText={fieldErrors.accountNo}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="accountType"
                  fullWidth
                  name="accountType"
                  label="Account Type"
                  size="small"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  error={fieldErrors.accountType}
                  helperText={fieldErrors.accountType}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="ifscCode"
                  fullWidth
                  name="ifscCode"
                  label="IFSC Code"
                  size="small"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  error={fieldErrors.ifscCode}
                  helperText={fieldErrors.ifscCode}
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  id="swift"
                  fullWidth
                  name="swift"
                  label="SWIFT"
                  size="small"
                  value={formData.swift}
                  onChange={handleInputChange}
                  error={fieldErrors.swift}
                  helperText={fieldErrors.swift}
                />
              </div>
            </div>
            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs value={tabValue} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
                  <Tab label="Party State" />
                  <Tab label="Address" />
                  <Tab label="Details of Directors/Partner/Owner" />
                  <Tab label="Special TDS / WH Tax Detail" />
                  <Tab label="Charges Exemption for Special TDS / WH" />
                  <Tab label="Currency Mapping" />
                  <Tab label="Sales Person Tagging" />
                  <Tab label="TDS Exempted" />
                  <Tab label="Partner Tagging" />
                  <Tab label="Vendor Evaluation" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {tabValue === 0 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPartyState} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">State</th>
                                <th className="px-2 py-2 text-white text-center">GSTIN</th>
                                <th className="px-2 py-2 text-white text-center">State No</th>
                                <th className="px-2 py-2 text-white text-center">Contact Person</th>
                                <th className="px-2 py-2 text-white text-center">Contact Phone No</th>
                                <th className="px-2 py-2 text-white text-center">Contact Email</th>
                                <th className="px-2 py-2 text-white text-center">State Code</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyStateData.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowPartyState(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.state}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const updatedPartyStateData = [...partyStateData];
                                        updatedPartyStateData[index].state = e.target.value;
                                        setPartyStateData(updatedPartyStateData);
                                      }}
                                      className={partyStateDataErrors[index]?.state ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="STATE1">STATE1</option>
                                      <option value="STATE2">STATE2</option>
                                    </select>
                                    {partyStateDataErrors[index]?.state && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyStateDataErrors[index].state}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.gstIn}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, gstIn: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], gstIn: !value ? 'GstIn is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.gstIn ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.gstIn && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].gstIn}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.stateNo}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateNo: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            stateNo: !value ? 'State No is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.stateNo ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.stateNo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].stateNo}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contactPerson}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, contactPerson: value } : r))
                                        );
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            contactPerson: !value ? 'Contact Person is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.contactPerson ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.contactPerson && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].contactPerson}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contactPhoneNo}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, contactPhoneNo: value } : r))
                                        );
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            contactPhoneNo: !value ? 'Contact Phone No is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.contactPhoneNo ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.contactPhoneNo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].contactPhoneNo}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contactEmail}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, contactEmail: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            contactEmail: !value ? 'Contact Email is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.contactEmail ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.contactEmail && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].contactEmail}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.stateCode}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateCode: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            stateCode: !value ? 'State Code is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.stateCode ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.stateCode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].stateCode}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 1 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPartyAddress} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">State</th>
                                <th className="px-2 py-2 text-white text-center">Business Place</th>
                                <th className="px-2 py-2 text-white text-center">State GST IN</th>
                                <th className="px-2 py-2 text-white text-center">City Name</th>
                                <th className="px-2 py-2 text-white text-center">Address Type</th>
                                <th className="px-2 py-2 text-white text-center">Address Line1</th>
                                <th className="px-2 py-2 text-white text-center">Address Line2</th>
                                <th className="px-2 py-2 text-white text-center">Address Line3</th>
                                <th className="px-2 py-2 text-white text-center">Pin Code</th>
                                <th className="px-2 py-2 text-white text-center">Contact</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyAddressData.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowPartyAddress(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.state}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const updatedPartyAddressData = [...partyAddressData];
                                        updatedPartyAddressData[index].state = e.target.value;
                                        setPartyStateData(updatedPartyAddressData);
                                      }}
                                      className={partyAddressDataErrors[index]?.state ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="STATE1">STATE1</option>
                                      <option value="STATE2">STATE2</option>
                                    </select>
                                    {partyAddressDataErrors[index]?.state && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyAddressDataErrors[index].state}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.businessPlace}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const updatedPartyAddressData = [...partyAddressData];
                                        updatedPartyAddressData[index].businessPlace = e.target.value;
                                        setPartyStateData(updatedPartyAddressData);
                                      }}
                                      className={partyAddressDataErrors[index]?.businessPlace ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="STATE1">STATE1</option>
                                      <option value="STATE2">STATE2</option>
                                    </select>
                                    {partyAddressDataErrors[index]?.businessPlace && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyAddressDataErrors[index].businessPlace}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.stateGstIn}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateGstIn: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], stateGstIn: !value ? 'State Gst In is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.stateGstIn ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.stateGstIn && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].stateGstIn}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.cityName}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, cityName: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            cityName: !value ? 'City Name is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.cityName ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.cityName && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].cityName}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressType}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressType: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressType: !value ? 'Address  Type is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressType ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressType && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressType}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine1}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine1: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine1: !value ? 'Address Line1 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine1 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine1 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine1}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine2}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine2: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine2: !value ? 'Address Line2 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine2 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine2 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine2}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine3}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine3: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine3: !value ? 'Address Line3 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine3 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine3 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine3}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.pincode}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, pincode: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            pincode: !value ? 'Pin Code is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.pincode ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.pincode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].pincode}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contact}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, contact: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            contact: !value ? 'Contact is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.contact ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.contact && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].contact}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 2 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowDetailsOfDPO} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">Name</th>
                                <th className="px-2 py-2 text-white text-center">Designation</th>
                                <th className="px-2 py-2 text-white text-center">Phone</th>
                                <th className="px-2 py-2 text-white text-center">Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyDetailsOfDirectors.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowDetailsOfDPO(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.name}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyDetailsOfDirectors((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, name: value } : r))
                                        );
                                        setPartyDetailsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], name: !value ? 'Name is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyDetailsErrors[index]?.name ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyDetailsErrors[index]?.name && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyDetailsErrors[index].name}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.designation}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyDetailsOfDirectors((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, designation: value } : r))
                                        );
                                        setPartyDetailsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            designation: !value ? 'Designation is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyDetailsErrors[index]?.designation ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyDetailsErrors[index]?.designation && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyDetailsErrors[index].designation}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.phone}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyDetailsOfDirectors((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, phone: value } : r))
                                        );
                                        setPartyDetailsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            phone: !value ? 'Phone is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyDetailsErrors[index]?.phone ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyDetailsErrors[index]?.phone && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyDetailsErrors[index].phone}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.email}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyDetailsOfDirectors((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, email: value } : r))
                                        );
                                        setPartyDetailsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            email: !value ? 'Contact Phone No is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyDetailsErrors[index]?.email ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyDetailsErrors[index]?.email && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyDetailsErrors[index].email}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tabValue === 3 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowSpecialTdsWhTaxDetail} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">TDS / WH Section</th>
                                <th className="px-2 py-2 text-white text-center">Rate From</th>
                                <th className="px-2 py-2 text-white text-center">Rate To</th>
                                <th className="px-2 py-2 text-white text-center">TDS / WH %</th>
                                <th className="px-2 py-2 text-white text-center">SUR %</th>
                                <th className="px-2 py-2 text-white text-center">ED %</th>
                                <th className="px-2 py-2 text-white text-center">TDS Certificate No</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partySpecialTDS.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() => handleDeleteRowSpecialTdsWhTaxDetail(row.id)}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.tdsSection}
                                      style={{ width: '150px' }}
                                      className={partySpecialTDSErrors[index]?.tdsSection ? 'error form-control' : 'form-control'}
                                      onChange={(e) =>
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsSection: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                    {partySpecialTDSErrors[index]?.tdsSection && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partySpecialTDSErrors[index].tdsSection}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.rateForm}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) => prev.map((r) => (r.id === row.id ? { ...r, rateForm: value } : r)));
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            rateForm: !value ? 'Rate From is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.rateForm ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.rateForm && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].rateForm}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.rateTo}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) => prev.map((r) => (r.id === row.id ? { ...r, rateTo: value } : r)));
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            rateTo: !value ? 'Rate To is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.rateTo ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.rateTo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].rateTo}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.tdsPercentage}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsPercentage: value } : r))
                                        );
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            tdsPercentage: !value ? 'Tds Percentage is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.tdsPercentage ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.tdsPercentage && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].tdsPercentage}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.surPercentage}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, surPercentage: value } : r))
                                        );
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            surPercentage: !value ? 'Sur Percentage is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.surPercentage ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.surPercentage && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].surPercentage}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.edPercentage}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, edPercentage: value } : r))
                                        );
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            edPercentage: !value ? 'edPercentage is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.edPercentage ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.edPercentage && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].edPercentage}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.tdsCertificateNo}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsCertificateNo: value } : r))
                                        );
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            tdsCertificateNo: !value ? 'Tds Certificate No is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.tdsCertificateNo ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.tdsCertificateNo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].tdsCertificateNo}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 4 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowChargesExemption} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">TDS / WH Section</th>
                                <th className="px-2 py-2 text-white text-center">Charges</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyChargesExemption.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() => handleDeleteRowChargesExemption(row.id)}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.tdsSection}
                                      className={partyChargesExemptionErrors[index]?.tdsSection ? 'error form-control' : 'form-control'}
                                      onChange={(e) =>
                                        setPartyChargesExemption((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsSection: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                    {partyChargesExemptionErrors[index]?.tdsSection && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyChargesExemptionErrors[index].tdsSection}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.charge}
                                      className={partyChargesExemptionErrors[index]?.charge ? 'error form-control' : 'form-control'}
                                      onChange={(e) =>
                                        setPartyChargesExemption((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, charge: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                    {partyChargesExemptionErrors[index]?.charge && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyChargesExemptionErrors[index].charge}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 5 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowCurrencyMapping} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">Transaction Currency</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyCurrencyMapping.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowCurrencyMapping(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      className={
                                        partyCurrencyMappingErrors[index]?.transactionCurrency ? 'error form-control' : 'form-control'
                                      }
                                      value={row.transactionCurrency}
                                      onChange={(e) =>
                                        setPartyCurrencyMapping((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, transactionCurrency: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                    {partyCurrencyMappingErrors[index]?.transactionCurrency && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyCurrencyMappingErrors[index].transactionCurrency}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 6 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowSalesPerson} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">Sales Person</th>
                                <th className="px-2 py-2 text-white text-center">Emp Code</th>
                                <th className="px-2 py-2 text-white text-center">Sales Branch</th>
                                <th className="px-2 py-2 text-white text-center">Effective From</th>
                                <th className="px-2 py-2 text-white text-center">Effective Till</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partySalesPersonTagging.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowSalesPerson(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.salesPerson}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, salesPerson: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            salesPerson: !value ? 'Sales Person is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.salesPerson ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.salesPerson && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].salesPerson}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.empCode}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, empCode: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            empCode: !value ? 'Emp Code is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.empCode ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.empCode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].empCode}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.salesBranch}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, salesBranch: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            salesBranch: !value ? 'Sales Branch is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.salesBranch ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.salesBranch && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].salesBranch}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.effectiveFrom}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, effectiveFrom: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            effectiveFrom: !value ? 'Effective From is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.effectiveFrom ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.effectiveFrom && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].effectiveFrom}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.effectiveTill}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, effectiveTill: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            effectiveTill: !value ? 'Effective Till is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.effectiveTill ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.effectiveTill && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].effectiveTill}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 7 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowTdsExempted} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-8">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">TDS Exempted Certificate</th>
                                <th className="px-2 py-2 text-white text-center">Value</th>
                                <th className="px-2 py-2 text-white text-center">Fin Year</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyTdsExempted.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowTdsExempted(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.tdsExemptedCertificate}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyTdsExempted((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsExemptedCertificate: value } : r))
                                        );
                                        setPartyTdsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            tdsExemptedCertificate: !value ? 'Tds Exempted Certificate is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyTdsErrors[index]?.tdsExemptedCertificate ? 'error form-control' : 'form-control'}
                                      style={{ width: '100%' }}
                                    />
                                    {partyTdsErrors[index]?.tdsExemptedCertificate && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyTdsErrors[index].tdsExemptedCertificate}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.value}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyTdsExempted((prev) => prev.map((r) => (r.id === row.id ? { ...r, value: value } : r)));
                                        setPartyTdsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            value: !value ? 'Value is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyTdsErrors[index]?.value ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyTdsErrors[index]?.value && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyTdsErrors[index].value}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.finYear}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyTdsExempted((prev) => prev.map((r) => (r.id === row.id ? { ...r, finYear: value } : r)));
                                        setPartyTdsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            finYear: !value ? 'Fin Year is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyTdsErrors[index]?.finYear ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyTdsErrors[index]?.finYear && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyTdsErrors[index].finYear}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 8 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPartnerTagging} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="px-2 py-2 text-white text-center">Action</th>
                                <th className="px-2 py-2 text-white text-center">SNo</th>
                                <th className="px-2 py-2 text-white text-center">Partner Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyPartnerTagging.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowPartnerTagging(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.partnerName}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyPartnerTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, partnerName: value } : r))
                                        );
                                        setPartyPartnerErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            partnerName: !value ? 'Partner Name is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyPartnerErrors[index]?.partnerName ? 'error form-control' : 'form-control'}
                                      style={{ width: '100%' }}
                                    />
                                    {partyPartnerErrors[index]?.partnerName && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyPartnerErrors[index].partnerName}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 9 && (
                  <>
                    <div className="row d-flex mt-3">
                      <div className="col-md-4 mb-3">
                        <TextField
                          id="whoBroughtVendor"
                          fullWidth
                          name="whoBroughtVendor"
                          label="Who Bought Vendor"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.whoBroughtVendor}
                          onChange={handleInputChange}
                          error={partyVendorErrors.whoBroughtVendor}
                          helperText={partyVendorErrors.whoBroughtVendor}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <TextField
                          id="whatBasisVendorSelected"
                          fullWidth
                          name="whatBasisVendorSelected"
                          label="What Basis Vendor Selected"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.whatBasisVendorSelected}
                          onChange={handleInputChange}
                          error={partyVendorErrors.whatBasisVendorSelected}
                          helperText={partyVendorErrors.whatBasisVendorSelected}
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <TextField
                          id="justification"
                          fullWidth
                          name="justification"
                          label="justification"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.justification}
                          onChange={handleInputChange}
                          error={partyVendorErrors.justification}
                          helperText={partyVendorErrors.justification}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <TextField
                          id="slaPoints"
                          fullWidth
                          name="slaPoints"
                          label="SLA Points"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.slaPoints}
                          onChange={handleInputChange}
                          error={partyVendorErrors.slaPoints}
                          helperText={partyVendorErrors.slaPoints}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <TextField
                          id="commonAgreedTerms"
                          fullWidth
                          name="commonAgreedTerms"
                          label="Common Agreed Terms"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.commonAgreedTerms}
                          onChange={handleInputChange}
                          error={partyVendorErrors.commonAgreedTerms}
                          helperText={partyVendorErrors.commonAgreedTerms}
                        />
                      </div>
                    </div>
                  </>
                )}
              </Box>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default PartyMaster;
