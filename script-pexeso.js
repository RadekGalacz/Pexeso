const numChoose = document.querySelectorAll(".box");
const idSelect = document.querySelectorAll("[id^='cislo']");
const button = document.querySelector(".btn");
const alertPlaceholder = document.querySelector("#alert-placeholder");
const pair = document.querySelector(".par");
const createTable = document.querySelector(".tabulka");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalCross = document.querySelector(".close-modal");
const btnOpenModal = document.querySelectorAll(".show-modal");
const buttonContinue = document.querySelector(".btn-continue ");

let score = 0;
let numClick = 0;
let numCorrect = 0;
let blocked = false;
let arrayNum = []; //Čísla karet
let id = []; //ID karet
let guessID = []; //Pole - uhodnuté ID karet
const arrayOfNum = []; //Pole čísel karet podle jejich class
let arrayScore = JSON.parse(localStorage.getItem("skore")) || []; // Načíst existující skóre z localStorage, nebo použít prázdné pole

//Naplnění pole čísly pro identifikaci karet
for (let i = 1; arrayOfNum.length < numChoose.length; i++) {
  arrayOfNum.push((i % (numChoose.length / 2)) + 1);
}
//zamíchání pole (random)
function randomArray(arrayOfNum) {
  for (let i = arrayOfNum.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayOfNum[i], arrayOfNum[randomIndex]] = [
      arrayOfNum[randomIndex],
      arrayOfNum[i],
    ]; // Prohození hodnot
  }
}

//Změna class karet náhodnými čísly
randomArray(arrayOfNum);
idSelect.forEach((karta, index) => {
  //Iterace všemi kartami přes jeji třídy
  karta.className = `karta${arrayOfNum[index]}`;
});

// Ukládání skóre do localStorage + výpis hry
function localStor(scoreInput) {
  arrayScore.push(scoreInput); // Přidá nové skóre do pole
  if (arrayScore.length === 5) {
    // **********Max. 5 záznamů, pak se pole vynuluje**********
    const minValue = Math.min(...arrayScore);
    const minIndex = arrayScore.indexOf(minValue) + 1;
    let paragraph = document.createElement("p");
    paragraph.innerHTML = `Nejméně otočených dvojic karet: ${minValue} bylo ve hře č. ${minIndex}`;
    modal.appendChild(paragraph);
    pair.innerHTML = ``;
    createTable.remove();
    buttonContinue.innerText = "Hrát znovu 🔄";
    openModal();
    arrayScore = [];
  }
  localStorage.setItem("skore", JSON.stringify(arrayScore)); // Uložit pole zpět do localStorage
}

//Načte poslední doažené skóre
function localStorLoad() {
  let loadScore = JSON.parse(localStorage.getItem("skore"));
  if (!loadScore?.length) {
    pair.innerHTML = "<hr /> Pojďte si zahrát pexeso 😊";
  } else {
    pair.innerHTML = "<hr /> Pokračujte ve hře 😊";
    createTable.classList.remove("d-none");
    table();
  }
}
localStorLoad();

//MODAL
function closeModal() {
  modal.classList.add("d-none");
  overlay.classList.add("d-none");
}
function openModal() {
  modal.classList.remove("d-none");
  overlay.classList.remove("d-none");
}
closeModalCross.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function table() {
  //Vymaže již vytvořenou tabulku pro zabránění jejimu opakování
  const oldTable = createTable.querySelector("table");
  if (oldTable) oldTable.remove();

  const loadScore = JSON.parse(localStorage.getItem("skore"));

  // Vytvoření tabulky
  let table = document.createElement("table");
  table.classList.add(
    "table",
    "table-bordered",
    "table-striped",
    "table-hover",
    "fs-5"
  );

  // Vytvoření hlavičky tabulky
  let thead = document.createElement("thead");
  let trow = document.createElement("tr");

  let th1 = document.createElement("th");
  th1.classList.add("text-center", "text-success", "col-6");
  th1.innerText = "Číslo hry";

  let th2 = document.createElement("th");
  th2.classList.add("text-center", "text-success", "col-6");
  th2.innerText = "Počet dvojic";

  trow.appendChild(th1);
  trow.appendChild(th2);

  thead.appendChild(trow);
  table.appendChild(thead);

  // Vytvoření těla tabulky
  if (loadScore != null) {
    //Kontrola, zda není pole prázdné
    let body = document.createElement("tbody");
    for (let i = 0; i < loadScore.length && i < 5; i++) {
      let row = document.createElement("tr");

      let cell1 = document.createElement("td");
      cell1.classList.add("text-center", "text-secondary");
      cell1.innerText = `${i + 1}.`; //Číslo hry

      let cell2 = document.createElement("td");
      cell2.classList.add("text-center", "text-secondary");
      cell2.innerText = loadScore[i]; //Počet dvojic

      row.appendChild(cell1);
      row.appendChild(cell2);

      body.appendChild(row); //Přidání řádku do těla tabulky
    }
    table.appendChild(body);

    //Přiřazení tabulky do divu s třídou "tabulka"
    const createTable = document.querySelector(".tabulka");
    createTable.appendChild(table);
  }
}

