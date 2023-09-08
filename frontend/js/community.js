// Code Started

let groupTab = document.querySelectorAll(".groupTab");
let createGroup = document.getElementById("createGroup");
let logout = document.getElementById("logout");
let userProfile = document.querySelectorAll(".userProfile");
let name = document.getElementById("name");
let username = document.getElementById("username");
let createGroupBtn = document.getElementById("createGroupBtn");
let gType = document.getElementsByName("gType");
let gInvite = document.getElementsByName("groupInvite");
let gPost = document.getElementsByName("groupPost");
let groupBox = document.querySelector(".groupBox");
let myGroups = document.getElementById("myGroups");
let profileHref = document.querySelectorAll(".profileHref");
let allGroup = document.getElementById("allGroups");
let viewGroup;
let allGroups;

let groupType;
let groupInvite;
let groupPost;

if (localStorage.getItem("token") == null) window.location.href = "/";
let user = JSON.parse(localStorage.getItem('user'));
name.innerHTML = user.fullname;
username.innerHTML = user.username;


const menuBtn = document.querySelector('#menu-btn');
menuBtn.addEventListener('click', () => {
    document.querySelector('.left').style.display = 'block';
})
const closeBtn = document.querySelector('#close-btn');
closeBtn.addEventListener('click', () => {
    document.querySelector('.left').style.display = 'none';
})
// Get all groups 
async function getGroups() {
    let response = await fetch("/groups/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
        },
    });
    let data = await response.json();
    if (data.success) {
        groupBox.innerHTML = "";
        allGroups = data.groups;
        data.groups.forEach((group) => {
            groupBox.innerHTML += `
            <div class="groupCard">
            <div class="imgArea">
                <img src="${group.coverPhoto}" alt="">
                <div class="smallImg">
                    <img src="${group.logo}" alt="">
                </div>
            </div>
            <div class="groupDetails">
                <div data-id="${group._id}" class="groupName">${group.name}</div>
                <span>${group.groupType} &bull; Club</span>
            </div>
            <div class="actionBtn">
            ${group.members.includes(user._id) ? group.admins.includes(user._id) ? `<button disabled class="btn btn-secondary"><i class="uil uil-check"></i> Admin</button>` :
                    `<button disabled class="btn btn-secondary joinGroup"><i class="uil uil-check"></i> Member</button>`
                    :
                    `<button data-id="${group._id}" class="btn btn-primary joinGroup"><i class="uil uil-user-plus"></i> Join</button>`
                }
            </div>
        </div>
            `;
        });
        viewGroup = document.querySelectorAll(".groupName");
        viewGroup.forEach((viewGroup) => {
            viewGroup.addEventListener("click", (e) => {
                let groupId = e.target.getAttribute("data-id");
                // filter that group from groupId and show it in single group
                let singleGroup = allGroups.filter((group) => {
                    return group._id == groupId;
                });
                sessionStorage.setItem("singleGroup", JSON.stringify(singleGroup));
                window.location.href = "/community?group=" + e.target.innerText;
            });
        });
        let joinGroup = document.querySelectorAll(".joinGroup");
        joinGroup.forEach((joinGroup) => {
            joinGroup.addEventListener("click", async (e) => {
                let groupId = e.target.getAttribute("data-id");
                let response = await fetch("/groups/join?id=" + groupId, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                    },
                });
                let data = await response.json();
                if (data.success) {
                    e.target.innerHTML = "Member";
                    e.target.disabled = true;
                    e.target.classList.remove("btn-primary");
                    e.target.classList.add("btn-secondary");
                }
            });
        });
    }
}
getGroups();


// Redirecting to profile page
userProfile.forEach((profile) => {
    profile.src = user.profilePic;
    profile.addEventListener("click", (e) => {
        window.location.href = "/profile";
    });
});

// Saving group type value
gType.forEach((type) => {
    type.addEventListener("click", (e) => {
        groupType = e.target.value;
    });
});
// Saving group posting permissions 
gInvite.forEach(invite => {
    invite.addEventListener("click", (e) => {
        groupInvite = e.target.value
    })
})
// Saving group inviting permissions 
gPost.forEach(invite => {
    invite.addEventListener("click", (e) => {
        groupPost = e.target.value
    })
})


// Changing Groups Tab
groupTab.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        let activeTab = document.querySelector(".groupTab.active");
        activeTab.classList.remove("active");
        e.target.classList.add("active");
    });
});

// Show Modal
createGroup.addEventListener("click", (e) => {
    document.querySelector(".modal").style.display = "flex";
    document.querySelector(".overlay").style.display = "block";
});
// Hide Modal
document.querySelector(".closeModal").addEventListener("click", (e) => {
    document.querySelector(".modal").style.display = "none";
    document.querySelector(".overlay").style.display = "none";
    groupTab[0].click();
});

