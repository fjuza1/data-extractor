class ZiskDatZoServisov {
    def _ziskajObjektoveHodnoty(objekt) {
        if (objekt == null) return
        return objekt.values().toList()
    }

    def _ziskajObjektoveKluce(objekt) {
        return objekt.keySet().toList()
    }

    def _jePrimitivna(obj) {
        return !(obj instanceof Map) && !(obj instanceof List) || obj == null
    }

    def _nieJePoleObjektov(array) {
        if (array instanceof List) return array.every { !(it instanceof Map) }
    }

    def _ziskjJednTypyDatPoli(data) {
        return _ziskajObjektoveHodnoty(data)
            .collectMany { element ->
                if (!element) return []
                return _nieJePoleObjektov(element) ? element : []
            }
    }

    def _ziskajPrimitivneDoObjektu(obj) {
        def objekt = [:]
        _ziskajObjektoveKluce(obj).each { polozka ->
            def key = obj[polozka]
            if (_jePrimitivna(key)) objekt[polozka] = key
        }
        return [objekt]
    }

    def _ziskajNestedObj(res) {
        return _ziskajObjektoveHodnoty(res)
            .collectMany { v -> v instanceof Map ? _ziskajObjektoveHodnoty(v) : [v] }
            .collectMany { cur -> cur instanceof Map ? [cur] : [] }
    }

    def _ziskajJednoducheObjekty(data) {
        if (!(data instanceof List)) {
            return _ziskajObjektoveHodnoty(data)
                .findAll { cur ->
                    cur && (cur instanceof Map && !_ziskajObjektoveHodnoty(cur).any { it instanceof Map })
                }
        } else {
            return _ziskajObjektoveHodnoty(data)
                .findAll { cur ->
                    cur && (cur instanceof Map || (data instanceof List && !_ziskajObjektoveHodnoty(cur).any { it instanceof Map }))
                }
        }
    }

    def _ziskjHodnKlucDoArr(data) {
        def primitivne = _ziskajPrimitivneDoObjektu(data)
        def vnoreneObjekty = _ziskajNestedObj(data)
        def jednoducheObjekty = _ziskajJednoducheObjekty(data)
        def lord = _ziskajObjektoveHodnoty(data)
            .findAll { cur -> cur && !(cur instanceof List) && _ziskajObjektoveHodnoty(cur).any { it instanceof List } }
        def jednoducheArr = _ziskjJednTypyDatPoli(data)
        def arr = primitivne + vnoreneObjekty + jednoducheObjekty
        if (jednoducheArr.size() > 0) arr += jednoducheArr
        return arr.findAll { cur -> cur && cur.keySet().size() > 0 }
    }
}

class SpracovanieDat extends ZiskDatZoServisov {
    def _ocislujDuplikaty(obj) {
        def i = 1
        if (obj instanceof List) {
            def cislaNecisla = obj.inject([]) { acc, cur ->
                def original = cur
                while (acc.contains(cur)) {
                    i++
                    cur = "${original}${i}"
                }
                i = 1
                acc + [cur]
            }.collect { !it.isNumber() ? "${it}1" : "${it}" }
            return cislaNecisla
        }
        return obj
    }

    def _ziskjNepovolene(data, nepovolene) {
        def extracted = [:]
        data.keySet().findAll { nepovolene.contains(it) }.each { key ->
            extracted[key] = data[key]
        }
        return extracted
    }

    def _odstranNepovolene(data, nepovolene) {
        data.keySet().findAll { nepovolene.contains(it) }.each { key ->
            data.remove(key)
        }
    }

    def _zjednotitData(result) {
        def zozbieraneData = _ziskjHodnKlucDoArr(result)
        def arrKluc = []
        def arrHodnota = []
        zozbieraneData.each { obj ->
            if (obj == null) return
            obj.each { key, val ->
                if (val instanceof List) {
                    if (!_nieJePoleObjektov(val)) return
                }
                if (val instanceof Map) {
                    val.each { k, v ->
                        if (v instanceof List) {
                            if (!_nieJePoleObjektov(v)) return
                        }
                        arrKluc << k
                        arrHodnota << v
                    }
                } else {
                    arrKluc << key
                    arrHodnota << val
                }
            }
        }
        return [arrKluc, arrHodnota]
    }

    def _ziskajObjektPodlaHodnoty(data, hladanaHodnota) {
        def keys = _ziskajObjektoveKluce(data)
        for (key in keys) {
            def value = data[key]
            if (value == hladanaHodnota) {
                return [(key): value]
            }
            if (value instanceof Map && value != null) {
                def vnoreneRes = _ziskajObjektPodlaHodnoty(value, hladanaHodnota)
                if (vnoreneRes) {
                    return [(key): vnoreneRes]
                }
            }
        }
        return null
    }

    def _jeJednObj() {
        return _ziskajObjektoveHodnoty(obj).collect { (it instanceof Number || it instanceof Boolean || it instanceof String) }
    }

    def _menNazKlucZlozObj(res) {
        def array = []
        def objektove = []
        def naVyhladanie = _zjednotitData(res)[1]
        def vyhladane = naVyhladanie.collect { item -> _ziskajObjektPodlaHodnoty(res, item) }
        vyhladane.each { val ->
            val.each { kys, element ->
                if (element instanceof String) return
                element.each { ky, el ->
                    if (ky.isNumber()) {
                        ky = (ky as Integer) + 1
                    }
                    array << "${kys}_${ky}"
                }
            }
        }
        def price = _ziskajPrimitivneDoObjektu(res)[0].find { true }
        if (price) array.add(0, price.key)
        return array
    }

    def _ziskjHodnZArr(data) {
        def nepovolene = _ziskjNepovolene(data, _ziskajPrimitivneDoObjektu(data)[0].keySet().toList())
        _odstranNepovolene(data, _ziskajPrimitivneDoObjektu(nepovolene)[0].keySet().toList())
        def ky1 = _menNazKlucZlozObj(data)
        def ky2 = _zjednotitData(data)[0]
        def jeto = [ky1, ky2]
        def val = _zjednotitData(data)[1]
        def ziskjHodn = { ky1, ky2 ->
            def key1 = ky1.flatten()
            def key2 = ky2.flatten()
            def spojene = key1.collect { item, i ->
                def string = "${item}_${key2[i]}"
                string = string.split('_').toList().unique().join('_')
                return string
            }
            return spojene
        }
        def zbavSa = ziskjHodn(ky1, ky2)
        def brasil = zbavSa.collect { item ->
            item.split('_').collect { part, index ->
                index > 0 && part.isNumber() ? part : (index == 0 ? part : "_${part}")
            }.join('')
        }
        def result = [:]
        brasil.eachWithIndex { key, index ->
            result[key] = val[index]
        }
        nepovolene.each { key, value -> result[key] = value }
        return result
    }

    def _ulozKlHdnDoProstr(data, pouzFct) {
        def prazdne = _ziskjHodnKlucDoArr(data)
            .collectMany { obj -> obj.keySet().findAll { obj[it] == null } }
        prazdne = _ocislujDuplikaty(prazdne)
        prazdne.each { element ->
            println("${element} = null")
        }
        pouzFct.each { key, value ->
            println("${key} = ${value}")
        }
    }
}

def ziskDatZoServisov = new ZiskDatZoServisov()
def spracovanieDat = new SpracovanieDat()
