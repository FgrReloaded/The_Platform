
// SIDEBAR 
const menuItems = document.querySelectorAll('.menu-item');

// MESSAGES
const messagesNotification = document.querySelector('#messages-notification');
const messages = document.querySelector('.messages');
const message = messages.querySelectorAll('.message');
const messageSearch = document.querySelector('#message-search');
const userProfile = document.querySelectorAll('.userProfile');
const imgFileSelector = document.getElementById("imgFileSelector")
const videoFileSelector = document.getElementById("videoFileSelector")
const imageFile = document.getElementById("imageFile")
const videoFile = document.getElementById("videoFile")
let imgContainer = document.getElementById("imgContainer");
let closeCreatePost = document.getElementById("close-create-post");
let createPost = document.getElementById("createPost");
let postBtn = document.getElementById("post");
let profileHref = document.querySelectorAll(".profileHref");
let logout = document.getElementById("logout");
let searchResult = document.getElementById("searchResult");
let searchBox = document.getElementById("searchBox");
let stories = document.getElementById("storiesContainer");
let currentStory = document.getElementById('currentStory');
let deleteStory = document.querySelector('.deleteStory');
let userOwnPosts = document.querySelector('.userOwnPosts');
let allStories;
// Post array
let setPosts = []
// THEME
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');
const fontSizes = document.querySelectorAll('.choose-size span');
var root = document.querySelector(':root');
const colorPalette = document.querySelectorAll('.choose-color span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');
const userFullName = document.querySelector('.name');
const fullname = document.getElementById('name');
const username = document.getElementById('username');




// ================ SIDEBAR ===============

// Push to main page if not logged in
if (!localStorage.getItem('token')) {
    window.location.href = "/";
}



// Get user data
let user = JSON.parse(localStorage.getItem('user'));

// Set user data
fullname.innerHTML = user.fullname;
userFullName.innerHTML = user.fullname;
username.innerHTML = '@' + user.username;
userProfile.forEach((item) => {
    item.src = user.profilePic;
});



// Handle Story
let followersStories = JSON.parse(sessionStorage.getItem('followersStories'));

const getStories = async () => {
    const response = await fetch('/stories/getstories?user=' + user.username, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    });
    const data = await response.json();
    if (data.success) {
        if (data.stories.length > 0) {
            storyPic.src = data.stories[0].story;
            sessionStorage.setItem('storyPic', JSON.stringify(data.stories[0]));
            storyPic.style.display = 'block';
            uploadStory.style.display = 'flex';
            upload_widget.style.display = 'none';
        }
    }
}

if (sessionStorage.getItem('storyPic')) {
    let src = JSON.parse(sessionStorage.getItem('storyPic'));
    storyPic.src = src.story;
    storyPic.style.display = 'block';
    upload_widget.style.display = 'none';
}
else {
    getStories();
}
let myFollowing = user.following;
// find all story with my followers
const addStories = () => {
    followersStories.forEach((story) => {
        let ele = `
        <div data-story='${story.story}' class="story userStory">
        <div class="profile-photo">
            <img class="userProfile">
        </div>
        <div class="storyPic">
            <img src=${story.story}>
        </div>
        <p class="name">${story.userFullName}</p>
    </div>
        `;
        stories.innerHTML += ele;
    });
    stories = document.querySelectorAll('.userStory');
    stories.forEach((story) => {
        story.addEventListener('click', (e) => {
            let storyLink = e.target.getAttribute('data-story');
            document.querySelector('.storyContainer').style.display = 'block';
            document.querySelector('.overlay').style.display = 'block';
            document.querySelector('.overlay').style.background = ' rgba(77, 77, 77, 0.9)';
            document.getElementById('currentStory').src = storyLink;
        })
    });
}
document.querySelector(".myStory").addEventListener("click", () => {
    document.querySelector('.deleteStory').style.display = "block"
})

