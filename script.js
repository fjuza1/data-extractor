// Polyfill for Object.create
if (typeof Object.create !== 'function') {
    Object.create = function(o, props) {
     function F() {}
     F.prototype = o;
     result = new F();
     if (typeof(props) === "object") {
      for (prop in props) {
       if (props.hasOwnProperty((prop))) {
        result[prop] = props[prop].value;
       }
      }
     }
     return result;
    };
   }

// Your existing code
function ZiskDatZoServisov() {
    this.zaciatok = 'Dec 13, 2023';
}

ZiskDatZoServisov.prototype.ziskajObjektoveHodnoty = function(objekt) {
    if (objekt === undefined || objekt === null) return;
    var values = [];
    for (var key in objekt) {
        if (objekt.hasOwnProperty(key)) {
            values.push(objekt[key]);
        }
    }
    return values;
};

ZiskDatZoServisov.prototype.ziskajObjektoveKluce = function(objekt) {
    var keys = [];
    for (var key in objekt) {
        if (objekt.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
};

ZiskDatZoServisov.prototype.jePrimitivna = function(obj) {
    return typeof obj !== 'object' || obj === null;
};

ZiskDatZoServisov.prototype.nieJePoleObjektov = function(array) {
    if (Array.isArray(array)) {
        return array.every(function(element) {
            return typeof element !== 'object';
        });
    }
};

ZiskDatZoServisov.prototype.ziskjJednTypyDatPoli = function(data) {
    var values = this.ziskajObjektoveHodnoty(data);
    var result = [];
    for (var i = 0; i < values.length; i++) {
        var element = values[i];
        if (!element) continue;
        if (this.nieJePoleObjektov(element)) {
            result = result.concat(element);
        }
    }
    return result;
};

ZiskDatZoServisov.prototype.ziskajPrimitivneDoObjektu = function(obj) {
    var objekt = {};
    var keys = this.ziskajObjektoveKluce(obj);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = obj[key];
        if (this.jePrimitivna(value)) {
            objekt[key] = value;
        }
    }
    return [objekt];
};

ZiskDatZoServisov.prototype.ziskajNestedObj = function(res) {
    var values = this.ziskajObjektoveHodnoty(res);
    var result = [];
    for (var i = 0; i < values.length; i++) {
        var v = values[i];
        if (v instanceof Object) {
            result = result.concat(this.ziskajObjektoveHodnoty(v));
        } else {
            result.push(v);
        }
    }
    var finalResult = [];
    for (var j = 0; j < result.length; j++) {
        var cur = result[j];
        if (typeof cur === 'object') {
            finalResult.push(cur);
        }
    }
    return finalResult;
};

ZiskDatZoServisov.prototype.ziskajJednoducheObjekty = function(data) {
    if (!Array.isArray(data)) {
        var values = this.ziskajObjektoveHodnoty(data);
        var result = [];
        for (var i = 0; i < values.length; i++) {
            var cur = values[i];
            if (cur && typeof cur === 'object' && !Array.isArray(cur) || cur === null && this.ziskajObjektoveHodnoty(cur).every(function(value) {
                    return typeof value !== 'object';
                })) {
                result.push(cur);
            }
        }
        return result;
    } else {
        var values = this.ziskajObjektoveHodnoty(data);
        var result = [];
        for (var i = 0; i < values.length; i++) {
            var cur = values[i];
            if (cur && typeof cur === 'object' || Array.isArray(data) || cur === null && !Array.isArray(cur) && this.ziskajObjektoveHodnoty(cur).every(function(value) {
                    return typeof value !== 'object';
                })) {
                result.push(cur);
            }
        }
        return result;jePrimitivna
    }
};

ZiskDatZoServisov.prototype.ziskjHodnKlucDoArr = function(data) {
    var primitivne = this.ziskajPrimitivneDoObjektu(data);
    var vnoreneObjekty = this.ziskajNestedObj(data);
    var jednoducheObjekty = this.ziskajJednoducheObjekty(data);
    var values = this.ziskajObjektoveHodnoty(data);
    var lord = [];
    for (var i = 0; i < values.length; i++) {
        var cur = values[i];
        if (cur && !Array.isArray(cur) && this.ziskajObjektoveHodnoty(cur).some(function(value) {
                return Array.isArray(value);
            })) {
            lord.push(cur);
        }
    }
    var jednoducheArr = this.ziskjJednTypyDatPoli(data);
    var arr = primitivne.concat(vnoreneObjekty, jednoducheObjekty);
    if (jednoducheArr.length > 0) arr = arr.concat(jednoducheArr);
    var result = [];
    for (var j = 0; j < arr.length; j++) {
        var cur = arr[j];
        if (cur && Object.keys(cur).length > 0) {
            result.push(cur);
        }
    }
    return result;
};

function SpracovanieDat() {
    ZiskDatZoServisov.call(this);
}

SpracovanieDat.prototype = Object.create(ZiskDatZoServisov.prototype);
SpracovanieDat.prototype.constructor = SpracovanieDat;

SpracovanieDat.prototype.ocislujDuplikaty = function(obj) {
    var i = 1;
    if (Array.isArray(obj)) {
        var cislaNecisla = obj.reduce(function(acc, cur) {
                var original = cur;
                while (acc.indexOf(cur) !== -1) {
                    i++;
                    cur = original + i;
                }
                i = 1;
                return acc.concat(cur);
            }, [])
            .map(function(cislaNecisla) {
                return !(/\d/).test(cislaNecisla) ? cislaNecisla + "1" : cislaNecisla;
            });
        return cislaNecisla;
    }
    return obj;
};

SpracovanieDat.prototype.ziskjNepovolene = function(data, nepovolene) {
    var extracted = {};
    for (var key in data) {
        if (data.hasOwnProperty(key) && nepovolene.indexOf(key) !== -1) {
            extracted[key] = data[key];
        }
    }
    return extracted;
};

SpracovanieDat.prototype.odstranNepovolene = function(data, nepovolene) {
    for (var key in data) {
        if (data.hasOwnProperty(key) && nepovolene.indexOf(key) !== -1) {
            delete data[key];
        }
    }
};

SpracovanieDat.prototype.zjednotitData = function(result) {
    var zozbieraneData = this.ziskjHodnKlucDoArr(result);
    var arrKluc = [];
    var arrHodnota = [];
    for (var i = 0; i < zozbieraneData.length; i++) {
        var obj = zozbieraneData[i];
        if (obj === undefined || obj === null) continue;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var val = obj[key];
                if (Array.isArray(val)) {
                    if (this.nieJePoleObjektov(val)) {
                        val = val;
                    } else {
                        val = [];
                    }
                }
                if (typeof val === 'object') {
                    for (var k in val) {
                        if (val.hasOwnProperty(k)) {
                            if (Array.isArray(val)) {
                                if (this.nieJePoleObjektov(val)) {
                                    val = val;
                                } else {
                                    val = [];
                                }
                            }
                            arrKluc.push(key);
                            var element = val[k];
                            arrHodnota.push(element);
                            if (typeof element !== 'object') return;
                        }
                    }
                }
                if (typeof val !== 'object') {
                    arrKluc.push(key);
                    arrHodnota.push(val);
                }
            }
        }
    }
    return [arrKluc, arrHodnota];
};

