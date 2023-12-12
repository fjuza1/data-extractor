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
			friendNames: "Bob",
			age: 32
		}
	],
	meHow: [{
			fds: "Alice",
			as: 28
		},
		{
			fds: "Bob",
			as: 32
		}
	]
};
const AutomatizaciaResReq = {
	__ziskajObjektoveHodnoty(objekt) {
		return Object.values(objekt)
	},
	__pracaSoSluzbami(arr){
		return arr.forEach(element => {
			Object.entries(element).forEach(([key, val]) => {
				console.log(key, val);
			});
		})
	},
	__ziskajDatovePolia(pole) {
		return this.__ziskajObjektoveHodnoty(pole)
			.filter(datovyTyp => Array.isArray(datovyTyp))
			.reduce((arr, acc) => arr.concat(acc), [])
	},
	__ziskajKlucHodnotuZArr(datovePolia) {
		this.__pracaSoSluzbami(this.__ziskajDatovePolia(datovePolia))
	},
  __filtrujNedatovePolia (arr){
	return new Array(arr).filter(nedatovePole=>!Array.isArray(nedatovePole))
  }
};

/*
    pracaSArr(arr){
            arr.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            console.log(key, value)
        });
    })
*/
AutomatizaciaResReq.__ziskajKlucHodnotuZArr(response)
// let skuska = {
//   __ziskajKlucHodnotuZArr:AutomatizaciaResReq.__ziskajObjektoveHodnoty
// }
// console.dir(skuska.__ziskajKlucHodnotuZArr(response)
//   )
