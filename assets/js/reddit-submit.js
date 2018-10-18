'use strict';

window.onload = () => {
  if (localStorage.getItem('username') !== null) {
    const http = new XMLHttpRequest();
    http.open('GET', `/submit`, true);

    http.onload = () => {
      if (http.status === 200) {
        const getSubmitButton = document.querySelector('#submit-button');
        getSubmitButton.addEventListener('click', sendPost, false);

        const getBackButton = document.querySelector('#back-button');
        getBackButton.addEventListener('click', () => { window.location = `/` }, false);
      }
    }
    http.send();
    function sendPost() {
      const http = new XMLHttpRequest();
      http.open('POST', `/posts`, true);
      http.setRequestHeader("Content-Type", "application/json");
      const getTitle = document.querySelector('#post-title')['value'];
      const getUrl = document.querySelector('#post-url')['value'];
      const getUsername = localStorage.getItem('username');
      if (getTitle === "") {
        alert('Please provide a title!');
      }
      else {
        http.send(JSON.stringify({ title: getTitle, url: getUrl, username: getUsername }));
        window.location = `/`;
      }
    };
  }
}