document.getElementById('uploadStory').addEventListener('click', (e) => {
    if (sessionStorage.getItem('storyPic')) {
        document.querySelector('.storyContainer').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
        document.querySelector('.overlay').style.background = ' rgba(77, 77, 77, 0.9)';
        currentStory.src = storyPic.src;
    }
});
let submitIdea  = document.getElementById('submitIdea');
submitIdea.addEventListener('click', async (e) => {
    e.preventDefault();
    let a = document.createElement('a');
    a.href = "https://docs.google.com/forms/d/e/1FAIpQLScAU3U2kz9q2rxTTUHlX-G6rd3oMIarIkePMpACfgPRha6Prg/viewform?vc=0&c=0&w=1&flr=0";
    a.target = "_blank";
    a.click();
});



document.querySelector('.closeStory').addEventListener('click', () => {
    document.querySelector('.storyContainer').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.overlay').style.background = 'rgba(250, 251, 253, .9)';
});

// Delete Story
deleteStory.addEventListener('click', async () => {
    let getStory = JSON.parse(sessionStorage.getItem('storyPic'));
    const response = await fetch('/stories/delete-story?story=' + getStory._id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    });
    const data = await response.json();
    if (data.success) {
        storyPic.style.display = 'none';
        upload_widget.style.display = 'block';
        sessionStorage.removeItem('storyPic');
        document.querySelector('.storyContainer').style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
        document.querySelector('.overlay').style.background = 'rgba(250, 251, 253, .9)';
    }
});

const getFollowingStories = async () => {
    const response = await fetch('/stories/get-following-stories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ myFollowing })
    });
    const data = await response.json();
    if (data.success) {
        sessionStorage.setItem('followersStories', JSON.stringify(data.stories));
        followersStories = data.stories;
        addStories()
    }
}
getFollowingStories();

//  get user latest posts
let feeds = document.querySelector('.feeds');
let currentDate = new Date();
let day, month, year, hour, minute, time;


