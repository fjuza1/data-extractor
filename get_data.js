export default class GetData {
	_getObjectValues(objekt) {
		if (objekt === undefined || objekt === null) return [];
		return Object.values(objekt);
	}
	_getObjectKeys(objekt) {
		return Object.keys(objekt)
	}
	_isPrimitive(obj) {
		return typeof obj !== 'object' || obj === null
	}
	_isNotArrayOfObjects(array) {
		if (Array.isArray(array)) return array.every(element => typeof element !== 'object')
	}
	_getSingleDataTypesFromArrays(data) {
		return this._getObjectValues(data)
			.flatMap(element => {
				if (!element) return
				return this._isNotArrayOfObjects(element) ? [...element] : []
			})
	}
	_extractPrimitiveToObject(obj) {
		let objekt = {};
		this._getObjectKeys(obj)
			.forEach(polozka => {
				const key = obj[polozka];
				this._isPrimitive(key) ? objekt[polozka] = key : null
			})
		return [objekt]
	}
	_getNestedObjects(res) {
		return this._getObjectValues(res).map(v => v instanceof Object ? this._getObjectValues(v) : [v])
			.reduce((acc, next) => acc.concat(...next), [])
			.reduce((acc, cur) => typeof cur === 'object' ? [...acc, cur] : acc, []);
	}
	_getSimpleObjects(data) {
		if (!Array.isArray(data)) {
			return this._getObjectValues(data)
				.reduce((acc, cur, i, arr) => cur &&
					typeof cur === 'object' &&
					!Array.isArray(cur) || cur === null &&
					this._getObjectValues(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
		} else {
			return this._getObjectValues(data)
				.reduce((acc, cur, i, arr) => cur &&
					typeof cur === 'object' || Array.isArray(arr) || cur === null &&
					!Array.isArray(cur) && this._getObjectValues(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
		}
	}
	_getValuesAndKeysArray(data) {
		const primitivne = this._extractPrimitiveToObject(data);
		const vnoreneObjekty = this._getNestedObjects(data)
		const jednoducheObjekty = this._getSimpleObjects(data)
		const lord = this._getObjectValues(data)
			.reduce((acc, cur) => cur && !Array.isArray(cur) && this._getObjectValues(cur).some(value => Array.isArray(value)) ? [...acc, cur] : acc, [])
		let jednoducheArr = this._getSingleDataTypesFromArrays(data)
		let arr;
		arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty]
		if (jednoducheArr.length > 0) arr = [...arr, jednoducheArr]
		return arr.reduce((acc, cur) => cur && !Object.keys(cur).length < 1 ? [...acc, cur] : acc, []);
	}
}