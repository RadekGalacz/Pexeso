const cisloVyber = document.querySelectorAll(".box");
const idvyber = document.querySelectorAll("[id^='cislo']");
const button = document.querySelector(".btn")
const alertPlaceholder = document.querySelector('#alert-placeholder');
const par = document.querySelector(".par")
let skore = 0;
let pocetKliku = 0;
let pocetSpravne = 0;
let zablokovano = false;
let poleCisel = [] //Čísla karet
let id = [] //ID karet
let uhodnuteID = [] //Pole - uhodnuté ID karet
const pole = [];


//Ukládání skóre do localhost
function localhost(skoreZadej) {
    localStorage.setItem("skore", skoreZadej)
}

//Načte poslední doažené skóre
function localhostNacti(){
let nactiSkore = JSON.parse(localStorage.getItem("skore"))
console.log(nactiSkore)
par.textContent = ` ${nactiSkore === null ? "Ještě jsi nehrál 😊" : "Tvé poslední skóre - otočených párů: " + nactiSkore}`
}
localhostNacti()

//Naplnění pole čísly pro identifikaci karet
for (let i = 1; pole.length < cisloVyber.length; i++) {
    pole.push((i % (cisloVyber.length / 2)) + 1);
}
//zamíchání pole (random)
function zamichat(pole) {
    for (let i = pole.length - 1; i > 0; i--) {
      const nahodnyIndex = Math.floor(Math.random() * (i + 1));
      [pole[i], pole[nahodnyIndex]] = [pole[nahodnyIndex], pole[i]]; // Prohození hodnot
    }
    return pole;
  }
zamichat(pole);
idvyber.forEach((karta, index) => { //Iterace všemi kartami přes jeji třídy
    karta.className =`karta${pole[index]}`; //Změna class karet náhodnými čísly
  });  
cisloVyber.forEach((cislo) => {
    cislo.addEventListener('click', (event) => {
        if (zablokovano) return;

        const klik = event.target.classList.value.slice(-1) //přístup k číslu classy
        const idKlik = event.target.id //Přístup k ID karty
        const cisloID = idKlik.slice(-1) //Vyříznutí čísla ID z karty  
        const element = document.querySelector(`#${idKlik}`);
        const jeOtoceno = element.getAttribute("src") !== './img/rub.png';

        if (jeOtoceno) {
            // Karta se otočí zpět na rub
            barva(`cislo${cisloID}`, `cislo${cisloID}`);
            return;
        }
        if (pocetKliku < 2) {
            id.push(cisloID) //Přidávání vyříznutých čísel ID do pole
            poleCisel.push(klik) //Přidání čísla karty do pole
            barva(`cislo${cisloID}`, `cislo${cisloID}`); // Otočení karty na líc
            pocetKliku++; // Inkrementace počtu kliknutí
        }
        if (pocetKliku === 2){
            zablokovano = true;
            skore++
            localhost(skore)
            par.textContent = `Počet otočených párů karet: ${skore}`

            setTimeout(() => {
            if (poleCisel[0] === poleCisel[1] && id[0] !== id[1]) {
                uhodnuteID.push(id[0], id[1]) //Uhodnuté ID karet
                pocetSpravne++
                if (pocetSpravne === cisloVyber.length/2){
                    alertPlaceholder.classList.add("alert", "alert-success", "fs-5" , "visible")
                    alertPlaceholder.textContent="Konec hry 🥳"
                }
            } else {
                barva(`cislo${id[0]}`, `cislo${id[1]}`);
            }
            poleCisel = [];
            id = [];
            pocetKliku = 0;
            zablokovano = false;
        }, 1000);
    }
    })
})
function barva(karta1, karta2) {
    const element1 = document.querySelector(`#${karta1}`);
    const element2 = document.querySelector(`#${karta2}`);

    const classKarty1 = element1.classList[0];
    const classKarty2 = element2.classList[0];

    if (classKarty1 === classKarty2) {
        // Pokud jsou karty stejné, otočit líc karty
        const novaCesta1 = `./img/${classKarty1}.svg`;
        element1.setAttribute("src", novaCesta1);
        
        const novaCesta2 = `./img/${classKarty2}.svg`;
        element2.setAttribute("src", novaCesta2);
        
        element1.classList.add("flipped") //Animace otočení karty přidáním class flipped
        element2.classList.add("flipped") //Animace otočení karty přidáním class flipped
    } else {
        // Pokud karty nejsou stejné, otočit rub karty
        element1.setAttribute("src", './img/rub.png');
        element2.setAttribute("src", './img/rub.png');

        element1.classList.remove("flipped")
        element2.classList.remove("flipped")
    }
}
button.addEventListener("click", () => {
    location.reload();
});