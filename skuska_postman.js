'use strict';

let odpoved = {
    "reaction": {
        "sts": 200,
        "msg": "description",
        "Usernamez": null
    },
    "User": [{
            "Email": "phil.juza2@gmail.com",
            "Username": null,
            "Gender_id": 2
        },
        {
            "Email": "phil.juza@gmail.com",
            "Username": "ShenHU1",
            "Gender_id": 1
        },
        {
            "Email": null,
            "Username": "ShenHU",
            "Gender_id": 2
        }
    ],
    "dssad": 'dffsdfds',
    "dssads": 'dffsdfdsss',
    "babel": "¬1"
};

/**
 * Class for extracting data from service responses.
 */
class ZiskDatZoServisov {
    constructor() {
        this.zaciatok = 'Dec 13, 2023';
    }

    /**
     * Retrieves the values of an object's properties.
     * @param {Object} objekt - The object to retrieve values from 
     * @returns {Array} - An array of the object's values.
     */
    ziskajObjektoveHodnoty(objekt) {
        if (objekt === undefined || objekt === null) return;
        return Object.values(objekt);
    }

    /**
     * Retrieves the keys of an object's properties.
     * @param {Object} objekt - The object to retrieve keys from.
     * @returns {Array} - An array of the object's keys.
     */
    ziskajObjektoveKluce(objekt) {
        return Object.keys(objekt);
    }

    /**
     * Checks if a value is primitive.
     * @param {*} obj - The value to check.
     * @returns {boolean} - True if the value is primitive, false otherwise.
     */
    jePrimitivna(obj) {
        return typeof obj !== 'object' || obj === null;
    }

    /**
     * Checks if an array does not contain any objects.
     * @param {Array} array - The array to check.
     * @returns {boolean} - True if the array does not contain objects, false otherwise.
     */
    nieJePoleObjektov(array) {
        if (Array.isArray(array)) return array.every(element => typeof element !== 'object');
    }

    /**
     * Retrieves data types from an array.
     * @param {Object} data - The data object to process.
     * @returns {Array} - An array of data types.
     */
    ziskjJednTypyDatPoli(data) {
        return this.ziskajObjektoveHodnoty(data)
            .flatMap(element => {
                if (!element) return;
                return this.nieJePoleObjektov(element) ? [...element] : [];
            });
    }

    /**
     * Retrieves primitive values from an object and places them in a new object.
     * @param {Object} obj - The object to process.
     * @return {Array} - An array containing the new object with primitive values.
     */
    ziskajPrimitivneDoObjektu(obj) {
        let objekt = {};
        this.ziskajObjektoveKluce(obj)
            .forEach(polozka => {
                const key = obj[polozka];
                this.jePrimitivna(key) ? objekt[polozka] = key : null;
            });
        return [objekt];
    }

    /**
     * @param {Object} res - The response object to process.
     * @returns {Array} - An array of nested objects.
     */
    ziskajNestedObj(res) {
        return this.ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.ziskajObjektoveHodnoty(v) : [v])
            .reduce((acc, next) => acc.concat(...next), [])
            .reduce((acc, cur) => typeof cur === 'object' ? [...acc, cur] : acc, []);
    }

    /**
     * Retrieves simple objects from data.
     * @param {Object|Array} data - The data to process.
     * @returns {Array} - An array of simple objects.
     */
    ziskajJednoducheObjekty(data) {
        if (!Array.isArray(data)) {
            return this.ziskajObjektoveHodnoty(data)
                .reduce((acc, cur, i, arr) => cur &&
                    typeof cur === 'object' &&
                    !Array.isArray(cur) || cur === null &&
                    this.ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, []);
        } else {
            return this.ziskajObjektoveHodnoty(data)
                .reduce((acc, cur, i, arr) => cur &&
                    typeof cur === 'object' || Array.isArray(arr) || cur === null &&
                    !Array.isArray(cur) && this.ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, []);
        }
    }

    /**
     * Retrieves a combined array of keys and values from data.
     * @param {Object} data - The data to process.
     * @returns {Array} - An array of combined keys and values.
     */
    ziskjHodnKlucDoArr(data) {
        const primitivne = this.ziskajPrimitivneDoObjektu(data);
        const vnoreneObjekty = this.ziskajNestedObj(data);
        const jednoducheObjekty = this.ziskajJednoducheObjekty(data);
        const lord = this.ziskajObjektoveHodnoty(data)
            .reduce((acc, cur) => cur && !Array.isArray(cur) && this.ziskajObjektoveHodnoty(cur).some(value => Array.isArray(value)) ? [...acc, cur] : acc, []);
        let jednoducheArr = this.ziskjJednTypyDatPoli(data);
        let arr;
        arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty];
        if (jednoducheArr.length > 0) arr = [...arr, jednoducheArr];
        return arr.reduce((acc, cur) => cur && !Object.keys(cur).length < 1 ? [...acc, cur] : acc, []);
    }
}

