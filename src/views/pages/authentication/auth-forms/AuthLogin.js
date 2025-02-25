import Axios from 'axios';
import apiCalls from 'apicall';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUserRole } from 'store/actions';
import { encryptPassword } from 'views/utilities/passwordEnc';
// material-ui
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { setUser } from '../../../../redux/userSlice';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [orgId, setOrgId] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const storedCredentials = localStorage.getItem('rememberedCredentials');
    if (storedCredentials) {
      const { email, password } = JSON.parse(storedCredentials);
      formikRef.current.setValues({ email, password });
      setChecked(true);
    }
  }, []);

  const user = useSelector((state) => state.user);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formikRef = useRef(null);
  const navigate = useNavigate();
  const resetForm = () => {
    // Check if the formikRef is defined
    if (formikRef.current) {
      // Call the resetForm function using the ref
      formikRef.current.resetForm({
        values: {
          email: '',
          password: ''
        }
      });
    }
  };

  const loginAPICall = async (values) => {
    const userData = {
      password: encryptPassword(values.password),
      userName: values.email
    };
    try {
      const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status) {
        const userVO = response.data.paramObjectsMap.userVO;

        dispatch(setUser({ orgId: userVO.orgId }));
        localStorage.setItem('orgId', userVO.orgId);
        localStorage.setItem('userId', userVO.usersId);
        localStorage.setItem('token', userVO.token);
        localStorage.setItem('tokenId', userVO.tokenId);
        localStorage.setItem('userName', userVO.userName);
        localStorage.setItem('userType', userVO.userType);
        localStorage.setItem('LoginMessage', true);

        const userRole = userVO.roleVO;
        localStorage.setItem('ROLE', userRole);
        dispatch(setUserRole(userRole));

        const roles = userRole.map((row) => ({ role: row.role }));
        localStorage.setItem('ROLES', JSON.stringify(roles));

        let allScreensVO = [];
        userVO.roleVO.forEach((roleObj) => {
          roleObj.responsibilityVO.forEach((responsibility) => {
            if (responsibility.screensVO) {
              allScreensVO = allScreensVO.concat(responsibility.screensVO);
            }
          });
        });
        allScreensVO = [...new Set(allScreensVO)];
        localStorage.setItem('screens', JSON.stringify(allScreensVO));
        resetForm();

        try {
          const companyResponse = await apiCalls('get', `commonmaster/company/${userVO.orgId}`);

          if (companyResponse.status === true) {
            const particularCompany = companyResponse.paramObjectsMap.companyVO[0];
            console.log('particularCompany', particularCompany);
            localStorage.setItem('companyName', particularCompany.companyName);
          } else {
            console.error('commonmaster/company API Error:', companyResponse);
          }
        } catch (error) {
          console.error('Error fetching data in Company Name:', error);
        }
        navigate('/dashboard/default');
        if (checked) {
          localStorage.setItem('rememberedCredentials', JSON.stringify({ email: values.email, password: values.password }));
        } else {
          localStorage.removeItem('rememberedCredentials');
        }
      } else {
        toast.error(response.data.paramObjectsMap.errorMessage, {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } catch (error) {
      toast.error('Network Error', {
        autoClose: 2000,
        theme: 'colored'
      });
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          {/* <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign in with Email address</Typography>
          </Box> */}
        </Grid>
      </Grid>

      <Formik
        innerRef={formikRef}
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().max(255).required('UserId is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              loginAPICall(values);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Remember me"
              />
              <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
