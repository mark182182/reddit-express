'use strict';

window.onload = () => {
  if (localStorage.getItem('username') !== null) {
    const http = new XMLHttpRequest();
    http.open('GET', `/comment`, true);

    http.onload = () => {
      if (http.status === 200) {
        const postId = localStorage.getItem('currentElement');
        const postTitle = localStorage.getItem('currentTitle');
        const postUrl = localStorage.getItem('currentURL');
        const postScore = localStorage.getItem('currentScore');
        const postTime = localStorage.getItem('currentTimestamp');
        const username = localStorage.getItem('username');
        const getSubmitButton = document.querySelector('#comment-button');
        const getPostsContainer = document.querySelector('.posts-container');

        let newDivElement = document.createElement('div');
        getPostsContainer.appendChild(newDivElement);
        newDivElement.classList.add(`post${postId}`, 'post');

        let newButtonHolder = document.createElement('div');
        newButtonHolder.classList.add('button-holder');
        newDivElement.appendChild(newButtonHolder);

        let upVoteButton = document.createElement('button');
        newButtonHolder.appendChild(upVoteButton);
        upVoteButton.classList.add('upvote-button');
        upVoteButton.addEventListener('click', upVote.bind(null, postId, false));

        let scoreInfo = document.createElement('p');
        newButtonHolder.appendChild(scoreInfo);
        scoreInfo.innerHTML = postScore;

        let downVoteButton = document.createElement('button');
        newButtonHolder.appendChild(downVoteButton);
        downVoteButton.classList.add('downvote-button');
        downVoteButton.addEventListener('click', downVote.bind(null, postId, false));

        let newPostsHolder = document.createElement('div');
        newPostsHolder.classList.add('posts-holder');
        newDivElement.appendChild(newPostsHolder);

        let newPost = document.createElement('a');
        newPost.classList.add(`post${postId}`);
        newPostsHolder.appendChild(newPost);
        newPost.innerHTML = postTitle;
        newPost.setAttribute('href', postUrl);

        let newInfo = document.createElement('div');
        newInfo.classList.add
        (`info`);
        newPostsHolder.appendChild(newInfo);

        getPostOwner(postId);
        getComments(postId);

        if (((Date.now() - Date.parse(postTime)) / 1000) < 1) {
          newInfo.innerHTML = 'Post created by ' + username + ' ' + ' now.';
        }

        else if (((Date.now() - Date.parse(postTime)) / 1000) >= 1 && ((Date.now() - Date.parse(postTime)) / 1000) < 60) {
          newInfo.innerHTML = 'Post created by ' + username + ' ' + parseInt((Date.now() - Date.parse(postTime)) / 1000) + ' seconds ago.';
        }

        else if (((Date.now() - Date.parse(postTime)) / 60000) >= 1 && ((Date.now() - Date.parse(postTime)) / 60000) < 60) {
          newInfo.innerHTML = 'Post created by ' + username + ' ' + parseInt((Date.now() - Date.parse(postTime)) / 60000) + ' minutes ago.';
        }

        else if (((Date.now() - Date.parse(postTime)) / 3600000) >= 1 && ((Date.now() - Date.parse(postTime)) / 3600000) < 24) {
          newInfo.innerHTML = 'Post created by ' + username + ' ' + parseInt((Date.now() - Date.parse(postTime)) / 3600000) + ' hours ago.';
        }

        else if (((Date.now() - Date.parse(postTime)) / 86400000) >= 1 && ((Date.now() - Date.parse(postTime)) / 86400000) < 24) {
          newInfo.innerHTML = 'Post created by ' + username + ' ' + parseInt((Date.now() - Date.parse(postTime)) / 86400000) + ' days ago.';
        }

        getSubmitButton.addEventListener('click', sendComment.bind(null, username, postId), false);
        const getBackButton = document.querySelector('#back-button');
        getBackButton.addEventListener('click', () => { window.location = `/` }, false);

      }
    }
    http.send();
    function upVote(postId) {
      fetch(`/posts/${postId}/upvote`, {
        method: 'put',
      }).then((resp) => (resp.body));

      const getCurrentScore = document.querySelector(`.button-holder p`);
      getCurrentScore.textContent++;
      const getUpvoteButton = document.querySelector(`.post${postId} .button-holder .upvote-button`);
      getUpvoteButton.style.backgroundImage = 'url(../assets/css/upvoted.png)';
    }

    function downVote(postId) {
      fetch(`/posts/${postId}/downvote`, {
        method: 'put',
      }).then((resp) => (resp.body));

      const getCurrentScore = document.querySelector(`.button-holder p`);
      getCurrentScore.textContent--;
      const getDownvoteButton = document.querySelector(`.post${postId} .button-holder .downvote-button`);
      getDownvoteButton.style.backgroundImage = 'url(../assets/css/downvoted.png)';
    }

    function getComments(postId) {
      fetch(`/comment/${postId}`, {
        method: 'get'
      }).then((resp) => resp.json().then(resp => {
        for (let index = 0; index < resp.comments.length; index++) {
          const getPostCommentHolder = document.querySelector('.posts-comment-holder');
          const newCommentWrapper = document.querySelector('#comment-wrapper');
          const commentText = document.createElement('p');
          const infoText = document.createElement('p');
          commentText.classList.add(`comment${index}`, 'comment');
          commentText.innerHTML = resp.comments[index].comment;
          if (((Date.now() - Date.parse(resp.comments[index].timestamp)) / 1000) < 1) {
            infoText.innerHTML = resp.comments[index].comment_owner + ' ' + ' now.';
          }

          else if (((Date.now() - Date.parse(resp.comments[index].timestamp)) / 1000) >= 1 && ((Date.now() - Date.parse(resp.comments[index].timestamp)) / 1000) < 60) {
            infoText.innerHTML = resp.comments[index].comment_owner + ' ' + parseInt((Date.now() - Date.parse(resp.comments[index].timestamp)) / 1000) + ' seconds ago.';
          }

          else if (((Date.now() - Date.parse(resp.comments[index].timestamp)) / 60000) >= 1 && ((Date.now() - Date.parse(resp.comments[index].timestamp)) / 60000) < 60) {
            infoText.innerHTML = resp.comments[index].comment_owner + ' ' + parseInt((Date.now() - Date.parse(resp.comments[index].timestamp)) / 60000) + ' minutes ago.';
          }

          else if (((Date.now() - Date.parse(resp.comments[index].timestamp)) / 3600000) >= 1 && ((Date.now() - Date.parse(resp.comments[index].timestamp)) / 3600000) < 24) {
            infoText.innerHTML = resp.comments[index].comment_owner + ' ' + parseInt((Date.now() - Date.parse(resp.comments[index].timestamp)) / 3600000) + ' hours ago.';
          }

          else if (((Date.now() - Date.parse(resp.comments[index].timestamp)) / 86400000) >= 1 && ((Date.now() - Date.parse(resp.comments[index].timestamp)) / 86400000) < 24) {
            infoText.innerHTML = resp.comments[index].comment_owner + ' ' + parseInt((Date.now() - Date.parse(resp.comments[index].timestamp)) / 86400000) + ' days ago.';
          }
          getPostCommentHolder.appendChild(newCommentWrapper);
          newCommentWrapper.appendChild(commentText);
          commentText.appendChild(infoText);
          const lineSeparator = document.createElement('hr');
          infoText.appendChild(lineSeparator);
        }
      }));
    }

    function sendComment(owner, postId) {
      const comment = document.querySelector('#comment-input')['value'];

      if (comment === "") {
        alert('Please write a comment!');
      }
      else {
        fetch(`/comment/${postId}`, {
          method: 'post',
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({ owner, comment })
        });
        location.reload();
      }
    }

    function getPostOwner(postId) {
      fetch(`/comment/${postId}/owner`, {
        method: 'get'
      }).then(response => {
        console.log(response);

      }).then(resp => {
        console.log(JSON.parse(resp));
      });
    }
  }
}