/**
 * Class for processing data, extending ZiskDatZoServisov.
 */
class SpracovanieDat extends ZiskDatZoServisov {
    /**
     * Number duplicates in an array.
     * @param {Array} obj - The array to process.
     * @returns {Array} - An array with numbered duplicates.
     */
    ocislujDuplikaty(obj) {
        let i = 1;
        if (Array.isArray(obj)) {
            const cislaNecisla = obj.reduce((acc, cur) => {
                    const original = cur;
                    while (acc.includes(cur)) {
                        i++;
                        cur = `${original}${i}`;
                    }
                    i = 1;
                    return [...acc, cur];
                }, [])
                .map(cislaNecisla => !(/\d/).test(cislaNecisla) ? `${cislaNecisla}1` : `${cislaNecisla}`);
            return cislaNecisla;
        }
        return obj;
    }

    /**
     * Retrieves disallowed data from an object.
     * @param {Object} data - The data object to process.
     * @param {Array} nepovolene - An array of disallowed keys.
     * @returns {Object} - An object containing disallowed data.
     */
    ziskjNepovolene(data, nepovolene) {
        const extracted = {};
        Object.keys(data)
            .filter(key => nepovolene.includes(key))
            .forEach(key => extracted[key] = data[key]);
        return extracted;
    }

    /**
     * Removes disallowed data from an object.
     * @param {Object} data - The data object to process.
     * @param {Array} nepovolene - An array of disallowed keys.
     */
    odstranNepovolene(data, nepovolene) {
        Object.keys(data)
            .filter(key => nepovolene.includes(key))
            .forEach(key => delete data[key]);
    }

    /**
     * Combines data into a unified format.
     * @param {Object} result - The data object to process.
     * @returns {Array} - An array containing unified keys and values.
     */
    zjednotitData(result) {
        const zozbieraneData = this.ziskjHodnKlucDoArr(result);
        const arrKluc = [];
        const arrHodnota = [];
        zozbieraneData.forEach(obj => {
            if (obj === undefined || obj === null) return;
            Object.entries(obj).forEach(([key, val]) => {
                if (Array.isArray(val)) {
                    this.nieJePoleObjektov(val) ? val : [];
                }
                if (typeof val === 'object') {
                    for (const key in val) {
                        if (Object.hasOwnProperty.call(val, key)) {
                            if (Array.isArray(val)) {
                                this.nieJePoleObjektov(val) ? val : [];
                            }
                            arrKluc.push(key);
                            const element = val[key];
                            arrHodnota.push(element);
                            if (typeof element !== 'object') return;
                        }
                    }
                }
                if (typeof val !== 'object') {
                    arrKluc.push(key);
                    arrHodnota.push(val);
                }
            });
        });
        return [arrKluc, arrHodnota];
    }

    /**
     * Retrieves an object based on a specific value.
     * @param {Object} data - The data object to search.
     * @param {*} hladanaHodnota - The value to search for.
     * @returns {Object|null} - The object containing the searched value.
     */
    ziskajObjektPodlaHodnoty(data, hladanaHodnota) {
        const keys = this.ziskajObjektoveKluce(data);
        for (const key of keys) {
            const value = data[key];
            if (value === hladanaHodnota) {
                return {
                    [key]: value
                };
            }
            if (typeof value === 'object' && value !== null) {
                const vnoreneRes = this.ziskajObjektPodlaHodnoty(value, hladanaHodnota);
                if (vnoreneRes) {
                    return {
                        [key]: vnoreneRes
                    };
                }
            }
        }
        return null;
    }

