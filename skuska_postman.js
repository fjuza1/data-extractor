'use strict'
/*
Object.entries(polozka).forEach(([key, value]) => {
    console.log(key, value)
})
*/
let odpoved = {
	"reaction": {
		"sts": "<integer>",
		"msg": "<string>"
	},
	"User": [{
		"Email": "<string>",
		"Username": "<string>",
		"Gender_id": "<integer>"
	}, ],
	"service": [{
		"name": "restservice",
		"device": "xr-1",
		"interface-port": "0/0/2/3",
		"interface-description": "uBot testing for NSO REST",
		"addr": "10.10.1.3/24",
		"mtu": 1024
	}],
	"person": {
		"male": {
			"name": "infinitbility",
					"male": {
			"names": "infinitbilities"
		}
		},
		"female": {
			"name": "aguidehub"
		}
	},
	"reactionID": "5484484898448948"
}
const ZískavanieDátZoSlužieb = {
	'začiatok': 'Dec 13, 2023 ',
	__ziskajObjektoveHodnoty(objekt) {
		return Object.values(objekt)
	},
	__ziskajObjektoveKluce(objekt) {
		return Object.keys(objekt)
	},
	__jePrimitivna(obj) {
		return typeof obj !== 'object'
	},
	__ziskajPrimitivneDoObjektu(obj) {
		let objekt = {};
		this.__ziskajObjektoveKluce(obj)
			.forEach(polozka => {
				const key = obj[polozka];
				this.__jePrimitivna(key) ? objekt[polozka] = key : []
			})
		return objekt
	},
	__ziskajNestedObj(res) {
		return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.__ziskajObjektoveHodnoty(v) : [v])
			.reduce((acc, next) => acc.concat(...next), [])
			.filter(obj => typeof obj === 'object')
	},
	__ziskajJednoducheObjekty(odpoved) {
		const array = []
		Object.values(odpoved)
			.filter((polozka) => typeof polozka === 'object' && !Array.isArray(polozka))
			.forEach((obj) => {
				Object.entries(obj).forEach(([key, value]) => {
					value ? array[array.length] = {
						[key]: value
					} : []
				});
			});
		return array
	},
	__ziskajUdaje(odpoved) {
		const primitivne = [this.__ziskajPrimitivneDoObjektu(odpoved)];
		const vnoreneObjekty = this.__ziskajNestedObj(odpoved)
		const jednoducheObjekty = this.__ziskajJednoducheObjekty(odpoved)
		let arr;
		primitivne.length > 0 || vnoreneObjekty.length > 0 || jednoducheObjekty.length > 0 ?
			arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty] :
			arr = vnoreneObjekty
		const elementArr = []
		arr.forEach(element => {
			const oibjekty = this.__ziskajObjektoveHodnoty(element).length === 0
			elementArr[elementArr.length] = oibjekty
		})
		return arr.slice(elementArr.indexOf(true) + 1)
	},
};
const result = ZískavanieDátZoSlužieb.__ziskajUdaje(odpoved);
const spracovanieDát = Object.create(ZískavanieDátZoSlužieb)
/*
Priklad
*/

spracovanieDát.zjednotitData = function(result) {
	const arrZozbierane = ZískavanieDátZoSlužieb.__ziskajUdaje(result)
	const arrKluc = [];
	const arrHodnota = []
	arrZozbierane.forEach(obj => {
		Object.entries(obj).forEach(([key, val]) => {
				while (typeof val === 'object') {
					for (const key in val) {
						if (Object.hasOwnProperty.call(val, key)) {
							arrKluc.push(key)
							const element = val[key];
							arrHodnota.push(element)
							// console.log("🚀 ~ file: skuska_postman.js:102 ~ Object.entries ~ element:", element)
							if (typeof element !== 'object') return;
						}
					}
				}
				if(typeof val !== 'object'){
					arrKluc.push(key)
					arrHodnota.push(val)
					// console.log("🚀 ~ file: skuska_postman.js:110 ~ Object.entries ~ val:", [key, val])
					}
		});
	});
	return [arrKluc,arrHodnota]
}
const data = spracovanieDát.zjednotitData(odpoved)
console.log("🚀 ~ file: skuska_postman.js:125 ~ data:", data)
// spracovanieDát.__filtrujHodnotyObj = function(result){
//     const objektoveHodnoty = spracovanieDát.zjednotitData(result)
// 	objektoveHodnoty.forEach(element => {
// 		const kluc = element[0]
// 		const hodnota = element[1]
// 		if(typeof hodnota === 'object'){

// 		}
// 	});
// }
// spracovanieDát.__filtrujHodnotyObj(result)
/*
*/
// PRiklad
// console.log("🚀 ~ file: skuska_postman.js:85 ~ result:", Object.getOwnPropertyNames(result[8]))
/*
spracovanieDát.__najdiDuplikat = function (){
    return odpoved
} */
// const duplikatyPrec = [...best.reduce((acc,cur) =>acc.includes(cur)?acc: [...acc,cur],[]) ]
// console.log("🚀 ~ file: skuska_postman.js:283 ~ duplikatyPrec:", duplikatyPrec)
//spracovanieDát.__hodnotaJeObjekt