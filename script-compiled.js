function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var ZiskDatZoServisov = {
  zaciatok: 'Dec 13, 2023 ',
  __ziskajObjektoveHodnoty: function __ziskajObjektoveHodnoty(objekt) {
    if (objekt === undefined || objekt === null) return [];
    return Object.values(objekt);
  },
  __ziskajObjektoveKluce: function __ziskajObjektoveKluce(objekt) {
    return Object.keys(objekt);
  },
  __jePrimitivna: function __jePrimitivna(obj) {
    return _typeof(obj) !== 'object' || obj === null;
  },
  __nieJePoleObjektov: function __nieJePoleObjektov(array) {
    if (Array.isArray(array)) return array.every(function (element) {
      return _typeof(element) !== 'object';
    });
  },
  __ziskjJednTypyDatPoli: function __ziskjJednTypyDatPoli(data) {
    var _this = this;
    return this.__ziskajObjektoveHodnoty(data).flatMap(function (element) {
      if (!element) return [];
      return _this.__nieJePoleObjektov(element) ? [].concat(element) : [];
    });
  },
  __ziskajPrimitivneDoObjektu: function __ziskajPrimitivneDoObjektu(obj) {
    var _this2 = this;
    var objekt = {};
    this.__ziskajObjektoveKluce(obj).forEach(function (polozka) {
      var key = obj[polozka];
      if (_this2.__jePrimitivna(key)) objekt[polozka] = key;
    });
    return [objekt];
  },
  __ziskajNestedObj: function __ziskajNestedObj(res) {
    var _this3 = this;
    return this.__ziskajObjektoveHodnoty(res).map(function (v) {
      return v instanceof Object ? _this3.__ziskajObjektoveHodnoty(v) : [v];
    }).reduce(function (acc, next) {
      return acc.concat.apply(acc, _toConsumableArray(next));
    }, []).reduce(function (acc, cur) {
      return _typeof(cur) === 'object' ? [].concat(_toConsumableArray(acc), [cur]) : acc;
    }, []);
  },
  __ziskajJednoducheObjekty: function __ziskajJednoducheObjekty(data) {
    var _this4 = this;
    if (!Array.isArray(data)) {
      return this.__ziskajObjektoveHodnoty(data).reduce(function (acc, cur, i, arr) {
        return cur && _typeof(cur) === 'object' && (!Array.isArray(cur) || cur === null) && _this4.__ziskajObjektoveHodnoty(cur).every(function (value) {
          return _typeof(value) !== 'object';
        }) ? [].concat(_toConsumableArray(acc), [cur]) : acc;
      }, []);
    } else {
      return this.__ziskajObjektoveHodnoty(data).reduce(function (acc, cur, i, arr) {
        return cur && (_typeof(cur) === 'object' || Array.isArray(arr)) && !Array.isArray(cur) && _this4.__ziskajObjektoveHodnoty(cur).every(function (value) {
          return _typeof(value) !== 'object';
        }) ? [].concat(_toConsumableArray(acc), [cur]) : acc;
      }, []);
    }
  },
  __ziskjHodnKlucDoArr: function __ziskjHodnKlucDoArr(data) {
    var _this5 = this;
    var primitivne = this.__ziskajPrimitivneDoObjektu(data);
    var vnoreneObjekty = this.__ziskajNestedObj(data);
    var jednoducheObjekty = this.__ziskajJednoducheObjekty(data);
    var lord = this.__ziskajObjektoveHodnoty(data).reduce(function (acc, cur) {
      return cur && !Array.isArray(cur) && _this5.__ziskajObjektoveHodnoty(cur).some(function (value) {
        return Array.isArray(value);
      }) ? [].concat(_toConsumableArray(acc), [cur]) : acc;
    }, []);
    var jednoducheArr = this.__ziskjJednTypyDatPoli(data);
    var arr;
    arr = [].concat(_toConsumableArray(primitivne), _toConsumableArray(vnoreneObjekty), _toConsumableArray(jednoducheObjekty));
    if (jednoducheArr.length > 0) arr = [].concat(_toConsumableArray(arr), [jednoducheArr]);
    return arr.reduce(function (acc, cur) {
      return cur && Object.keys(cur).length > 0 ? [].concat(_toConsumableArray(acc), [cur]) : acc;
    }, []);
  }
};
var spracovanieDat = Object.create(ZiskDatZoServisov);
spracovanieDat.__ocislujDuplikaty = function (obj) {
  var i = 1;
  if (Array.isArray(obj)) {
    var cislaNecisla = obj.reduce(function (acc, cur) {
      var original = cur;
      while (acc.includes(cur)) {
        i++;
        cur = "".concat(original).concat(i);
      }
      i = 1;
      return [].concat(_toConsumableArray(acc), [cur]);
    }, []).map(function (cislaNecisla) {
      return !/\d/.test(cislaNecisla) ? "".concat(cislaNecisla, "1") : "".concat(cislaNecisla);
    });
    return cislaNecisla;
  }
  return obj;
};
spracovanieDat.__ziskjNepovolene = function (data, nepovolene) {
  var extracted = {};
  Object.keys(data).filter(function (key) {
    return nepovolene.includes(key);
  }).forEach(function (key) {
    return extracted[key] = data[key];
  });
  return extracted;
};
spracovanieDat.__odstranNepovolene = function (data, nepovolene) {
  Object.keys(data).filter(function (key) {
    return nepovolene.includes(key);
  }).forEach(function (key) {
    return delete data[key];
  });
};
spracovanieDat.__zjednotitData = function (result) {
  var _this6 = this;
  var zozbieraneData = this.__ziskjHodnKlucDoArr(result);
  var arrKluc = [];
  var arrHodnota = [];
  zozbieraneData.forEach(function (obj) {
    if (obj === undefined || obj === null) return;
    Object.entries(obj).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];
      if (Array.isArray(val)) {
        _this6.__nieJePoleObjektov(val) ? val : [];
      }
      if (_typeof(val) === 'object') {
        for (var k in val) {
          if (Object.hasOwnProperty.call(val, k)) {
            if (Array.isArray(val)) {
              _this6.__nieJePoleObjektov(val) ? val : [];
            }
            arrKluc.push(k);
            var element = val[k];
            arrHodnota.push(element);
            if (_typeof(element) !== 'object') return;
          }
        }
      }
      if (_typeof(val) !== 'object') {
        arrKluc.push(key);
        arrHodnota.push(val);
      }
    });
  });
  return [arrKluc, arrHodnota];
};
spracovanieDat.__ziskajObjektPodlaHodnoty = function (data, hladanaHodnota) {
  var keys = this.__ziskajObjektoveKluce(data);
  var _iterator = _createForOfIteratorHelper(keys),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;
      var value = data[key];
      if (value === hladanaHodnota) {
        return _defineProperty({}, key, value);
      }
      if (_typeof(value) === 'object' && value !== null) {
        var vnoreneRes = this.__ziskajObjektPodlaHodnoty(value, hladanaHodnota);
        if (vnoreneRes) {
          return _defineProperty({}, key, vnoreneRes);
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return null;
};
spracovanieDat.__jeJednObj = function (obj) {
  return this.__ziskajObjektoveHodnoty(obj).map(function (element) {
    return _typeof(element).match(/(number)|(boolean)|(string)/);
  });
};
spracovanieDat.__menNazKlucZlozObj = function (res) {
  var _this7 = this;
  var array = [];
  var naVyhladanie = this.__zjednotitData(res)[1];
  var vyhladane = naVyhladanie.map(function (item) {
    return _this7.__ziskajObjektPodlaHodnoty(res, item);
  });
  vyhladane.forEach(function (val) {
    for (var kys in val) {
      if (Object.hasOwnProperty.call(val, kys)) {
        var element = val[kys];
        if (typeof element === 'string') return;
        for (var ky in element) {
          if (Object.hasOwnProperty.call(element, ky)) {
            if (!isNaN(+ky)) {
              ky = +ky + 1;
            }
            array.push("".concat(kys, "_").concat(ky));
          }
        }
      }
    }
  });
  var price = Object.entries(this.__ziskajPrimitivneDoObjektu(res)[0])[0];
  if (price) array.unshift(price[0]);
  return array;
};
spracovanieDat.__ziskjHodnZArr = function (data) {
  var nepovolene = this.__ziskjNepovolene(data, Object.getOwnPropertyNames(this.__ziskajPrimitivneDoObjektu(data)[0]));
  this.__odstranNepovolene(data, Object.getOwnPropertyNames(this.__ziskajPrimitivneDoObjektu(nepovolene)[0]));
  var ky1 = this.__menNazKlucZlozObj(data);
  var ky2 = this.__zjednotitData(data)[0];
  var jeto = [ky1, ky2];
  var val = this.__zjednotitData(data)[1];
  var ziskjHodn = function ziskjHodn(ky1, ky2) {
    var key1 = ky1.flat();
    var key2 = ky2.flat();
    var spojene = key1.map(function (item, i) {
      var string = "".concat(item, "_").concat(key2[i]);
      string = Array.from(new Set(Object.values(string.split('_'))));
      return string.join('_');
    });
    return spojene;
  };
  var zbavSa = ziskjHodn(ky1, ky2);
  var brasil = zbavSa.map(function (item) {
    return item.split('_').map(function (part, index) {
      return index > 0 && !isNaN(part) ? part : index === 0 ? part : "_".concat(part);
    }).join('');
  });
  var result = {};
  brasil.forEach(function (key, index) {
    result[key] = val[index];
  });
  Object.keys(nepovolene).forEach(function (key) {
    return result[key] = nepovolene[key];
  });
  return result;
};
spracovanieDat.__ulozKlHdnDoProstr = function (data, pouzFct) {
  var prazdne = this.__ziskjHodnKlucDoArr(data).flatMap(function (obj) {
    return Object.keys(obj).reduce(function (acc, o) {
      return obj[o] === null ? [].concat(_toConsumableArray(acc), [o]) : acc;
    }, []);
  });
  prazdne = this.__ocislujDuplikaty(prazdne);
  if (prazdne) {
    prazdne.forEach(function (element) {
      console.log(element, null);
    });
  }
  Object.entries(pouzFct).forEach(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
      key = _ref6[0],
      value = _ref6[1];
    console.log(key, value);
  });
};
spracovanieDat.__ulozKlHdnDoProstr(odpoved, spracovanieDat.__ziskjHodnZArr(odpoved));
