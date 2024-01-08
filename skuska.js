/*
const allButtons = document.querySelectorAll('.d-flex.justify-content-center');
// dms


async function cancelDeletion() {
    try {
        const btns = [...allButtons].filter(item => item.children.length > 0).map(child => child.children[1]);
        const clickDelete = btns[1].click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        const dialogButtons = document.querySelector('dialog').querySelectorAll('button')[1];
        await dialogButtons.click();
        return new Promise(resolve => resolve('Nebolo vymazane'));
    } catch (error) {
        console.error(error);
    }
}
*/
// cms 
/*
async function cancelDeletion() {
    try {
        const allSees = [...allButtons]
        const btns = allSees.filter(item => item.children.length > 0).flatMap(child => child.children)
        const clickDelete = btns[0][2].click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        const dialogButtons = document.querySelectorAll('dialog').querySelectorAll('button')[1];
        await dialogButtons.click();
    } catch (error) {
        console.error(error);
    }
}*/
const arr = ['svatych', 'svatych67', 'svatych69', 'svatych66', 'advensty nedela'];
const moznostiZoradenia = {
    usage:"sort"
}
const zoradenieZostupne = function (a, b) {
    return a.localeCompare(b, moznostiZoradenia);
};
//console.log("🚀 ~ file: skuska.js:42 ~ arr.sort(zoradenieZostupne):", arr.sort(zoradenieZostupne))
/*
const bios = arr.sort(zoradenieZostupne).at(-1) //svatych69
const cislo = +bios.split(/(\d+)/)[1]+1 // 70 could be NaN
const oddelCislo = bios.slice(-cislo.toString().length) //69
let cisloOddelene = bios.replace(oddelCislo,'')//svatych
const vsetko  = cisloOddelene+=cislo
console.log("🚀 ~ file: skuska.js:44 ~ vsetko:", vsetko)// console.log("🚀 ~ file: skuska_postman.js:99 ~ bios:", bios);
const string = 'svatych';
// posledne je cislo
const poslednyDatovyTyp = [...string].findLast(element => isNaN(+element));
// console.log("🚀 ~ file: skuska_postman.js:97 ~ poslednyDatovyTyp:", poslednyDatovyTyp)
// je cilso posledne alebo nie je
// console.log(!isNaN(poslednyDatovyTyp));
*/
/*
const duplikatyPrec = result.reduce((acc,cur) =>acc.includes(cur)?[...acc,cur]:acc,[]) 
*/
function getObjectKeys(obj, value) {
    let keys = [];
  
    for (const key of Object.keys(obj)) {
      if (obj[key] === value) {
        keys.push(key);
      }
    }
  
    return keys;
  }
  
  let obj = {
    user: {
      name: {
        first: "Bob",
        last: "Johnson"
      },
      age: 35,
      address: {
        street: "789 Pine St",
        city: "Complex City",
        zip: "98765"
      }
    },
    preferences: {
      colors: ["blue", "green", "red"],
      language: "JavaScript",
      theme: "dark"
    },
    isDeveloper: true,
    projects: [
      { name: "Project A", status: "completed" },
      { name: "Project B", status: "in progress" },
      { name: "Project C", status: "planning" }
    ],
}
  
  console.log(getObjectKeys(obj, 'Johnson')); // 👉️ employee1
  