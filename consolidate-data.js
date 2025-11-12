
import GetData from './get_data.js'

/**
 * Data consolidation utilities that extend the extraction helpers in GetData.
 *
 * This class provides methods to normalize keys/values from nested service
 * responses, remove disallowed properties, rename complex keys and prepare
 * key/value pairs for environment storage. Methods are considered internal
 * helpers (prefixed with `_`) but are documented for maintainability.
 *
 * @extends GetData
 */
class ConsolidateData extends GetData {
	/**
	 * Ensure items in an array are unique by adding a numeric suffix to duplicates.
	 * If `obj` is not an array it is returned unchanged.
	 *
	 * @param {Array<any>|*} obj - Array of keys (or other value) to normalise
	 * @returns {Array<any>|*} Array with unique entries (suffixed) or original value
	 * @private
	 */
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
	/**
	 * Extract and return properties from `data` whose keys are listed in `nepovolene`.
	 *
	 * @param {Object} data - Source object
	 * @param {Array<string>} nepovolene - Array of disallowed keys to extract
	 * @returns {Object} Object containing the extracted disallowed key/value pairs
	 * @private
	 */
	_getDisallowed(data, nepovolene) {
		const extracted = {};
		Object.keys(data)
			.filter(key => nepovolene.includes(key))
			.forEach(key => extracted[key] = data[key])
		return extracted
	}

	/**
	 * Remove properties from `data` whose keys are listed in `nepovolene`.
	 * This mutates the provided object.
	 *
	 * @param {Object} data - Object to remove keys from (mutated)
	 * @param {Array<string>} nepovolene - Array of keys to remove
	 * @private
	 */
	_removeDisallowed(data, nepovolene) {
		Object.keys(data)
			.filter(key => nepovolene.includes(key))
			.forEach(key => delete data[key]);
	}

	/**
	 * Consolidate collected values/keys from nested structures into two parallel
	 * arrays: keys and values. Used by higher-level renaming and extraction logic.
	 *
	 * @param {Object|Array} result - Input data to scan
	 * @returns {[Array<string>, Array<any>]} Tuple of [keysArray, valuesArray]
	 * @private
	 */
	_consolidateData(result, options = {}) {
		const zozbieraneData = this._getValuesAndKeysArray(result,options)
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

	/**
	 * Recursively search `data` for the first occurrence of `hladanaHodnota` and
	 * return the key/value structure that contains it.
	 *
	 * @param {Object} data - Object to search
	 * @param {*} hladanaHodnota - Value to find
	 * @returns {Object|null} Object containing the found key/value or null if not found
	 * @private
	 */
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

	/**
	 * Determine whether values in an object are primitive types (number, boolean, string).
	 * Note: original implementation references an `obj` variable; callers should
	 * ensure the required input is available or this method may throw.
	 *
	 * @returns {Array<RegExpMatchArray|null>} Array of match results per value
	 * @private
	 */
	_isSingleObjectType(obj) {
		return this._getObjectValues(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/))
	}

	/**
	 * Produce a list of renamed keys for complex nested objects. This function
	 * inspects nested structures and creates unique, indexed key names like
	 * `parent_1`, `parent_2`, preserving a price/primitive key at the front when present.

	 * @param {Object} res - Input object to inspect and derive keys from
	 * @returns {Array<string>} Array of new key names
	 * @private
	 */
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

	/**
	 * Extract key/value pairs from a complex nested array/object structure and
	 * return a flat result object mapping renamed keys to corresponding values.
	 *
	 * @param {Object|Array} data - Input data to extract from
	 * @returns {Object} Flattened key/value mapping
	 * @private
	 */
	_extractValuesFromArray(data, options = {}) {
		const nepovolene = this._getDisallowed(data, Object.getOwnPropertyNames(this._extractPrimitiveToObject(data)[0]))
		this._removeDisallowed(data, Object.getOwnPropertyNames(this._extractPrimitiveToObject(nepovolene)[0]))
		const ky1 = this._renameKeysInComplexObject(data)
		const ky2 = this._consolidateData(data, options)[0]
		const jeto = [ky1, ky2]
		const val = this._consolidateData(data, options)[1]
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

	/**
	 * Prepare and (optionally) store key/value pairs into an environment store.
	 * Current implementation logs null keys and the provided key/value pairs
	 * to the console; integration points (e.g. pm.environment.set) are commented out.
	 *
	 * @param {Object} data - Source object to analyze for empty keys
	 * @param {Object} pouzFct - Key/value pairs to store (object of name->value)
	 * @private
	 */
	_storeKeyValuesToEnv(data, options = {}) {
		let prazdne = this._getValuesAndKeysArray(data,options)
			.flatMap((obj) => Object.keys(obj).reduce((acc, o) => obj[o] === null ? [...acc, o] : acc, []))
		prazdne = this._numberDuplicates(prazdne)
		//console.log(...prazdne,null);
		if (prazdne) {
			prazdne.forEach(element => {
				//console.log(element, null);
				//pm.environment.set(element,null);
			});
		}
		//if(prazdne) pm.environment.set(...prazdne,null);
		//pouzFct.push(primitivne)
		const retrieved = this._extractValuesFromArray(data, options)
		Object.entries(retrieved).forEach(([key, value]) => {
			if(!value) return
			if(!key) return
				console.log('element',value);
			//pm.environment.set(key,value);
			//console.log(key, value);
		})
	}
}
export default new ConsolidateData()