const showFeeds = () => {
    feeds.innerHTML = "";
    setPosts.forEach((post) => {
        date = new Date(post.createdAt);
        day = date.getDate();
        month = date.getMonth();
        year = date.getFullYear();
        hour = date.getHours();
        minute = date.getMinutes();

        if (currentDate.getFullYear() == year) {
            if (currentDate.getMonth() == month) {
                if (currentDate.getDate() == day) {
                    if (currentDate.getHours() == hour) {
                        time = currentDate.getMinutes() - minute + " minutes ago";
                    } else {
                        time = currentDate.getHours() - hour + " hours ago";
                    }
                } else {
                    time = currentDate.getDate() - day + " days ago";
                }
            } else {
                time = currentDate.getMonth() - month + " months ago";
            }
        } else {
            time = currentDate.getFullYear() - year + " years ago";
        }




        let ele = `
    <div class="feed">
    <div class="head">
        <div class="user">
            <div class="profile-photo">
                <img src="${post.userProfilePic}">
            </div>
            <div class="ingo">
                <h3>${post.fullname}</h3>
                <small>${time}</small>
            </div>
        </div>
        <span class="edit">
            <i class="uil editOption uil-ellipsis-h"></i>
            <div class="popup">
            ${post.user === user._id ? "<span>Delete</span>" : `<span onclick="window.location.href='/platform?message=true&user=${post.username}'">Message</span>`}
            </div>    

        </span>
    </div>
    <div class="postContent">
    ${post.body}    
    </div>
        <div class="photo">
    ${post.images.map((image) => {
            return `<img src="${image}">`
        })
            }
    </div>
    <div class="action-buttons">
        <div class="interaction-buttons">
            <span>${post.likes.includes(user._id) ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>`: `
            <i data-id="${post._id}" class="uil likeBtn uil-heart"></i>
            `
            }
            </span>
            <!--<span><i data-id="${post._id}" class="uil openComment uil-comment-dots"></i></span> -->
            <span><i class="uil uil-share-alt"></i></span>
        </div>
       
    </div>
    ${post.likes.length > 0 ? `
    <div class="liked-by">
    <p>Liked by <b>${post.likes.includes(user._id) ? "you" : ""} </b> ${post.likes.includes(user._id) && post.likes.length > 1 ? "and" : ""} ${(post.likes.includes(user._id) && post.likes.length <= 1) ? "" : ` <b> ${post.likes.length >= 1 ? post.likes.includes(user._id) ? post.likes.length - 1 + " others" : post.likes.length + " others" : ""} </b>`}</p>
    </div>
    `: ""
            }
            <!--
    <div class="caption">
        <p><b>Lana Rose</b> Lorem ipsum dolor sit quisquam eius. <span
                class="harsh-tag">#lifestyle</span></p>
    </div>
    <div data-id="${post._id}" class="commentInput">
        <input type="text" placeholder="Add a comment...">
        <i class="uil addComment uil-message"></i>
    </div>-->
<!--        <div class="comments text-muted">View all 3,473 comments</div> -->

</div >
    `
        feeds.innerHTML += ele;
    });

    document.querySelectorAll(".editOption").forEach(edit => {
        edit.addEventListener('click', (e) => {
            // get sibling element 
            let popup = e.target.nextElementSibling;
            popup.classList.toggle("show");
        })
    });

    // document.querySelectorAll('.openComment').forEach((btn) => {
    //     btn.addEventListener('click', (e) => {
    //         let id = e.target.getAttribute('data-id');
    //         let commentInput = document.querySelector(`div[data-id="${id}"]`);
    //         commentInput.style.display = "inline-block";
    //     })
    // });
    // document.querySelectorAll('.addComment').forEach((btn) => {
    //     btn.addEventListener('click', async (e) => {
    //         let id = e.target.parentElement.getAttribute('data-id');
    //         let commentInput = document.querySelector(`div[data-id="${id}"] input`);
    //         const response = await fetch('/comments/add-comment', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'auth-token': localStorage.getItem('token')
    //             },
    //             body: JSON.stringify({ post: id, body: commentInput.value, user: user.username, userProfilePic: user.profilePic, fullname: user.fullname })
    //         });
    //         const data = await response.json();
    //         if (data.success) {
    //             commentInput.value = "";
    //         }

    //     })
    // });

    document.querySelectorAll(".photo").forEach((photo) => {
        if (photo.children.length == 0) {
            photo.style.height = "100px";
        }
    });
    let likeBtn = document.querySelectorAll('.likeBtn');
    likeBtn.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            let id = e.target.getAttribute('data-id');
            const response = await fetch('/posts/like-post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ postId: id })
            });
            const data = await response.json();
            if (data.success) {
                if (data.posts.user == user._id) {
                    let myPosts = JSON.parse(sessionStorage.getItem('userPosts'));
                    myPosts.forEach((post) => {
                        if (post._id == data.posts._id) {
                            post.likes = data.posts.likes;
                        }
                    })
                    sessionStorage.setItem('userPosts', JSON.stringify(myPosts));
                }
                if (data.like == "add") {
                    e.target.classList.remove("uil-heart", "uil");
                    e.target.innerHTML = `
    <svg svg xmlns = "http://www.w3.org/2000/svg" width = "18" height = "18" fill = "red" class="bi bi-heart-fill" viewBox = "0 0 16 16" >
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                    </svg > `;
                    e.target.style.color = "#ff0000";
                } else {
                    e.target.classList.add("uil-heart", "uil");
                    e.target.innerHTML = ``;
                    e.target.style.color = "#000";
                }

            }

        })
    });

    let bookmarkBtn = document.querySelectorAll(".bookmark");
    bookmarkBtn.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            let id = e.target.getAttribute('data-id');
            const response = await fetch('/posts/bookmark?postId=' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            if (data.success) {
                if (data.posts.user == user._id) {
                    sessionStorage.setItem('userPosts', JSON.stringify([data.posts]));
                }
                if (data.bookmark == "add") {
                    e.target.classList.remove("uil-bookmark-full", "uil");
                    e.target.innerHTML = `
    < svg id = "removeBookmark" data - id="${post._id}" xmlns = "http://www.w3.org/2000/svg" height = "1em" viewBox = "0 0 384 512" > `

                } else {
                    e.target.classList.add("uil-bookmark-full", "uil");
                    e.target.innerHTML = ``;
                }
            }
        });
    });
}

const getPosts = async () => {
    const response = await fetch('/posts/get-posts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    });
    const data = await response.json();
    if (data.success) {
        data.posts.forEach(post => {
            if (!setPosts.includes(post)) {
                setPosts.push(post);
            }
        })
        showFeeds();
        sessionStorage.setItem('userPosts', JSON.stringify(data.posts));
    }
}

let userPosts = JSON.parse(sessionStorage.getItem('userPosts'));
if (!userPosts || userPosts.length == 0) {
    // getPosts();
} else {
    // userPosts.forEach((post) => {
    //     if (!setPosts.includes(post)) {
    //         setPosts.push(post);
    //     }
    // })
    
    // showFeeds();
}

// get following posts
const getFollowingPosts = async () => {
    const response = await fetch('/posts/get-following-posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ myFollowing })
    });
    const data = await response.json();
    if (data.success) {
        data.posts.forEach((post) => {
            if (!setPosts.includes(post)) {
                setPosts.push(post);
            }

        })
        showFeeds();
    }
}

getFollowingPosts();






// remove active class from all menu items
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');
        if (item.id != 'notifications') {
            document.querySelector('.notifications-popup').style.display = 'none';
        } else {
            document.querySelector('.notifications-popup').style.display = 'block';
            document.querySelector('#notifications .notification-count').style.display = 'none';
        }
    })
})


// ================ MESSAGES ===============
// searches chats
const searchMessage = () => {
    const val = messageSearch.value.toLowerCase();
    message.forEach(user => {
        let name = user.querySelector('h5').textContent.toLowerCase();
        if (name.indexOf(val) != -1) {
            user.style.display = 'flex';
        } else {
            user.style.display = 'none';
        }
    })
}


// search chat
messageSearch.addEventListener('keyup', searchMessage);

// hightlight messages card when messages menu item is clicked
messagesNotification.addEventListener('click', () => {
    messages.style.boxShadow = '0 0 1rem var(--color-primary)';
    messagesNotification.querySelector('.notification-count').style.display = 'none';
    setTimeout(() => {
        messages.style.boxShadow = 'none';
    }, 2000);
})



// THEME/DISPLAY CUSTOMIZATION

// opens modal
const openThemeModal = () => {
    themeModal.style.display = 'grid';
}

// closes modal
const closeThemeModal = (e) => {
    if (e.target.classList.contains('customize-theme')) {
        themeModal.style.display = 'none';
    }
}

// close modal
themeModal.addEventListener('click', closeThemeModal);

theme.addEventListener('click', openThemeModal);




// ======================== FONTS =========================

// remove active class from spans or font size selectors
const removeSizeSelector = () => {
    fontSizes.forEach(size => {
        size.classList.remove('active');
    })
}

fontSizes.forEach(size => {
    size.addEventListener('click', () => {
        removeSizeSelector();
        let fontSize;
        size.classList.toggle('active');

        if (size.classList.contains('font-size-1')) {
            fontSize = '10px';
            root.style.setProperty('----sticky-top-left', '5.4rem');
            root.style.setProperty('----sticky-top-right', '5.4rem');
        } else if (size.classList.contains('font-size-2')) {
            fontSize = '13px';
            root.style.setProperty('----sticky-top-left', '5.4rem');
            root.style.setProperty('----sticky-top-right', '-7rem');
        } else if (size.classList.contains('font-size-3')) {
            fontSize = '16px';
            root.style.setProperty('----sticky-top-left', '-2rem');
            root.style.setProperty('----sticky-top-right', '-17rem');
        } else if (size.classList.contains('font-size-4')) {
            fontSize = '19px';
            root.style.setProperty('----sticky-top-left', '-5rem');
            root.style.setProperty('----sticky-top-right', '-25rem');
        } else if (size.classList.contains('font-size-5')) {
            fontSize = '22px';
            root.style.setProperty('----sticky-top-left', '-12rem');
            root.style.setProperty('----sticky-top-right', '-35rem');
        }

        // change font size of the root html element
        document.querySelector('html').style.fontSize = fontSize;
    })

})



// remove active class from colors
const changeActiveColorClass = () => {
    colorPalette.forEach(colorPicker => {
        colorPicker.classList.remove('active');
    })
}

// change primary colors
colorPalette.forEach(color => {
    color.addEventListener('click', () => {
        let primary;
        // remove active class from colors
        changeActiveColorClass();

        if (color.classList.contains('color-1')) {
            primaryHue = 252;
        } else if (color.classList.contains('color-2')) {
            primaryHue = 52;
        } else if (color.classList.contains('color-3')) {
            primaryHue = 352;
        } else if (color.classList.contains('color-4')) {
            primaryHue = 152;
        } else if (color.classList.contains('color-5')) {
            primaryHue = 202;
        }
        color.classList.add('active');

        root.style.setProperty('--primary-color-hue', primaryHue);
    })
})






// theme BACKGROUND values
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// changes background color
const changeBG = () => {
    root.style.setProperty('--light-color-lightness', lightColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
}


// change background colors
Bg1.addEventListener('click', () => {
    // add active class
    Bg1.classList.add('active');
    // remove active class from the others
    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    // remove customized changes from local storage
    window.location.reload();
});

Bg2.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';

    // add active class
    Bg2.classList.add('active');
    // remove active class from the others
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
});

Bg3.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';

    // add active class
    Bg3.classList.add('active');
    // remove active class from others
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    changeBG();
})




// show sidebar
const menuBtn = document.querySelector('#menu-btn');
menuBtn.addEventListener('click', () => {
    document.querySelector('.left').style.display = 'block';
})

// hide sidebar
const closeBtn = document.querySelector('#close-btn');
closeBtn.addEventListener('click', () => {
    document.querySelector('.left').style.display = 'none';
})


// Creating a Post
createPost.addEventListener('click', () => {
    document.querySelector('.createPost').style.display = 'flex';
    document.querySelector('.overlay').style.display = 'block';
});
closeCreatePost.addEventListener('click', () => {
    document.querySelector('.createPost').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
});
imgFileSelector.onclick = () => {
    imageFile.click();
}
// videoFileSelector.onclick = () => {
//     videoFile.click();
// }

imageFile.addEventListener('change', () => {
    imgContainer.style.borderTop = "1px solid rgb(214, 214, 214)"
    if (imageFile.files.length > 0) {
        Array.from(imageFile.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                const img = document.createElement("img");
                img.src = result;
                img.width = 250;
                img.height = 250;
                img.style.objectFit = "contain";
                imgContainer.appendChild(img);
            }
            reader.readAsDataURL(file);
        })
    }
});

videoFile.addEventListener('change', () => {
    imgContainer.style.borderTop = "1px solid rgb(214, 214, 214)"
    if (videoFile.files.length > 0) {
        Array.from(videoFile.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                const video = document.createElement("video");
                video.src = result;
                video.width = 250;
                video.height = 250;
                video.autoplay = true;
                video.style.objectFit = "contain";
                imgContainer.appendChild(video);
            }
            reader.readAsDataURL(file);
        })
    }
});

postBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.target.innerText = "Posting...";
    // Upload all files
    let fileUrls = [];
    let videoUrls = [];
    let files = imageFile.files;
    let files2 = videoFile.files;

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            formData.append("upload_preset", "platform");
            formData.append("cloud_name", "dfn0nvt6t");
            const response = await fetch(`https://api.cloudinary.com/v1_1/dfn0nvt6t/image/upload`, {
                method: "post",
                body: formData
            });
            const data = await response.json();
            fileUrls.push(data.secure_url);
        }
    };
    if (files2.length > 0) {
        for (let i = 0; i < files2.length; i++) {
            const formData = new FormData();
            formData.append('file', files2[i]);
            formData.append("upload_preset", "platform");
            formData.append("cloud_name", "dfn0nvt6t");
            const response = await fetch(`https://api.cloudinary.com/v1_1/dfn0nvt6t/video/upload`, {
                method: "post",
                body: formData
            });
            const data = await response.json();
            videoUrls.push(data.secure_url);
        }
    };
    let content = document.getElementById('content');
    const response = await fetch('/posts/create-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ content: content.value, files: fileUrls, videos: videoUrls, username: user.username, fullname: user.fullname, userProfilePic: user.profilePic })
    });
    const data = await response.json();
    if (data.success) {
        setPosts.unshift(data.post);
        let userPosts = JSON.parse(sessionStorage.getItem('userPosts'));
        if (userPosts) {
            userPosts.unshift(data.post);
            sessionStorage.setItem('userPosts', JSON.stringify(userPosts));
        }
        e.target.innerText = "Post";
        showFeeds();
        window.location.href = '/platform';
    }
});

