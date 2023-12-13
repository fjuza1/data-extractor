'use strict'
let response = {
	name: "John Doe",
	age: 30,
	address: {
		street: "123 Main St",
		city: "Anytown",
		country: "USA"
	},
	person: {
		firstName: "John",
		lastName: "Doe",
		age: 50,
		eyeColor: "blue",
		x:{type:"Fiat", model:"500", color:"white"},
		address: {
			street: "123 Main St",
			city: "Anytown",
			country: "USA",
		},
	},
	friends: [{
			friendNames: "Alice",
			age: 28
		},
		{
			friendNamez: "Bob",
			age: 32
		}
	],
	meHow: [{
			fds: "Alice",
			as: 28
		},
		{
			dfgfdg: "Bob",
			dfg: 32
		}
	]
};
const AutomatizaciaResReq = {
	__ziskajObjektoveHodnoty(objekt) {
		return Object.values(objekt)
	},
	__ziskajObjektoveKluce(objekt) {
		return Object.keys(objekt)
	},
	__ziskajVsetkyObjekty(res){
			return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? Object.values(v) : [v])
			.reduce((acc, next) => acc.concat(...next), [])
			.filter(obj=>typeof obj === 'object')
	}
};
const vsetkyObjekty = AutomatizaciaResReq.__ziskajVsetkyObjekty(response)
// console.log("🚀 ~ file: skuska_postman.js:54 ~ vsetkyObjekty:", vsetkyObjekty)
/*
console.log(Object.keys(response));
for (const key in response) {
	if (Object.hasOwnProperty.call(response, key)) {
		const element = Object.values(response[key]).filter(item=>typeof item !== 'object' && !Array.isArray(item))
		if(!element.length === []) return
		console.log("🚀 ~ file: skuska_postman.js:59 ~ element:", element)
	}
}*/
console.log(Object.values(response).map(v => !(v instanceof Object)));