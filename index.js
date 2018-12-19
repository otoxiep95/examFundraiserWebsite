"use strict";

let urlParams = new URLSearchParams(window.location.search);

let userIdurl = urlParams.get("id");
let user_endpoint =
  "https://5bfd357c827c3800139ae907.mockapi.io/treefund/user/";

let main = document.querySelector("main");
let recentDonationTemplate = document.querySelector(".recentDonations-template")
  .content;
let loginModal = document.querySelector(".modal");
let registerForm = document.querySelector("#main-register-form");
let loginForm = document.querySelector(".login-form");
//IF USER LOGED IN DONT SHOW LOG IN LINK IN NAV
if (userIdurl) {
  document.querySelector("#myforest-link").href =
    "myforest.html?id=" + userIdurl;
  document.querySelector("#log-in-link").classList.add("hidden");
  document.querySelector("#log-out-link").classList.remove("hidden");
  document.querySelector("#myforest-link").classList.remove("hidden");
} else {
  document.querySelector("#myforest-link").classList.add("hidden");
  //OPENING AND CLOSING OF MODAL FOR LOGIN AND REGISTER
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
}

// CHECK INFO TO BEFORE GOING TO DONATION FORM FUNCTION
function userInfoValid() {
  let validity = registerForm.checkValidity();
  if (validity) {
    if (
      document
        .querySelector("#username-lable span")
        .classList.contains("wrong") ||
      document.querySelector("#email-lable span").classList.contains("wrong")
    ) {
      return false;
    } else {
      return true;
    }
  }
}

document
  .querySelector(".next-step-button")
  .addEventListener("click", function() {
    // CHECK INFO TO BEFORE GOING TO DONATION FORM
    // if (userInfoValid()) {
    document.querySelector(".register-form").classList.add("hidden");
    document.querySelector(".login-form").classList.add("hidden");
    document.querySelector(".planttree-form").classList.remove("hidden");
    document.querySelector(".credit-card-details").classList.remove("hidden");
    document.querySelector(".plus").addEventListener("click", e => {
      registerForm.elements.treenumber.stepUp(1);
    });
    document.querySelector(".minus").addEventListener("click", e => {
      if (registerForm.elements.treenumber.value > 1) {
        registerForm.elements.treenumber.stepUp(-1);
      }
    });
    // }
    console.log("toggle");
  });

//SHOW ERROE MESSAGE IF USERNAME IS TAKEN
registerForm.elements.iusername.addEventListener("blur", e => {
  let username = registerForm.elements.iusername.value;
  let warningSigng = registerForm.elements.iusername.parentElement.querySelector(
    "span"
  );
  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      let userTaken = false;
      data.forEach(user => {
        if (user.username === username) {
          userTaken = true;
        }
      });
      if (userTaken) {
        warningSigng.classList.add("wrong");
        warningSigng.classList.remove("validated");
        registerForm.elements.iusername.parentElement.querySelector(
          "span"
        ).textContent = "username already taken";
      } else {
        warningSigng.classList.remove("wrong");
        warningSigng.classList.add("validated");
        registerForm.elements.iusername.parentElement.querySelector(
          "span"
        ).textContent = "";
      }
    });
});
//SHOW ERROR MESSAGE IF EMAIL TAKEN OR INVALID
registerForm.elements.iemail.addEventListener("blur", e => {
  let email = registerForm.elements.iemail.value;
  let warningSigng = registerForm.elements.iemail.parentElement.querySelector(
    "span"
  );
  console.log(warningSigng);
  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      let emailTaken = false;
      data.forEach(user => {
        if (user.email === email) {
          console.log("found");
          emailTaken = true;
        }
      });
      if (registerForm.elements.iemail.checkValidity()) {
        if (emailTaken) {
          console.log("user taken");
          console.log(registerForm.elements.iemail.parentElement);
          warningSigng.classList.add("wrong");
          warningSigng.classList.remove("validated");
          registerForm.elements.iemail.parentElement.querySelector(
            "span"
          ).textContent = "email already taken";
        } else {
          console.log("free");
          warningSigng.classList.remove("wrong");
          warningSigng.classList.add("validated");
          registerForm.elements.iemail.parentElement.querySelector(
            "span"
          ).textContent = "";
        }
      } else {
        warningSigng.classList.add("wrong");
        warningSigng.classList.remove("validated");
        registerForm.elements.iemail.parentElement.querySelector(
          "span"
        ).textContent = "please type a valid semail";
      }
    });
});

registerForm.elements.ipassword.addEventListener("blur", e => {
  let warningSigng = registerForm.elements.iemail.parentElement.querySelector(
    "span"
  );
  if (!registerForm.elements.ipassword.checkValidity()) {
    warningSigng.classList.add("wrong");
    warningSigng.classList.remove("validated");
    registerForm.elements.ipassword.parentElement.querySelector(
      "span"
    ).textContent = "password not valid";
  }
});

//CHANGE PRICE REGARDING NNUMBER OF TREES
registerForm.elements.treenumber.addEventListener("change", e => {
  console.log(e);
  console.log("change");
  let treeNum = registerForm.elements.treenumber.value;
  console.log(treeNum);
  document.querySelector(".price p").textContent = treeNum * 10 + "kr";
});

//SUBMIT REGISTER FORM
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
  const firstDonationData = {
    category: registerForm.elements.location.value,
    trees: Number(registerForm.elements.treenumber.value),
    date: new Date().toDateString()
  };
  createUser(newUserData, firstDonationData);
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
  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      data.forEach(user => {
        //verify if there is usernamer
        if (user.username === username) {
          //within this verify if the password matches
          if (user.password === password) {
            window.location = "myforest.html?id=" + user.id;
          } else {
            //Show error message: Username or password incorrect
            document
              .querySelector(".login-errormsg")
              .classList.remove("hidden");
          }
        }
      });
    });
}

function createUser(newUserData, firstDonationData) {
  fetch(user_endpoint, {
    method: "post",
    body: JSON.stringify(newUserData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(d => {
      console.log(d);
      let userId = d.id;
      fetch(user_endpoint + d.id + "/donations", {
        method: "post",
        body: JSON.stringify(firstDonationData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(d => {
          console.log(d);
          document.querySelector("#myForest-button").href =
            "myforest.html?id=" + userId;
        });
    });
}

document.querySelector(".burguerMenu").addEventListener("click", function() {
  document.querySelector(".menu").classList.remove("hidden");
});
document.querySelector(".mobile-cross").addEventListener("click", function() {
  document.querySelector(".menu").classList.add("hidden");
});
document
  .querySelector("#bottom-modal-login")
  .addEventListener("click", function() {
    document.querySelector(".login-form").style.display = "grid";
    document.querySelector("#main-register-form").style.display = "none";
  });
document
  .querySelector("#bottom-modal-register")
  .addEventListener("click", function() {
    document.querySelector(".login-form").style.display = "none";
    document.querySelector("#main-register-form").style.display = "block";
  });

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

    console.log(id);
    function getUsername(id, elem) {
      fetch(user_endpoint)
        .then(res => res.json())
        .then(data => {
          data.forEach(user => {
            if (user.id === id) {
              console.log(elem);
              elem.textContent = user.username;
            }
          });
        });
    }
    getUsername(id, clone.querySelector("h2"));
    //clone.querySelector("h2").textContent = getUsername(id);
    clone.querySelector(".recentDonation-date").textContent = new Date(
      donation.date
    ).toDateString();
    document.querySelector(".recentDonations").appendChild(clone);
  });
}

init();
