"use strict";

// GET ID OF LOGGED IN USER
let urlParams = new URLSearchParams(window.location.search);
let userIdurl = urlParams.get("id");

// MOCK API LINK FOR ALL USERS
let user_endpoint =
  "https://5bfd357c827c3800139ae907.mockapi.io/treefund/user/";

let main = document.querySelector("main");
let recentDonationTemplate = document.querySelector(".recentDonations-template")
  .content;
let loginModal = document.querySelector(".modal");
let registerForm = document.querySelector("#main-register-form");
let loginForm = document.querySelector(".login-form");
let step0 = document.querySelector("#modal-step0");
let donateButtonsContent = document.querySelectorAll(".content button");

function init() {
  getDonationsData();
  checkIfLoggedIn();
}

function getDonationsData() {
  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      //MAKE AN ARRAY OF DONATIONS ARRAY
      let userdonations = data.map((user, index) => {
        return user.donations;
      });

      // MAKE ARRAY OF DONATIONS
      let donations = [].concat.apply([], userdonations);

      //total amount of trees planted
      let totalDonations = donations
        // MAKE AN ARRAY OF TREE NUMBER
        .map(d => {
          return d.trees;
        })
        .reduce(add, 0);

      // SUM TREE NUMBER
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

      printLastDonations(lastFiveDonations);
    });
}

function checkIfLoggedIn() {
  if (userIdurl) {
    // GIVE USER ID TO URL
    document.querySelector("#myforest-link").href =
      "myforest.html?id=" + userIdurl;
    //GIVE LINK MYFOREST TO PLANT A TREE BUTTON
    document.querySelector(".getstarted").addEventListener("click", function() {
      window.location = "myforest.html?id=" + userIdurl;
    });
    // DIRECT DONATE BUTTONS TO MY FOREST PAGE
    donateButtonsContent.forEach(but => {
      but.addEventListener("click", function() {
        window.location = "myforest.html?id=" + userIdurl;
      });
    });
    //IF USER LOGED IN DONT SHOW LOG IN LINK IN NAV
    document.querySelector("#log-in-link").classList.add("hidden");
    document.querySelector("#log-out-link").classList.remove("hidden");
    document.querySelector("#myforest-link").classList.remove("hidden");
  } else {
    document.querySelector("#myforest-link").classList.add("hidden");

    // DIRECT DONATE BUTTONS TO REGISTER/LOGIN MODAL
    donateButtonsContent.forEach(but => {
      but.addEventListener("click", openModal);
    });

    // DIRECT GET STARTED BUTTONS TO REGISTER/LOGIN MODAL
    document.querySelector(".getstarted").addEventListener("click", openModal);

    // DIRECT LOG IN TO REGISTER/LOGIN MODAL
    document.querySelector("#log-in-link").addEventListener("click", openModal);

    // CLOSE THE MODAL
    document
      .querySelector(".modal .cross")
      .addEventListener("click", closeModal);
  }
}

function closeModal() {
  if (window.matchMedia("(min-width: 768px)").matches) {
    /* The viewport is at least 400 pixels wide */
  } else {
    document
      .querySelector(".mobile-bottom-modalMenu")
      .classList.remove("hidden");
    document.querySelector(".modal-timeline").classList.add("hidden");
  }
  loginModal.classList.add("hidden");
  document.querySelector(".register-form").classList.remove("hidden");
  loginForm.classList.remove("hidden");
  document.querySelector(".planttree-form").classList.add("hidden");
  document.querySelector(".credit-card-details").classList.add("hidden");
  document.querySelector(".congrats-part").classList.add("hidden");
}

function openModal() {
  if (window.matchMedia("(min-width: 768px)").matches) {
    loginModal.classList.remove("hidden");
    registerForm.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    document.querySelector(".planttree-form").classList.add("hidden");
    document.querySelector(".credit-card-details").classList.add("hidden");
  } else {
    loginModal.classList.remove("hidden");
    step0.classList.remove("hidden");
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
  }

  // CHECK IF USERNAME EMAIL AND PASSWORD TAKEN
  registerForm.elements.iusername.addEventListener("blur", usernameTaken);
  registerForm.elements.iemail.addEventListener("blur", emailTaken);
  registerForm.elements.ipassword.addEventListener("blur", passwordValid);

  registerForm.elements.iusername.addEventListener("focus", e => {
    registerForm.elements.iusername.parentElement.querySelector(
      "span"
    ).textContent = "";
  });
  registerForm.elements.iemail.addEventListener("focus", e => {
    registerForm.elements.iemail.parentElement.querySelector(
      "span"
    ).textContent = "";
  });
  registerForm.elements.ipassword.addEventListener("focus", e => {
    registerForm.elements.ipassword.parentElement.querySelector(
      "span"
    ).textContent = "";
  });

  // MODAL SECOND STEP
  document
    .querySelector(".next-step-button")
    .addEventListener("click", function() {
      // CHECK USER INFO BEFORE GOING DONATION FORM
      if (userInfoValid()) {
        modal2ndStep();
      }
    });

  //SUBMIT LOGIN FORM
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    verifyUser(
      loginForm.elements.username.value,
      loginForm.elements.password.value
    );
  });
}

