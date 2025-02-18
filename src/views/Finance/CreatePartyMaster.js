import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const CreatePartyMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [formValues, setFormValues] = useState({
    active: true,
    partyType: '',
    partyTypeCode: '',
    createdBy: loginUserName,
    orgId: orgId
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getAllPartyMasterByOrgId();
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value, checked, type } = e.target;

  //   setFormValues((prev) => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value.toUpperCase() // Convert text inputs to uppercase
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newValue = type === 'checkbox' ? checked : value.toUpperCase();
    let errors = { ...validationErrors };

    if (name === 'partyType') {
      if (/[^A-Z0-9 ]/.test(newValue)) {
        errors.partyType = 'Special characters are not allowed.';
      } else {
        delete errors.partyType;
      }
      newValue = newValue.replace(/[^A-Z0-9 ]/g, ''); // Prevent special characters from being entered
    }

    if (name === 'partyTypeCode') {
      if (newValue.length > 10) {
        newValue = newValue.slice(0, 10); // Restrict to 10 characters
      }
    }

    setValidationErrors(errors);
    setFormValues((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const columns = [
    { accessorKey: 'partyType', header: 'Party Type', size: 140 },
    { accessorKey: 'partyTypeCode', header: 'Party Code', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleClear = () => {
    setFormValues({
      active: true,
      partyType: '',
      partyTypeCode: ''
    });
    setValidationErrors({});
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);
        const response = await apiCalls('put', '/master/createUpdatePartyType', formValues);
        console.log('Save Successful', response.data);
        toast.success(editMode ? ' Party Master Updated Successfully' : ' Party Master created successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        handleClear();
        getAllPartyMasterByOrgId();
        setIsLoading(false);
      } catch (error) {
        console.error('Save Failed', error);
      }
    } else {
      console.error('Validation Errors:', validationErrors);
    }
  };

  const getAllPartyMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllPartyTypeByOrgId?orgid=${orgId}`);
      setData(result.paramObjectsMap.partyTypeVO.reverse() || []);
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getPartyMasterById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/master/getPartyTypeById?id=${row.original.id}`);
      if (result) {
        const partyMasterVO = result.paramObjectsMap.partyTypeVO[0];
        setEditMode(true);

        setFormValues({
          partyType: partyMasterVO.partyType || '',
          partyTypeCode: partyMasterVO.partyTypeCode || '',
          active: partyMasterVO.active || false,
          id: partyMasterVO.id || 0,
          orgId: orgId
        });
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleList = () => {
    setShowForm(!showForm);
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.partyType.trim()) {
      errors.partyType = 'Party Type is required';
    }
    if (!formValues.partyTypeCode.trim()) {
      errors.partyTypeCode = 'Party Code is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          {/* <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} /> */}
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} isLoading={isLoading} margin="0 10px 0 10px" />
        </div>
        {showForm ? (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="partyType"
                    label="Party Type"
                    name="partyType"
                    size="small"
                    required
                    value={formValues.partyType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!validationErrors.partyType}
                    helperText={validationErrors.partyType}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="partyTypeCode"
                    label="Party Code"
                    name="partyTypeCode"
                    size="small"
                    required
                    value={formValues.partyTypeCode}
                    onChange={handleInputChange}
                    // inputProps={{ maxLength: 30 }}
                    error={!!validationErrors.partyTypeCode}
                    helperText={validationErrors.partyTypeCode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="active"
                        name="active"
                        checked={formValues.active}
                        onChange={handleInputChange}
                        sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                      />
                    }
                    label="Active"
                  />
                </FormGroup>
              </div>
            </div>
          </>
        ) : (
          <CommonListViewTable data={data && data} columns={columns} blockEdit={true} toEdit={getPartyMasterById} />
        )}
      </div>
    </div>
  );
};

export default CreatePartyMaster;
