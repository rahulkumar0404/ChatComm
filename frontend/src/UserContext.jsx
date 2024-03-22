import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
export const UserContext = createContext({});

function UserContextProvider({ children }) {
  const [ username, setUsername ] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios.get('/profile').then((response) => {
      const {userId, username} = response.data
      setUsername(username)
      setId(userId)
    });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;