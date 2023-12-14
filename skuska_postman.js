'use strict'
let response = {
    // name:'me',
    address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA"
    },
    person: {
        firstName: "John",
        lastName: "Doe",
        age: 50,
        eyeColor: "blue",
        x: {
            type: "Fiat",
            model: "500",
            color: "white"
        },
        address: {
            street: "123 Main St",
            city: "Anytown",
            country: "USA",
        },
    },
    friends: [{
            friendNames: "Alice",
            age: 28
        },
        {
            friendNamez: "Bob",
            age: 32
        }
    ],
    meHow: [{
            fds: "Alice",
            as: 28
        },
        {
            dfgfdg: "Bob",
            dfg: 32
        }
    ]
};
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
console.log("🚀 ~ file: skuska_postman.js:81 ~ result:", result)
