// /*
// const allButtons = document.querySelectorAll('.d-flex.justify-content-center');
// // dms


// async function cancelDeletion() {
//     try {
//         const btns = [...allButtons].filter(item => item.children.length > 0).map(child => child.children[1]);
//         const clickDelete = btns[1].click();
//         await new Promise(resolve => setTimeout(resolve, 3000));
//         const dialogButtons = document.querySelector('dialog').querySelectorAll('button')[1];
//         await dialogButtons.click();
//         return new Promise(resolve => resolve('Nebolo vymazane'));
//     } catch (error) {
//         console.error(error);
//     }
// }
// */
// // cms 
// /*
// async function cancelDeletion() {
//     try {
//         const allSees = [...allButtons]
//         const btns = allSees.filter(item => item.children.length > 0).flatMap(child => child.children)
//         const clickDelete = btns[0][2].click();
//         await new Promise(resolve => setTimeout(resolve, 3000));
//         const dialogButtons = document.querySelectorAll('dialog').querySelectorAll('button')[1];
//         await dialogButtons.click();
//     } catch (error) {
//         console.error(error);
//     }
// }*/
// const arr = ['svatych', 'svatych67', 'svatych69', 'svatych66', 'advensty nedela'];
// const moznostiZoradenia = {
//     usage:"sort"
// }
// const zoradenieZostupne = function (a, b) {
//     return a.localeCompare(b, moznostiZoradenia);
// };
// //console.log("🚀 ~ file: skuska.js:42 ~ arr.sort(zoradenieZostupne):", arr.sort(zoradenieZostupne))
// /*
// const bios = arr.sort(zoradenieZostupne).at(-1) //svatych69
// const cislo = +bios.split(/(\d+)/)[1]+1 // 70 could be NaN
// const oddelCislo = bios.slice(-cislo.toString().length) //69
// let cisloOddelene = bios.replace(oddelCislo,'')//svatych
// const vsetko  = cisloOddelene+=cislo
// console.log("🚀 ~ file: skuska.js:44 ~ vsetko:", vsetko)// console.log("🚀 ~ file: skuska_postman.js:99 ~ bios:", bios);
// const string = 'svatych';
// // posledne je cislo
// const poslednyDatovyTyp = [...string].findLast(element => isNaN(+element));
// // console.log("🚀 ~ file: skuska_postman.js:97 ~ poslednyDatovyTyp:", poslednyDatovyTyp)
// // je cilso posledne alebo nie je
// // console.log(!isNaN(poslednyDatovyTyp));
// */
// /*
// const duplikatyPrec = result.reduce((acc,cur) =>acc.includes(cur)?[...acc,cur]:acc,[]) 
// */
//   /*
//   let obj = { user: { address: '98765' } }
//   const [objekt] = Object.getOwnPropertyNames(obj)
//   */
//  /*
//  const nieJePoleObjektov = (array=>array.every(element => typeof element !=='object'))
//  */
// /*
// let x = ' preferences_language_language'
// console.log(new Set(x.split('_')))
//  x = Array.from(new Set(x.split('_'))).toString().split(',').join('_')
//  */

// /*
//  let array = [{a:'b'}, {}, {}, {}];
// function myGeeks() {
//  let filtered = array.reduce((acc, cur) => !Object.keys(cur).length<1? [...acc, cur] : acc, []);
//  console.log(filtered)
// }
// myGeeks()
// */
// //item=>typeof item !== 'object'?item:''
// /*
// const data = [
//   { nameStatus: 'sdad' },
//   { name: { first: 'Bob', last: 'Johnson' } },
//   { age: 35 },
//   { address: { street: '789 Pine St', city: 'Complex City', zip: '98765' } },
//   { colors: ['modr', 'zelk', 'cer'] },
//   { fruits: ['neviem', 'co', 'tera'] },
//   { language: 'JavaScript' },
//   { theme: 'dark' }
// ];

// const filteredData = data.reduce((accumulator, currentObject) => {
//   // Check if the object has a property with a string value
//   if (Object.values(currentObject).every(value => typeof value !== 'object')) {
//     accumulator.push(currentObject);
//   }
//   return accumulator;
// }, []);

// console.log(filteredData);
// const data = ZískDátZoServisov.__ziskajJednoducheObjekty(odpoved)
// console.log("🚀 ~ data:", data)
// */
// let odpoved = {
//     uponUs: ["wintertime", "sunshine", "The time is now"],
//     name: {
//         lust: "you",
//         bust: "Tedious"
//     },
//     user: {
//         name: {
//             first: "Bob",
//             last: "Johnson"
//         },
//         age: 35,
//         address: {
//             street: "789 Pine St",
//             city: "Complex City",
//             zip: "98765"
//         }
//     },
//     preferences: {
//         colors: ["modr", "zelk", "cer"],
//         fruits: ['neviem', 'co', 'tera'],
//         language: "JavaScript",
//         theme: "dark"
//     },
//     // isDeveloper: true,
//     // isNOTDeveloper: false,
//     projects: [{
//             name: "Project A",
//             status: "completed"
//         },
//         {
//             name: "Project B",
//             status: "in progress"
//         },
//         {
//             name: "Project C",
//             status: "planning"
//         }
//     ],
// }
// const jednArr = []
// Object.values(odpoved)
// .reduce((acc,cur)=>typeof cur === 'object'&& !Array.isArray(cur) && Object.values(cur).some(cur=>Array.isArray(cur) )?[...acc,cur]:acc ,[])
// .forEach(element => {
//     Object.values(element).forEach(element => {
//         Array.isArray(element) ? jednArr[jednArr.length] = element:[]
//     });
// });
// console.log("🚀 ~ jednArr:", jednArr)
const raw = {
    dssad: 'dffsdfds',
    User1_dssads: 'dffsdfdsss',
    User1_Email: 'phil.juza2@gmail.com',
    User2_Gender_id: 2,
    User2_Email: 'phil.juza@gmail.com',
    User2_Username: 'ShenHU1',
    User3_Gender_id: 1,
    User1_Username: 'ShenHU',
    reaction_sts_Gender_id: 2,
    reaction_msg_sts: 200
  }
  
  const allowed = ['dssad','User1_dssads'];
  
  Object.keys(raw)
    .filter(key => allowed.includes(key))
    .forEach(key => delete raw[key]);
  
  console.log(raw);