// Create Group
createGroupBtn.addEventListener("click", async (e) => {
    let groupName = document.getElementById("gName").value;
    let groupDesc = document.getElementById("desc").value;
    let coverUrl = document.getElementById("coverUrl").value;
    let logoUrl = document.getElementById("logoUrl").value;
    let body = { groupName, groupDesc, groupInvite, groupPost, groupType, coverUrl, logoUrl };

    let response = await fetch("/groups/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
    });
    let data = await response.json();
    if (data.success) {
        window.location.reload();
    }
});

let url = window.location.search;
let params = new URLSearchParams(url);
let group = params.get("group");
let message = params.get("message");

if (group) {
    let buttonSec = document.querySelector(".buttonSec");
    let singleGroup = JSON.parse(sessionStorage.getItem('singleGroup'));
    document.querySelector(".groups").style.display = "none";
    document.querySelector(".back").style.display = "block";
    document.querySelector(".singleGroup").style.display = "flex";
    document.querySelector('.coverImg').src = singleGroup[0].coverPhoto;
    document.querySelector('.logo').src = singleGroup[0].logo;
    document.querySelector('.gName').innerText = singleGroup[0].name;
    document.querySelector('.gDesc').innerText = singleGroup[0].desc;
    document.querySelector('.gType').innerText = singleGroup[0].groupType;
    if (singleGroup[0].admins.includes(user._id)) {
        buttonSec.innerHTML = `<button disabled class="btn btn-secondary"><i class="uil uil-check"></i> Admin</button>`;
    } else if (singleGroup[0].members.includes(user._id)) {
        buttonSec.innerHTML = `<button disabled class="btn btn-secondary"><i class="uil uil-check"></i> Member</button>`;
    } else {
        buttonSec.innerHTML = `<button data-id="${singleGroup[0]._id}" class="btn btn-primary joinGroup"><i class="uil uil-user-plus"></i> Join</button>`;
    }
}

myGroups.addEventListener("click", (e) => {
    groupBox.innerHTML = "";
    // filter all groups and show only those groups in which user is member
    let myGroups = allGroups.filter((group) => {
        return group.members.includes(user._id);
    });
    myGroups.forEach((group) => {
        groupBox.innerHTML += `
        <div class="groupCard">
        <div class="imgArea">
            <img src="${group.coverPhoto}" alt="">
            <div class="smallImg">
                <img src="${group.logo}" alt="">
            </div>
        </div>
        <div class="groupDetails">
            <div data-id="${group._id}" class="groupName">${group.name}</div>
            <span>${group.groupType} &bull; Club</span>
        </div>
        <div class="actionBtn">
        ${group.members.includes(user._id) ? group.admins.includes(user._id) ? `<button disabled class="btn btn-secondary"><i class="uil uil-check"></i> Admin</button>` :
                `<button disabled class="btn btn-secondary joinGroup"><i class="uil uil-check"></i> Member</button>`
                :
                `<button data-id="${group._id}" class="btn btn-primary joinGroup"><i class="uil uil-user-plus"></i> Join</button>`
            }
        </div>
    </div>
        `;
    });
});
allGroup.addEventListener("click", (e) => {
    groupBox.innerHTML = "";
    allGroups.forEach((group) => {
        groupBox.innerHTML += `
        <div class="groupCard">
        <div class="imgArea">
            <img src="${group.coverPhoto}" alt="">
            <div class="smallImg">
                <img src="${group.logo}" alt="">
            </div>
        </div>
        <div class="groupDetails">
            <div data-id="${group._id}" class="groupName">${group.name}</div>
            <span>${group.groupType} &bull; Club</span>
        </div>
        <div class="actionBtn">
        ${group.members.includes(user._id) ? group.admins.includes(user._id) ? `<button disabled class="btn btn-secondary"><i class="uil uil-check"></i> Admin</button>` :
                `<button disabled class="btn btn-secondary joinGroup"><i class="uil uil-check"></i> Member</button>`
                :
                `<button data-id="${group._id}" class="btn btn-primary joinGroup"><i class="uil uil-user-plus"></i> Join</button>`
            }
        </div>
    </div>
        `;
    });
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
    `; let searchClose = document.querySelector(".searchClose");
                searchClose.style.display = "block";
                searchClose.addEventListener("click", (e) => {
                    searchResult.style.display = "none";
                    searchBox.value = "";
                });
            }
        }
    }
});

profileHref.forEach((item) => {
    item.addEventListener('click', () => {
        window.location.href = "/platform?profile=" + user.username;
    })
});

// Handle Logout
logout.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('followersStories');
    sessionStorage.removeItem('userPosts');
    sessionStorage.removeItem('storyPic');
    sessionStorage.removeItem('singleGroup');
    window.location.href = "/";
});

