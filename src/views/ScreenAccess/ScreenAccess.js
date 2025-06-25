import { Refresh, Search } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import { getAllActiveRoles, getAllActiveScreens } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';

const ScreenAccess = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [screenList, setScreenList] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchText, setSearchText] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState('');

  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    getAllScreens();
    getAllRoles();
  }, []);

  useEffect(() => {
    getScreenAccess();
  }, [role]);

  const getAllScreens = async () => {
    try {
      const screensData = await getAllActiveScreens(orgId);
      setScreenList(screensData);
      const initialPermissions = screensData.map((screen) => ({
        module: screen.screenName,
        screenCode: screen.screenCode,
        read: false,
        write: false,
        delete: false
      }));
      setPermissions(initialPermissions);
      setFilteredPermissions(initialPermissions);
    } catch (error) {
      console.error('Error fetching screens:', error);
    }
  };

  const getAllRoles = async () => {
    try {
      const roleData = await getAllActiveRoles(orgId);
      setRoleList(roleData.sort((a, b) => a.role.localeCompare(b.role)));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);
    setLoading(true);

    setTimeout(() => {
      const setTo = selectedRole.toLowerCase() === 'admin';
      const updatedPermissions = permissions.map((item) => ({
        ...item,
        read: setTo,
        write: setTo,
        delete: setTo
      }));
      setPermissions(updatedPermissions);
      setFilteredPermissions(filterPermissions(updatedPermissions, searchText));
      setLoading(false);
    }, 300);
  };

  const handleCheckboxChange = (screenCode, type) => {
    const updatedPermissions = permissions.map((item) => (item.screenCode === screenCode ? { ...item, [type]: !item[type] } : item));

    setPermissions(updatedPermissions);
    setFilteredPermissions(filterPermissions(updatedPermissions, searchText));
  };

  const handleSelectAll = (type) => {
    const allChecked = filteredPermissions.every((item) => item[type]);
    const updatedPermissions = permissions.map((item) =>
      filteredPermissions.some((f) => f.screenCode === item.screenCode) ? { ...item, [type]: !allChecked } : item
    );
    setPermissions(updatedPermissions);
    setFilteredPermissions(filterPermissions(updatedPermissions, searchText));
  };

  // const handleSave = async () => {
  //   const payload = { role, permissions };
  //   console.log('Saving:', payload);
  //   // TODO: Replace with actual API call
  //   setSnackbar({ open: true, message: 'Permissions saved successfully!', severity: 'success' });
  // };

  const handleSave = async () => {
    console.log('Saving:', permissions);
    const payload = {
      active: true,
      createdBy: 'admin', // Replace with actual user
      orgId: orgId, // Replace with actual org ID
      ...(editId && { id: editId }),
      role: role,
      rolesPermissionDTO: permissions.map((item) => ({
        canDelete: item.delete,
        canRead: item.read,
        canWrite: item.write,
        screenId: item.screenCode,
        screenName: item.module
      }))
    };

    try {
      const response = await apiCalls('put', `/auth/createUpdateRoleScreenPermission`, payload);
      console.log('Saved:', response.data);
      showToast('success', editId ? ' screen Access Updated Successfully' : 'screen Access Created successfully');
      setRole('');
    } catch (error) {
      console.error('Error saving permissions:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save permissions.',
        severity: 'error'
      });
    }
  };

  const getScreenAccess = async () => {
    try {
      const response = await apiCalls('get', `auth/getRolesPermissionHeaderByRoleandOrgid?orgid=${orgId}&role=${role}`);
      console.log('API Response:', response);

      const userList = response?.paramObjectsMap?.userVO;

      console.log('userList', userList);

      if (Array.isArray(userList) && userList.length > 0) {
        const user = userList[0];

        setEditId(user.id);

        console.log('Test', user.id);

        const permissionList = user.rolesPermissionVO;

        if (Array.isArray(permissionList) && permissionList.length > 0) {
          const mappedPermissions = permissionList.map((item) => ({
            screenCode: item.screenId,
            module: item.screenName,
            read: !!item.canRead,
            write: !!item.canWrite,
            delete: !!item.canDelete
          }));

          setPermissions(mappedPermissions);
          setFilteredPermissions(filterPermissions(mappedPermissions, searchText));

          console.log('Mapped Permissions:', mappedPermissions);

          if (user.role) setRole(user.role);
        } else {
          console.warn('No rolesPermissionVO data found.');
          setPermissions([]);
        }
      } else {
        console.warn('No userVO data found.');
        // setPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const confirmResetPermissions = () => setConfirmReset(true);
  const handleResetConfirm = () => {
    const resetPermissions = permissions.map((item) => ({
      ...item,
      read: false,
      write: false,
      delete: false
    }));
    setPermissions(resetPermissions);
    setFilteredPermissions(filterPermissions(resetPermissions, searchText));
    setConfirmReset(false);
    setSnackbar({ open: true, message: 'Permissions reset!', severity: 'info' });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    setFilteredPermissions(filterPermissions(permissions, value));
  };

  const filterPermissions = (permissionsList, searchValue) =>
    permissionsList.filter((item) => item.module.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <Box p={2} sx={{ backgroundColor: '#f9fbfd', minHeight: '100vh' }}>
      <Card elevation={2}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" mb={1}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Select Role</InputLabel>
                <Select value={role} onChange={handleRoleChange} label="Select Role">
                  {roleList.map((r) => (
                    <MenuItem key={r.role} value={r.role}>
                      {r.role.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {role && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      placeholder="Search Screens"
                      value={searchText}
                      onChange={handleSearchChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <ActionButton title="Save" icon={SaveIcon} isLoading={isLoading} onClick={handleSave} />
                    <ActionButton title="Reset" icon={Refresh} isLoading={isLoading} onClick={confirmResetPermissions} />
                  </Stack>
                </Grid>
              </>
            )}
          </Grid>

          {loading ? (
            <Box textAlign="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : role ? (
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 0.5, backgroundColor: '#e3f2fd' }}>
                      <strong>Screen Name</strong>
                    </TableCell>
                    {['read', 'write', 'delete'].map((type) => (
                      <TableCell key={type} align="center" sx={{ py: 0.5, backgroundColor: '#e3f2fd' }}>
                        <Checkbox
                          size="small"
                          checked={filteredPermissions.length > 0 && filteredPermissions.every((p) => p[type])}
                          onChange={() => handleSelectAll(type)}
                        />
                        <strong>{type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPermissions.map((item) => (
                    <TableRow key={item.screenCode} hover>
                      <TableCell sx={{ py: 0.3 }}>{item.module}</TableCell>
                      {['read', 'write', 'delete'].map((type) => (
                        <TableCell key={type} align="center" sx={{ py: 0.3 }}>
                          <Checkbox
                            size="small"
                            color={type === 'read' ? 'primary' : type === 'write' ? 'success' : 'error'}
                            checked={item[type]}
                            onChange={() => handleCheckboxChange(item.screenCode, type)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
              <Paper
                elevation={3}
                sx={{
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: 'linear-gradient(135deg, #1DE9B6 0%, #2196F3 100%)',
                  borderRadius: 2,
                  color: '#fff',
                  minWidth: 300
                }}
              >
                <InfoOutlinedIcon sx={{ color: '#fff' }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Please select a role to begin.
                </Typography>
              </Paper>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)}>
        <DialogTitle>Reset Permissions</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to reset all permissions to default (unchecked)?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => 
            (false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} color="error" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScreenAccess;
