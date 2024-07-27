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

const TdsMaster = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [formValues, setFormValues] = useState({
    active: true,
    createdBy: '',
    orgId: orgId,
    section: '',
    sectionName: '',
    tdsMaster2DTO: [],
    updatedBy: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getAllTdsMasterByOrgId();
  }, []);

  const handleInputChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));

    // Validate the input fields
    if (id === 'section' || id === 'sectionName') {
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
    { accessorKey: 'section', header: 'Section', size: 140 },
    { accessorKey: 'sectionName', header: 'Section Name', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleClear = () => {
    setFormValues({
      section: '',
      sectionName: '',
      active: true,
      createdBy: 'currentUser',
      updatedBy: 'currentUser',
      orgId: '',
      tdsMaster2DTO: []
    });
    setValidationErrors({});
  };

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    const formDataWithEncryptedPassword = {
      ...formValues,
      tdsMaster2DTO: formValues.tdsMaster2DTO.map((item) => ({
        ...item,
        fromDate: formatDate(item.fromDate),
        toDate: formatDate(item.toDate)
      }))
    };
    if (validateForm()) {
      try {
        setIsLoading(true);
        const response = await apiCall('put', '/master/updateCreateTdsMaster', formDataWithEncryptedPassword);
        console.log('Save Successful', response.data);
        toast.success(editMode ? ' Tds Master Updated Successfully' : ' Tds Master created successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        getAllTdsMasterByOrgId();
        handleClear();
        setIsLoading(false);
      } catch (error) {
        console.error('Save Failed', error);
      }
    } else {
      console.error('Validation Errors:', validationErrors);
    }
  };

  const getAllTdsMasterByOrgId = async () => {
    try {
      const result = await apiCall('get', `/master/getAllTdsMasterByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.tdsMasterVO || []);
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getTdsMasterById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCall('get', `/master/getAllTdsMasterById?id=${row.original.id}`);
      if (result) {
        const tdsMasterVO = result.paramObjectsMap.tdsMasterVO[0];
        setEditMode(true);

        setFormValues({
          section: tdsMasterVO.section || '',
          sectionName: tdsMasterVO.sectionName || '',
          active: tdsMasterVO.active || false,
          id: tdsMasterVO.id || 0,
          tdsMaster2DTO: tdsMasterVO.tdsMaster2VO || [],
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
    if (!formValues.section.trim()) {
      errors.section = 'This field is required';
    }
    if (!formValues.sectionName.trim()) {
      errors.sectionName = 'This field is required';
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
                    id="section"
                    label="Section"
                    size="small"
                    required
                    value={formValues.section}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!validationErrors.section}
                    helperText={validationErrors.section}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="sectionName"
                    label="Section Name"
                    size="small"
                    required
                    value={formValues.sectionName}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!validationErrors.sectionName}
                    helperText={validationErrors.sectionName}
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
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getTdsMasterById} />
        )}
      </div>
    </div>
  );
};

export default TdsMaster;
