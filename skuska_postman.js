'use strict'
let odpoved = {
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
        fruits: ['banana', 'apple', 'peach'],
        language: "JavaScript",
        theme: "dark"
    },
    // isDeveloper: true,
    // isNOTDeveloper: false,
    projects: [{
            name: "Project A",
            status: "completed"
        },
        {
            name: "Project B",
            status: "in progress"
        },
        {
            name: "Project C",
            status: "planning"
        }
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
    __nieJePoleObjektov(array) {
        return array.every(element => typeof element !== 'object')
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
                            array.push({
                                [key]: value
                            });
                        }
                    });
                }
            });
        return array;
    },
    __ziskjHodnKlucDoArr(odpoved) {
        const primitivne = [this.__ziskajPrimitivneDoObjektu(odpoved)];
        const vnoreneObjekty = this.__ziskajNestedObj(odpoved)
        const jednoducheObjekty = this.__ziskajJednoducheObjekty(odpoved)
        const jednoducheArr = Object.values(odpoved)
            .flatMap(element => {
                if (Array.isArray(element)) {
                    if (!element) return
                    return this.__nieJePoleObjektov(element) ? [...element] : []
                }
            }).filter(item => typeof item !== 'undefined')
        let arr;
        primitivne.length > 0 || vnoreneObjekty.length > 0 || jednoducheObjekty.length > 0 ?
            arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty] : ''
        if (jednoducheArr.length > 0) arr = [...arr, jednoducheArr]
        const elementArr = []
        arr.forEach(element => {
            if (element === undefined || element === null) return
            const oibjekty = this.__ziskajObjektoveHodnoty(element).length === 0
            elementArr[elementArr.length] = oibjekty
        })
        return arr.slice(elementArr.indexOf(true) + 1)
    },
};
const spracovanieDát = Object.create(ZískDátZoServisov)
spracovanieDát.__ocislujDuplikaty = function(arrParam) {
    let cislo = 1;
    return arrParam.reduce((acc, arr) => acc.includes(arr) ? acc.concat(arr + cislo++) : acc.concat(arr), [])
}
spracovanieDát.__vymazDuplikatyString = function(){
    
}
spracovanieDát.__zjednotitData = function(result) {
    const zozbieraneData = ZískDátZoServisov.__ziskjHodnKlucDoArr(result)
    const arrKluc = [];
    const arrHodnota = []
    zozbieraneData.forEach(obj => {
        if (obj === undefined || obj === null) return
        Object.entries(obj).forEach(([key, val]) => {
            while (typeof val === 'object') {
                for (const key in val) {
                    if (Object.hasOwnProperty.call(val, key)) {
                        if (Array.isArray(val)) {
                            this.__nieJePoleObjektov(val) ? val : []

                        }
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
    return [arrKluc, arrHodnota]
}
spracovanieDát.__ziskajObjektPodlaHodnoty = function(odpoved, hladanaHodnota) {
    const keys = Object.keys(odpoved);
    for (const key of keys) {
        const value = odpoved[key];
        if (value === hladanaHodnota) {
            return {
                [key]: value
            };
        }
        if (typeof value === 'object' && value !== null) {
            const vnoreneRes = this.__ziskajObjektPodlaHodnoty(value, hladanaHodnota);
            if (vnoreneRes) {
                return {
                    [key]: vnoreneRes
                }
            }
        }

    }
    return null;
}
spracovanieDát.__jeJednObj = function(obj) {
    return Object.values(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/))
}
spracovanieDát.__menNazKlucZlozObj = function(res) {
    let array = []
    let objektove = []
    const naVyhladanie = this.__zjednotitData(res)[1]
    const vyhladane = naVyhladanie.map(item => this.__ziskajObjektPodlaHodnoty(res, item))
    Object.entries(vyhladane).forEach(([key, val]) => {
        for (const kys in val) {
            if (Object.hasOwnProperty.call(val, kys)) {
                const jeObjJedn = this.__jeJednObj(val)
                const [propertyName] = jeObjJedn;
                if (Array.isArray(propertyName)) {
                    array[array.length] = val
                }
                const element = val[kys];
                for (let ky in element) {
                    if (Object.hasOwnProperty.call(element, ky)) {

                        if (!isNaN(+ky)) {
                            +ky++
                        }
                    }
                    array[array.length] = `${kys}_${ky}`
                }
            }
        }

    });
    return array
}
spracovanieDát.__ziskjHodnZArr = function() {
    const ky1 = this.__menNazKlucZlozObj(odpoved)
    const ky2 = this.__zjednotitData(odpoved)[0]
    const jeto = [ky1,ky2]
    const val = this.__zjednotitData(odpoved)[1]
    const ziskjHodn = (ky1,ky2)=>{
        const key1 = ky1.flat(element => element);
        const key2 = ky2.flat(element => element);
        const spojene = key1.map((item, i)=>`${item}_${key2[i]}`)
        console.log("🚀 ~ ziskjHodn ~ spojene:", spojene)
    }
    ziskjHodn(ky1,ky2)
    /*
    for (const a in arraySimple) {
        if (Object.hasOwnProperty.call(arraySimple, a)) {
            const [element] = arraySimple[a];
            const pouzivam = this.__ziskjHodnZArr(this.__menNazKlucZlozObj(odpoved))
            console.log("🚀 ~ file: skuska_postman.js:201 ~ pouzivam:", pouzivam)
        }
    }
    */
}
spracovanieDát.__ziskjHodnZArr()