document.getElementById('adminButton').addEventListener('click', () => {
    // Simple authentication
    let password = prompt("Enter admin password:");
    if (password === "admin27") {
        document.getElementById('adminPage').classList.remove('hidden');
    } else {
        alert("Incorrect password");
    }
});

document.getElementById('closeAdmin').addEventListener('click', () => {
    document.getElementById('adminPage').classList.add('hidden');
});

document.getElementById('blogForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let title = document.getElementById('title').value;
    let content = document.getElementById('blogContent').value;
    let image = document.getElementById('image').value;
    let video = document.getElementById('video').value;

    let blogPost = {
        title: title,
        content: content,
        image: image,
        video: video,
        comments: []
    };

    saveBlogPost(blogPost);
    addBlogPostToDOM(blogPost);

    // Reset the form
    document.getElementById('blogForm').reset();
    document.getElementById('adminPage').classList.add('hidden');
});

function saveBlogPost(post) {
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts.push(post);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function loadBlogPosts() {
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts.forEach(post => {
        addBlogPostToDOM(post);
    });
}

function addBlogPostToDOM(post) {
    let blogPost = document.createElement('div');
    blogPost.classList.add('blog-post');
    blogPost.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        ${post.image ? `<img src="${post.image}" alt="Blog Image" width="500" height="600">` : ''}
    `;
    if (post.video) {
        let videoContainer = document.createElement('div');
        videoContainer.classList.add('responsive-video-container');

        let iframe = document.createElement('iframe');
        iframe.src = post.video;
        iframe.allowFullscreen = true;

        videoContainer.appendChild(iframe);
        blogPost.appendChild(videoContainer);
    }

    blogPost.innerHTML += `
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
        <button class="comment-button">Comment</button>
        <form class="comment-form">
            <input type="text" class="commentName" placeholder="Your Name" required>
            <textarea class="commentMessage" placeholder="Your Comment" required></textarea>
            <button type="submit">Submit Comment</button>
        </form>
        <div class="comments"></div>
    `;

    document.getElementById('content').appendChild(blogPost);

    // Add event listeners to the new buttons
    blogPost.querySelector('.edit-button').addEventListener('click', () => editPost(blogPost));
    blogPost.querySelector('.delete-button').addEventListener('click', () => deletePost(blogPost));
    blogPost.querySelector('.comment-button').addEventListener('click', () => toggleCommentForm(blogPost));

    // Handle comment form submission
    blogPost.querySelector('.comment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        let name = blogPost.querySelector('.commentName').value;
        let message = blogPost.querySelector('.commentMessage').value;

        let comment = {
            name: name,
            message: message,
            replies: []
        };

        addCommentToDOM(blogPost, comment);

        // Update local storage
        let postIndex = Array.from(document.getElementById('content').children).indexOf(blogPost);
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts[postIndex].comments.push(comment);
        localStorage.setItem('blogPosts', JSON.stringify(posts));

        // Reset and hide the comment form
        blogPost.querySelector('.comment-form').reset();
        blogPost.querySelector('.comment-form').style.display = 'none';
    });

    // Load existing comments
    post.comments.forEach(commentData => {
        addCommentToDOM(blogPost, commentData);
    });
}

function addCommentToDOM(blogPost, commentData) {
    let comment = document.createElement('div');
    comment.classList.add('comment');
    comment.innerHTML = `
        <h3>${commentData.name}</h3>
        <p>${commentData.message}</p>
        <button class="reply-button">Reply</button>
        <button class="delete-comment-button">Delete</button>
        <div class="replies"></div>
    `;

    blogPost.querySelector('.comments').appendChild(comment);

    // Add event listeners to the new buttons
    comment.querySelector('.reply-button').addEventListener('click', () => replyToComment(comment, blogPost));
    comment.querySelector('.delete-comment-button').addEventListener('click', () => deleteComment(comment, blogPost));

    // Load existing replies
    commentData.replies.forEach(replyData => {
        addReplyToDOM(comment, replyData);
    });
}

function addReplyToDOM(comment, replyData) {
    let reply = document.createElement('div');
    reply.classList.add('comment');
    reply.innerHTML = `
        <h4>${replyData.name}</h4>
        <p>${replyData.message}</p>
    `;

    comment.querySelector('.replies').appendChild(reply);
}

function toggleCommentForm(post) {
    let commentForm = post.querySelector('.comment-form');
    if (commentForm.style.display === 'none' || commentForm.style.display === '') {
        commentForm.style.display = 'block';
    } else {
        commentForm.style.display = 'none';
    }
}

function editPost(post) {
    let title = prompt("Edit title:", post.querySelector('h2').innerText);
    let content = prompt("Edit content:", post.querySelector('p').innerText);
    let image = prompt("Edit image URL:", post.querySelector('img') ? post.querySelector('img').src : '');
    let video = prompt("Edit video URL:", post.querySelector('iframe') ? post.querySelector('iframe').src : '');

    post.querySelector('h2').innerText = title;
    post.querySelector('p').innerText = content;

    if (image) {
        if (!post.querySelector('img')) {
            let img = document.createElement('img');
            img.alt = "Blog Image";
            img.width = 500;
            img.height = 600;
            post.insertBefore(img, post.querySelector('.edit-button'));
        }
        post.querySelector('img').src = image;
    } else if (post.querySelector('img')) {
        post.querySelector('img').remove();
    }

    if (video) {
        if (!post.querySelector('iframe')) {
            let videoContainer = document.createElement('div');
            videoContainer.classList.add('responsive-video-container');

            let iframe = document.createElement('iframe');
            iframe.allowFullscreen = true;
            videoContainer.appendChild(iframe);
            post.insertBefore(videoContainer, post.querySelector('.edit-button'));
        }
        post.querySelector('iframe').src = video;
    } else if (post.querySelector('iframe')) {
        post.querySelector('iframe').parentElement.remove();
    }

    // Update local storage
    let postIndex = Array.from(document.getElementById('content').children).indexOf(post);
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts[postIndex].title = title;
    posts[postIndex].content = content;
    posts[postIndex].image = image;
    posts[postIndex].video = video;
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function deletePost(post) {
    if (confirm("Are you sure you want to delete this post?")) {
        let postIndex = Array.from(document.getElementById('content').children).indexOf(post);
        post.remove();

        // Update local storage
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts.splice(postIndex, 1);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
}

function replyToComment(comment, blogPost) {
    let replyName = prompt("Enter your name:");
    let replyMessage = prompt("Enter your reply:");

    let reply = {
        name: replyName,
        message: replyMessage
    };

    addReplyToDOM(comment, reply);

    // Update local storage
    let postIndex = Array.from(document.getElementById('content').children).indexOf(blogPost);
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    let commentIndex = Array.from(blogPost.querySelector('.comments').children).indexOf(comment);
    posts[postIndex].comments[commentIndex].replies.push(reply);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function deleteComment(comment, blogPost) {
    if (confirm("Are you sure you want to delete this comment?")) {
        let postIndex = Array.from(document.getElementById('content').children).indexOf(blogPost);
        let commentIndex = Array.from(blogPost.querySelector('.comments').children).indexOf(comment);

        // Remove comment from DOM
        comment.remove();

        // Update local storage
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts[postIndex].comments.splice(commentIndex, 1);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
}

// Load blog posts from local storage on page load
window.onload = loadBlogPosts;
