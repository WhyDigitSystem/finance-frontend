import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiCall from 'apicalls';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/action-button';
import CommonTable from 'views/basicMaster/CommonTable';
import TableComponent from './TableComponent';

const ListOfValues = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [formValues, setFormValues] = useState({
    listCode: '',
    listDescription: '',
    active: true,
    createdBy: 'currentUser', // replace with actual user
    updatedBy: 'currentUser', // replace with actual user
    orgId: orgId, // replace with actual org ID
    listOfValues1DTO: []
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllListOfValuesByOrgId();
  }, []);

  const handleInputChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));

    // Validate the input fields
    if (id === 'listCode' || id === 'listDescription') {
      if (!value.trim()) {
        setValidationErrors((prev) => ({
          ...prev,
          [id]: 'This field is required'
        }));
      } else {
        setValidationErrors((prev) => {
          const { [id]: removed, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const columns = [
    { accessorKey: 'listCode', header: 'List Code', size: 140 },
    { accessorKey: 'listDescription', header: 'Description', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleClear = () => {
    setFormValues({
      listCode: '',
      listDescription: '',
      active: true,
      createdBy: 'currentUser',
      updatedBy: 'currentUser',
      orgId: 1,
      listOfValues1DTO: []
    });
    setValidationErrors({});
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);
        const response = await apiCall('put', '/master/updateCreateListOfValues', formValues);
        console.log('Save Successful', response.data);
        toast.success('List of value created successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getAllListOfValuesByOrgId();
        handleClear();
        setIsLoading(false);
      } catch (error) {
        console.error('Save Failed', error);
      }
    } else {
      console.error('Validation Errors:', validationErrors);
    }
  };

  const getAllListOfValuesByOrgId = async () => {
    try {
      const result = await apiCall('get', `/master/getListOfValuesByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.listOfValuesVO || []);
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getListOfValueById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCall('get', `/master/getListOfValuesById?id=${row.original.id}`);

      if (result) {
        const listValueVO = result.paramObjectsMap.listOfValuesVO[0];
        // setEditMode(true);

        setFormValues({
          listCode: listValueVO.listCode || '',
          listDescription: listValueVO.listDescription || '',
          active: listValueVO.active || false,
          id: listValueVO.id || 0,
          listOfValues1DTO: listValueVO.listOfValues1VO || []
        });

        console.log('DataToEdit', listValueVO);
      } else {
        // Handle erro
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
    if (!formValues.listCode.trim()) {
      errors.listCode = 'This field is required';
    }
    if (!formValues.listDescription.trim()) {
      errors.listDescription = 'This field is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} isLoading={isLoading} margin="0 10px 0 10px" />
        </div>
        {showForm ? (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="listCode"
                    label="List Code"
                    size="small"
                    required
                    value={formValues.listCode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!validationErrors.listCode}
                    helperText={validationErrors.listCode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="listDescription"
                    label="List Description"
                    size="small"
                    required
                    value={formValues.listDescription}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!validationErrors.listDescription}
                    helperText={validationErrors.listDescription}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="active"
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
            <TableComponent formValues={formValues} setFormValues={setFormValues} />
          </>
        ) : (
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getListOfValueById} />
        )}
      </div>
    </div>
  );
};

export default ListOfValues;
