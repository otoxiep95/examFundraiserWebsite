"use strict";
let urlParams = new URLSearchParams(window.location.search);
let userId = 1;
let userIdurl = urlParams.get("id");

let endpoint =
  "http://5bfd357c827c3800139ae907.mockapi.io/treefund/user/" +
  userId +
  "/donations";

let donationForm = document.querySelector(".donation-form");
let goBackButton = document.querySelector(".go-back-plant");

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
  document.querySelector(".cc-part").classList.add("hidden");
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
  document.querySelector(".cc-part").classList.remove("hidden");
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
