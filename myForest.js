"use strict";
let urlParams = new URLSearchParams(window.location.search);

let userId = urlParams.get("id");

let endpoint =
  "http://5bfd357c827c3800139ae907.mockapi.io/treefund/user/" +
  userId +
  "/donations";

let donationForm = document.querySelector(".donation-form");
let goBackButton = document.querySelector(".go-back-plant");
let donationsPerCat = [
  {
    category: "Brazil",
    trees: 0
  },
  {
    category: "Tanzania",
    trees: 0
  },
  {
    category: "USA",
    trees: 0
  },
  {
    category: "Vietnam",
    trees: 0
  }
];

//HIDE NAV IN MOBILE
if (window.matchMedia("(min-width: 768px)").matches) {
  document.querySelector(".menu").classList.remove("hidden");
} else {
  document.querySelector(".menu").classList.add("hidden");
}

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

let brazilGameLink = document.querySelector("#brazil");
let tanzaniaGameLink = document.querySelector("#tanzania");
let usaGameLink = document.querySelector("#usa");
let vietnamGameLink = document.querySelector("#vietnam");

let plantTreeLink = document.querySelector("#plant-tree-link");
let myInfoLink = document.querySelector("#my-info-link");
let communityLink = document.querySelector("#community-link");

function init() {
  fetchDonatios();
  setGameLinks();
  setOptionsLinks();
}

// PLUS AND MINUS IN THE FORM
document.querySelector(".plus").addEventListener("click", e => {
  donationForm.elements.treenumber.stepUp(1);
  let treeNum = donationForm.elements.treenumber.value;
  document.querySelector(".price p").textContent = treeNum * 10 + "kr";
});

document.querySelector(".minus").addEventListener("click", e => {
  if (donationForm.elements.treenumber.value > 1) {
    donationForm.elements.treenumber.stepUp(-1);
    let treeNum = donationForm.elements.treenumber.value;
    document.querySelector(".price p").textContent = treeNum * 10 + "kr";
  }
});

//GO BACK BUTTON
goBackButton.addEventListener("click", e => {
  document.querySelector(".myforestCC").classList.add("hidden");
  document.querySelector(".planttree-part").classList.remove("hidden");
});

//SUBMIT FORM
document
  .querySelector(".myforestCC .submit")
  .addEventListener("click", function() {
    document.querySelector(".myforestCC").classList.add("hidden");
    document.querySelector(".planttree-part").classList.remove("hidden");
  });

// SUBMIT DONATION
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
  postDonation(donationObject);
});

function goToPayment() {
  document.querySelector(".myforestCC").classList.remove("hidden");
  document.querySelector(".planttree-part").classList.add("hidden");
}

/* POST THE DONATION TO THE DATABASE */
function postDonation(newDonation) {
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

function setGameLinks() {
  document.querySelector("#brazil").addEventListener("click", e => {
    getGame(e.target.id);
    e.target.classList.add("forest-selected");

    nonActive(tanzaniaGameLink, usaGameLink, vietnamGameLink);
  });
  document.querySelector("#tanzania").addEventListener("click", e => {
    getGame(e.target.id);
    e.target.classList.add("forest-selected");

    nonActive(brazilGameLink, usaGameLink, vietnamGameLink);
  });
  document.querySelector("#usa").addEventListener("click", e => {
    getGame(e.target.id);
    e.target.classList.add("forest-selected");

    nonActive(tanzaniaGameLink, brazilGameLink, vietnamGameLink);
  });
  document.querySelector("#vietnam").addEventListener("click", e => {
    getGame(e.target.id);
    e.target.classList.add("forest-selected");

    nonActive(brazilGameLink, tanzaniaGameLink, usaGameLink);
  });
}

function setOptionsLinks() {
  plantTreeLink.addEventListener("click", e => {
    plantTreeLink.classList.add("forest-selected");

    nonActive(myInfoLink, communityLink);

    document.querySelector(".planttree-form").classList.remove("hidden");
    document.querySelector(".my-infos").classList.add("hidden");
    document.querySelector(".the-community").classList.add("hidden");
  });

  myInfoLink.addEventListener("click", e => {
    myInfoLink.classList.add("forest-selected");

    nonActive(plantTreeLink, communityLink);
    document.querySelector(".planttree-form").classList.add("hidden");
    document.querySelector(".my-infos").classList.remove("hidden");
    document.querySelector(".the-community").classList.add("hidden");
  });

  communityLink.addEventListener("click", e => {
    communityLink.classList.add("forest-selected");

    nonActive(plantTreeLink, myInfoLink);
    document.querySelector(".planttree-form").classList.add("hidden");
    document.querySelector(".my-infos").classList.add("hidden");
    document.querySelector(".the-community").classList.remove("hidden");
  });
}

function nonActive(link1, link2, link3) {
  link1.classList.remove("forest-selected");
  link2.classList.remove("forest-selected");
  if (link3) {
    link3.classList.remove("forest-selected");
  }
}

function fetchDonatios(forest) {
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      data.forEach(function(donation) {
        let existing = donationsPerCat.filter(function(v, i) {
          return v.category == donation.category;
        });
        if (existing.length) {
          let existingIndex = donationsPerCat.indexOf(existing[0]);

          donationsPerCat[existingIndex].trees += donation.trees;
        } else {
          if (typeof donation.value === "string") donation.value = [item.value];
          donationsPerCat[
            donationsPerCat.findIndex(cat => cat === donation.category)
          ] += donation.trees;
        }
      });
      let gameForest = "brazil";
      if (forest) {
        gameForest = forest;
      }

      getGame(gameForest);
    });
}

