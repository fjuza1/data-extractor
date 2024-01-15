'use strict'
let odpoved = {
    uponUs: ["wintertime", "sunshine", "The time is now"],
    name: {
        lust: "you",
        bust: "Tedious"
    },
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
        colors: ["modr", "zelk", "cer"],
        fruits: ['neviem', 'co', 'tera'],
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
        if (Array.isArray(array)) return array.every(element => typeof element !== 'object')
    },
    __ziskjJednTypyDatPoli(odpoved) {
        return this.__ziskajObjektoveHodnoty(odpoved)
            .flatMap(element => {
                if (!element) return
                return this.__nieJePoleObjektov(element) ? [...element] : []
            })
    },
    __ziskajPrimitivneDoObjektu(obj) {
        let objekt = {};
        this.__ziskajObjektoveKluce(obj)
            .forEach(polozka => {
                const key = obj[polozka];
                this.__jePrimitivna(key) ? objekt[polozka] = key : null
            })
        return [objekt]
    },
    __ziskajNestedObj(res) {
        return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.__ziskajObjektoveHodnoty(v) : [v])
            .reduce((acc, next) => acc.concat(...next), [])
            .reduce((acc, cur) => typeof cur === 'object' ? [...acc, cur] : acc, []);
    },
    __ziskajJednoducheObjekty(odpoved) {
        if (!Array.isArray(odpoved)) {
            return this.__ziskajObjektoveHodnoty(odpoved)
            .reduce((acc, cur, i, arr) => cur && typeof cur === 'object' && !Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
        } else{
            return this.__ziskajObjektoveHodnoty(odpoved)
            .reduce((acc, cur, i, arr) => cur && typeof cur === 'object' || Array.isArray(arr) && !Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
        }
    },
    __ziskjHodnKlucDoArr(odpoved) {
        const primitivne = this.__ziskajPrimitivneDoObjektu(odpoved);
        const vnoreneObjekty = this.__ziskajNestedObj(odpoved)
        const jednoducheObjekty = this.__ziskajJednoducheObjekty(odpoved)
        const lord = this.__ziskajObjektoveHodnoty(odpoved)
            .reduce((acc, cur) => cur && !Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).some(value => Array.isArray(value)) ? [...acc, cur] : acc, [])
        let jednoducheArr = this.__ziskjJednTypyDatPoli(odpoved)
        let arr;
        primitivne.length > 0 || vnoreneObjekty.length > 0 || jednoducheObjekty.length > 0 ?
            arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty] : ''
        if (jednoducheArr.length > 0) arr = [...arr, jednoducheArr]
        return arr.reduce((acc, cur) => cur && !Object.keys(cur).length < 1 ? [...acc, cur] : acc, []);
    },
};
console.log(ZískDátZoServisov.__ziskjHodnKlucDoArr(odpoved));
const spracovanieDát = Object.create(ZískDátZoServisov)
spracovanieDát.__zjednotitData = function(result) {
    const zozbieraneData = ZískDátZoServisov.__ziskjHodnKlucDoArr(result)
    const arrKluc = [];
    const arrHodnota = []
    zozbieraneData.forEach(obj => {
        if (obj === undefined || obj === null) return
        Object.entries(obj).forEach(([key, val]) => {
            if (Array.isArray(val)) {
                this.__nieJePoleObjektov(val) ? val : []

            }
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
    return this.__ziskajObjektoveHodnoty(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/))
}
/*\
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
        const key1 = ky1.flat();
        const key2 = ky2.flat();
        const spojene = key1.map((item, i)=>{
            let string = `${item}_${key2[i]}`
            string = Array.from(new Set(Object.values(string.split('_'))))
            return string
        })
        return spojene
    }
    const zbavSa = ziskjHodn(ky1,ky2)
    console.log("🚀 ~ zbavSa:", zbavSa)
}
console.log(spracovanieDát.__ziskjHodnZArr());
*/
spracovanieDát.__ocislujDuplikaty = function(arrParam) {
    let cislo = 1;
    return arrParam.reduce((acc, arr) => acc.includes(arr) ? acc.concat(arr + cislo++) : acc.concat(arr), [])
}