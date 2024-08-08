var ZiskDatZoServisov = {
	__ziskajObjektoveHodnoty: function (objekt) {
	  if (objekt === undefined || objekt === null) return;
	  return Object.values(objekt);
	},
	__ziskajObjektoveKluce: function (objekt) {
	  return Object.keys(objekt);
	},
	__jePrimitivna: function (obj) {
	  return typeof obj !== "object" || obj === null;
	},
	__nieJePoleObjektov: function(array) {
		Array.isArray(array) ? array.every(element => typeof element !== "object") : null
	},
	__ziskjJednTypyDatPoli: function (data) {
	  return this.__ziskajObjektoveHodnoty(data).flatMap(element => {
		if (!element) return [];
		return this.__nieJePoleObjektov(element) ? [...element] : [];
	  });
	},
	__ziskajPrimitivneDoObjektu: function (obj) {
	  let objekt = {};
	  this.__ziskajObjektoveKluce(obj).forEach(polozka => {
		var key = obj[polozka];
		this.__jePrimitivna(key) ? objekt[polozka] = key : null;
	  });
	  return [objekt];
	},
	__ziskajNestedObj: function (res) {
	  return this.__ziskajObjektoveHodnoty(res).map(v => v instanceof Object ? this.__ziskajObjektoveHodnoty(v) : [v]).reduce((acc, next) => acc.concat(...next), []).reduce((acc, cur) => typeof cur === "object" ? [...acc, cur] : acc, []);
	},
	__ziskajJednoducheObjekty: function (data) {
	  if (!Array.isArray(data)) {
		return this.__ziskajObjektoveHodnoty(data).reduce((acc, cur, i, arr) => cur && typeof cur === "object" && !Array.isArray(cur) || cur === null && this.__ziskajObjektoveHodnoty(cur).every(value => typeof value !== "object") ? [...acc, cur] : acc, []);
	  } else {
		return this.__ziskajObjektoveHodnoty(data).reduce((acc, cur, i, arr) => cur && typeof cur === "object" || Array.isArray(arr) || cur === null && !Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).every(value => typeof value !== "object") ? [...acc, cur] : acc, []);
	  }
	},
	__ziskjHodnKlucDoArr: function (data) {
	  var primitivne = this.__ziskajPrimitivneDoObjektu(data);
	  var vnoreneObjekty = this.__ziskajNestedObj(data);
	  var jednoducheObjekty = this.__ziskajJednoducheObjekty(data);
	  var lord = this.__ziskajObjektoveHodnoty(data).reduce((acc, cur) => cur && !Array.isArray(cur) && this.__ziskajObjektoveHodnoty(cur).some(value => Array.isArray(value)) ? [...acc, cur] : acc, []);
	  let jednoducheArr = this.__ziskjJednTypyDatPoli(data);
	  let arr;
	  arr = [...primitivne, ...vnoreneObjekty, ...jednoducheObjekty];
	  if (jednoducheArr.length > 0) arr = [...arr, jednoducheArr];
	  return arr.reduce((acc, cur) => cur && !Object.keys(cur).length < 1 ? [...acc, cur] : acc, []);
	}
  };
  
  var SpracovanieDat = Object.create(ZiskDatZoServisov);
  
  SpracovanieDat.__ocislujDuplikaty = function (obj) {
	let i = 1;
	if (Array.isArray(obj)) {
	  var cislaNecisla = obj.reduce((acc, cur) => {
		var original = cur;
		while (acc.includes(cur)) {
		  i++;
		  cur = `${original}${i}`;
		}
		i = 1;
		return [...acc, cur];
	  }, []).map(cislaNecisla => !/\d/.test(cislaNecisla) ? `${cislaNecisla}1` : `${cislaNecisla}`);
	  return cislaNecisla;
	}
	return obj;
  };
  
  SpracovanieDat.__ziskjNepovolene = function (data, nepovolene) {
	var extracted = {};
	Object.keys(data).filter(key => nepovolene.includes(key)).forEach(key => extracted[key] = data[key]);
	return extracted;
  };
  
  SpracovanieDat.__odstranNepovolene = function (data, nepovolene) {
	Object.keys(data).filter(key => nepovolene.includes(key)).forEach(key => delete data[key]);
  };
  
  SpracovanieDat.__zjednotitData = function (result) {
	var zozbieraneData = this.__ziskjHodnKlucDoArr(result);
	var arrKluc = [];
	var arrHodnota = [];
	zozbieraneData.forEach(obj => {
	  if (obj === undefined || obj === null) return;
	  Object.entries(obj).forEach(([key, val]) => {
		if (Array.isArray(val)) {
		  this.__nieJePoleObjektov(val) ? val : [];
		}
		if (typeof val === "object") {
		  for (var key in val) {
			if (Object.hasOwnProperty.call(val, key)) {
			  if (Array.isArray(val)) {
				this.__nieJePoleObjektov(val) ? val : [];
			  }
			  arrKluc.push(key);
			  var element = val[key];
			  arrHodnota.push(element);
			  if (typeof element !== "object") return;
			}
		  }
		}
		if (typeof val !== "object") {
		  arrKluc.push(key);
		  arrHodnota.push(val);
		}
	  });
	});
	return [arrKluc, arrHodnota];
  };
  
  SpracovanieDat.__ziskajObjektPodlaHodnoty = function (data, hladanaHodnota) {
	var keys = this.__ziskajObjektoveKluce(data);
	for (var key of keys) {
	  var value = data[key];
	  if (value === hladanaHodnota) {
		return {
		  [key]: value
		};
	  }
	  if (typeof value === "object" && value !== null) {
		var vnoreneRes = this.__ziskajObjektPodlaHodnoty(value, hladanaHodnota);
		if (vnoreneRes) {
		  return {
			[key]: vnoreneRes
		  };
		}
	  }
	}
	return null;
  };
  
  SpracovanieDat.__jeJednObj = function (obj) {
	return this.__ziskajObjektoveHodnoty(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/));
  };
  
  SpracovanieDat.__menNazKlucZlozObj = function (res) {
	let array = [];
	let objektove = [];
	var naVyhladanie = this.__zjednotitData(res)[1];
	var vyhladane = naVyhladanie.map(item => this.__ziskajObjektPodlaHodnoty(res, item));
	vyhladane.forEach(val => {
	  for (var kys in val) {
		if (Object.hasOwnProperty.call(val, kys)) {
		  var element = val[kys];
		  if (typeof element === "string") return;
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
	var price = Object.entries(this.__ziskajPrimitivneDoObjektu(res)[0])[0];
	if (price) array.unshift(price[0]);
	return array;
  };
  
  SpracovanieDat.__ziskjHodnZArr = function (data) {
	var nepovolene = this.__ziskjNepovolene(data, Object.getOwnPropertyNames(this.__ziskajPrimitivneDoObjektu(data)[0]));
	this.__odstranNepovolene(data, Object.getOwnPropertyNames(this.__ziskajPrimitivneDoObjektu(nepovolene)[0]));
	var ky1 = this.__menNazKlucZlozObj(data);
	var ky2 = this.__zjednotitData(data)[0];
	var jeto = [ky1, ky2];
	var val = this.__zjednotitData(data)[1];
	var ziskjHodn = (ky1, ky2) => {
	  var key1 = ky1.flat();
	  var key2 = ky2.flat();
	  var spojene = key1.map((item, i) => {
		let string = `${item}_${key2[i]}`;
		string = Array.from(new Set(Object.values(string.split("_"))));
		return string.join("_");
	  });
	  return spojene;
	};
	var zbavSa = ziskjHodn(ky1, ky2);
	var brasil = zbavSa.map(item => {
	  return item.split("_").map((part, index) => index > 0 && !isNaN(part) ? part : index === 0 ? part : `_${part}`).join("");
	});
	var result = {};
	brasil.forEach((key, index) => {
	  result[key] = val[index];
	});
	Object.keys(nepovolene).forEach(key => result[key] = nepovolene[key]);
	return result;
  };
  
  SpracovanieDat.__ulozKlHdnDoProstr = function (data, pouzFct) {
	let nullove = this.__ziskjHodnKlucDoArr(data).flatMap(obj => Object.keys(obj).reduce((acc, o) => obj[o] === null ? [...acc, o] : acc, []));
	nullove = this.__ocislujDuplikaty(nullove);
	//console.log(...nullove,null);
	if (nullove) {
	  nullove.forEach(element => {
		console.log(element, null);
		//pm.environment.set(element,null);
	  });
	}
	//if(nullove) pm.environment.set(...nullove,null);
	//pouzFct.push(primitivne)
	Object.entries(pouzFct).forEach(([key, value]) => {
	  //pm.environment.set(key,value);
	  console.log(key, value);
	});
  };
var ziskDatZoServisov = new ZiskDatZoServisov();
var spracovanieDat = new SpracovanieDat();
context.setProperty("ziskDatZoServisov", ziskDatZoServisov);
context.setProperty("spracovanieDat", spracovanieDat);