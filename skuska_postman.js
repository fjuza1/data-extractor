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
	__ziskajDatovePolia(pole) {
		return this.__ziskajObjektoveHodnoty(pole)
			.filter(datovyTyp => Array.isArray(datovyTyp))
			.reduce((arr, acc) => arr.concat(acc), [])
	},
	__ziskajKlucHodnotuZArr(datovePolia) {
		this.__ziskajDatovePolia(datovePolia)
			.forEach(element => {
				if (Array.isArray(element)) return;
				Object.entries(element).forEach(([key, val]) => {
					if (Array.isArray(key) && Array.isArray(val)) return
					console.log(key, val);
				});
			})
	},
	__ziskajNedatovePolia(res) {
		const arr = new Array();
		this.__ziskajObjektoveKluce(res).forEach(item => {
			const hodnoty = res[item]
			typeof hodnoty === 'object' && !Array.isArray(hodnoty) ? arr[arr.length] = hodnoty : false;
		})
		return arr
	}
};

function x(){
	for (const key in response.person) {
		if (Object.hasOwnProperty.call(response.person, key)) {
			const element = response.person[key];
			return element
		}
	}
}
console.log(x());