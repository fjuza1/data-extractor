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
			"name": "infinitbility"
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

spracovanieDát.__ulozKlucHodnotu = function(result) {
	const arr = []
	result.forEach(obj => {
		Object.entries(obj).forEach(([key, val]) => {
			arr[arr.length] = [key, val]
		});
	});
	return arr;
}
const data = spracovanieDát.__ulozKlucHodnotu(result)
console.log("🚀 ~ file: skuska_postman.js:105 ~ data:", data)
/*
spracovanieDát.__filtrujHodnotyObj = function(result){
    const objektoveHodnoty = spracovanieDát.__ulozKlucHodnotu(result)
    .filter(item=>typeof item === 'object' && !Array.isArray(item))
}
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