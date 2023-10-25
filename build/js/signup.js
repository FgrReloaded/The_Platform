// Code Started

let Name = document.getElementById('Name');
let Email = document.getElementById('E-mail');
let Password = document.getElementById('Password');
let CPassword = document.getElementById('CPassword');
let username = document.getElementById('username');
let birthday = document.getElementById('birthday');
let Mobile = document.getElementById('Mobile');
let gender = document.getElementsByName("gender");
let form = document.getElementById('form');
let alert = document.getElementById('alert');
let alertMsg = document.getElementById('alertMsg');
let next = document.getElementById('next');
let genderValue = "female";

localStorage.getItem('token') != null ? window.location.href = "/platform" : null;



gender.forEach((item) => {
    item.addEventListener('click', () => {
        genderValue = item.value;
    })
})


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    next.innerHTML = "Loading...";
    let data = {
        fullname: Name.value,
        email: Email.value,
        password: Password.value,
        username: (username.value).toLowerCase(),
        bday: birthday.value,
        gender: genderValue,
        profilePic: profileImg.src,
        mobile: Mobile.value
    }
    // check all fields in data
    for (let key in data) {
        if (data[key] == "") {
            myAlert("Please fill all the fields");
            next.innerHTML = "Next";
            return;
        }
    }
    if (data.password !== CPassword.value) {
        myAlert("Password are not matching");
        next.innerHTML = "Next";
        return;
    }

    let res = await fetch('/auth/createuser', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let resData = await res.json();
    if (resData.error) {
        if (resData.msg == "email") {
            myAlert("This email has already existed. Try Login")
        }
        else if (resData.msg == "username") {
            myAlert("This username has already taken. Try Another")
        }
    } else {
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
    }, 2000)
}