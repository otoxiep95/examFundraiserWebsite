"use strict";

let user_endpoint = "https://5bfd357c827c3800139ae907.mockapi.io/treefund/user";

let main = document.querySelector("main");
let registerForm = document.querySelector(".register-form");

registerForm.addEventListener("submit", e => {
  e.preventDefault();
  console.log(e);
  console.log(registerForm.elements);
  const newUserData = {
    firstname: registerForm.elements.ifirstname.value,
    lastname: registerForm.elements.ilastname.value,
    username: registerForm.elements.iusername.value,
    email: registerForm.elements.iemail.value,
    password: registerForm.elements.ipassword.value,
    date: new Date().toDateString()
  };
  checkUsername(registerForm.elements.iusername.value);
  function checkUsername(username) {
    let userTaken = false;
    fetch(user_endpoint)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        data.forEach(user => {
          if (user.username === username) {
            console.log("found");
            userTaken = true;
          }
        });
      });

    if (!userTaken) {
      createUser(newUserData);
    } else {
      console.log("username taken please choose another one");
    }
  }
});

let loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  console.log(loginForm.elements);

  verifyUser(
    loginForm.elements.username.value,
    loginForm.elements.password.value
  );
});

function verifyUser(username, password) {
  let userValid = false;
  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      console.log(username, password);
      console.log(data);

      data.forEach(user => {
        //verify if there is usernamer
        if (user.username === username) {
          console.log("found");
          console.log(user.password);
          //within this verify if the password matches
          if (user.password === password) {
            userValid = true;
            console.log("go to user profile id:" + user.id);
            window.location = "myforest.html?id=" + user.id;
          }
        }
      });
      console.log(userValid);
      //return userValid;
    });
}

function createUser(newUserData) {
  fetch(user_endpoint, {
    method: "post",
    body: JSON.stringify(newUserData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(d => { });
}