SpracovanieDat.prototype.ziskajObjektPodlaHodnoty = function(data, hladanaHodnota) {
    var keys = this.ziskajObjektoveKluce(data);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = data[key];
        if (value === hladanaHodnota) {
            var result = {};
            result[key] = value;
            return result;
        }
        if (typeof value === 'object' && value !== null) {
            var vnoreneRes = this.ziskajObjektPodlaHodnoty(value, hladanaHodnota);
            if (vnoreneRes) {
                var nestedResult = {};
                nestedResult[key] = vnoreneRes;
                return nestedResult;
            }
        }
    }
    return null;
};

SpracovanieDat.prototype.jeJednObj = function(obj) {
    var values = this.ziskajObjektoveHodnoty(obj);
    var result = [];
    for (var i = 0; i < values.length; i++) {
        var element = values[i];
        result.push((typeof element).match(/(number)|(boolean)|(string)/));
    }
    return result;
};

SpracovanieDat.prototype.menNazKlucZlozObj = function(res) {
    var array = [];
    var objektove = [];
    var naVyhladanie = this.zjednotitData(res)[1];
    var vyhladane = [];
    for (var i = 0; i < naVyhladanie.length; i++) {
        var item = naVyhladanie[i];
        vyhladane.push(this.ziskajObjektPodlaHodnoty(res, item));
    }
    for (var i = 0; i < vyhladane.length; i++) {
        var val = vyhladane[i];
        for (var kys in val) {
            if (val.hasOwnProperty(kys)) {
                var element = val[kys];
                if (typeof element === 'string') return;
                for (var ky in element) {
                    if (element.hasOwnProperty(ky)) {
                        if (!isNaN(+ky)) {
                            ky = +ky + 1;
                        }
                        array.push(kys + "_" + ky);
                    }
                }
            }
        }
    }
    var price = Object.entries(this.ziskajPrimitivneDoObjektu(res)[0])[0];
    if (price) array.unshift(price[0]);
    return array;
};

SpracovanieDat.prototype.ziskjHodnZArr = function(data) {
    var nepovolene = this.ziskjNepovolene(data, Object.getOwnPropertyNames(this.ziskajPrimitivneDoObjektu(data)[0]));
    this.odstranNepovolene(data, Object.getOwnPropertyNames(this.ziskajPrimitivneDoObjektu(nepovolene)[0]));
    var ky1 = this.menNazKlucZlozObj(data);
    var ky2 = this.zjednotitData(data)[0];
    var jeto = [ky1, ky2];
    var val = this.zjednotitData(data)[1];
    var ziskjHodn = function(ky1, ky2) {
        var key1 = ky1.flat();
        var key2 = ky2.flat();
        var spojene = key1.map(function(item, i) {
            var string = item + "_" + key2[i];
            string = Array.from(new Set(Object.values(string.split('_'))));
            return string.join('_');
        });
        return spojene;
    };
    var zbavSa = ziskjHodn(ky1, ky2);
    var brasil = zbavSa.map(function(item) {
        return item
            .split('_')
            .map(function(part, index) {
                return (index > 0 && !isNaN(part) ? part : index === 0 ? part : "_" + part);
            })
            .join('');
    });
    var result = {};
    for (var i = 0; i < brasil.length; i++) {
        var key = brasil[i];
        result[key] = val[i];
    }
    for (var key in nepovolene) {
        result[key] = nepovolene[key];
    }
    return result;
};

SpracovanieDat.prototype.ulozKlHdnDoProstr = function(data, pouzFct) {
    var nullove = this.ziskjHodnKlucDoArr(data)
        .flatMap(function(obj) {
            return Object.keys(obj).reduce(function(acc, o) {
                return obj[o] === null ? acc.concat(o) : acc;
            }, []);
        });
    nullove = this.ocislujDuplikaty(nullove);
    if (nullove) {
        for (var i = 0; i < nullove.length; i++) {
            var element = nullove[i];
            console.log(element, null);
        }
    }
    for (var key in pouzFct) {
        if (pouzFct.hasOwnProperty(key)) {
            console.log(key, pouzFct[key]);
        }
    }
};
