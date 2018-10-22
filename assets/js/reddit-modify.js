'use strict';

window.onload = () => {
  if (localStorage.getItem('username') !== null) {
    const http = new XMLHttpRequest();
    http.open('GET', `/modify`, true);

    http.onload = () => {
      if (http.status === 200) {
        const getSubmitButton = document.querySelector('#submit-button');
        let getTitle = document.querySelector('#post-title');
        let getUrl = document.querySelector('#post-url');
        getTitle.setAttribute("value", localStorage.getItem("currentTitle"));
        getUrl.setAttribute("value", localStorage.getItem("currentURL"));
        const getUsername = localStorage.getItem('username');
        getSubmitButton.addEventListener('click', sendPost.bind(null, getTitle, getUrl, getUsername), false);

        const getBackButton = document.querySelector('#back-button');
        getBackButton.addEventListener('click', () => { window.location = `/` }, false);
      }
    };
    http.send();
    function sendPost(getTitle, getUrl, getUsername) {
      const http = new XMLHttpRequest();
      const index = localStorage.getItem("currentElement");
      http.open('PUT', `/posts/${index}`, true);
      http.setRequestHeader("Content-Type", "application/json");
      if (getTitle['value'] === "") {
        alert('Please provide a title!');
      }
      else {
        http.send(JSON.stringify({ title: getTitle['value'], url: getUrl['value'], username: getUsername }));
        window.location = `/`;
      }
    }
  }
};
