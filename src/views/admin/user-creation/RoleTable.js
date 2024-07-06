import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MaterialReactTable } from 'material-react-table';
import { useCallback, useMemo, useState } from 'react';

import ActionButton from 'utils/action-button';

const RoleTable = ({ data, onUpdateRoles, roleData }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(data || []);
  const [validationErrors, setValidationErrors] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const theme = useTheme();

  const handleCreateNewRow = (values) => {
    setTableData((prev) => {
      const newData = [...prev, values];
      onUpdateRoles(newData); // Update parent component
      return newData;
    });
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      setTableData((prev) => {
        const newData = [...prev];
        newData[row.index] = values;
        onUpdateRoles(newData); // Update parent component
        return newData;
      });
      exitEditingMode();
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback((row) => {
    setRowToDelete(row);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDeleteRow = () => {
    setTableData((prev) => {
      const newData = prev.filter((_, index) => index !== rowToDelete.index);
      onUpdateRoles(newData); // Update parent component
      return newData;
    });
    setDeleteConfirmOpen(false);
    setRowToDelete(null);
  };

  function validateEmail(email) {
    // Validation logic
  }

  function validateAge(age) {
    // Validation logic
  }

  function validateRequired(value) {
    // Validation logic
  }

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          let isValid = true;
          if (cell.column.id === 'email') {
            isValid = validateEmail(event.target.value);
          } else if (cell.column.id === 'age') {
            isValid = validateAge(+event.target.value);
          } else {
            isValid = validateRequired(event.target.value);
          }

          if (!isValid) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`
            });
          } else {
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors
            });
          }
        }
      };
    },
    [validationErrors]
  );

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    return `${formattedDate.getFullYear()}/${formattedDate.getMonth() + 1}/${formattedDate.getDate()}`;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'role',
        header: 'Role',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        })
      },
      {
        accessorKey: 'startdate',
        header: 'Start Date',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        }),
        render: (rowData) => formatDate(rowData.startdate)
      },
      {
        accessorKey: 'enddate',
        header: 'End Date',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        }),
        render: (rowData) => formatDate(rowData.enddate)
      }
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center'
            },
            size: 120
          }
        }}
        columns={columns}
        data={tableData}
        editingMode="modal"
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <ActionButton title="delete" icon={DeleteIcon} onClick={() => handleDeleteRow(row)} />

            <ActionButton title="delete" icon={EditIcon} onClick={() => table.setEditingRow(row)} />
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Stack direction="row" spacing={2} className="ml-5 ">
            <Tooltip title="Add">
              <ButtonBase sx={{ borderRadius: '12px', marginRight: '10px' }} onClick={() => setCreateModalOpen(true)}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.dark,
                      color: theme.palette.secondary.light
                    }
                  }}
                  aria-haspopup="true"
                  color="inherit"
                >
                  <Add size="1.3rem" stroke={1.5} />
                </Avatar>
              </ButtonBase>
            </Tooltip>
          </Stack>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        roleData={roleData}
      />
      <ConfirmDeleteModal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} onConfirm={confirmDeleteRow} />
    </>
  );
};

const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, roleData }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {})
  );

  const [validationErrors, setValidationErrors] = useState({
    // Assuming 'startdate' and 'enddate' are keys in your validationErrors state
    startdate: '',
    enddate: ''
  });

  const handleDateChange = (date, accessorKey) => {
    const formattedDate = date ? `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}` : '';
    setValues((prevValues) => ({
      ...prevValues,
      [accessorKey]: formattedDate
    }));
  };

  console.log('RoleData', roleData);

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Add</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem'
            }}
          >
            {columns.map((column) => (
              <div key={column.accessorKey}>
                {column.accessorKey === 'role' ? (
                  <Select
                    label={column.header}
                    name={column.accessorKey}
                    value={values[column.accessorKey]}
                    onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select a role
                    </MenuItem>
                    {roleData.map((role, index) => (
                      <MenuItem key={index} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                ) : column.accessorKey === 'startdate' || column.accessorKey === 'enddate' ? (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <MobileDatePicker
                        fullWidth
                        label={column.header}
                        value={values[column.accessorKey]} // Ensure date value is correctly formatted or converted
                        onChange={(date) => handleDateChange(date, column.accessorKey)}
                        inputFormat="dd-MM-yyyy"
                        sx={{ flexGrow: 1, maxWidth: 400 }}
                        error={!!validationErrors[column.accessorKey]} // Check if there's a validation error for this field
                        helperText={validationErrors[column.accessorKey]}
                      />
                    </Box>
                  </LocalizationProvider>
                ) : (
                  <TextField
                    {...column.muiTableBodyCellEditTextFieldProps}
                    label={column.header}
                    name={column.accessorKey}
                    value={values[column.accessorKey]}
                    onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                    fullWidth
                  />
                )}
              </div>
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="secondary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>Are you sure you want to delete this row?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleTable;
