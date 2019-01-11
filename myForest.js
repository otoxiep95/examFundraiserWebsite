"use strict";
let urlParams = new URLSearchParams(window.location.search);

let userId = urlParams.get("id");

let endpoint =
  "http://5bfd357c827c3800139ae907.mockapi.io/treefund/user/" +
  userId +
  "/donations";

let donationForm = document.querySelector(".donation-form");
let goBackButton = document.querySelector(".go-back-plant");

//HIDE NAV IN MOBILE
if (window.matchMedia("(min-width: 720px)").matches) {
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

//ACTIVE LINK MENU USER

document.querySelector("#plant-tree-link").addEventListener("click", e => {
  e.target.classList.add("forest-selected");
  // document.querySelector("#my-info-link").classList.remove("forest-selected");
  // document.querySelector("#community-link").classList.remove("forest-selected");
  nonActive(
    document.querySelector("#my-info-link"),
    document.querySelector("#community-link"),

  );
  document.querySelector(".planttree-form").classList.remove("hidden");
  document.querySelector(".my-infos").classList.add("hidden");
  document.querySelector(".the-community").classList.add("hidden");
});

//ACTIVE LINK MENU USER
document.querySelector("#my-info-link").addEventListener("click", e => {
  e.target.classList.add("forest-selected");
  document
    .querySelector("#plant-tree-link")
    .classList.remove("forest-selected");
  document.querySelector("#community-link").classList.remove("forest-selected");
  document.querySelector(".planttree-form").classList.add("hidden");
  document.querySelector(".my-infos").classList.remove("hidden");
  document.querySelector(".the-community").classList.add("hidden");
});

//ACTIVE LINK MENU USER
document.querySelector("#community-link").addEventListener("click", e => {
  e.target.classList.add("forest-selected");
  document.querySelector("#my-info-link").classList.remove("forest-selected");
  document
    .querySelector("#plant-tree-link")
    .classList.remove("forest-selected");
  document.querySelector(".planttree-form").classList.add("hidden");
  document.querySelector(".my-infos").classList.add("hidden");
  document.querySelector(".the-community").classList.remove("hidden");
});

// - N°trees +
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

//GO BACK DONATION FORM
goBackButton.addEventListener("click", e => {
  document.querySelector(".myforestCC").classList.add("hidden");
  document.querySelector(".planttree-part").classList.remove("hidden");
});

// SUBMIT CC FORM
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

// BURGER MENU MOBILE
document.querySelector(".burguerMenu").addEventListener("click", function() {
  document.querySelector(".menu").classList.remove("hidden");
});
document.querySelector(".mobile-cross").addEventListener("click", function() {
  document.querySelector(".menu").classList.add("hidden");
});

// MY FOREST MENU MOBILE
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

function nonActive(link1, link2, link3) {
  link1.classList.remove("forest-selected");
  link2.classList.remove("forest-selected");
  link3.classList.remove("forest-selected");
}

function init() {
  fetchDonatios();

  document.querySelector("#brazil").addEventListener("click", e => {
    getGame(e.target.id);
    e.target.classList.add("forest-selected");
    nonActive(
      document.querySelector("#tanzania"),
      document.querySelector("#usa"),
      document.querySelector("#vietnam")
    );
  });
  document.querySelector("#tanzania").addEventListener("click", e => {
    getGame(e.target.id);
    e.target.classList.add("forest-selected");
    document.querySelector("#brazil").classList.remove("forest-selected");
    document.querySelector("#usa").classList.remove("forest-selected");
    document.querySelector("#vietnam").classList.remove("forest-selected");
  });
  document.querySelector("#usa").addEventListener("click", e => {
    getGame(e.target.id);
    e.target.classList.add("forest-selected");
    document.querySelector("#tanzania").classList.remove("forest-selected");
    document.querySelector("#brazil").classList.remove("forest-selected");
    document.querySelector("#vietnam").classList.remove("forest-selected");
  });
  document.querySelector("#vietnam").addEventListener("click", e => {
    getGame(e.target.id);
    e.target.classList.add("forest-selected");
    document.querySelector("#tanzania").classList.remove("forest-selected");
    document.querySelector("#usa").classList.remove("forest-selected");
    document.querySelector("#brazil").classList.remove("forest-selected");
  });
}
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
function fetchDonatios() {
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

      let defaultForest = "brazil";
      getGame(defaultForest);
    });
}

function getGame(forest) {
  let forestClicked = forest;

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
        // document.querySelector(".badge img").src =
        // "img/badges/infantSeedlingBadge.svg";
      } else if (forestDonations.trees > 0 && forestDonations.trees < 20) {
        //first level
        document.querySelector(".game").classList.add("level1");
        document.querySelector(".game").classList.remove("level2");
        document.querySelector(".game").classList.remove("level0");
        document.querySelector(".badge").classList.remove("hidden");
        // document.querySelector(".badge img").src = "img/badges/badge1.svg";
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

init();
