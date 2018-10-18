'use strict';

window.onload = () => {
  const http = new XMLHttpRequest();
  http.open('GET', `/login`, true);

  http.onload = () => {
    if (http.status === 200) {
      const getContentHolder = document.querySelector('.creation-content-holder ');
      const getLoginButton = document.querySelector('#login-button');
      let getUsername = document.querySelector('#username');
      let getPassword = document.querySelector('#password');
      let makeText = document.createElement('p');
      getContentHolder.appendChild(makeText);
      makeText.style.color = 'white';
      getLoginButton.addEventListener('click', sendAccountDetails.bind(null, getUsername, getPassword, makeText), false);
    }
  }
  http.send();
  function sendAccountDetails(getUsername, getPassword, makeText) {
    const http = new XMLHttpRequest();
    http.open('POST', `/login`, true);
    http.setRequestHeader("Content-Type", "application/json");
    if (getUsername['value'] === "" || getPassword['value'] === "") {
      alert('Please provide information!');
    }
    else {
      http.onload = () => {
        if (http.status === 200) {
          const context = JSON.parse(http.response);
          console.log(context);
          if (context === 'Incorrect username!') {
            makeText.innerHTML = context;
          }
          else if (context === 'Incorrect password!') {
            makeText.innerHTML = context;
          }
          else {
            localStorage.setItem('username', `${getUsername['value']}`);
            console.log(localStorage.getItem('username'));
            makeText.innerHTML = 'Login successful';
            window.location = `/`;
          }
        }
      }
      http.send(JSON.stringify({ owner: getUsername['value'], password: getPassword['value'] }));
    }
  }
}