function modal2ndStep() {
  // SHOW / HIDE STEPS
  if (window.matchMedia("(min-width: 768px)").matches) {
    document.querySelector(".mobile-bottom-modalMenu").classList.add("hidden");
    document.querySelector(".register-form").classList.add("hidden");
    document.querySelector(".login-form").classList.add("hidden");
    document.querySelector(".planttree-form").classList.remove("hidden");
    document.querySelector(".credit-card-details").classList.remove("hidden");
  }
  document.querySelector(".register-form").classList.add("hidden");
  document.querySelector(".planttree-form").classList.remove("hidden");
  document.querySelector(".timeline-2").style.backgroundColor = "orange";

  document.querySelector(".plantModal").addEventListener("click", function() {
    document.querySelector(".planttree-form").classList.add("hidden");
    document.querySelector(".credit-card-details").classList.remove("hidden");
    document.querySelector(".timeline-3").style.backgroundColor = "orange";
  });

  //CHANGE PRICE REGARDING NUMBER OF TREES

  document.querySelector(".plus").addEventListener("click", e => {
    let treeNum = registerForm.elements.treenumber.value;
    registerForm.elements.treenumber.stepUp(1);
    document.querySelector(".price p").textContent = treeNum * 10 + "kr";
  });

  document.querySelector(".minus").addEventListener("click", e => {
    let treeNum = registerForm.elements.treenumber.value;
    if (registerForm.elements.treenumber.value > 1) {
      registerForm.elements.treenumber.stepUp(-1);
      document.querySelector(".price p").textContent = treeNum * 10 + "kr";
    }
  });

  //SUBMIT REGISTER FORM
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    registerSubmit();
  });
}

function userInfoValid() {
  // CHECK INFO FROM HTML INPUT
  let validity = registerForm.checkValidity();
  // RETURNS IF USERNAME AND EMAIL TAKEN
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

function usernameTaken() {
  let username = registerForm.elements.iusername.value;
  let warningSigng = registerForm.elements.iusername.parentElement.querySelector(
    "span"
  );
  // CHECK USERNAME IN DATABASE
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
}

function emailTaken() {
  let email = registerForm.elements.iemail.value;
  let warningSigng = registerForm.elements.iemail.parentElement.querySelector(
    "span"
  );

  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      let emailTaken = false;
      data.forEach(user => {
        if (user.email === email) {
          emailTaken = true;
        }
      });

      if (registerForm.elements.iemail.checkValidity()) {
        if (emailTaken) {
          warningSigng.classList.add("wrong");
          warningSigng.classList.remove("validated");
          registerForm.elements.iemail.parentElement.querySelector(
            "span"
          ).textContent = "email already taken";
        } else {
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
}

function passwordValid() {
  let warningSigng = registerForm.elements.iemail.parentElement.querySelector(
    "span"
  );
  if (!registerForm.elements.ipassword.checkValidity()) {
    warningSigng.classList.add("wrong");
    warningSigng.classList.remove("validated");
    registerForm.elements.ipassword.parentElement.querySelector(
      "span"
    ).textContent = "password not valid";
  } else {
    warningSigng.classList.remove("wrong");
    registerForm.elements.ipassword.parentElement.querySelector(
      "span"
    ).textContent = "";
  }
}

function verifyUser(username, password) {
  fetch(user_endpoint)
    .then(res => res.json())
    .then(data => {
      data.forEach(user => {
        //verify if there is username
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

function registerSubmit() {
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
  document.querySelector("#main-register-form").classList.add("hidden");
  document.querySelector(".congrats-part").classList.remove("hidden");
  document.querySelector(".modal-timeline").classList.add("hidden");
  document.querySelector(".cross").classList.add("hidden");
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
          document.querySelector("#myForest-button").href =
            "myforest.html?id=" + userId;
        });
    });
}

/* MOBILE CODE */

//CLICK BURGER MENU MOBILE
document.querySelector(".burguerMenu").addEventListener("click", function() {
  document.querySelector(".menu").classList.remove("hidden");
});
document.querySelector(".mobile-cross").addEventListener("click", function() {
  document.querySelector(".menu").classList.add("hidden");
});

// SWITCH REGISTER LOGIN MOBILE
document
  .querySelector("#bottom-modal-login")
  .addEventListener("click", function() {
    step0.classList.add("hidden");
    loginForm.classList.remove("hidden");
    // loginForm.style.display = "grid";
    document.querySelector("#main-register-form").classList.add("hidden");
    document.querySelector(".mobile-bottom-modalMenu").classList.add("hidden");
    document.querySelector(".modal-timeline").classList.remove("hidden");
  });
document
  .querySelector("#bottom-modal-register")
  .addEventListener("click", function() {
    step0.classList.add("hidden");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    document.querySelector("#main-register-form").style.display = "block";
    document.querySelector(".mobile-bottom-modalMenu").classList.add("hidden");
    document.querySelector(".modal-timeline").classList.remove("hidden");
  });

function printTotalDonations(totalTrees) {
  document.querySelector(".total-planted span").textContent = totalTrees;
}

function printLastDonations(lastFiveDonations) {
  lastFiveDonations.forEach(donation => {
    const clone = recentDonationTemplate.cloneNode(true);
    const id = donation.userId;

    function getUsername(id, elem) {
      fetch(user_endpoint)
        .then(res => res.json())
        .then(data => {
          data.forEach(user => {
            if (user.id === id) {
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

    clone.querySelector(".donation-value .trees").textContent =
      donation.trees + " trees";
    clone.querySelector(".donation-value .forest").textContent =
      donation.category;
    document.querySelector(".recentDonations").appendChild(clone);
  });
}

//HIDE NAV IN MOBILE
if (window.matchMedia("(min-width: 768px)").matches) {
  document.querySelector(".menu").classList.remove("hidden");
} else {
  /* The viewport is less than 768 pixels wide */
  document.querySelector(".menu").classList.add("hidden");
  document.querySelectorAll(".menu a").forEach(a => {
    a.addEventListener("click", e => {
      document.querySelector(".menu").classList.add("hidden");
    });
  });
}

init();