    /**
     * Checks if all elements in the object are of primitive types.
     * @param {Object} obj - The object to check.
     * @returns {Array} - An array indicating the type of each element ('number', 'boolean', 'string').
     */
    jeJednObj(obj) {
        return this.ziskajObjektoveHodnoty(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/));
    }

    /**
     * Generates an array of key names for a complex object.
     * @param {Object} res - The object to process.
     * @returns {Array} - An array of key names.
     */
    menNazKlucZlozObj(res) {
        let array = [];
        let objektove = [];
        const naVyhladanie = this.zjednotitData(res)[1];
        const vyhladane = naVyhladanie.map(item => this.ziskajObjektPodlaHodnoty(res, item));
        vyhladane.forEach(val => {
            for (const kys in val) {
                if (Object.hasOwnProperty.call(val, kys)) {
                    const element = val[kys];
                    if (typeof element === 'string') return;
                    for (let ky in element) {
                        if (Object.hasOwnProperty.call(element, ky)) {
                            if (!isNaN(+ky)) {
                                ky = +ky + 1;
                            }
                            array.push(`${kys}_${ky}`);
                        }
                    }
                }
            }
        });
        const price = Object.entries(this.ziskajPrimitivneDoObjektu(res)[0])[0];
        if (price) array.unshift(price[0]);
        return array;
    }

    /**
     * Retrieves values from an array.
     * @param {Object} data - The data object to process.
     * @returns {Object} - An object with keys and values from the data.
     */
    ziskjHodnZArr(data) {
        const nepovolene = this.ziskjNepovolene(data, Object.getOwnPropertyNames(this.ziskajPrimitivneDoObjektu(data)[0]));
        this.odstranNepovolene(data, Object.getOwnPropertyNames(this.ziskajPrimitivneDoObjektu(nepovolene)[0]));
        const ky1 = this.menNazKlucZlozObj(data);
        const ky2 = this.zjednotitData(data)[0];
        const jeto = [ky1, ky2];
        const val = this.zjednotitData(data)[1];
        const ziskjHodn = (ky1, ky2) => {
            const key1 = ky1.flat();
            const key2 = ky2.flat();
            const spojene = key1.map((item, i) => {
                let string = `${item}_${key2[i]}`;
                string = Array.from(new Set(Object.values(string.split('_'))));
                return string.join('_');
            });
            return spojene;
        };
        const zbavSa = ziskjHodn(ky1, ky2);
        const brasil = zbavSa.map(item => {
            return item
                .split('_')
                .map((part, index) => (index > 0 && !isNaN(part) ? part : index === 0 ? part : `_${part}`))
                .join('');
        });
        const result = {};
        brasil.forEach((key, index) => {
            result[key] = val[index];
        });
        Object.keys(nepovolene).forEach((key) => result[key] = nepovolene[key]);
        return result;
    }

    /**
     * Saves keys and values to an environment.
     * @param {Object} data - The data object to process.
     * @param {Object} pouzFct - The function to use for saving.
     */
    ulozKlHdnDoProstr(data, pouzFct) {
        let nullove = this.ziskjHodnKlucDoArr(data)
            .flatMap((obj) => Object.keys(obj).reduce((acc, o) => obj[o] === null ? [...acc, o] : acc, []));
        nullove = this.ocislujDuplikaty(nullove);
        //console.log(...nullove,null);
        if (nullove) {
            nullove.forEach(element => {
                console.log(element, null);
                //pm.environment.set(element,null);
            });
        }
        //if(nullove) pm.environment.set(...nullove,null);
        //pouzFct.push(primitivne);
        Object.entries(pouzFct).forEach(([key, value]) => {
            //pm.environment.set(key,value);
            console.log(key, value);
        });
    }
}

const spracovanie = new SpracovanieDat();
const result = spracovanie.zjednotitData(odpoved);
console.log(result);