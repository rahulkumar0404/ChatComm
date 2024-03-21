import axios from 'axios';
import { useContext, useState } from 'react';
import { UserContext } from './UserContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setUserpassword] = useState('');
  const { setUsername: setLoggedInUserName, setId } = useContext(UserContext);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
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

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleUserRegister}>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(event) => setUserpassword(event.target.value)}
          type="text"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister === 'register' ? 'Sign Up' : 'Login'}
        </button>
        {isLoginOrRegister === 'register' && (
          <div className="text-center mt-2">
            Already a member?{' '}
            <button onClick={() => setIsLoginOrRegister('login')}>
              Login here
            </button>
          </div>
        )}
        {isLoginOrRegister === 'login' && (
          <div className="text-center mt-2">
            Don&apos;t Have a account?
            <button onClick={() => setIsLoginOrRegister('register')}>
              Sign Up
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;
