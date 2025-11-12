
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
			const uniqueWithSuffix = obj.reduce((acc, cur) => {
					const original = cur;
					while (acc.includes(cur)) {
						i++;
						cur = `${original}${i}`;
					}
					i = 1;
					return [...acc, cur];
				}, [])
				.map(item => !(/\d/).test(item) ? `${item}1` : `${item}`);
			return uniqueWithSuffix;
		}
		return obj;
	}
	/**
	 * Extract and return properties from `data` whose keys are listed in `disallowedKeys`.
	 *
	 * @param {Object} data - Source object
	 * @param {Array<string>} disallowedKeys - Array of disallowed keys to extract
	 * @returns {Object} Object containing the extracted disallowed key/value pairs
	 * @private
	 */
	_getDisallowed(data, disallowedKeys) {
		const extracted = {};
		Object.keys(data)
			.filter(key => disallowedKeys.includes(key))
			.forEach(key => extracted[key] = data[key])
		return extracted
	}

	/**
	 * Remove properties from `data` whose keys are listed in `disallowedKeys`.
	 * This mutates the provided object.
	 *
	 * @param {Object} data - Object to remove keys from (mutated)
	 * @param {Array<string>} disallowedKeys - Array of keys to remove
	 * @private
	 */
	_removeDisallowed(data, disallowedKeys) {
		Object.keys(data)
			.filter(key => disallowedKeys.includes(key))
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
	/**
	 * Helper: extract key-value pairs from a single value recursively.
	 * @private
	 */
	_extractKeyValuePairs(val, key, keysArray, valuesArray) {
		if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
			for (const nestedKey in val) {
				if (Object.prototype.hasOwnProperty.call(val, nestedKey)) {
					const element = val[nestedKey];
					keysArray.push(nestedKey);
					valuesArray.push(element);
					if (typeof element === 'object') return;
				}
			}
		} else if (typeof val !== 'object') {
			keysArray.push(key);
			valuesArray.push(val);
		}
	}

	_consolidateData(result, options = {}) {
		const collectedData = this._getValuesAndKeysArray(result, options)
		const keysArray = [];
		const valuesArray = []
		collectedData.forEach(obj => {
			if (obj === undefined || obj === null) return
			Object.entries(obj).forEach(([key, val]) => {
				this._extractKeyValuePairs(val, key, keysArray, valuesArray);
			});
		});
		return [keysArray, valuesArray]
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
	/**
	 * Helper: build key names from nested object properties.
	 * @private
	 */
	_buildKeyNamesFromElement(element, parentKey, array) {
		for (let ky in element) {
			if (Object.prototype.hasOwnProperty.call(element, ky)) {
				if (!isNaN(+ky)) {
					ky = +ky + 1;
				}
				array.push(`${parentKey}_${ky}`);
			}
		}
	}

	_renameKeysInComplexObject(res) {
		let array = [];
		const searchValues = this._consolidateData(res)[1];
		const foundObjects = searchValues.map(item => this._getObjectByValue(res, item));
		foundObjects.forEach(val => {
			for (const parentKey in val) {
				if (Object.prototype.hasOwnProperty.call(val, parentKey)) {
					const element = val[parentKey];
					if (typeof element === 'string') return;
					this._buildKeyNamesFromElement(element, parentKey, array);
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
		const disallowed = this._getDisallowed(data, Object.getOwnPropertyNames(this._extractPrimitiveToObject(data)[0]))
		this._removeDisallowed(data, Object.getOwnPropertyNames(this._extractPrimitiveToObject(disallowed)[0]))
		const renamedKeys = this._renameKeysInComplexObject(data)
		// Cache the consolidated data to avoid triple-calling
		const consolidatedData = this._consolidateData(data, options)
		const consolidatedKeys = consolidatedData[0]
		const consolidatedValues = consolidatedData[1]
		const mergeKeyPairs = (renamedKeys, consolidatedKeys) => {
			const flatRenamedKeys = renamedKeys.flat();
			const flatConsolidatedKeys = consolidatedKeys.flat();
			const mergedKeys = flatRenamedKeys.map((item, i) => {
				let keyString = `${item}_${flatConsolidatedKeys[i]}`
				keyString = Array.from(new Set(Object.values(keyString.split('_'))))
				return keyString.join('_')
			})
			return mergedKeys
		}
		const mergedKeysList = mergeKeyPairs(renamedKeys, consolidatedKeys)
		const finalKeys = mergedKeysList.map(item => {
			return item
				.split('_')
				.map((part, index) => (index > 0 && !isNaN(part) ? part : index === 0 ? part : `_${part}`))
				.join('');
		});
		const result = {};
		finalKeys.forEach((key, index) => {
			result[key] = consolidatedValues[index];
		});
		Object.keys(disallowed).forEach((key) => result[key] = disallowed[key]);
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
		let emptyKeys = this._getValuesAndKeysArray(data, options)
			.flatMap((obj) => Object.keys(obj).reduce((acc, o) => obj[o] === null ? [...acc, o] : acc, []))
		emptyKeys = this._numberDuplicates(emptyKeys)
		//console.log(...emptyKeys,null);
		if (emptyKeys) {
			emptyKeys.forEach(element => {
				//console.log(element, null);
				//pm.environment.set(element,null);
			});
		}
		//if(emptyKeys) pm.environment.set(...emptyKeys,null);
		const extractedValues = this._extractValuesFromArray(data, options)
		Object.entries(extractedValues).forEach(([key, value]) => {
			if(!value) return
			if(!key) return
				console.log('element',value);
			//pm.environment.set(key,value);
			//console.log(key, value);
		})
	}
}
export default new ConsolidateData()