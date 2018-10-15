window.onload = () => {
  if (localStorage.getItem('username') !== null) {
    const host = 'http://localhost:3000';
    const http = new XMLHttpRequest();
    http.open('GET', `${host}/submit`, true);

    http.onload = () => {
      if (http.status === 200) {
        const getSubmitButton = document.querySelector('#submit-button');
        getSubmitButton.addEventListener('click', sendPost.bind(null, host), false);

        const getBackButton = document.querySelector('#back-button');
        getBackButton.addEventListener('click', () => { window.location = `${host}` }, false);
      }
    }
    http.send();
    function sendPost(host) {
      const http = new XMLHttpRequest();
      http.open('POST', `${host}/posts`, true);
      http.setRequestHeader("Content-Type", "application/json");
      const getTitle = document.querySelector('#post-title')['value'];
      const getUrl = document.querySelector('#post-url')['value'];
      const getUsername = localStorage.getItem('username');
      if (getTitle === "") {
        alert('Please provide a title!');
      }
      else {
        http.send(JSON.stringify({ title: getTitle, url: getUrl, username: getUsername }));
        window.location = `${host}`;
      }
    };
  }
}