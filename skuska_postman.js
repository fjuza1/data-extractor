'use strict'
/*
Object.entries(polozka).forEach(([key, value]) => {
    console.log(key, value)
})
*/
let odpoved = {
    "reaction": {
        "sts": "<integer>",
        "msg": "<string>"
    },
    "User": [{
        "Email": "<string>",
        "Username": "<string>",
        "Gender_id": "<integer>"
    }, ],
    "service": [{
        "name": "restservice",
        "device": "xr-1",
        "interface-port": "0/0/2/3",
        "interface-description": "uBot testing for NSO REST",
        "addr": "10.10.1.3/24",
        "mtu": 1024
    }],
    "person": {
        "male": {
            "name": "infinitbility"
        },
        "female": {
            "name": "aguidehub"
        }
    },
    "reactionID": "5484484898448948"
}
const ZískavanieDátZoSlužieb = {
    __ziskajObjektoveHodnoty(objekt) {
        return Object.values(objekt)
    },
    __ziskajObjektoveKluce(objekt) {
        return Object.keys(objekt)
    },
    __jePrimitivna(obj) {
        return typeof obj !== 'object'
    },
    __primitivne(obj) {
        let objekt = {};
        this.__ziskajObjektoveKluce(obj)
            .forEach(polozka => {
                const key = obj[polozka];
                this.__jePrimitivna(key) ? objekt[polozka] = key : []
            })
        return objekt
    },
    __ziskajNestedObjekty(res) {
        return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.__ziskajObjektoveHodnoty(v) : [v])
            .reduce((acc, next) => acc.concat(...next), [])
            .filter(obj => typeof obj === 'object')
    },
    __ziskajVonkajsieObjekty (odpoved){
        //console.log(Object.getOwnPropertyNames(this));
    },
    __ziskajJednoducheObjekty(odpoved) {
        const array = []
      Object.values(odpoved)
        .filter((polozka) => typeof polozka === 'object' && !Array.isArray(polozka))
        .forEach((obj) => {
          Object.entries(obj).forEach(([key, value]) => {
            value? array[array.length] = { [key]: value }:[]
          });
        });
        return array
    },
    __ziskajUdaje(odpoved) {
        const primitivne = [this.__primitivne(odpoved)];
        const vsetkyObjekty = this.__ziskajNestedObjekty(odpoved)
        const jednoducheObjekty = this.__ziskajJednoducheObjekty(odpoved)
        let arr
        (primitivne.length > 0 || vsetkyObjekty.length > 0 || jednoducheObjekty.length > 0) ? 
        arr = [...primitivne, ...vsetkyObjekty, ...jednoducheObjekty ] : arr = vsetkyObjekty
        if (this.__ziskajObjektoveKluce(arr[0]).length === 0) return arr.slice(1)
        return arr
    },
};
const SpracovanieDát = Object.create(ZískavanieDátZoSlužieb)
SpracovanieDát.__najdiDuplikat = function (){
    return odpoved
}
const result = ZískavanieDátZoSlužieb.__ziskajUdaje(odpoved);
//console.log("🚀 ~ file: skuska_postman.js:85 ~ result:", result)
// const resultss = ZískavanieDátZoSlužieb.__ziskajJednoducheObjekty(odpoved);
// console.log([...resultss]);
/*
const resultss = ZískavanieDátZoSlužieb.__ziskajJednoducheObjekty(odpoved);
console.log("🚀 ~ file: skuska_postman.js:90 ~ resultss:", resultss)
*/
// PRiklad
// console.log("🚀 ~ file: skuska_postman.js:85 ~ result:", Object.getOwnPropertyNames(result[8]))