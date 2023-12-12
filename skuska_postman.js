'use strict'
let response = {
	name: "John Doe",
	age: 30,
	address: {
		street: "123 Main St",
		city: "Anytown",
		country: "USA"
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
	__zaplnPole(){}
	__ziskajDatovePolia(pole) {
		return this.__ziskajObjektoveHodnoty(pole)
			.filter(datovyTyp => Array.isArray(datovyTyp))
			.reduce((arr, acc) => arr.concat(acc), [])
	},
	__spracovanieVstupnychDat(element){
		return 	Object.entries(element).forEach(([key, val]) => {
			if (Array.isArray(key) && Array.isArray(val)) return
			console.log(key, val);
		});
	},
	__ziskajKlucHodnotuZArr(datovePolia) {
		this.__ziskajDatovePolia(datovePolia)
			.forEach(element => {
				if (Array.isArray(element)) return;
				this.__spracovanieVstupnychDat(element)
			})
	},
  ziskajNedatovePolia (){

  }
};
AutomatizaciaResReq.__ziskajKlucHodnotuZArr(response)
// let skuska = {
//   __ziskajKlucHodnotuZArr:AutomatizaciaResReq.__ziskajObjektoveHodnoty
// }
// console.dir(skuska.__ziskajKlucHodnotuZArr(response)
//   )
