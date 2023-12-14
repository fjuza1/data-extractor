'use strict'
let response = {
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
    __ziskajNestedObjekty(res) {
        return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.__ziskajObjektoveHodnoty(v) : [v])
            .reduce((acc, next) => acc.concat(...next), [])
            .filter(obj => typeof obj === 'object')
    },
    __ziskajPrimitivne(response) {
        const primitivne = [this.__primitivne(response)];
        const vsetkyObjekty = this.__ziskajNestedObjekty(response)
        let arr
        primitivne.length > 0 ? arr = [...primitivne, ...vsetkyObjekty] : arr = vsetkyObjekty
        if (this.__ziskajObjektoveKluce(arr[0]).length === 0) return arr.slice(1)
        return arr
    }
};
const vsetkyNestedObjekty = AutomatizaciaResReq.__ziskajNestedObjekty(response)
console.log("🚀 ~ file: skuska_postman.js:64 ~ vsetkyNestedObjekty:", vsetkyNestedObjekty)
const result = AutomatizaciaResReq.__ziskajPrimitivne(response);
// console.log("🚀 ~ file: skuska_postman.js:64 ~ result:", result)
/*
const power = Object.values(response)
  .filter(element => typeof element === 'object' && !Array.isArray(element))
  .map(element => element);

console.log("🚀 ~ file: skuska_postman.js:24 ~ nenestObjekty:", power);
*/