function getGame(forest) {
  let forestClicked = forest;

  let gameTree = document.querySelector(".game");
  let badge = document.querySelector(".badge");

  donationsPerCat.forEach(forestDonations => {
    if (
      forestDonations.category.toUpperCase() === forestClicked.toUpperCase()
    ) {
      document.querySelector(".current-trees").textContent =
        forestDonations.trees + " TREES PLANTED !";
      if (forestDonations.trees >= 20) {
        //second level

        document.querySelector(".game").classList.remove("level1");
        document.querySelector(".game").classList.add("level2");
        document.querySelector(".game").classList.remove("level0");
        document.querySelector(".badge").classList.remove("hidden");

        document.querySelector(".badge").classList.remove("badge-level1");
        document.querySelector(".badge").classList.add("badge-level2");
      } else if (forestDonations.trees > 0 && forestDonations.trees < 20) {
        //first level
        document.querySelector(".game").classList.add("level1");
        document.querySelector(".game").classList.remove("level2");
        document.querySelector(".game").classList.remove("level0");
        document.querySelector(".badge").classList.remove("hidden");
        document.querySelector(".badge").classList.remove("badge-level2");
        document.querySelector(".badge").classList.add("badge-level1");
      } else if (forestDonations.trees == 0) {
        //no trees planted
        document.querySelector(".game").classList.remove("level1");
        document.querySelector(".game").classList.remove("level2");
        document.querySelector(".game").classList.add("level0");
        document.querySelector(".badge").classList.add("hidden");
      }
      let calcWidth = (100 * forestDonations.trees) / 20;
      if (calcWidth > 100) {
        calcWidth = 100;
      }
      document.querySelector(".level").style.transition = "width 1s ease";
      document.querySelector(".level").style.width = calcWidth + "%";
    }
  });
}

//MOBILE

document.querySelector(".burguerMenu").addEventListener("click", function() {
  document.querySelector(".menu").classList.remove("hidden");
});
document.querySelector(".mobile-cross").addEventListener("click", function() {
  document.querySelector(".menu").classList.add("hidden");
});

let myForestBottom = document.querySelector("#myForest-botttom");
let optionsBottom = document.querySelector("#options-bottom");

myForestBottom.addEventListener("click", function() {
  myForestBottom.classList.add("bottom-selected");
  optionsBottom.classList.remove("bottom-selected");
  document.querySelector(".myForests").style.display = "block";
  document.querySelector(".my-forests-options").style.display = "none";
});
optionsBottom.addEventListener("click", function() {
  optionsBottom.classList.add("bottom-selected");
  myForestBottom.classList.remove("bottom-selected");
  document.querySelector(".myForests").style.display = "none";
  document.querySelector(".my-forests-options").style.display = "block";
});

init();