const storyUpload = async (storyLink) => {
    const response = await fetch('/stories/create-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ storyLink, user: user.username, userFullName: user.fullname })
    });
    const data = await response.json();
    if (data.success) {
        sessionStorage.setItem('storyPic', JSON.stringify(data.post));
        window.location.href = '/platform';
    }
}

// Handle Profile View
profileHref.forEach((item) => {
    item.addEventListener('click', () => {
        window.location.href = "/platform?profile=" + user.username;
    })
});

// get params in url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const profile = urlParams.get('profile');
const messageUrl = urlParams.get('message');

if (profile == null) {
    document.querySelector('.feeds').style.display = 'block';
    document.querySelector('.stories').style.display = 'flex';
}

// get user posts
const getUserPost = async (profile) => {
    const response = await fetch('/posts/get-user-posts?profile=' + profile, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    });
    const data = await response.json();
    if (data.success) {
        userOwnPosts.innerHTML = "";
        data.posts.forEach((post) => {
            let ele = `
            <div class="feed">
            <div class="head">
                <div class="user">
                    <div class="profile-photo">
                        <img src="${post.userProfilePic}">
                    </div>
                    <div class="ingo">
                        <h3>${post.fullname}</h3>
                        <small>${new Date(post.createdAt).toDateString()}</small>
                    </div>
                </div>
                <span class="edit">
                    <i class="uil editOption uil-ellipsis-h"></i>
                    <div class="popup">
                    ${post.user === user._id ? `<span class="deletePost" data-id='${post._id}' >Delete</span>` : `<span onclick="window.location.href='/platform?message=true&user=${post.username}'">Message</span>`}
                    </div>                    
                </span>
            </div>
            <div class="postContent">
            ${post.body}    
            </div>
                <div class="photo">
            ${post.images.map((image) => {
                return `<img src="${image}">`
            })
                }
            </div>
            <div class="action-buttons">
                <div class="interaction-buttons">
                    <span>${post.likes.includes(user._id) ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>`: `
                    <i data-id="${post._id}" class="uil likeBtn uil-heart"></i>
                    `
                }
                    </span>
                    <!--
                    <span><i class="uil uil-comment-dots"></i></span> -->
                    <span><i class="uil uil-share-alt"></i></span>
                </div>                  
            </div>
            ${post.likes.length > 0 ? `
            <div class="liked-by">
            <p>Liked by <b>${post.likes.includes(user._id) ? "you" : ""} </b> ${post.likes.includes(user._id) && post.likes.length > 1 ? "and" : ""} ${(post.likes.includes(user._id) && post.likes.length <= 1) ? "" : ` <b> ${post.likes.length >= 1 ? post.likes.includes(user._id) ? post.likes.length - 1 + " others" : post.likes.length + " others" : ""} </b>`}</p>
            </div>
            `: ""
                }  
                
                `
            userOwnPosts.innerHTML += ele;
        });

        document.querySelectorAll('.deletePost').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                let id = e.target.getAttribute('data-id');
                const response = await fetch('/posts/delete-post?postId=' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    }
                });
                const data = await response.json();
                if (data.success) {
                    let myPosts = JSON.parse(sessionStorage.getItem('userPosts'));
                    myPosts = myPosts.filter((post) => {
                        return post._id != id;
                    })
                    sessionStorage.setItem('userPosts', JSON.stringify(myPosts));
                    window.location.reload();
                }
            })
        });
        document.querySelectorAll(".editOption").forEach(edit => {
            edit.addEventListener('click', (e) => {
                // get sibling element 
                let popup = e.target.nextElementSibling;
                popup.classList.toggle("show");
            })
        });
        document.querySelectorAll(".photo").forEach((photo) => {
            if (photo.children.length == 0) {
                photo.style.height = "100px";
            }
        });
    }
}


// get user profile
const getUserProfile = async () => {
    const response = await fetch('/auth/getUser?profile=' + profile, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    });
    const data = await response.json();
    if (data.success) {
        if (data.user.username == user.username) {
            document.querySelector('.buttonArea').style.display = 'none';
        }
        // check if current user is following or not
        if (user.following.includes(data.user.username)) {
            document.querySelector('.follow').classList.add("btnFollowing");
            document.querySelector('.follow').innerHTML = "<i class='uil uil-check'></i> Following";
        } else {
            document.querySelector('.follow').classList.remove("btnFollowing");
            document.querySelector('.follow').innerHTML = "<i class='uil uil-user-plus'></i> Follow";
        }
        document.querySelector('.profileUserPic').src = data.user.profilePic;
        document.querySelector('.nameProfile').innerHTML = data.user.fullname;
        document.querySelector('.username').innerHTML = '@' + data.user.username;
        document.querySelector('.dateJoined').innerHTML = 'Joined ' + new Date(data.user.createdAt).toDateString();
        document.querySelector('.followerCount').innerHTML = data.user.followers.length + " Followers";
        document.querySelector('.followingCount').innerHTML = data.user.following.length + " Following";
    }
}

if (profile) {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
    document.getElementById("profileContainer").style.display = "flex";
    getUserPost(profile);
    getUserProfile();
}


// Handle Follow
document.querySelector('.follow').addEventListener('click', async (e) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const profile = urlParams.get('profile');
    const response = await fetch('/auth/follow?profile=' + profile, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    });
    const data = await response.json();
    if (data.success) {
        if (data.follow == "add") {
            e.target.classList.add("btnFollowing");
            e.target.innerHTML = "<i class='uil uil-check'></i> Following";
            user.following.push(profile);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.reload();
        } else {
            e.target.classList.remove("btnFollowing");
            e.target.innerHTML = "<i class='uil uil-user-plus'></i> Follow";
            user.following.splice(user.following.indexOf(profile), 1);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.reload();
        }
    }
});
document.querySelector('.follow').addEventListener('mouseenter', (e) => {
    if (e.target.classList.contains("btnFollowing")) {
        e.target.innerHTML = "<i class='uil uil-user-minus'></i> Unfollow";
    }
});
document.querySelector('.follow').addEventListener('mouseleave', (e) => {
    if (e.target.classList.contains("btnFollowing")) {
        e.target.innerHTML = "<i class='uil uil-check'></i> Following";
    }
});

// Handle Search
searchBox.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && searchBox.value != "") {
        if (searchBox.value[0] == '@') {
            searchBox.value = searchBox.value.slice(1);
        }
        const response = await fetch('/auth/search?search=' + searchBox.value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const data = await response.json();
        if (data.success) {
            if (data.users.length > 0) {
                searchResult.style.display = "flex";
                searchResult.innerHTML = `
                <div class="profile-photo">
                    <img src=${data.users[0].profilePic}  />
                </div>
                <a href = '/platform?profile=${data.users[0].username}' id = "searchName" > ${data.users[0].fullname}</a>
            `;
                let searchClose = document.querySelector(".searchClose");
                searchClose.style.display = "block";
                searchClose.addEventListener("click", (e) => {
                    searchResult.style.display = "none";
                    searchBox.value = "";
                });
            }
        }
    }
});

// Hande Message Operations
if (messageUrl) {
    document.querySelector('.messages').style.display = "block";
    let right = document.querySelector(".right")
    document.querySelector(".middle").style.display = "none";
    document.querySelectorAll(".menu-item").forEach((item) => {
        item.classList.remove("active");
    });
    document.getElementById("messages-notification").classList.add("active");
    right.style.display = "flex";
    right.style.gap = "3rem";
    right.style.marginBottom = "10rem";


}



// Handle Logout

logout.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('followersStories');
    sessionStorage.removeItem('userPosts');
    sessionStorage.removeItem('storyPic');
    window.location.href = "/";
});

