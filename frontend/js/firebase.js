// Code Started


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
let chatUser = document.getElementById('chatUser');
let count = 0;
let chattingWith = [];
let messagesCollection = [];
let currentChattingWith;
let currentLen, previousLen = 0;
let user = JSON.parse(localStorage.getItem("user"));
const firebaseConfig = {
    apiKey: "AIzaSyB25REPzbxZnVFMRAuEDSA8oNELa5DqVXY",
    authDomain: "platform-4b58f.firebaseapp.com",
    projectId: "platform-4b58f",
    storageBucket: "platform-4b58f.appspot.com",
    messagingSenderId: "1096577923742",
    appId: "1:1096577923742:web:6472532147890e1c5f998f"
};
let addedUser = [];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

const db = getFirestore(app);


// Handle Messaging System
const userId = urlParams.get('user');

const viewMessages = (id) => {
    const messages = collection(db, "users", user.username, "chattingWith", id, "messages");
    onSnapshot(messages, (querySnapshot) => {
        messagesCollection = [];
        querySnapshot.forEach((doc) => {
            messagesCollection.push(doc.data());
        });

        messagesCollection.sort((a, b) => {
            return a.time - b.time;
        });

        document.querySelector('.msgArea').innerHTML = "";
        messagesCollection.forEach((message) => {
            if (message.sender === user.username) {
                let ele = `
                <p class="me">${message.message}</p>
            `;
                document.querySelector('.msgArea').innerHTML += ele;
            } else {
                let ele = `
                <p class="you">${message.message}</p>
            `;
                document.querySelector('.msgArea').innerHTML += ele;
            }
        });
        document.querySelector('.msgArea').scrollTo(0, document.querySelector('.msgArea').scrollHeight);
    });
}

const showMsgUser = () => {
    if (chattingWith.length === 0 && count === 2) {
        document.querySelector('.msgHeader').style.display = "none";
        document.querySelector('.msgInput').style.display = "none";
        document.querySelector(".messageBox").style.background = "rgb(204 204 204)";
        document.querySelector('.msgArea').style.borderRadius = "1rem"
        document.querySelector('.msgArea').innerHTML = `
        <div id="empty" class="empty">
            <i class="uil uil-comment-alt-plus"></i>
            <h2>Start a conversation</h2>
        </div>
        `;
        document.querySelector(".messages").innerHTML += `
        <div id="noUser" class="noUser empty">
        <i class="uil uil-user-exclamation"></i>
        <h2>No Users to Chat</h2>
        </div>
        `;
    }
    if (currentLen !== previousLen) {
        chattingWith.reverse().forEach((user) => {
            if (!addedUser.includes(user.username)) {
                addedUser.push(user.username);
                let ele = `
        <div  data-id="${user.username}" class="message">
        <div data-id="${user.username}" class="profile-photo">
            <img data-id="${user.username}" src=${user.profilePic}>
        </div>
        <div data-id="${user.username}" class="message-body">
            <h5 data-id="${user.username}">${user.fullname}</h5>
            <p data-id="${user.username}" class="text-muted">Just woke up bruh</p>
        </div>
    </div>
        `;
                document.querySelector('.messages').innerHTML += ele;
            }
        });
        document.querySelectorAll('.message').forEach((ele) => {
            ele.addEventListener('click', async (e) => {
                ele.classList.add("activeReceiver");
                const id = e.target.getAttribute('data-id');
                document.querySelectorAll('.message').forEach((ele) => {
                    if (ele.getAttribute('data-id') !== id) {
                        ele.classList.remove("activeReceiver");
                    }
                });
                chatUser.innerText = chattingWith.find((user) => user.username === id).fullname;
                currentChattingWith = id;
                viewMessages(id);
            });
        });
    }
    previousLen = currentLen;
}



