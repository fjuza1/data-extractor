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
}
class ZiskDatZoServisov {
    _ziskajObjektoveHodnoty(objekt) {
        if (objekt === undefined || objekt === null) return
        return Object.values(objekt)
    }
    _ziskajObjektoveKluce(objekt) {
        return Object.keys(objekt)
    }
    _jePrimitivna(obj) {
        return typeof obj !== 'object' || obj === null
    }
    _nieJePoleObjektov(array) {
        if (Array.isArray(array)) return array.every(element => typeof element !== 'object')
    }
    _ziskjJednTypyDatPoli(data) {
        return this._ziskajObjektoveHodnoty(data)
            .flatMap(element => {
                if (!element) return
                return this._nieJePoleObjektov(element) ? [...element] : []
            })
    }
    _ziskajPrimitivneDoObjektu(obj) {
        let objekt = {};
        this._ziskajObjektoveKluce(obj)
            .forEach(polozka => {
                const key = obj[polozka];
                this._jePrimitivna(key) ? objekt[polozka] = key : null
            })
        return [objekt]
    }
    _ziskajNestedObj(res) {
        return this._ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this._ziskajObjektoveHodnoty(v) : [v])
            .reduce((acc, next) => acc.concat(...next), [])
            .reduce((acc, cur) => typeof cur === 'object' ? [...acc, cur] : acc, []);
    }
    _ziskajJednoducheObjekty(data) {
        if (!Array.isArray(data)) {
            return this._ziskajObjektoveHodnoty(data)
                .reduce((acc, cur, i, arr) => cur &&
                    typeof cur === 'object' &&
                    !Array.isArray(cur) || cur === null &&
                    this._ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
        } else {
            return this._ziskajObjektoveHodnoty(data)
                .reduce((acc, cur, i, arr) => cur &&
                    typeof cur === 'object' || Array.isArray(arr) || cur === null &&
                    !Array.isArray(cur) && this._ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
        }
    }
    _ziskjHodnKlucDoArr(data) {
        const primitivne = this._ziskajPrimitivneDoObjektu(data);
        const vnoreneObjekty = this._ziskajNestedObj(data)
        const jednoducheObjekty = this._ziskajJednoducheObjekty(data)
        const lord = this._ziskajObjektoveHodnoty(data)
            .reduce((acc, cur) => cur && !Array.isArray(cur) && this._ziskajObjektoveHodnoty(cur).some(value => Array.isArray(value)) ? [...acc, cur] : acc, [])
        let jednoducheArr = this._ziskjJednTypyDatPoli(data)
        let arr;
        arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty]
        if (jednoducheArr.length > 0) arr = [...arr, jednoducheArr]
        return arr.reduce((acc, cur) => cur && !Object.keys(cur).length < 1 ? [...acc, cur] : acc, []);
    }
}
class SpracovanieDat extends ZiskDatZoServisov {
    _ocislujDuplikaty(obj) {
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
    _ziskjNepovolene(data, nepovolene) {
        const extracted = {};
        Object.keys(data)
            .filter(key => nepovolene.includes(key))
            .forEach(key => extracted[key] = data[key])
        return extracted
    }
    _odstranNepovolene(data, nepovolene) {
        Object.keys(data)
            .filter(key => nepovolene.includes(key))
            .forEach(key => delete data[key]);
    }
    _zjednotitData(result) {
        const zozbieraneData = this._ziskjHodnKlucDoArr(result)
        const arrKluc = [];
        const arrHodnota = []
        zozbieraneData.forEach(obj => {
            if (obj === undefined || obj === null) return
            Object.entries(obj).forEach(([key, val]) => {
                if (Array.isArray(val)) {
                    this._nieJePoleObjektov(val) ? val : []

                }
                if (typeof val === 'object') {
                    for (const key in val) {
                        if (Object.hasOwnProperty.call(val, key)) {
                            if (Array.isArray(val)) {
                                this._nieJePoleObjektov(val) ? val : []

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
    _ziskajObjektPodlaHodnoty(data, hladanaHodnota) {
        const keys = this._ziskajObjektoveKluce(data);
        for (const key of keys) {
            const value = data[key];
            if (value === hladanaHodnota) {
                return {
                    [key]: value
                };
            }
            if (typeof value === 'object' && value !== null) {
                const vnoreneRes = this._ziskajObjektPodlaHodnoty(value, hladanaHodnota);
                if (vnoreneRes) {
                    return {
                        [key]: vnoreneRes
                    }
                }
            }

        }
        return null;
    }
    _jeJednObj() {
        return this._ziskajObjektoveHodnoty(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/))
    }
    _menNazKlucZlozObj(res) {
        let array = [];
        let objektove = [];
        const naVyhladanie = this._zjednotitData(res)[1];
        const vyhladane = naVyhladanie.map(item => this._ziskajObjektPodlaHodnoty(res, item));
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
        const price = Object.entries(this._ziskajPrimitivneDoObjektu(res)[0])[0]
        if (price) array.unshift(price[0])
        return array
    }
    _ziskjHodnZArr(data) {
        const nepovolene = this._ziskjNepovolene(data, Object.getOwnPropertyNames(this._ziskajPrimitivneDoObjektu(data)[0]))
        this._odstranNepovolene(data, Object.getOwnPropertyNames(this._ziskajPrimitivneDoObjektu(nepovolene)[0]))
        const ky1 = this._menNazKlucZlozObj(data)
        const ky2 = this._zjednotitData(data)[0]
        const jeto = [ky1, ky2]
        const val = this._zjednotitData(data)[1]
        const ziskjHodn = (ky1, ky2) => {
            const key1 = ky1.flat();
            const key2 = ky2.flat();
            const spojene = key1.map((item, i) => {
                let string = `${item}_${key2[i]}`
                string = Array.from(new Set(Object.values(string.split('_'))))
                return string.join('_')
            })
            return spojene
        }
        const zbavSa = ziskjHodn(ky1, ky2)
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
        return result
    }
    _ulozKlHdnDoProstr(data, pouzFct) {
        let prazdne = this._ziskjHodnKlucDoArr(data)
            .flatMap((obj) => Object.keys(obj).reduce((acc, o) => obj[o] === null ? [...acc, o] : acc, []))
        prazdne = this._ocislujDuplikaty(prazdne)
        //console.log(...prazdne,null);
        if (prazdne) {
            prazdne.forEach(element => {
                console.log(element, null);
                //pm.environment.set(element,null);
            });
        }
        //if(prazdne) pm.environment.set(...prazdne,null);
        //pouzFct.push(primitivne)
        Object.entries(pouzFct).forEach(([key, value]) => {
            //pm.environment.set(key,value);
            console.log(key, value);
        })
    }
}
const ziskDatZoServisov = new ZiskDatZoServisov();
const spracovanieDat = new SpracovanieDat();

spracovanieDat._ulozKlHdnDoProstr(odpoved, spracovanieDat._ziskjHodnZArr(odpoved));