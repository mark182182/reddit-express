window.onload = () => {
  const http = new XMLHttpRequest();
  http.open('GET', `/posts`, true);

  http.onload = () => {
    if (http.status === 200) {
      const context = JSON.parse(http.response);
      getPosts(context);
    }
  }
  http.send();

  function getPosts(context) {
    const getPostsContainer = document.querySelector('.posts-container');
    for (let index = 0; index < context.length; index++) {

      let newDivElement = document.createElement('div');
      getPostsContainer.appendChild(newDivElement);
      newDivElement.classList.add(`post${context[index].id}`, 'post');

      let newButtonHolder = document.createElement('div');
      newButtonHolder.classList.add('button-holder');
      newDivElement.appendChild(newButtonHolder);

      let upVoteButton = document.createElement('button');
      newButtonHolder.appendChild(upVoteButton);
      upVoteButton.classList.add('upvote-button');
      upVoteButton.addEventListener('click', upVote.bind(null, context, index), false);

      let scoreInfo = document.createElement('p');
      newButtonHolder.appendChild(scoreInfo);
      scoreInfo.innerHTML = context[index].score;

      let downVoteButton = document.createElement('button');
      newButtonHolder.appendChild(downVoteButton);
      downVoteButton.classList.add('downvote-button');
      downVoteButton.addEventListener('click', downVote.bind(null, context, index), false);

      let newPostsHolder = document.createElement('div');
      newPostsHolder.classList.add('posts-holder');
      newDivElement.appendChild(newPostsHolder);

      let newPost = document.createElement('a');
      newPost.classList.add(`post${context[index].id}`);
      newPostsHolder.appendChild(newPost);
      newPost.innerHTML = context[index].title;
      newPost.setAttribute('href', context[index].url);

      let newInfo = document.createElement('div');
      newInfo.classList.add(`info`);
      newPostsHolder.appendChild(newInfo);

      if (((Date.now() - Date.parse(context[index].timestamp)) / 1000) < 1) {
        newInfo.innerHTML = 'Post created by ' + context[index].owner + ' ' + ' now.';
      }

      else if (((Date.now() - Date.parse(context[index].timestamp)) / 1000) >= 1 && ((Date.now() - Date.parse(context[index].timestamp)) / 1000) < 60) {
        newInfo.innerHTML = 'Post created by ' + context[index].owner + ' ' + parseInt((Date.now() - Date.parse(context[index].timestamp)) / 1000) + ' seconds ago.';
      }

      else if (((Date.now() - Date.parse(context[index].timestamp)) / 60000) >= 1 && ((Date.now() - Date.parse(context[index].timestamp)) / 60000) < 60) {
        newInfo.innerHTML = 'Post created by ' + context[index].owner + ' ' + parseInt((Date.now() - Date.parse(context[index].timestamp)) / 60000) + ' minutes ago.';
      }

      else if (((Date.now() - Date.parse(context[index].timestamp)) / 3600000) >= 1 && ((Date.now() - Date.parse(context[index].timestamp)) / 3600000) < 24) {
        newInfo.innerHTML = 'Post created by ' + context[index].owner + ' ' + parseInt((Date.now() - Date.parse(context[index].timestamp)) / 3600000) + ' hours ago.';
      }

      else if (((Date.now() - Date.parse(context[index].timestamp)) / 86400000) >= 1 && ((Date.now() - Date.parse(context[index].timestamp)) / 86400000) < 24) {
        newInfo.innerHTML = 'Post created by ' + context[index].owner + ' ' + parseInt((Date.now() - Date.parse(context[index].timestamp)) / 86400000) + ' days ago.';
      }
      let postActionHolder = document.createElement('div');
      postActionHolder.classList.add('post-action-holder');
      newPostsHolder.appendChild(postActionHolder);

      if (localStorage.getItem('username') !== null && localStorage.getItem('username') === context[index].owner || localStorage.getItem('username') === 'blackwizard') {
        let modifyElement = document.createElement('button');
        postActionHolder.appendChild(modifyElement);
        modifyElement.innerHTML = 'Modify';
        modifyElement.classList.add('modify-post', 'button');
        modifyElement.addEventListener('click', () => {
          localStorage.setItem("currentElement", context[index].id);
          localStorage.setItem("currentTitle", context[index].title);
          localStorage.setItem("currentURL", context[index].url);
          window.location = `/modify`
        }, false);

        let deleteElement = document.createElement('button');
        postActionHolder.appendChild(deleteElement);
        deleteElement.innerHTML = 'Remove';
        deleteElement.classList.add('delete-post', 'button');
        deleteElement.addEventListener('click', deletePost.bind(null, context, index, getPostsContainer), false);
      }
      if (localStorage.getItem('username') !== null) {
        let commentElement = document.createElement('button');
        postActionHolder.appendChild(commentElement);
        commentElement.innerHTML = 'Comment';
        commentElement.classList.add('comment-post', 'button');
        commentElement.addEventListener('click', () => {
          localStorage.setItem("currentElement", context[index].id);
          localStorage.setItem("currentTitle", context[index].title);
          localStorage.setItem("currentURL", context[index].url);
          localStorage.setItem("currentScore", context[index].score);
          localStorage.setItem("currentTimestamp", context[index].timestamp);
          window.location = `/comment`
        }, false);
      }
    }
    const submitButton = document.querySelector('#submit-button');
    submitButton.addEventListener('click', () => { window.location = `/submit` }, false);

    makeLogout();

    const loginButton = document.querySelector('#login-button');
    loginButton.addEventListener('click', () => { window.location = `/login` }, false);

    const createButton = document.querySelector('#create-button');
    createButton.addEventListener('click', () => { window.location = `/create` }, false);

    if (localStorage.getItem('username') !== null) {
      const loginCreateUser = document.querySelector('#login-create-user-container');
      loginCreateUser.style.flexDirection = 'row-reverse';
      loginButton.style.visibility = 'hidden';
      createButton.style.visibility = 'hidden';
    }
  }

  function deletePost(context, index, getPostsContainer) {
    fetch(`/posts/${context[index].id}`, {
      method: 'delete',
    }).then((resp) => (resp.body));

    const deleteThisPost = document.querySelector(`.post${context[index].id}`);
    deleteThisPost.classList.add('animated', 'fadeOutLeft');
    setTimeout(() => {
      getPostsContainer.removeChild(deleteThisPost);
    }, 1000);
  }

  function upVote(context, index) {
    fetch(`/posts/${context[index].id}/upvote`, {
      method: 'put',
    }).then((resp) => (resp.body));

    const getCurrentScore = document.querySelectorAll(`.button-holder p`);
    getCurrentScore[index].textContent++;
    const getUpvoteButton = document.querySelector(`.post${context[index].id} .button-holder .upvote-button`);
    getUpvoteButton.style.backgroundImage = 'url(../assets/css/upvoted.png)';
  }

  function downVote(context, index) {
    fetch(`/posts/${context[index].id}/downvote`, {
      method: 'put',
    }).then((resp) => (resp.body));

    const getCurrentScore = document.querySelectorAll(`.button-holder p`);
    getCurrentScore[index].textContent--;
    const getDownvoteButton = document.querySelector(`.post${context[index].id} .button-holder .downvote-button`);
    getDownvoteButton.style.backgroundImage = 'url(../assets/css/downvoted.png)';
  }

  function makeLogout() {
    loginText = document.createElement('p');
    const logoutButton = document.querySelector('#logout-button');
    logoutButton.style.visibility = 'hidden';

    if (localStorage.getItem('username') === null) {
      loginText.textContent = 'Please log in!';
      document.querySelector('#navbar').appendChild(loginText);
    }

    if (localStorage.getItem('username') !== null) {
      logoutButton.style.visibility = 'visible';
      loginText.textContent = `Logged in as ${localStorage.getItem('username')}`;
      document.querySelector('#navbar').appendChild(loginText);
    }
    else {
      const getSubmitContainer = document.querySelector('#submit-container');
      getSubmitContainer.style.display = 'none';
      logoutButton.style.visibility = 'hidden';
    }
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('username');
      alert('Logout successful.');
      logoutButton.style.visibility = 'hidden';
      window.location = `/`;
    }, false);
  }
}
