"use strict";

// let urlParams = new URLSearchParams(window.location.search);

// let userIdurl = urlParams.get("id");

let user_endpoint = "https://5bfd357c827c3800139ae907.mockapi.io/treefund/user";

let main = document.querySelector("main");
let recentDonationTemplate = document.querySelector(".recentDonations-template")
  .content;
let loginModal = document.querySelector(".modal");
let registerForm = document.querySelector("#main-register-form");
let loginForm = document.querySelector(".login-form");
document.querySelector(".getstarted").addEventListener("click", function() {
  //open modal
  loginModal.classList.remove("hidden");
  document.querySelector(".register-form").classList.remove("hidden");
  loginForm.classList.remove("hidden");
  document.querySelector(".planttree-form").classList.add("hidden");
  document.querySelector(".credit-card-details").classList.add("hidden");
});
document.querySelector("#log-in-link").addEventListener("click", function() {
  //open modal
  loginModal.classList.remove("hidden");
  document.querySelector(".register-form").classList.remove("hidden");
  loginForm.classList.remove("hidden");
  document.querySelector(".planttree-form").classList.add("hidden");
  document.querySelector(".credit-card-details").classList.add("hidden");
});
document.querySelector(".modal .cross").addEventListener("click", function() {
  loginModal.classList.add("hidden");
  document.querySelector(".register-form").classList.remove("hidden");
  loginForm.classList.remove("hidden");
  document.querySelector(".planttree-form").classList.add("hidden");
  document.querySelector(".credit-card-details").classList.add("hidden");
});
document
  .querySelector(".next-step-button")
  .addEventListener("click", function() {
    console.log("toggle");
    document.querySelector(".register-form").classList.add("hidden");
    document.querySelector(".login-form").classList.add("hidden");
    document.querySelector(".planttree-form").classList.remove("hidden");
    document.querySelector(".credit-card-details").classList.remove("hidden");
  });
console.log(registerForm.elements.iusername);
registerForm.elements.iusername.addEventListener("blur", e => {
  let username = registerForm.elements.iusername.value;
  let warningSigng = registerForm.elements.iusername.parentElement.querySelector(
    "span"
  );
  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      let userTaken = false;
      data.forEach(user => {
        if (user.username === username) {
          console.log("found");
          userTaken = true;
        }
      });
      if (userTaken) {
        console.log("user taken");
        console.log(registerForm.elements.iusername.parentElement);
        warningSigng.classList.add("wrong");
        warningSigng.classList.remove("validated");
      } else {
        console.log("free");
        warningSigng.classList.remove("wrong");
        warningSigng.classList.add("validated");
      }
    });
});

registerForm.elements.treenumber.addEventListener("input", e => {
  console.log(e);
  console.log("change");
  let treeNum = registerForm.elements.treenumber.value;
  console.log(treeNum);
  document.querySelector(".price p").textContent = treeNum * 10 + "kr";
});
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
      //createUser(newUserData);
      //go to first donation
      //document.querySelector(".planttree-form").classList.toggle("hidden");
    } else {
      console.log("username taken please choose another one");
    }
  }
});

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
          } else {
            //Show error message: Username or password incorrect
            document
              .querySelector(".login-errormsg")
              .classList.remove("hidden");
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
    .then(d => {});
}

function init() {
  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      let userdonations = data.map((user, index) => {
        return user.donations;
      });

      let donations = [].concat.apply([], userdonations);
      console.log(donations);
      //total amount of trees planted
      let totalDonations = donations
        .map(d => {
          return d.trees;
        })
        .reduce(add, 0);

      function add(a, b) {
        return a + b;
      }
      printTotalDonations(totalDonations);

      //last 5 donations
      let lastFiveDonations = [];
      lastFiveDonations = donations
        .sort(function(a, b) {
          return b.id - a.id;
        })
        .slice(0, 5);
      console.log(lastFiveDonations);
      console.log(totalDonations);
      printLastDonations(lastFiveDonations);
    });
}

function printTotalDonations(totalTrees) {
  document.querySelector(".total-planted span").textContent = totalTrees;
}

function printLastDonations(lastFiveDonations) {
  lastFiveDonations.forEach(donation => {
    const clone = recentDonationTemplate.cloneNode(true);
    const id = donation.userId;
    // let usernameHERE = "";
    // console.log(id);
    // fetch(user_endpoint)
    //   .then(res => res.json())
    //   .then(data => {
    //     data.forEach(user => {
    //       if (user.id === id) {
    //         console.log(user.username);
    //         usernameHERE = user.username;
    //       }
    //     });
    //   });

    // console.log(usernameHERE);
    // clone.querySelector("h2").textContent = usernameHERE;
    clone.querySelector(".recentDonation-date").textContent = new Date(
      donation.date
    ).toDateString();
    document.querySelector(".recentDonations").appendChild(clone);
  });
}

init();