const extractUsers = async () => {
    //  get users from collection users in firebase database
    const users = collection(db, "users", user.username, "chattingWith");
    const querySnapshot = await getDocs(users);
    querySnapshot.forEach((doc) => {
        if (doc.data().username != user.username && !chattingWith.includes(doc.data())) {
            chattingWith.push(doc.data());
        }
    });
    currentLen = chattingWith.length;
    if (chattingWith.length === 0) {
        count += 1;
    }
    showMsgUser();

    if (userId == null && chattingWith.length > 0) {
        currentChattingWith = chattingWith[0].username;
        document.querySelectorAll('.message').forEach((ele) => {
            if (ele.getAttribute('data-id') === currentChattingWith) {
                ele.classList.add("activeReceiver");
            }
        });
        chatUser.innerText = chattingWith[0].fullname;
        viewMessages(chattingWith[0].username);
    }

}


const getUserData = async (userId) => {
    let getBack = false;
    const messages = collection(db, "users", user.username, "chattingWith");
    const querySnapshot = await getDocs(messages);
    querySnapshot.forEach((doc) => {
        if (doc.data().username === userId) {
            document.querySelectorAll('.message').forEach((ele) => {
                if (ele.getAttribute('data-id') === userId) {
                    ele.classList.add("activeReceiver");
                }
            });
            chatUser.innerText = doc.data().fullname;
            getBack = true;
        }
    });
    if (getBack) {
        viewMessages(userId);
        return;
    }
    let response = await fetch(`/auth/search?search=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token")
        }
    });
    let data = await response.json();
    if (data.success) {
        let currentUser = { username: data.users[0].username, fullname: data.users[0].fullname, profilePic: data.users[0].profilePic };
        chatUser.innerText = currentUser.fullname;
        document.querySelectorAll('.message').forEach((ele) => {
            if (ele.getAttribute('data-id') === userId) {
                ele.classList.add("activeReceiver");
            }
        });

        if (!chattingWith.includes(currentUser)) {
            chattingWith.unshift(currentUser);
        }
        currentLen = chattingWith.length;
        if (chattingWith.length === 0) {
            count += 1;
        }
        showMsgUser();
    }
}




if (messageUrl) {
    document.querySelector(".middle").style.display = "block";
    document.getElementById("stories").style.display = "none";
    document.getElementById("profileContainer").style.display = "none";
    document.querySelector(".feeds").style.display = "none";
    document.querySelector(".right").style.flexDirection = "column"
    extractUsers();
} else {
    document.querySelector(".messageBox").style.display = "none";
}
if (messageUrl && userId !== null && userId !== user.username) {
    let getData = true;
    currentChattingWith = userId;
    chattingWith.forEach((user) => {
        if (user.username === userId) {
            getData = false;
        }
    });
    if (getData) {
        getUserData(userId);
    }
}
if (userId === null) {
    count += 1;
}

const handleSendMsg = async () => {
    const message = document.getElementById('msgInput').value;
    const messages = collection(db, "users", user.username, "chattingWith", currentChattingWith, "messages");
    const messageReceiver = collection(db, "users", currentChattingWith, "chattingWith", user.username, "messages");
    const querySnapshot = await getDocs(messages);
    if (querySnapshot.empty) {
        let lastEle = chattingWith[chattingWith.length - 1];
        let users = collection(db, "users", user.username, "chattingWith");
        await addDoc(users, {
            username: currentChattingWith,
            fullname: lastEle.fullname,
            profilePic: lastEle.profilePic
        });
    }
    const querySnapshot2 = await getDocs(messageReceiver);
    if (querySnapshot2.empty) {
        let lastEle = chattingWith.filter((user) => user.username === currentChattingWith)[0];
        let users = collection(db, "users", currentChattingWith, "chattingWith");
        await addDoc(users, {
            username: user.username,
            fullname: user.fullname,
            profilePic: user.profilePic
        });
    }

    await addDoc(messages, {
        message,
        sender: user.username,
        receiver: currentChattingWith,
        time: new Date()
    });
    await addDoc(messageReceiver, {
        message,
        sender: user.username,
        receiver: currentChattingWith,
        time: new Date()
    });

    viewMessages(currentChattingWith);
    document.getElementById('msgInput').value = "";
}

sendMsg.addEventListener('click', (e) => {
    e.preventDefault();
    handleSendMsg();
});

document.getElementById('msgInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMsg();
    }
});
