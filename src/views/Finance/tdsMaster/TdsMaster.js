import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { FormHelperText, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ToastComponent, { showToast } from 'utils/toast-component';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const TdsMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [formValues, setFormValues] = useState({
    active: true,
    section: '',
    sectionName: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getAllTdsMasterByOrgId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked, type, id } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value.toUpperCase(),
      [id]: type === 'checkbox' ? checked : value.toUpperCase(),
    }));

    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const [tdsTableData, setTdsTableData] = useState([
    {
      id: 1,
      fromDate: '',
      toDate: '',
      tcs: '',
      sur: '',
      eds: ''
    }
  ]);

  const [tdsTableErrors, setTdsTableErrors] = useState([
    {
      fromDate: '',
      toDate: '',
      tcs: '',
      sur: '',
      eds: ''
    }
  ]);

  const handleAddRow = () => {
    if (isLastRowEmpty(tdsTableData)) {
      displayRowError(tdsTableData);
      return;
    }

    const newRow = {
      id: Date.now(),
      fromDate: '',
      toDate: '',
      tcs: '',
      sur: '',
      eds: ''
    };

    setTdsTableData((prevData) => [...prevData, newRow]);
    setTdsTableErrors((prevErrors) => [
      ...prevErrors,
      { fromDate: null, toDate: null, tcs: '', sur: '', eds: '' }
    ]);
  };


  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    return (!lastRow.fromDate || !lastRow.toDate || !lastRow.tcs || !lastRow.sur || !lastRow.eds);
  };


  const displayRowError = (table) => {
    setTdsTableErrors((prevErrors) => {
      const lastIndex = table.length - 1;

      const newErrors = [...prevErrors];
      while (newErrors.length < table.length) {
        newErrors.push({ fromDate: null, toDate: null, tcs: '', sur: '', eds: '' });
      }

      newErrors[lastIndex] = {
        fromDate: !table[lastIndex].fromDate ? 'From Date is required' : '',
        toDate: !table[lastIndex].toDate ? 'To Date is required' : '',
        tcs: !table[lastIndex].tcs ? 'Tcs is required' : '',
        sur: !table[lastIndex].sur ? 'Sur is required' : '',
        eds: !table[lastIndex].eds ? 'Eds is required' : ''
      };

      return newErrors;
    });
  };


  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
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
      active: true
    });

    setTdsTableData([
      {
        id: 1,
        fromDate: '',
        toDate: '',
        tcs: '',
        sur: '',
        eds: ''
      }
    ]);

    setTdsTableErrors([
      {
        fromDate: null,
        toDate: null,
        tcs: '',
        sur: '',
        eds: ''
      }
    ]);

    setValidationErrors({});
    setEditId('');
  };

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    const errors = {};
    const tableErrors = tdsTableData.map((row) => ({
      // fromDate: !row.fromDate ? 'From Date is required' : '',
      // toDate: !row.toDate ? 'To Date is required' : '',
      // tcs: !row.tcs ? 'TCS is required' : '',
      // sur: !row.sur ? 'Sur is required' : '',
      // eds: !row.eds ? 'EDS is required' : ''
    }));

    let hasTableErrors = false;

    tableErrors.forEach((err) => {
      if (Object.values(err).some((error) => error)) {
        hasTableErrors = true;
      }
    });

    if (!formValues.section.trim()) {
      errors.section = 'Section is required';
    }
    if (!formValues.sectionName) {
      errors.sectionName = 'Section Name is required';
    }

    setValidationErrors(errors);
    setTdsTableErrors(tableErrors);

    // Prevent saving if form or table errors exist
    if (Object.keys(errors).length === 0 && !hasTableErrors) {
      setIsLoading(true);

      const tdsTableVo = tdsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        fromDate: formatDate(row.fromDate),
        toDate: formatDate(row.toDate),
        tcsPercentage: parseFloat(row.tcs) || 0,
        surPercentage: parseFloat(row.sur) || 0,
        edcessPercentage: parseFloat(row.eds) || 0
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        section: formValues.section,
        sectionName: formValues.sectionName,
        active: formValues.active,
        createdBy: loginUserName,
        orgId: orgId,
        tdsMaster2DTO: tdsTableVo
      };

      try {
        const response = await apiCalls('put', `master/updateCreateTdsMaster`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'Tds Updated Successfully' : 'Tds created successfully');
          handleClear();
          getAllTdsMasterByOrgId();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Tds creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Tds creation failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getAllTdsMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/master/getAllTdsMasterByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.tdsMasterVO.reverse() || []);
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getTdsMasterById = async (row) => {
    console.log('first', row);
    setEditId(row.original.id);
    setShowForm(true);

    try {
      const result = await apiCalls('get', `/master/getAllTdsMasterById?id=${row.original.id}`);
      if (result) {
        const tdsMasterVO = result.paramObjectsMap.tdsMasterVO[0];
        setEditMode(true);

        setFormValues({
          section: tdsMasterVO.section,
          sectionName: tdsMasterVO.sectionName,
          active: tdsMasterVO.active
        });
        setTdsTableData(
          tdsMasterVO.tdsMaster2VO.map((role) => ({
            id: role.id,
            fromDate: role.fromDate,
            toDate: role.toDate,
            tcs: role.tcsPercentage,
            sur: role.surPercentage,
            eds: role.edcessPercentage
          }))
        );
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



  return (
    <div>
      <ToastComponent />
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
                <FormControl variant="outlined" fullWidth size="small" error={!!validationErrors.section}>
                  <InputLabel id="section">Section</InputLabel>
                  <Select
                    labelId="section"
                    label="Section"
                    name="section"
                    value={formValues.section}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="NO">NO</MenuItem>
                    <MenuItem value="NORMAL">NORMAL</MenuItem>
                    <MenuItem value="SPECIAL">SPECIAL</MenuItem>
                  </Select>
                  {validationErrors.section && <FormHelperText>{validationErrors.section}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="sectionName"
                    label="Section Name"
                    size="small"
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
            {/* <TableComponent formValues={formValues} setFormValues={setFormValues} /> */}
            <div className="row d-flex ml">
              <div className="mb-1">
                <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
              </div>
              <div className="row mt-2">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr style={{ backgroundColor: '#673AB7' }}>
                          <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                            Action
                          </th>
                          <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                            S.No
                          </th>
                          <th className="px-2 py-2 text-white text-center">From Date</th>
                          <th className="px-2 py-2 text-white text-center">To Date</th>
                          <th className="px-2 py-2 text-white text-center">TDS %</th>
                          <th className="px-2 py-2 text-white text-center">Sur %</th>
                          <th className="px-2 py-2 text-white text-center">EDS %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(tdsTableData) &&
                          tdsTableData.map((row, index) => (
                            <tr key={row.id}>
                              <td className="border px-2 py-2 text-center">
                                <ActionButton
                                  title="Delete"
                                  icon={DeleteIcon}
                                  onClick={() => handleDeleteRow(row.id, tdsTableData, setTdsTableData, tdsTableErrors, setTdsTableErrors)}
                                />
                              </td>
                              <td className="text-center">
                                <div className="pt-2">{index + 1}</div>
                              </td>

                              <td className="border px-2 py-2">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    value={
                                      row.fromDate
                                        ? dayjs(row.fromDate, 'YYYY-MM-DD').isValid()
                                          ? dayjs(row.fromDate, 'YYYY-MM-DD')
                                          : null
                                        : null
                                    }
                                    slotProps={{
                                      textField: { size: 'small', clearable: true }
                                    }}
                                    format="DD-MM-YYYY"
                                    onChange={(newValue) => {
                                      setTdsTableData((prev) =>
                                        prev.map((r) =>
                                          r.id === row.id
                                            ? { ...r, fromDate: newValue ? newValue.format('YYYY-MM-DD') : null }
                                            : r
                                        )
                                      );
                                      setTdsTableErrors((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = {
                                          ...newErrors[index],
                                          fromDate: !newValue ? 'From Date is required' : '',
                                        };
                                        return newErrors;
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        className={
                                          tdsTableErrors[index]?.fromDate ? 'error form-control' : 'form-control'
                                        }
                                      />
                                    )}
                                    minDate={dayjs()}
                                  />
                                </LocalizationProvider>
                                {tdsTableErrors[index]?.fromDate && (
                                  <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    {tdsTableErrors[index].fromDate}
                                  </div>
                                )}
                              </td>


                              <td className="border px-2 py-2">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    value={
                                      row.toDate
                                        ? dayjs(row.toDate, 'YYYY-MM-DD').isValid()
                                          ? dayjs(row.toDate, 'YYYY-MM-DD')
                                          : null
                                        : null
                                    }
                                    slotProps={{
                                      textField: { size: 'small', clearable: true }
                                    }}
                                    format="DD-MM-YYYY"
                                    onChange={(newValue) => {
                                      setTdsTableData((prev) =>
                                        prev.map((r) =>
                                          r.id === row.id
                                            ? { ...r, toDate: newValue ? newValue.format('YYYY-MM-DD') : null }
                                            : r
                                        )
                                      );
                                      setTdsTableErrors((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = {
                                          ...newErrors[index],
                                          toDate: !newValue ? 'To Date is required' : '',
                                        };
                                        return newErrors;
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        // size="small"
                                        className={
                                          tdsTableErrors[index]?.toDate
                                            ? 'error form-control'
                                            : 'form-control'
                                        }
                                      />
                                    )}
                                    minDate={row.toDate ? dayjs(row.toDate) : dayjs()}
                                  />
                                  {tdsTableErrors[index]?.toDate && (
                                    <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                      {tdsTableErrors[index].toDate}
                                    </div>
                                  )}
                                </LocalizationProvider>
                              </td>

                              <td className="border px-2 py-2">
                                <input
                                  type="text"
                                  value={row.tcs}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numericRegex = /^[0-9]*$/;
                                    if (numericRegex.test(value)) {
                                      setTdsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, tcs: value } : r)));
                                      setTdsTableErrors((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = { ...newErrors[index], tcs: !value ? 'Tcs is required' : '' };
                                        return newErrors;
                                      });
                                    } else {
                                      setTdsTableErrors((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = { ...newErrors[index], tcs: 'Only numeric characters are allowed' };
                                        return newErrors;
                                      });
                                    }
                                  }}
                                  className={tdsTableErrors[index]?.tcs ? 'error form-control' : 'form-control'}
                                />
                                {tdsTableErrors[index]?.tcs && (
                                  <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    {tdsTableErrors[index].tcs}
                                  </div>
                                )}
                              </td>

                              <td className="border px-2 py-2">
                                <input
                                  type="text"
                                  value={row.sur}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numericRegex = /^[0-9]*$/;
                                    if (numericRegex.test(value)) {
                                      setTdsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, sur: value } : r)));
                                      setTdsTableErrors((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = { ...newErrors[index], sur: !value ? 'Sur is required' : '' };
                                        return newErrors;
                                      });
                                    } else {
                                      setTdsTableErrors((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = { ...newErrors[index], sur: 'Only numeric characters are allowed' };
                                        return newErrors;
                                      });
                                    }
                                  }}
                                  className={tdsTableErrors[index]?.sur ? 'error form-control' : 'form-control'}
                                // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                />
                                {tdsTableErrors[index]?.sur && (
                                  <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    {tdsTableErrors[index].sur}
                                  </div>
                                )}
                              </td>

                              <td className="border px-2 py-2">
                                <input
                                  type="text"
                                  value={row.eds}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numericRegex = /^[0-9]*$/;
                                    if (numericRegex.test(value)) {
                                      setTdsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, eds: value } : r)));
                                      setTdsTableErrors((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = { ...newErrors[index], eds: !value ? 'Eds is required' : '' };
                                        return newErrors;
                                      });
                                    } else {
                                      setTdsTableErrors((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = { ...newErrors[index], eds: 'Only numeric characters are allowed' };
                                        return newErrors;
                                      });
                                    }
                                  }}
                                  className={tdsTableErrors[index]?.eds ? 'error form-control' : 'form-control'}
                                />
                                {tdsTableErrors[index]?.eds && (
                                  <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                    {tdsTableErrors[index].eds}
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
          </>
        ) : (
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getTdsMasterById} />
        )}
      </div>
    </div>
  );
};

export default TdsMaster;
