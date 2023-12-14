'use strict'
let response = {
    "reaction": {
        "sts": "<integer>",
        "msg": "<string>"
    },
    "gfd": {
        "stsf": "<integer>",
        "msgf": "<string>"
    },
    "gfddfg": {
        "stss": "<integer>",
        "msgs": "<string>"
    },
    "User": [
        {
            "Email": "<string>",
            "Username": "<string>",
            "Gender_id": "<integer>"
        },
        {
            "Email": "<string>",
            "Username": "<string>",
            "Gender_id": "<integer>"
        }
    ],
    "reactionID":"5484484898448948"
}
const AutomatizaciaResReq = {
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
            .forEach(element => {
                const key = obj[element];
                this.__jePrimitivna(key) ? objekt[element] = key : false
            })
        return objekt
    },
    __ziskajVsetkyObjekty(res) {
        return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.__ziskajObjektoveHodnoty(v) : [v])
            .reduce((acc, next) => acc.concat(...next), [])
            .filter(obj => typeof obj === 'object')
    },
    __ziskajPrimitivne(){
        const primitivne= [this.__primitivne(response)];
        const vsetkyObjekty = this.__ziskajVsetkyObjekty(response)
        let arr
        primitivne.length > 0 ? arr = [...primitivne,...vsetkyObjekty]:arr = vsetkyObjekty
        if(this.__ziskajObjektoveKluce(arr[0]).length === 0) return arr.slice(1)
        return arr
    }
};
const vsetkyObjekty = AutomatizaciaResReq.__ziskajVsetkyObjekty(response)
const result = AutomatizaciaResReq.__ziskajPrimitivne(response);
/*
const power = Object.values(response)
  .filter(element => typeof element === 'object' && !Array.isArray(element))
  .map(element => element);

console.log("🚀 ~ file: skuska_postman.js:24 ~ nenestObjekty:", power);
*/