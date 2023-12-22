import React from 'react';
import './Popup.css';
import { useState, useEffect } from 'react';

const Popup = () => {
  const [username, setusername] = useState('');
  const [message, setmessage] = useState('Fetching from leetcode ....');


  useEffect(() => {
    retrieveTokens();

  }, [])
  
  const retrieveTokens = () => {
    chrome.runtime.sendMessage({ action: 'fetchCookies' });
  };

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === 'cookiesFetched') {
      const { csrfToken, leetcodeSession } = request;
      console.log('Received cookies:', csrfToken, leetcodeSession);

      if (csrfToken && leetcodeSession) {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var data = JSON.stringify({
          csrfToken: csrfToken,
          session: leetcodeSession,
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: data,
          redirect: 'follow',
        };

        fetch(
          'https://084e-2405-201-c033-80be-ed2d-ea6a-26f1-62ed.ngrok-free.app/addUser',
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            const res = JSON.parse(result);
            console.log('res', res);
            if (res.username) {
              setusername(res.username);
            }
          })
          .catch((error) => console.log('error', error));
      } else {
        setmessage('Please Login at www.leetcode.com');
      }
    }
  });

  return (
    <div className="App">
      <div className="title">
        <p className="coding">WE</p>
        <p className="buddies">CODES</p>
      </div>
      {/* <button onClick={retrieveTokens}>Get tokens</button> */}
      {username !== '' ? (
        <div>
          <button>
            <a
              href={`http://192.168.29.112:5173/${username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Room
            </a>
          </button>
        </div>
      ) : (
        <div>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Popup;
