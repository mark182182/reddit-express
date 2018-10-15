window.onload = () => {
  const host = 'http://localhost:3000';
  const http = new XMLHttpRequest();
  http.open('GET', `${host}/create`, true);

  http.onload = () => {
    if (http.status === 200) {
      const getContentHolder = document.querySelector('.creation-content-holder ');
      const getLoginButton = document.querySelector('#login-button');
      let getUsername = document.querySelector('#username');
      let getPassword = document.querySelector('#password');
      let makeText = document.createElement('p');
      getContentHolder.appendChild(makeText);
      makeText.style.color = 'white';
      getLoginButton.addEventListener('click', sendAccountDetails.bind(null, host, getUsername, getPassword, makeText), false);

      const getBackButton = document.querySelector('#back-button');
      getBackButton.addEventListener('click', () => { window.location = `${host}` }, false);
    }
  }
  http.send();
  function sendAccountDetails(host, getUsername, getPassword, makeText) {
    const http = new XMLHttpRequest();
    http.open('POST', `${host}/create`, true);
    http.setRequestHeader("Content-Type", "application/json");
    if (getUsername['value'] === "" || getPassword['value'] === "") {
      alert('Please provide information!');
    }
    else {
      http.onload = () => {
        if (http.status === 200) {
          const context = JSON.parse(http.response);
          if (context === 'User already exist!') {
            makeText.innerHTML = context;
          }
          else {
            makeText.innerHTML = 'Successful';
            window.location = `${host}`;
          }
        }
      }
      http.send(JSON.stringify({ owner: getUsername['value'], password: getPassword['value'] }));
    }
  }
}