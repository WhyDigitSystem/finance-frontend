import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { IconSettings } from '@tabler/icons-react';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { encryptPassword } from 'views/utilities/encryptPassword';

const ChangePasswordPopup = () => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });

  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  // Handle input change
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  // Handle password visibility toggle
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  // Open/Close dialog
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleClear = () => {
    setValues({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false
    });
    setOpen(false);
  };

  const handleSave = async () => {
    if (!values.currentPassword || !values.newPassword || !values.confirmPassword) {
      toast.error('All fields are required', { autoClose: 2000, theme: 'colored' });
      return;
    }

    if (values.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long', { autoClose: 2000, theme: 'colored' });
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      toast.error('New password and confirm password do not match', { autoClose: 2000, theme: 'colored' });
      return;
    }

    if (values.currentPassword === values.newPassword) {
      toast.error('New password must be different from the current password', { autoClose: 2000, theme: 'colored' });
      return;
    }

    const userData = {
      newPassword: encryptPassword(values.newPassword),
      oldPassword: encryptPassword(values.currentPassword),
      userName: userName
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/changePassword`, userData, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Log the response to check its structure
      console.log(response.data);

      if (response.data.status) {
        toast.success(response.data.paramObjectsMap.message || 'Password changed successfully', {
          autoClose: 2000,
          theme: 'colored'
        });
        handleClear();
      } else {
        toast.error(response.data.paramObjectsMap.errorMessage || 'Error changing password', {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } catch (error) {
      toast.error('Network Error', { autoClose: 2000, theme: 'colored' });
    }
  };

  return (
    <>
      {/* Change Password Button */}
      <ListItemButton sx={{ borderRadius: '8px', backgroundColor: '#f5f5f5', '&:hover': { backgroundColor: '#ddd' } }} onClick={handleOpen}>
        <ListItemIcon>
          <IconSettings stroke={1.5} size="1.3rem" />
        </ListItemIcon>
        <ListItemText primary={<Typography variant="body2">Change Password</Typography>} />
      </ListItemButton>
      <ToastContainer />

      {/* Change Password Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', bgcolor: '#6A11CB', color: '#fff' }}>Change Password</DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Current Password"
              type={values.showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={values.currentPassword}
              onChange={handleChange('currentPassword')}
            />
            <TextField
              label="New Password"
              type={values.showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={values.newPassword}
              onChange={handleChange('newPassword')}
            />
            <TextField
              label="Confirm Password"
              type={values.showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>{values.showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button variant="contained" color="secondary" onClick={handleClear}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleSave()}>
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangePasswordPopup;
