import React from 'react';
import './Popup.css';
import { useState, useEffect } from 'react';

const Popup = () => {
  const [username, setusername] = useState('');
  const [sessionToken, setsessionToken] = useState('');
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
        // chrome.runtime.sendMessage({ action: 'storeToken' , sessionToken: "tokeeeeen"});

        fetch(
          'https://677b-183-82-115-2.ngrok-free.app/auth/updateTokens',
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            const res = JSON.parse(result);
            console.log('res', res);
            if (res.username && res.sessionToken) {
              // chrome.runtime.sendMessage({ action: 'storeToken' , sessionToken: res.sessionToken});
              setusername(res.username);
              setsessionToken(res.sessionToken)
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
              href={`https://5475-183-82-115-2.ngrok-free.app/${username}/${sessionToken}`}
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
