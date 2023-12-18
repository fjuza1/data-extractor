'use strict'
/*
Object.entries(element).forEach(([key, value]) => {
    console.log(key, value)
})
*/
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
    __ziskajVonkajsieObjekty (response){
        return this.__ziskajObjektoveHodnoty(response).filter(element => typeof element === 'object' || !Array.isArray(element))
        .map(filtrovane=>this.contains(!Array.isArray(filtrovane)))
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
const result = AutomatizaciaResReq.__ziskajPrimitivne(response);

/*
priklad
const ziskajJednoducheObjekty = (response) => {
    const array = []
  Object.values(response)
    .filter((element) => typeof element === 'object' && !Array.isArray(element))
    .forEach((obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        typeof value === 'string'? array[array.length] = { [key]: value }:[]
      });
    });
    return array
};

const results = ziskajJednoducheObjekty(response);
console.log(results);
//console.log([...results]);
*/

const string = 'svatych';
// posledne je cislo
const poslednyDatovyTyp = [...string].findLast(element => !isNaN(+element));
// je cilso posledne alebo nie je
console.log(!isNaN(poslednyDatovyTyp));