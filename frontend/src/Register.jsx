import axios from 'axios';
import { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import classes from './Login.module.css';
function Register() {
  const [username, setUsername] = useState('');
  const [password, setUserpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUsername: setLoggedInUserName, setId } = useContext(UserContext);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleUserRegister(event) {
    event.preventDefault();
    try {
      const url = isLoginOrRegister === 'register' ? '/register' : '/login';
      const { data } = await axios.post(
        url,
        { username, password },
        { credential: 'include' }
      );
      setLoggedInUserName(username);
      setId(data.id);
      console.log('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  let cssSubHeaderInSignUp = `${classes.subheader}`;
  let cssSubHeaderInLogin = `${classes.subheader}`;
  if (isLoginOrRegister === 'register') {
    cssSubHeaderInSignUp += ` ${classes.subheaderFocus}`;
  } else {
    cssSubHeaderInLogin += ` ${classes.subheaderFocus}`;
  }
  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <Box
        display="flex"
        flexDirection="column"
        margin="auto"
        width={450}
        height={450}
      >
        <Box width={'100%'} height={200} className={`${classes.title}`}>
          ChatComm
        </Box>
        <Box className={`${classes.boxShadow}`}>
          <Box className={`${classes.header}`}>
            <span className={`${cssSubHeaderInSignUp}`}>Sign up</span>
            <span className={`${cssSubHeaderInLogin}`}>Log in</span>
          </Box>
          <Box>
            <form
              className={`w-96 mx-auto mb-12 mt-8`}
              onSubmit={handleUserRegister}
            >
              <FormControl
                fullWidth
                sx={{ mx: 2, my: 1, width: '40ch' }}
                variant="outlined"
              >
                <InputLabel htmlFor="username">Username</InputLabel>
                <OutlinedInput
                  id="username"
                  type="text"
                  className="block w-full rounded-sm border"
                  onChange={(event) => setUsername(event.target.value)}
                  label="Username"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 2, width: '40ch' }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full rounded-sm border"
                  onChange={(event) => setUserpassword(event.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <Button
                variant="contained"
                type="submit"
                style={{ margin: '0 15px' }}
                className={`bg-blue-500 text-white block rounded-sm p-2 m-2 ${classes.loginButton}`}
              >
                {isLoginOrRegister === 'register' ? 'Sign Up' : 'Login'}
              </Button>
              {isLoginOrRegister === 'register' && (
                <div className="text-center mt-2">
                  Already a member?{' '}
                  <Button
                    variant="text"
                    onClick={() => setIsLoginOrRegister('login')}
                  >
                    Login here
                  </Button>
                </div>
              )}
              {isLoginOrRegister === 'login' && (
                <div className="text-center mt-2">
                  Don&apos;t Have a account?
                  <Button
                    variant="text"
                    onClick={() => setIsLoginOrRegister('register')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </form>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Register;
