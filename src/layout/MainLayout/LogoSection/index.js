import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import { MENU_OPEN } from 'store/actions';
import LogoImage from '../../../../src/assets/images/BIN_BEE.png';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
      {/* <Logo /> */}
      <img
        src={LogoImage}
        alt="logo"
        style={{
          width: '150px',
          height: 'auto'
        }}
      ></img>
    </ButtonBase>
  );
};

export default LogoSection;
