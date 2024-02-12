'use strict'
let odpoved = {
    "state": {
        "internalCode": 0,
        "code": 200,
        "description": "API/Kalendar_Sviatkov/Kalendar_Sviatkov_G2_Get: Spracovanie prebehlo v poriadku. Systém podkračuje v ďalšom spracovaní."
    },
    "cis_Udalost_Kalendar_Sviatkov": [],
    "e_Dodrzany_Rozpocet_Eur": [],
    "e_Dodrzany_Rozpocet_Md": [],
    "e_Dodrzany_Termin": [],
    "e_Dostatok_Zdrojov": [],
    "e_Druh_Zaznamu": [],
    "e_Druh_Zmluvy": [],
    "e_Profesia": [],
    "e_Projekt_Nacas": [],
    "e_Projekt_Vramci_Rozpoctu": [],
    "e_Stav_Spracovania": [],
    "e_Stav_Zazmluvnenia": [],
    "e_Stav_Zmluvy": [],
    "e_Typ_Sviatku": [],
    "e_Typ_Zmluvneho_Partnera": [],
    "e_Typ_Zmluvy": [],
    "e_Zdroj_Dat": [],
    "firma": [],
    "kalendar_Sviatkov": [
        {
            "kalendaR_SVIATKOV_ID": 118,
            "ciS_UDALOST_KALENDAR_SVIATKOV_ID": 1,
            "ciS_UDALOST_KALENDAR_SVIATKOV_ID___NAZOV": null,
            "datuM_SVIATKU": "2026-06-20T00:00:00",
            "datumvytvorenia": "2024-02-09T00:00:00",
            "datumzmeny": "2024-02-09T00:00:00",
            "vytvoril": "a44ff19c-2c9d-4f03-8541-920fca962b34",
            "zmenil": "2ee0ede7-7a0b-46d6-bcdc-a46e4dac840d"
        }
    ],
    "kod_Opravnenia": [],
    "kod_Skupiny": [],
    "kod_Skupiny_Priradenie": [],
    "profit_Acl_Firma_Pracovnik": [],
    "profit_Acl_Firma_Profesia": [],
    "projekt_Cislo": [],
    "projektovy_Tim": [],
    "stredisko": [],
    "uct_Kategoria": [],
    "uct_Ucet": [],
    "zmluvny_Partner": [],
    "metadata": [],
    "correlationId": "5fd30fbe-f47b-4ea1-b123-ba2567a8334b"
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
		} else {
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
	const jeto = [ky1, ky2]
	const val = this.__zjednotitData(odpoved)[1]
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
spracovanieDát.__ulozKlHdnDoProstr = function (odpoved,pouzFct){
    Object.entries(pouzFct).forEach(([key,value])=>{
		if(value === undefined && value !==null) return;
		//console.log(key,value);
        //pm.environment.set(key,value);
    })
}
// /*\
//  */
 spracovanieDát.__ulozKlHdnDoProstr(odpoved,spracovanieDát.__ziskjHodnZArr(odpoved))