numChoose.forEach((num) => {
  num.addEventListener("click", (event) => {
    if (blocked) return;
    const click = event.target.classList.value.slice(-1); //přístup k číslu classy
    const clickID = event.target.id; //Přístup k ID karty
    const numberID = clickID.slice(-1); //Vyříznutí čísla ID z karty
    const element = document.querySelector(`#${clickID}`);
    const isTurned = element.getAttribute("src") !== "./img/rub.png";

    if (isTurned) {
      // Karta se otočí zpět na rub
      turnCard(`cislo${numberID}`, `cislo${numberID}`);
      return;
    }
    if (numClick < 2) {
      id.push(numberID); //Přidávání vyříznutých čísel ID do pole
      arrayNum.push(click); //Přidání čísla karty do pole
      turnCard(`cislo${numberID}`, `cislo${numberID}`); // Otočení karty na líc
      numClick++; // Inkrementace počtu kliknutí
    }
    if (numClick === 2) {
      blocked = true;
      score++;
      pair.innerHTML = `<hr /> Aktuálně otočených dvojic karet: ${score}`;

      setTimeout(() => {
        if (arrayNum[0] === arrayNum[1] && id[0] !== id[1]) {
          guessID.push(id[0], id[1]); //Uhodnuté ID karet
          numCorrect++;
          if (numCorrect === numChoose.length / 2) {
            localStor(score);
            alertPlaceholder.classList.add("alert", "alert-success", "fs-5");
            alertPlaceholder.classList.remove("d-none");
            document.querySelector(".btn-znovu").classList.remove("d-none");
            arrayScore.length === 0
              ? (alertPlaceholder.textContent = `Konec série🏆`)
              : (alertPlaceholder.textContent = `Konec ${arrayScore.length}. hry`);
            createTable.classList.remove("d-none");
            table();
          }
        } else {
          turnCard(`cislo${id[0]}`, `cislo${id[1]}`);
        }
        arrayNum = [];
        id = [];
        numClick = 0;
        blocked = false;
      }, 1000);
    }
  });
});

function turnCard(card1, card2) {
  const element1 = document.querySelector(`#${card1}`);
  const element2 = document.querySelector(`#${card2}`);

  const classCard1 = element1.classList[0];
  const classCard2 = element2.classList[0];

  if (classCard1 === classCard2) {
    // Pokud jsou karty stejné, otočit líc karty
    const newPath1 = `./img/${classCard1}.svg`;
    element1.setAttribute("src", newPath1);

    const newPath2 = `./img/${classCard2}.svg`;
    element2.setAttribute("src", newPath2);

    element1.classList.add("flipped"); //Animace otočení karty přidáním class flipped
    element2.classList.add("flipped"); //Animace otočení karty přidáním class flipped
  } else {
    // Pokud karty nejsou stejné, otočit rub karty
    element1.setAttribute("src", "./img/rub.png");
    element2.setAttribute("src", "./img/rub.png");

    element1.classList.remove("flipped");
    element2.classList.remove("flipped");
  }
}
button.addEventListener("click", () => {
  location.reload();
});
