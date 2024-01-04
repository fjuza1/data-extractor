'use strict'
/*
Object.entries(polozka).forEach(([key, value]) => {
    console.log(key, value)
})
*/
let odpoved = {
    "reaction": {
        "sts": "<integer>",
        "msg": '0'
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
            "name": "infinitbility",
            "male": {
                "names": "infinitbilities"
            }
        },
        "female": {
            "name": "aguidehub"
        }
    },
    "reactionID": "5484484898448948"
}
const ZískavanieDátZoSlužieb = {
    'začiatok': 'Dec 13, 2023 ',
    __ziskajObjektoveHodnoty(objekt) {
        if (objekt === null) return
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
    __ziskajNestedObj(res) {
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
        const vnoreneObjekty = this.__ziskajNestedObj(odpoved)
        const jednoducheObjekty = this.__ziskajJednoducheObjekty(odpoved)
        let arr;
        primitivne.length > 0 || vnoreneObjekty.length > 0 || jednoducheObjekty.length > 0 ?
            arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty] :
            arr = vnoreneObjekty
        const elementArr = []
        arr.forEach(element => {
			if(element === null) return
            const oibjekty = this.__ziskajObjektoveHodnoty(element).length === 0
            elementArr[elementArr.length] = oibjekty
        })
        return arr.slice(elementArr.indexOf(true) + 1)
    },
};
const spracovanieDát = Object.create(ZískavanieDátZoSlužieb)
spracovanieDát.__ocisliDuplikaty = function(arrParam) {
    let cislo = 1;
    return arrParam.reduce((acc, arr) => acc.includes(arr) ? acc.concat(arr + cislo++) : acc.concat(arr), [])
}
spracovanieDát.__zjednotitData = function(result) {
    const arrZozbierane = ZískavanieDátZoSlužieb.__ziskajUdaje(result)
    const arrKluc = [];
    const arrHodnota = []
    // if (!foo1 && (foo1 !== 0 || foo1))
    arrZozbierane.forEach(obj => {
    //console.log("🚀 ~ file: skuska_postman.js:104 ~ obj:", obj)
        Object.entries(obj).forEach(([key, val]) => {
            // TODO guard clause for  0 or newgative value logic change
            while (typeof val === 'object') {
                for (const key in val) {
                    if (Object.hasOwnProperty.call(val, key)) {
                        arrKluc.push(key)
                        const element = val[key];
                        arrHodnota.push(element)
                        if (typeof element !== 'object') return;
                    }
                }
            }
            if (typeof val !== 'object') {
                arrKluc.push(key)
                arrHodnota.push(val)
            }
        });
    });
    const klucOcisteneDupl = this.__ocisliDuplikaty(arrKluc)
    return [klucOcisteneDupl, arrHodnota]
}
const data = spracovanieDát.__zjednotitData(odpoved)
console.log("🚀 ~ file: skuska_postman.js:128 ~ data:", data)