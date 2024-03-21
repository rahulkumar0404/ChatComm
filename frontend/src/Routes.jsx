import { useContext } from 'react';
import Register from './Register.jsx';
import Chat from './Chat.jsx'
import  {UserContext}  from './UserContext.jsx';
export default function Routes() {
  const { username, id } = useContext(UserContext);

  if (username) {
    return <Chat />
  }
  return <Register />;
}
