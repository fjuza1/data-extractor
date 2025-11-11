import GetData from './get_data.js'
class ConsolidateData extends GetData {
	_numberDuplicates(obj) {
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
	_getDisallowed(data, nepovolene) {
		const extracted = {};
		Object.keys(data)
			.filter(key => nepovolene.includes(key))
			.forEach(key => extracted[key] = data[key])
		return extracted
	}
	_removeDisallowed(data, nepovolene) {
		Object.keys(data)
			.filter(key => nepovolene.includes(key))
			.forEach(key => delete data[key]);
	}
	_consolidateData(result) {
		const zozbieraneData = this._getValuesAndKeysArray(result)
		const arrKluc = [];
		const arrHodnota = []
		zozbieraneData.forEach(obj => {
			if (obj === undefined || obj === null) return
			Object.entries(obj).forEach(([key, val]) => {
				if (Array.isArray(val)) {
					this._isNotArrayOfObjects(val) ? val : []

				}
				if (typeof val === 'object') {
					for (const key in val) {
						if (Object.hasOwnProperty.call(val, key)) {
							if (Array.isArray(val)) {
								this._isNotArrayOfObjects(val) ? val : []

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
	_getObjectByValue(data, hladanaHodnota) {
		const keys = this._getObjectKeys(data);
		for (const key of keys) {
			const value = data[key];
			if (value === hladanaHodnota) {
				return {
					[key]: value
				};
			}
			if (typeof value === 'object' && value !== null) {
				const vnoreneRes = this._getObjectByValue(value, hladanaHodnota);
				if (vnoreneRes) {
					return {
						[key]: vnoreneRes
					}
				}
			}

		}
		return null;
	}
	_isSingleObjectType() {
		return this._getObjectValues(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/))
	}
	_renameKeysInComplexObject(res) {
		let array = [];
		let objektove = [];
		const naVyhladanie = this._consolidateData(res)[1];
		const vyhladane = naVyhladanie.map(item => this._getObjectByValue(res, item));
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
		const price = Object.entries(this._extractPrimitiveToObject(res)[0])[0]
		if (price) array.unshift(price[0])
		return array
	}
	_extractValuesFromArray(data) {
		const nepovolene = this._getDisallowed(data, Object.getOwnPropertyNames(this._extractPrimitiveToObject(data)[0]))
		this._removeDisallowed(data, Object.getOwnPropertyNames(this._extractPrimitiveToObject(nepovolene)[0]))
		const ky1 = this._renameKeysInComplexObject(data)
		const ky2 = this._consolidateData(data)[0]
		const jeto = [ky1, ky2]
		const val = this._consolidateData(data)[1]
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
	_storeKeyValuesToEnv(data, pouzFct) {
		let prazdne = this._getValuesAndKeysArray(data)
			.flatMap((obj) => Object.keys(obj).reduce((acc, o) => obj[o] === null ? [...acc, o] : acc, []))
		prazdne = this._numberDuplicates(prazdne)
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
export default new ConsolidateData()