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
    __ziskajPrimitivneDoObjektu(obj) {
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
    __ziskajJednoducheObjekty(odpoved) {
        const array = []
        Object.values(odpoved)
            .filter((polozka) => typeof polozka === 'object' && !Array.isArray(polozka))
            .forEach((obj) => {
                Object.entries(obj).forEach(([key, value]) => {
                    value ? array[array.length] = {
                        [key]: value
                    } : []
                });
            });
        return array
    },
    __ziskajUdaje(odpoved) {
        const primitivne = [this.__ziskajPrimitivneDoObjektu(odpoved)];
        const vsetkyObjekty = this.__ziskajNestedObjekty(odpoved)
        const jednoducheObjekty = this.__ziskajJednoducheObjekty(odpoved)
        let arr;
        primitivne.length > 0 || vsetkyObjekty.length > 0 || jednoducheObjekty.length > 0 ?
            arr = [...primitivne, ...vsetkyObjekty, ...jednoducheObjekty] :
            arr = vsetkyObjekty
        return arr
    },
};
const result = ZískavanieDátZoSlužieb.__ziskajUdaje(odpoved);
const spracovanieDát = Object.create(ZískavanieDátZoSlužieb)
/*
Priklad
*/
spracovanieDát.__zbavPrazdnychObjektov = function(arr) {
    const elementArr = []
    const ziskavanieArray = ZískavanieDátZoSlužieb.__ziskajUdaje(arr)
    ziskavanieArray.forEach(element => {
        const oibjekty = this.__ziskajObjektoveHodnoty(element).length === 0
        elementArr[elementArr.length] = oibjekty
    })
    return ziskavanieArray.slice(elementArr.indexOf(true) + 1)
}
spracovanieDát.__ulozKlucHodnotuDoPostmana = function () {}
const best = spracovanieDát.__zbavPrazdnychObjektov(result)
// PRiklad
// console.log("🚀 ~ file: skuska_postman.js:85 ~ result:", Object.getOwnPropertyNames(result[8]))
/*
spracovanieDát.__najdiDuplikat = function (){
    return odpoved
} */