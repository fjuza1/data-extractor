'use strict'
let odpoved = {
    fruits:['bananas', 'apples', 'peaches'],
    bitches:['bananassssssss', 'applessssssssss', 'peachessssssss'],
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
          fruits:['banana', 'apple', 'peach'],
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
const ZískDátZoServisov = {
    'začiatok': 'Dec 13, 2023 ',
    __ziskajObjektoveHodnoty(objekt) {
        if (objekt === undefined || objekt === null) return
        return Object.values(objekt)
    },
    __ziskajObjektoveKluce(objekt) {
        return Object.keys(objekt)
    },
    __jePrimitivna(obj) {
        return typeof obj !== 'object'
    },
    __nieJePoleObjektov(array){
        return array.every(element => typeof element !=='object')
    },
    __ziskajPrimitivneDoObjektu(obj) {
        let objekt = {};
        this.__ziskajObjektoveKluce(obj)
            .forEach(polozka => {
                const key = obj[polozka];
                this.__jePrimitivna(key) ? objekt[polozka] = key : null
            })
        return objekt
    },
    __ziskajNestedObj(res) {
        return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.__ziskajObjektoveHodnoty(v) : [v])
            .reduce((acc, next) => acc.concat(...next), [])
            .filter(obj => typeof obj === 'object')
    },
    __ziskajJednoducheObjekty(odpoved) {
        const array = [];
        this.__ziskajObjektoveHodnoty(odpoved)
            .filter((polozka) => typeof polozka === 'object' && !Array.isArray(polozka))
            .forEach((obj) => {
                if (obj !== undefined && obj !== null) {
                Object.entries(obj).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        array.push({ [key]: value });
                    }
                });
            }
            });
        return array;
    },
    __ziskajUdaje(odpoved) {
        const primitivne = [this.__ziskajPrimitivneDoObjektu(odpoved)];
        const vnoreneObjekty = this.__ziskajNestedObj(odpoved)
        const jednoducheObjekty = this.__ziskajJednoducheObjekty(odpoved)
        const ghost = [Object.values(odpoved).forEach(element => {
            if(Array.isArray(element)) {
                this.__nieJePoleObjektov(element) ? console.log(...element):[]
            }
        })]
        let arr;
        primitivne.length > 0 || vnoreneObjekty.length > 0 || jednoducheObjekty.length > 0 ?
            arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty] :
            arr = vnoreneObjekty
        const elementArr = []
        arr.forEach(element => {
            if (element === undefined || element === null) return
            const oibjekty = this.__ziskajObjektoveHodnoty(element).length === 0
            elementArr[elementArr.length] = oibjekty
        })
        return arr.slice(elementArr.indexOf(true) + 1)
    },
    __ziskajObjektPodlaHodnoty(odpoved, hladanaHodnota) {
        const keys = Object.keys(odpoved);
        for (const key of keys) {
            const value = odpoved[key];
            if (value === hladanaHodnota) {
                return { [key]: value };
            } if (typeof value === 'object' && value !== null) {
                const vnoreneRes = this.__ziskajObjektPodlaHodnoty(value, hladanaHodnota);
                if (vnoreneRes) {
                    return { [key]: vnoreneRes };
                }
            }

        }
        return null;
    },
};
const spracovanieDát = Object.create(ZískDátZoServisov)
spracovanieDát.__ocislujDuplikaty = function(arrParam) {
    let cislo = 1;
    return arrParam.reduce((acc, arr) => acc.includes(arr) ? acc.concat(arr + cislo++) : acc.concat(arr), [])
}
spracovanieDát.__zjednotitData = function(result) {
    const zozbieraneData = ZískDátZoServisov.__ziskajUdaje(result)
    const arrKluc = [];
    const arrHodnota = []
    zozbieraneData.forEach(obj => {
        if (obj === undefined || obj === null) return
        Object.entries(obj).forEach(([key, val]) => {
            while (typeof val === 'object') {
                for (const key in val) {
                    if (Object.hasOwnProperty.call(val, key)) {
                        if(Array.isArray(val)){
                            this.__nieJePoleObjektov(val) ? val:[]
                            
                        }
                        arrKluc.push(key)
                        const element = val[key];
                        arrHodnota.push(element)
                        if (typeof element !== 'object') return;
                    }
                }
            }
            if (typeof val !== 'object'){
                arrKluc.push(key)
                arrHodnota.push(val)
            }
        });
    });
    return [arrKluc, arrHodnota]
}
const data = spracovanieDát.__zjednotitData(odpoved)
const foundObject = ZískDátZoServisov.__ziskajObjektPodlaHodnoty(odpoved, data[1][0]);
//console.log("🚀 ~ file: skuska_postman.js:134 ~ foundObject:", foundObject)
