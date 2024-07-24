'use strict'
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
// TODO 1.0 add getting complex object on one level only in array of objects
//TODO 1.1 pouzi ! __jePrimitivna at 1.0
/**@namespace  ZískDátZoServisov
 * @property {string} zaciatok - starting date
 */
const ZískDátZoServisov = {
	'začiatok': 'Dec 13, 2023 ',
	/**Retrieves the values of an object's properties.
	 * @param {Object} objekt - The object to retrieve values from 
	 * @returns {Array} - An array of the object's values.
	 */
	__ziskajObjektoveHodnoty(objekt) {
		if (objekt === undefined || objekt === null) return
		return Object.values(objekt)
	},
	/**
	 *  Retrieves the keys of an object's properties.
	 * @param {Object} objekt -The object to retrieve keys from.
	 * @returns {Array} - An array of the object's keys.
	 * */
	__ziskajObjektoveKluce(objekt) {
		return Object.keys(objekt)
	},
	/**
	 * Checks if a value is primitive.
	 * @param {*} obj - The value to check.
	 * @returns {boolean} - True if the value is primitive, false otherwise.
	 */
	__jePrimitivna(obj) {
		return typeof obj !== 'object' || obj === null
	},
	/**
	 * Checks if an array does not contain any objects.
	 * @param {Array} array - The array to check. 
	 * @returns {boolean} - True if the array does not contain objects, false otherwise.*/
	__nieJePoleObjektov(array) {
		if (Array.isArray(array)) return array.every(element => typeof element !== 'object')
	},
	/**
	 * Retrieves data types from an array.
	 * @param {Object} data - The data object to process.
	 * @returns {Array} - An array of data types.
	 */
	__ziskjJednTypyDatPoli(data) {
		return this.__ziskajObjektoveHodnoty(data)
			.flatMap(element => {
				if (!element) return
				return this.__nieJePoleObjektov(element) ? [...element] : []
			})
	},
	/**
	 * Retrieves primitive values from an object and places them in a new object.
	 * @param {Object} obj - The object to process.
	 * @return {Array} - An array containing the new object with primitive values.
	 */
	__ziskajPrimitivneDoObjektu(obj) {
		let objekt = {};
		this.__ziskajObjektoveKluce(obj)
			.forEach(polozka => {
				const key = obj[polozka];
				this.__jePrimitivna(key) ? objekt[polozka] = key : null
			})
		return [objekt]
	},
	/**   
	 * @param {Object} res - The response object to process.
	 * @returns {Array} - An array of nested objects.
	 */
	__ziskajNestedObj(res) {
		return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.__ziskajObjektoveHodnoty(v) : [v])
			.reduce((acc, next) => acc.concat(...next), [])
			.reduce((acc, cur) => typeof cur === 'object' ? [...acc, cur] : acc, []);
	},
	/**
	 * Retrieves simple objects from data.
	 * @param {Object|Array} data - The data to process.
	 * @returns {Array} - An array of simple objects.
	 */
	__ziskajJednoducheObjekty(data) {
		if (!Array.isArray(data)) {
			return this.__ziskajObjektoveHodnoty(data)
				.reduce((acc, cur, i, arr) => cur &&
					typeof cur === 'object' &&
					!Array.isArray(cur) || cur === null &&
					this.__ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
		} else {
			return this.__ziskajObjektoveHodnoty(data)
				.reduce((acc, cur, i, arr) => cur &&
					typeof cur === 'object' || Array.isArray(arr) || cur === null &&
					!Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
		}
	},
	/**
	 * Retrieves a combined array of keys and values from data.
	 * @param {Object} data - The data to process.
	 * @returns {Array} - An array of combined keys and values.
	 */
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
/**@namespace spracovanieDát - extends  ZískDátZoServisov*/
const spracovanieDát = Object.create(ZískDátZoServisov);
/**
 * Number duplicates in an array.
 * @param {Array} obj - The array to process.
 * @returns {Array} - An array with numbered duplicates.
 */
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
/**
 * Retrieves disallowed data from an object.
 * @param {Object} data - The data object to process.
 * @param {Array} nepovolene - An array of disallowed keys.
 * @returns {Object} - An object containing disallowed data.
 */
spracovanieDát.__ziskjNepovolene = function(data, nepovolene) {
	const extracted = {};
	Object.keys(data)
		.filter(key => nepovolene.includes(key))
		.forEach(key => extracted[key] = data[key])
	return extracted
};
/**
 * Removes disallowed data from an object.
 * @param {Object} data - The data object to process.
 * @param {Array} nepovolene - An array of disallowed keys.
 */
spracovanieDát.__odstranNepovolene = function(data, nepovolene) {
	Object.keys(data)
		.filter(key => nepovolene.includes(key))
		.forEach(key => delete data[key]);
};
/**
 * Combines data into a unified format.
 * @param {Object} result - The data object to process.
 * @returns {Array} - An array containing unified keys and values.
 */
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
};
/**
 * Retrieves an object based on a specific value.
 * @param {Object} data - The data object to search.
 * @param {*} hladanaHodnota - The value to search for.
 * @returns {Object|null} - The object containing the searched value,
 **/
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
};
/**
 * Checks if all elements in the object are of primitive types.
 * @param {Object} obj - The object to check.
 * @returns {Array} - An array indicating the type of each element ('number', 'boolean', 'string').
 */
spracovanieDát.__jeJednObj = function(obj) {
	return this.__ziskajObjektoveHodnoty(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/))
};
/**
 * Generates an array of key names for a complex object.
 * @param {Object} res - The object to process.
 * @returns {Array} - An array of key names.
 */
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
};
/**
 * Retrieves values from an array.
 * @param {Object} data - The data object to process.
 * @returns {Object} - An object with keys and values from the data.
 */
spracovanieDát.__ziskjHodnZArr = function(data) {
	const nepovolene = this.__ziskjNepovolene(data, Object.getOwnPropertyNames(this.__ziskajPrimitivneDoObjektu(data)[0]))
	this.__odstranNepovolene(data, Object.getOwnPropertyNames(this.__ziskajPrimitivneDoObjektu(nepovolene)[0]))
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
	Object.keys(nepovolene).forEach((key) => result[key] = nepovolene[key]);
	return result
};
/**
 * Saves keys and values to an environment.
 * @param {Object} data - The data object to process.
 * @param {Object} pouzFct - The function to use for saving.
 */
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
};
spracovanieDát.__ulozKlHdnDoProstr(odpoved, spracovanieDát.__ziskjHodnZArr(odpoved));