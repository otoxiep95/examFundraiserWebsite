"use strict";
let urlParams = new URLSearchParams(window.location.search);

let userId = urlParams.get("id");

let endpoint =
  "http://5bfd357c827c3800139ae907.mockapi.io/treefund/user/" +
  userId +
  "/donations";

let donationForm = document.querySelector(".donation-form");
let goBackButton = document.querySelector(".go-back-plant");

//LINKS
document.querySelector("#logo-menu-link").href =
  "index.html?id=" + userId + "#header";
document.querySelector("#forest-menu-link").href =
  "index.html?id=" + userId + "#forest-menu";
document.querySelector("#who-menu-link").href =
  "index.html?id=" + userId + "#who-info";
document.querySelector("#why-menu-link").href =
  "index.html?id=" + userId + "#why-info";
document.querySelector("#contact-menu-link").href =
  "index.html?id=" + userId + "#footer";

donationForm.elements.treenumber.addEventListener("change", e => {
  console.log(e);
  console.log("change");
  let treeNum = donationForm.elements.treenumber.value;
  console.log(treeNum);
  document.querySelector(".price p").textContent = treeNum * 10 + "kr";
});
document.querySelector(".plus").addEventListener("click", e => {
  console.log(donationForm.elements.treenumber);
  donationForm.elements.treenumber.stepUp(1);
  let treeNum = donationForm.elements.treenumber.value;
  console.log(treeNum);
  document.querySelector(".price p").textContent = treeNum * 10 + "kr";
});
document.querySelector(".minus").addEventListener("click", e => {
  if (donationForm.elements.treenumber.value > 1) {
    donationForm.elements.treenumber.stepUp(-1);
    let treeNum = donationForm.elements.treenumber.value;
    console.log(treeNum);
    document.querySelector(".price p").textContent = treeNum * 10 + "kr";
  }
});
goBackButton.addEventListener("click", e => {
  document.querySelector(".myforestCC").classList.add("hidden");
  document.querySelector(".planttree-part").classList.remove("hidden");
});

donationForm.addEventListener("submit", e => {
  /* DONT REFRESH PAGE */
  e.preventDefault();

  /* create a Donation Object */
  const donationObject = {
    category: donationForm.elements.location.value,
    trees: Number(donationForm.elements.treenumber.value),
    date: new Date().toDateString()
  };
  document.querySelector(".purchase-trees").textContent =
    donationForm.elements.treenumber.value;
  document.querySelector(".purchase-forest").textContent =
    donationForm.elements.location.value;
  document.querySelector(".purchase-price").textContent =
    Number(donationForm.elements.treenumber.value) * 10 + "kr";
  goToPayment();
  //postDonation(donationObject);
});

function goToPayment() {
  document.querySelector(".myforestCC").classList.remove("hidden");
  document.querySelector(".planttree-part").classList.add("hidden");
}

/* POST THE DONATION TO THE DATABASE */
function postDonation(newDonation) {
  console.log(newDonation);
  console.log(endpoint);

  fetch(endpoint, {
    method: "post",
    body: JSON.stringify(newDonation),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(d => {});
}

document.querySelector(".burguerMenu").addEventListener("click", function() {
  document.querySelector(".menu").classList.remove("hidden");
});
document.querySelector(".mobile-cross").addEventListener("click", function() {
  document.querySelector(".menu").classList.add("hidden");
});
document
  .querySelector("#myForest-botttom")
  .addEventListener("click", function() {
    document.querySelector(".myForests").style.display = "block";
    document.querySelector(".my-forests-options").style.display = "none";
  });
document.querySelector("#options-bottom").addEventListener("click", function() {
  document.querySelector(".myForests").style.display = "none";
  document.querySelector(".my-forests-options").style.display = "block";
});

function init() {
  fetchDonatios();
}

function fetchDonatios() {
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      let output = [];
      data.forEach(function(donation) {
        let existing = output.filter(function(v, i) {
          return v.category == donation.category;
        });
        if (existing.length) {
          let existingIndex = output.indexOf(existing[0]);

          output[existingIndex].trees += donation.trees;
        } else {
          if (typeof donation.value === "string") donation.value = [item.value];
          output.push(donation);
        }
      });
      console.log(output);
    });
}
init();
