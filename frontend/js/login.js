// Code Started

let username = document.getElementById('username');
let password = document.getElementById('password');
let login = document.getElementById('login');


localStorage.getItem('token')!=null ? window.location.href = "/platform" : null;

login.addEventListener('click', async () => {
    console.log("first")
    login.innerHTML = "Loading...";
    let data = {
        username: username.value,
        password: password.value
    }
    let res = await fetch('/auth/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let resData = await res.json();
    console.log(resData)
    if (resData.error) {
        if (resData.msg == "username") {
            myAlert("Username or password you enter is incorrect.")
        }
        else if (resData.msg == "password") {
            myAlert("Username or password you enter is incorrect.")
        }
    }
    else {
        localStorage.setItem('token', resData.token);
        localStorage.setItem('user', JSON.stringify(resData.user));
        window.location.href = "/platform";
    }
});

const myAlert = (msg) => {
    alertMsg.innerHTML = msg;
    alert.classList.remove('hideAlert');
    setTimeout(() => {
        alert.classList.add('hideAlert');
    }, 2500)
}