import React, { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Autocomplete } from '@mui/material';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
const CreateKit = () => {
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));

  const [showForm, setShowForm] = useState(true);
  const [allTypes, setAllTypes] = useState([]);
  const [allassetType, setAllassetType] = useState([]);
  const [editId, setEditId] = useState('');
  const [data, setData] = useState(true);
    const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    kitId:'',
    kitDesc:'',
    partQty:'',
    active: true,
  });
  const [fieldErrors, setFieldErrors] = useState({
    kitId:'',
    kitDesc:'',
    partQty:''
  });
  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      assetType: '',
      category: '',
      categoryCode: '',
      assetCode: '',
      assetDesc: '',
      assetQty: '',
      categoryOptions: [],
      assetOptions: [],
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      assetType: '',
      category: '',
      categoryCode: '',
      assetCode: '',
      assetDesc: '',
      assetQty: ''
    }
  ]);
  const handleView = () => {
    setShowForm(!showForm);
  };
  const handleClear = () => {
    setFormData({
      kitId:'',
      kitDesc:'',
      partQty:'',
      active: true,
    });
    setFieldErrors({
      kitId:'',
      kitDesc:'',
      partQty:''
    });
    setDetailsTableData([{ id: 1,       
      assetType: '',
      category: '',
      categoryCode: '',
      assetCode: '',
      assetDesc: '',
      assetQty: '' }]);
    setDetailsTableErrors('');
    setEditId('');
  };
  useEffect(() => {
    getAllAssetCategoryByOrgId();
    getAllTypes();
  }, []);
  const listViewColumns = [
    { accessorKey: 'kitNo', header: 'Kit Id', size: 140 },
    { accessorKey: 'kitDesc', header: 'Description', size: 140 },
    { accessorKey: 'partQty', header: 'Part Qty', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 },
  ];
  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';
  if ((name === 'kitId' || name === 'kitDesc') && !/^[A-Za-z0-9- ]*$/.test(value)) {
    errorMessage = 'Only Alphanumerics Allowed';
  }
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));
    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toUpperCase()
      }));
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      assetType: '',
      category: '',
      categoryCode: '',
      assetCode: '',
      assetDesc: '',
      assetQty: '',
      categoryOptions: [],
      assetOptions: []
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, {       
      assetType: '',
      category: '',
      categoryCode: '',
      assetCode: '',
      assetDesc: '',
      assetQty: '' }]);
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
  const getAllTypes = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getAssetTypeByOrgId?orgid=${orgId}`);
      const allTypes = result.paramObjectsMap.assetTypeVO || [];
      const activeTypes = allTypes.filter(type => type.active === 'Active');
      setAllTypes(activeTypes);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getAllCategory = async (assetType, rowIndex) => {
    try {
      const response = await apiCalls('get', `/kitController/getAssetCategoeyByAsset?assetType=${assetType}&orgId=${orgId}`);
      if (response.status === true) {
        const updatedData = [...detailsTableData];
        updatedData[rowIndex].categoryOptions = response.paramObjectsMap.assetCategory || [];
        updatedData[rowIndex].categoryCode = '';
        updatedData[rowIndex].category = '';
        setDetailsTableData(updatedData);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAllAsset = async (assetCategory, rowIndex) => {
    if(detailsTableData[rowIndex]?.assetType){
    const assetType = detailsTableData[rowIndex]?.assetType;
    try {
      const response = await apiCalls('get', `/kitController/getAssetDescriptionByAssetCode?assetCategory=${assetCategory}&assetType=${assetType}&orgId=${orgId}`);
      if (response.status === true) {
        const updatedData = [...detailsTableData];
        updatedData[rowIndex].assetOptions = response.paramObjectsMap.asset || [];
        updatedData[rowIndex].assetCode = '';
        updatedData[rowIndex].asset = '';
        setDetailsTableData(updatedData);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }}else{
      showToast("error","Need Asset Type");
    }
  };
  const getAllAssetCategoryByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/kitController/getKitByOrgId?orgid=${orgId}`);
      setData(result.paramObjectsMap.kitVO.reverse() || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  // const getAssetCategoryById = async (row) => {
  //   console.log('first', row);
  //   setShowForm(true);
  //   try {
  //     const result = await apiCalls('get', `/kitController/getKitById?id=${row.original.id}`);

  //     if (result) {
  //       const assetTypeVO = result.paramObjectsMap.kitVO;
  //       setEditId(row.original.id);
  //       setFormData({
  //         // branch: assetTypeVO.branch,
  //         // branchCode:assetTypeVO. branchCode,
  //         createdBy: assetTypeVO.createdBy,
  //         updatedBy: assetTypeVO.updatedBy,
  //         orgId: assetTypeVO.orgId,
  //         finYear: assetTypeVO.finyr,
  //         kitId: assetTypeVO.kitNo,
  //         kitDesc: assetTypeVO.kitDesc,
  //         partQty: assetTypeVO.partQty,
  //         active: assetTypeVO.active === 'Active' ? true : false,
  //       });
  //       setDetailsTableData(
  //         assetTypeVO.kitAssetVO.map((row) => ({
  //           id: row.id,
  //           assetQty: row.quantity,
  //           assetDesc: row.assetName,
  //           assetCode: row.assetCodeId,
  //           categoryCode: row.categoryCode,
  //           category: row.assetCategory,
  //           assetType: row.assetType,
  //         }))
  //       );
  //       getAllCategory(detailsTableData.assetType);
  //     } else {
  //       // Handle erro
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
const getAssetCategoryById = async (row) => {
  setShowForm(true);
  try {
    const result = await apiCalls('get', `/kitController/getKitById?id=${row.original.id}`);

    if (result) {
      const assetTypeVO = result.paramObjectsMap.kitVO;
      setEditId(row.original.id);
      setFormData({
        createdBy: assetTypeVO.createdBy,
        updatedBy: assetTypeVO.updatedBy,
        orgId: assetTypeVO.orgId,
        finYear: assetTypeVO.finyr,
        kitId: assetTypeVO.kitNo,
        kitDesc: assetTypeVO.kitDesc,
        partQty: assetTypeVO.partQty,
        active: assetTypeVO.active === 'Active' ? true : false,
      });

      // Process each row to also populate categoryOptions and assetOptions
      const updatedDetails = await Promise.all(
        assetTypeVO.kitAssetVO.map(async (rowItem) => {
          let categoryOptions = [];
          let assetOptions = [];

          // Fetch category options
          try {
            const categoryRes = await apiCalls('get', `/kitController/getAssetCategoeyByAsset?assetType=${rowItem.assetType}&orgId=${orgId}`);
            if (categoryRes.status === true) {
              categoryOptions = categoryRes.paramObjectsMap.assetCategory || [];
            }
          } catch (err) {
            console.error("Error fetching category options", err);
          }

          // Fetch asset options
          try {
            const assetRes = await apiCalls('get', `/kitController/getAssetDescriptionByAssetCode?assetCategory=${rowItem.assetCategory}&assetType=${rowItem.assetType}&orgId=${orgId}`);
            if (assetRes.status === true) {
              assetOptions = assetRes.paramObjectsMap.asset || [];
            }
          } catch (err) {
            console.error("Error fetching asset options", err);
          }

          return {
            id: rowItem.id,
            assetQty: rowItem.quantity,
            assetDesc: rowItem.assetName,
            assetCode: rowItem.assetCodeId,
            categoryCode: rowItem.categoryCode,
            category: rowItem.assetCategory,
            assetType: rowItem.assetType,
            categoryOptions: categoryOptions,
            assetOptions: assetOptions
          };
        })
      );

      setDetailsTableData(updatedDetails);
    } else {
      showToast("error", "Failed to fetch Kit details");
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
  const handleSave = async () => {
    const errors = {};
    if (!formData.kitId) {
      errors.kitId = 'Kit Id is required';
    }
    if (!formData.kitDesc) {
      errors.kitDesc = 'Kit Desc is required';
    }
    if (!formData.partQty) {
      errors.partQty = 'Part Qty is required';
    }
    setFieldErrors(errors);
    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.assetType) {
        rowErrors.assetType = 'Asset Type is required';
        detailTableDataValid = false;
      }
      if (!row.category) {
        rowErrors.category = 'Category is required';
        detailTableDataValid = false;
      }
      if (!row.assetCode) {
        rowErrors.assetCode = 'Asset Code is required';
        detailTableDataValid = false;
      }
      if (!row.assetQty) {
        rowErrors.assetQty = 'Asset Qty is required';
        detailTableDataValid = false;
      }
      return rowErrors;
    });
    setDetailsTableErrors(newTableErrors);
    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const createKitVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        assetType: row.assetType,
        assetCategory: row.category,
        categoryCode: row.categoryCode,
        assetCodeId: row.assetCode,
        assetName: row.assetDesc,
        quantity: parseInt(row.assetQty),
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        // branch: branch,
        // branchCode: branchCode,
        active: formData.active,
        kitAssetDTO: createKitVO,
        createdBy: loginUserName,
        updatedBy: loginUserName,
        orgId: orgId,
        finyr: finYear,
        kitNo: formData.kitId,
        kitDesc: formData.kitDesc,
        partQty: parseInt(formData.partQty),
      };
      try {
        const response = await apiCalls('put', `/kitController/updateCreateKit`, saveFormData);
        if (response.status === true) {
          showToast('success', editId ? 'Kit Creation Updated Successfully' : 'Kit Creation Created successfully');
          getAllAssetCategoryByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Kit Creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Kit Creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
  const handleCheckboxChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      active: event.target.checked
    }));
  };
  const handleAssetTypeChange = (e, rowIndex) => {
    const selectedAssetType = e.target.value;
    const updatedData = [...detailsTableData];
    updatedData[rowIndex].assetType = selectedAssetType;
    updatedData[rowIndex].category = '';
    updatedData[rowIndex].categoryCode = '';
    updatedData[rowIndex].categoryOptions = [];
    setDetailsTableData(updatedData);
    getAllCategory(selectedAssetType, rowIndex);
  };
  const handleCategoryChange = (selectedOption, rowIndex) => {
    const updatedData = [...detailsTableData];
  
    if (selectedOption) {
      updatedData[rowIndex].category = selectedOption.category;
      updatedData[rowIndex].categoryCode = selectedOption.categoryCode;
    } else {
      updatedData[rowIndex].category = '';
      updatedData[rowIndex].categoryCode = '';
    }
    getAllAsset(selectedOption.category, rowIndex);
    setDetailsTableData(updatedData);
  };
  useEffect(() => {
    if(detailsTableData.assetType && detailsTableData.category){
  }},[detailsTableData])
  const handleAssetCodeChange = (selectedOption, rowIndex) => {
    const updatedData = [...detailsTableData];
  
    if (selectedOption) {
      updatedData[rowIndex].assetCode = selectedOption.assetCode;
      updatedData[rowIndex].assetDesc = selectedOption.asset;
    } else {
      updatedData[rowIndex].assetCode = '';
      updatedData[rowIndex].assetDesc = '';
    }
    setDetailsTableData(updatedData);
  };
  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-end mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField
                    id="kitId"
                    label= "Kit Id"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="kitId"
                    value={formData.kitId}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.kitId ? fieldErrors.kitId : ''}</span>}
                    error={!!fieldErrors.kitId}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="kitDesc"
                    label= "Kit Description"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="kitDesc"
                    value={formData.kitDesc}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.kitDesc ? fieldErrors.kitDesc : ''}</span>}
                    error={!!fieldErrors.kitDesc}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="partQty"
                    label= "Part Quantity"
                    variant="outlined"
                    size="small"
                    fullWidth
                    type='number'
                    name="partQty"
                    value={formData.partQty}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.partQty ? fieldErrors.partQty : ''}</span>}
                    error={!!fieldErrors.partQty}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControlLabel
                    control={<Checkbox checked={formData.active} onChange={handleCheckboxChange} />}
                    label="Active"
                    labelPlacement="end"
                  />
                </div>
              </div>
              <>
                <div className="row mt-2">
                  <Box sx={{ width: '100%' }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="secondary tabs example"
                    >
                      <Tab value={0} label="Asset Details" />
                    </Tabs>
                  </Box>
                  <Box sx={{ padding: 2 }}>
                    {value === 0 && (
                      <>
                        <div className="row d-flex ml">
                          <div className="mb-1">
                            <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                          </div>
                          <div className="row mt-2">
                            <div className="col-lg-12">
                              <div className="table-responsive">
                                <table className="table table-bordered ">
                                  <thead>
                                    <tr style={{ backgroundColor: '#673AB7' }}>
                                      <th className="table-header">Action</th>
                                      <th className="table-header">S.No</th>
                                      <th className="table-header">Asset Type</th>
                                      <th className="table-header">Category</th>
                                      <th className="table-header">Category Code</th>
                                      <th className="table-header">Asset Code</th>
                                      <th className="table-header">Asset Desc</th>
                                      <th className="table-header">Asset Qty</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {detailsTableData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                detailsTableData,
                                                setDetailsTableData,
                                                detailsTableErrors,
                                                setDetailsTableErrors
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                      <td>
                                        <select
                                        value={row.assetType}
                                        style={{ width: '150px' }}
                                        onChange={(e) => handleAssetTypeChange(e, index)}
                                        className={detailsTableErrors[index]?.assetType ? 'error form-control' : 'form-control'}
                                      >
                                        <option value="">--Select--</option>
                                        {allTypes &&
                                          allTypes.map((asset) => (
                                            <option key={asset.id} value={asset.assetType}>
                                              {asset.assetType}
                                            </option>
                                          ))}
                                        </select>
                                    {detailsTableErrors[index]?.assetType && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {detailsTableErrors[index].assetType}
                                      </div>
                                    )}
                                      </td>
                                     <td className="border px-2 py-2">
                                      <Autocomplete
                                        options={row.categoryOptions || []}
                                        getOptionLabel={(option) => option.category || ''}
                                        disableClearable
                                        sx={{ width: '200px' }}
                                        value={
                                          row.categoryOptions?.find(
                                            (option) => option.category === row.category
                                          ) || null
                                        }
                                        onChange={(event, newValue) => {
                                          handleCategoryChange(newValue, index);
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder="Select Category"
                                            size="small"
                                            error={!!detailsTableErrors[index]?.category}
                                            helperText={detailsTableErrors[index]?.category}
                                          />
                                        )}
                                      />
                                    </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.categoryCode}
                                          disabled
                                          style={{ width: '140px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, categoryCode: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                categoryCode: value ? '' : 'Category Code is required'
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.categoryCode ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.categoryCode && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].categoryCode}
                                          </div>
                                        )}
                                      </td>
                                     <td className="border px-2 py-2">
                                      <Autocomplete
                                        options={row.assetOptions || []}
                                        sx={{ width: '150px' }}
                                        getOptionLabel={(option) => option.assetCode || ''}
                                        disableClearable
                                        value={
                                          row.assetOptions?.find(
                                            (option) => option.assetCode === row.assetCode
                                          ) || null
                                        }
                                        onChange={(event, newValue) => {
                                          handleAssetCodeChange(newValue, index);
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder="Select Asset"
                                            size="small"
                                            error={!!detailsTableErrors[index]?.assetCode}
                                            helperText={detailsTableErrors[index]?.assetCode}
                                          />
                                        )}
                                      />
                                    </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.assetDesc}
                                            style={{ width: '170px' }}
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, assetDesc: value } : r))
                                              );
                                              setDetailsTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  assetDesc: !value ? 'Asset Desc is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={detailsTableErrors[index]?.assetDesc ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.assetDesc && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].assetDesc}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="number"
                                            value={row.assetQty}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, assetQty: value } : r))
                                              );
                                            }}
                                            className={detailsTableErrors[index]?.assetQty ? 'error form-control' : 'form-control'}
                                          />
                                          {detailsTableErrors[index]?.assetQty && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {detailsTableErrors[index].assetQty}
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
                    )}
                  </Box>
                </div>
              </>
            </>
          ) : (
            <CommonListViewTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAssetCategoryById} />
          )}
        </div>
      </div>
    </>
  )
}

export default CreateKit