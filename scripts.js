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

    let blogPost = document.createElement('div');
    blogPost.classList.add('blog-post');
    blogPost.innerHTML = `
        <h2>${title}</h2>
        <p>${content}</p>
        ${image ? `<img src="${image}" alt="Blog Image" width="500" height="600">` : ''}
    `;
    if (video) {
        let videoContainer = document.createElement('div');
        videoContainer.classList.add('responsive-video-container');

        let iframe = document.createElement('iframe');
        iframe.src = video;
        iframe.allowFullscreen = true;

        videoContainer.appendChild(iframe);
        blogPost.appendChild(videoContainer);
    }

    blogPost.innerHTML += `
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
    `;

    document.getElementById('content').appendChild(blogPost);

    // Add event listeners to the new buttons
    blogPost.querySelector('.edit-button').addEventListener('click', () => editPost(blogPost));
    blogPost.querySelector('.delete-button').addEventListener('click', () => deletePost(blogPost));

    // Reset the form
    document.getElementById('blogForm').reset();
    document.getElementById('adminPage').classList.add('hidden');
});

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
}

function deletePost(post) {
    if (confirm("Are you sure you want to delete this post?")) {
        post.remove();
    }
}

// Handle comment form submission
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let name = document.getElementById('commentName').value;
    let message = document.getElementById('commentMessage').value;

    let comment = document.createElement('div');
    comment.classList.add('comment');
    comment.innerHTML = `
        <h3>${name}</h3>
        <p>${message}</p>
        <button class="reply-button">Reply</button>
        <button class="delete-comment-button">Delete</button>
    `;

    document.getElementById('comments').appendChild(comment);

    // Add event listeners to the new buttons
    comment.querySelector('.reply-button').addEventListener('click', () => replyToComment(comment));
    comment.querySelector('.delete-comment-button').addEventListener('click', () => deleteComment(comment));

    // Reset the comment form
    document.getElementById('commentForm').reset();
});

function replyToComment(comment) {
    let replyName = prompt("Enter your name:");
    let replyMessage = prompt("Enter your reply:");

    let reply = document.createElement('div');
    reply.classList.add('comment');
    reply.innerHTML = `
        <h4>${replyName}</h4>
        <p>${replyMessage}</p>
    `;

    comment.appendChild(reply);
}

function deleteComment(comment) {
    if (confirm("Are you sure you want to delete this comment?")) {
        comment.remove();
    }
}
