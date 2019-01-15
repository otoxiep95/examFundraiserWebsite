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
  .querySelector(".planttree-part .plant-submit")
  .addEventListener("click", goToPayment);

function goToPayment() {
  document.querySelector(".myforestCC").classList.remove("hidden");
  document.querySelector(".planttree-part").classList.add("hidden");
}

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

  document.querySelector(".myforestCC").classList.add("hidden");
  document.querySelector(".planttree-part").classList.remove("hidden");
  postDonation(donationObject);
});

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
    .then(d => {
      fetchDonatios(d.category.toLowerCase());
      showThankMsg(d.category);
    });
}
function showThankMsg(forest) {
  let thanksmsg = document.querySelector(".thank-modal");
  thanksmsg.classList.add("show");
  thanksmsg.classList.remove("hidden");
  thanksmsg.querySelector("span").textContent = forest;
  thanksmsg.querySelector("button").addEventListener("click", e => {
    console.log("alo");
    thanksmsg.classList.add("hidden");
    thanksmsg.classList.remove("show");
  });
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

  //Radio buttons Select forest game
  let radioButtons = donationForm.location;
  console.log(radioButtons);
  radioButtons.forEach(but => {
    but.addEventListener("click", e => {
      let forest = e.target.value.toLowerCase();
      switch (forest) {
        case "brazil":
          console.log("brazil");
          getGame(forest);
          brazilGameLink.classList.add("forest-selected");
          nonActive(tanzaniaGameLink, usaGameLink, vietnamGameLink);
          break;
        case "tanzania":
          console.log("tan");
          getGame(forest);
          tanzaniaGameLink.classList.add("forest-selected");
          nonActive(brazilGameLink, usaGameLink, vietnamGameLink);
          break;
        case "usa":
          console.log("usa");
          getGame(forest);
          usaGameLink.classList.add("forest-selected");
          nonActive(brazilGameLink, tanzaniaGameLink, vietnamGameLink);
          break;
        case "vietnam":
          console.log("nam");
          getGame(forest);
          vietnamGameLink.classList.add("forest-selected");
          nonActive(brazilGameLink, usaGameLink, tanzaniaGameLink);
          break;
      }
    });
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
  console.log(forest);
  //clear array before fetching
  donationsPerCat = [
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
  let nextBadge = "";
  let level0 = 0;
  let level1 = 1;
  let level2 = 25;
  let level3 = 50;
  let level4 = 100;
  let level5 = 200;
  let level6 = 400;
  let currentLv = 0;
  let nextLv = 0;

  donationsPerCat.forEach(forestDonations => {
    if (
      forestDonations.category.toUpperCase() === forestClicked.toUpperCase()
    ) {
      document.querySelector(".current-trees").textContent =
        forestDonations.trees + " TREES PLANTED !";

      switch (true) {
        case forestDonations.trees == level0:
          console.log("no trees");
          currentLv = level0;
          nextLv = level1;
          gameTree.classList.remove("level1");
          gameTree.classList.remove("level2");
          gameTree.classList.remove("level3");
          gameTree.classList.remove("level4");
          gameTree.classList.remove("level5");
          gameTree.classList.remove("level6");
          gameTree.classList.add("level0");
          badge.classList.add("hidden");
          nextBadge = "BABY SPROUT";
          break;
        case forestDonations.trees >= level1 && forestDonations.trees < level2:
          console.log("baby sprout");
          currentLv = level1;
          nextLv = level2;
          gameTree.classList.remove("level0");
          gameTree.classList.remove("level2");
          gameTree.classList.remove("level3");
          gameTree.classList.remove("level4");
          gameTree.classList.remove("level5");
          gameTree.classList.remove("level6");
          gameTree.classList.add("level1");

          badge.classList.remove("hidden");
          badge.classList.remove("badge-level2");
          badge.classList.remove("badge-level3");
          badge.classList.remove("badge-level4");
          badge.classList.remove("badge-level5");
          badge.classList.remove("badge-level6");
          badge.classList.add("badge-level1");
          nextBadge = "INFANT SEEDLING";
          break;
        case forestDonations.trees >= level2 && forestDonations.trees < level3:
          console.log("infant seedling");
          currentLv = level2;
          nextLv = level3;
          gameTree.classList.remove("level0");
          gameTree.classList.remove("level1");
          gameTree.classList.remove("level3");
          gameTree.classList.remove("level4");
          gameTree.classList.remove("level5");
          gameTree.classList.remove("level6");
          gameTree.classList.add("level2");

          badge.classList.remove("hidden");
          badge.classList.remove("badge-level1");
          badge.classList.remove("badge-level3");
          badge.classList.remove("badge-level4");
          badge.classList.remove("badge-level5");
          badge.classList.remove("badge-level6");
          badge.classList.add("badge-level2");
          nextBadge = "JUNIOR SAPLING";
          break;
        case forestDonations.trees >= level3 && forestDonations.trees < level4:
          console.log("Junior Sapling");
          currentLv = level3;
          nextLv = level4;
          gameTree.classList.remove("level0");
          gameTree.classList.remove("level1");
          gameTree.classList.remove("level2");
          gameTree.classList.remove("level4");
          gameTree.classList.remove("level5");
          gameTree.classList.remove("level6");
          gameTree.classList.add("level3");

          badge.classList.remove("hidden");
          badge.classList.remove("badge-level1");
          badge.classList.remove("badge-level2");
          badge.classList.remove("badge-level4");
          badge.classList.remove("badge-level5");
          badge.classList.remove("badge-level6");
          badge.classList.add("badge-level3");
          nextBadge = "YOUNG TREE";
          break;
        case forestDonations.trees >= level4 && forestDonations.trees < level5:
          console.log("Young Tree");
          currentLv = level4;
          nextLv = level5;
          gameTree.classList.remove("level0");
          gameTree.classList.remove("level1");
          gameTree.classList.remove("level2");
          gameTree.classList.remove("level3");
          gameTree.classList.remove("level5");
          gameTree.classList.remove("level6");
          gameTree.classList.add("level4");
          badge.classList.remove("hidden");
          badge.classList.remove("badge-level1");
          badge.classList.remove("badge-level2");
          badge.classList.remove("badge-level3");
          badge.classList.remove("badge-level5");
          badge.classList.remove("badge-level6");
          badge.classList.add("badge-level4");
          nextBadge = "MATURE TREE";
          break;
        case forestDonations.trees >= level5 && forestDonations.trees < level6:
          console.log("Mature Tree");
          currentLv = level5;
          nextLv = level6;
          gameTree.classList.remove("level0");
          gameTree.classList.remove("level1");
          gameTree.classList.remove("level2");
          gameTree.classList.remove("level3");
          gameTree.classList.remove("level4");
          gameTree.classList.remove("level6");
          gameTree.classList.add("level5");
          badge.classList.remove("hidden");
          badge.classList.remove("badge-level1");
          badge.classList.remove("badge-level2");
          badge.classList.remove("badge-level3");
          badge.classList.remove("badge-level4");
          badge.classList.remove("badge-level6");
          badge.classList.add("badge-level5");
          nextBadge = "ANCIENT TREE";
          break;
        case forestDonations.trees >= level6:
          console.log("Ancient tree");
          currentLv = level6;
          nextLv = 800;
          gameTree.classList.remove("level0");
          gameTree.classList.remove("level1");
          gameTree.classList.remove("level2");
          gameTree.classList.remove("level3");
          gameTree.classList.remove("level4");
          gameTree.classList.remove("level5");
          gameTree.classList.add("level6");
          badge.classList.remove("hidden");
          badge.classList.remove("badge-level1");
          badge.classList.remove("badge-level2");
          badge.classList.remove("badge-level3");
          badge.classList.remove("badge-level4");
          badge.classList.remove("badge-level5");
          badge.classList.add("badge-level6");
          break;
      }

      document.querySelector(".trees-left-level-up .trees-left").textContent =
        nextLv - forestDonations.trees;

      document.querySelector(".next-level").textContent = nextBadge;

      let calcWidth =
        (100 * (forestDonations.trees - currentLv)) / (nextLv - currentLv);
      if (calcWidth > 100) {
        calcWidth = 100;
      }

      document.querySelector(".level").style.transition = "width 1s ease";
      document.querySelector(".level").style.width = calcWidth + "%";
    }
  });
}

//MOBILE

// document.querySelector(".burguerMenu").addEventListener("click", function() {
//   document.querySelector(".menu").classList.remove("hidden");
// });
// document.querySelector(".mobile-cross").addEventListener("click", function() {
//   document.querySelector(".menu").classList.add("hidden");
// });

let myForestBottom = document.querySelector("#myForest-bottom");
let badgeBottom = document.querySelector("#badge-bottom");
let donateBottom = document.querySelector("#donate-bottom");
let friendBottom = document.querySelector("#friend-bottom");
let communityBottom = document.querySelector("#community-bottom");

function bottomSelected(link) {
  link.classList.add("bottom-selected");
}

function bottomUnselected(link1, link2, link3, link4) {
  link1.classList.remove("bottom-selected");
  link2.classList.remove("bottom-selected");
  link3.classList.remove("bottom-selected");
  link4.classList.remove("bottom-selected");
}

myForestBottom.addEventListener("click", function() {
  bottomSelected(myForestBottom);
  bottomUnselected(badgeBottom, donateBottom, friendBottom, communityBottom);
  document.querySelector(".myForests").style.display = "block";
  document.querySelector(".my-forests-options").style.display = "none";
});

badgeBottom.addEventListener("click", function() {
  bottomSelected(badgeBottom);
  bottomUnselected(communityBottom, friendBottom, myForestBottom, donateBottom);
  document.querySelector(".myForests").style.display = "none";
  document.querySelector(".my-forests-options").style.display = "block";
});

donateBottom.addEventListener("click", function() {
  bottomSelected(donateBottom);
  bottomUnselected(myForestBottom, badgeBottom, friendBottom, communityBottom);
  document.querySelector(".myForests").style.display = "none";
  document.querySelector(".my-forests-options").style.display = "block";
});

friendBottom.addEventListener("click", function() {
  bottomSelected(friendBottom);
  bottomUnselected(myForestBottom, badgeBottom, donateBottom, communityBottom);
  document.querySelector(".myForests").style.display = "none";
  document.querySelector(".my-forests-options").style.display = "block";
});

communityBottom.addEventListener("click", function() {
  bottomSelected(communityBottom);
  bottomUnselected(myForestBottom, badgeBottom, friendBottom, donateBottom);
  document.querySelector(".myForests").style.display = "none";
  document.querySelector(".my-forests-options").style.display = "block";
});

init();
