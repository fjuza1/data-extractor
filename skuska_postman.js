'use strict'
let odpoved = {
	"reaction": {
		"sts": 200,
		"msg": "description"
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
	"dssads": 'dffsdfdsss'
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
		return typeof obj !== 'object' || obj === null
	},
	__nieJePoleObjektov(array) {
		if (Array.isArray(array)) return array.every(element => typeof element !== 'object')
	},
	__ziskjJednTypyDatPoli(data) {
		return this.__ziskajObjektoveHodnoty(data)
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
	__ziskajJednoducheObjekty(data) {
		if (!Array.isArray(data)) {
			return this.__ziskajObjektoveHodnoty(data)
				.reduce((acc, cur, i, arr) => cur && typeof cur === 'object' && !Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
		} else {
			return this.__ziskajObjektoveHodnoty(data)
				.reduce((acc, cur, i, arr) => cur && typeof cur === 'object' || Array.isArray(arr) && !Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
		}
	},
	__ziskjHodnKlucDoArr(data) {
		const primitivne = this.__ziskajPrimitivneDoObjektu(data);
		const vnoreneObjekty = this.__ziskajNestedObj(data)
		const jednoducheObjekty = this.__ziskajJednoducheObjekty(data)
		const lord = this.__ziskajObjektoveHodnoty(data)
			.reduce((acc, cur) => cur && !Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).some(value => Array.isArray(value)) ? [...acc, cur] : acc, [])
		let jednoducheArr = this.__ziskjJednTypyDatPoli(data)
		let arr;
		arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty]
		if (jednoducheArr.length > 0) arr = [...arr, jednoducheArr]
		return arr.reduce((acc, cur) => cur && !Object.keys(cur).length < 1 ? [...acc, cur] : acc, []);
	},
};
const spracovanieDát = Object.create(ZískDátZoServisov)
spracovanieDát.__ocislujDuplikaty = function(obj) {
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
	return cislaNecisla
};
spracovanieDát.__ziskjNepovolene = function(data, nepovolene) {
	const extracted = {};
	Object.keys(data)
		.filter(key => nepovolene.includes(key))
	.forEach(key => extracted[key] = data[key])
	return extracted
};
spracovanieDát.__odstranNepovolene = function (data, nepovolene){
	Object.keys(data)
	.filter(key => nepovolene.includes(key))
	.forEach(key => delete data[key]);
}
spracovanieDát.__zjednotitData = function(result) {
	this.__odstranNepovolene(result, Object.getOwnPropertyNames(this.__ziskajPrimitivneDoObjektu(result)[0]))
	const zozbieraneData = ZískDátZoServisov.__ziskjHodnKlucDoArr(result)
	const arrKluc = [];
	const arrHodnota = []
	zozbieraneData.forEach(obj => {
		if (obj === undefined || obj === null) return
		Object.entries(obj).forEach(([key, val]) => {
			if (Array.isArray(val)) {
				this.__nieJePoleObjektov(val) ? val : []

			}
			if (typeof val === 'object') {
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
spracovanieDát.__ziskajObjektPodlaHodnoty = function(data, hladanaHodnota) {
	const keys = this.__ziskajObjektoveKluce(data);
	for (const key of keys) {
		const value = data[key];
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
spracovanieDát.__menNazKlucZlozObj = function(res) {
	let array = [];
	let objektove = [];
	const naVyhladanie = this.__zjednotitData(res)[1];
	const vyhladane = naVyhladanie.map(item => this.__ziskajObjektPodlaHodnoty(res, item));
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
	const price = Object.entries(this.__ziskajPrimitivneDoObjektu(res)[0])[0]
	if (price) array.unshift(price[0])
	return array
}
spracovanieDát.__ziskjHodnZArr = function(data) {
	const ky1 = this.__menNazKlucZlozObj(data)
	const ky2 = this.__zjednotitData(data)[0]
	const jeto = [ky1, ky2]
	const val = this.__zjednotitData(data)[1]
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

	return result;
}
spracovanieDát.__ulozKlHdnDoProstr = function(data, pouzFct) {
	let nullove = this.__ziskjHodnKlucDoArr(data)
		.flatMap((obj) => Object.keys(obj).reduce((acc, o) => obj[o] === null ? [...acc, o] : acc, []))
	nullove = this.__ocislujDuplikaty(nullove)
	//console.log(...nullove,null);
	if (nullove) {
		nullove.forEach(element => {
			console.log(element, null);
			//pm.environment.set(element,null);
		});
	}
	//if(nullove) pm.environment.set(...nullove,null);
	//pouzFct.push(primitivne)
	Object.entries(pouzFct).forEach(([key, value]) => {
		//pm.environment.set(key,value);
		console.log(key, value);
	})
}
// BUG - primitivne push nakoniec do ulozKlHdnDoProstr
const boomboom = spracovanieDát.__ulozKlHdnDoProstr(odpoved, spracovanieDát.__ziskjHodnZArr(odpoved))