import { useContext, useEffect, useState } from 'react';
import Avatar from './Avatar';
import { ButtonIcon, LogoIcon } from './Logo';
import { UserContext } from './UserContext';
import LandingPage from './LandingPage';
export default function Chat() {
  const [ws, setWs] = useState('');
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const { id } = useContext(UserContext);
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    setWs(ws);

    ws.addEventListener('message', handleMessage);
  }, []);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });

    console.log(people);
    setOnlinePeople(people);
  }
  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    // console.log({messageData})
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else {
      console.log('message')
      console.log({ messageData });
    }
  }

  const onlinePeopleExecOurUser = { ...onlinePeople };
  delete onlinePeopleExecOurUser[id];

  function sendMessage(event) {
    event.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );
  }
  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/4">
        <LogoIcon />
        {Object.keys(onlinePeopleExecOurUser).map((userId) => (
          <div
            onClick={() => setSelectedUserId(userId)}
            className={
              'border-b border-gray-100 flex items-center gap-2 cursor-pointer ' +
              (userId === selectedUserId ? 'bg-blue-50' : '')
            }
            key={userId}
          >
            {userId === selectedUserId && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}

            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className="text-gray-800 px-2">{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex flex-col w-3/4 p-2"
        style={{ backgroundColor: '#edede9' }}
      >
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center">
              <div className="text-gray-400">
                <LandingPage />
              </div>
            </div>
          )}
        </div>

        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type your message here"
              value={newMessageText}
              onChange={(event) => setNewMessageText(event.target.value)}
              className="bg-white flex-grow border p-2 rounded-sm"
            />
            <button
              type="submit"
              className=" p-2 text-white"
              style={{ backgroundColor: '#0096c7' }}
            >
              <ButtonIcon />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
