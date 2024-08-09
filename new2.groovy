def odpoved = [
    reaction: [
        sts: 200,
        msg: "description",
        Usernamez: null
    ],
    User: [
        [
            Email: "phil.juza2@gmail.com",
            Username: null,
            Gender_id: 2
        ],
        [
            Email: "phil.juza@gmail.com",
            Username: "ShenHU1",
            Gender_id: 1
        ],
        [
            Email: null,
            Username: "ShenHU",
            Gender_id: 2
        ]
    ],
    dssad: 'dffsdfds',
    dssads: 'dffsdfdsss',
    babel: "¬1"
]
class ZiskDatZoServisov {
    
    def _ziskajObjektoveHodnoty(objekt) {
        if (objekt == null) return []
        return objekt.values().toList()
    }

    def _ziskajObjektoveKluce(objekt) {
        return objekt.keySet().toList()
    }

    def _jePrimitivna(obj) {
        return !(obj instanceof Map) || obj == null
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
            .collect { v -> v instanceof Map ? _ziskajObjektoveHodnoty(v) : [v] }
            .flatten()
            .findAll { it instanceof Map }
    }

    def _ziskajJednoducheObjekty(data) {
        if (!(data instanceof List)) {
            return _ziskajObjektoveHodnoty(data).findAll { cur ->
                cur && cur instanceof Map && !_ziskajObjektoveHodnoty(cur).any { it instanceof Map }
            }
        } else {
            return _ziskajObjektoveHodnoty(data).findAll { cur ->
                cur && cur instanceof Map || !_ziskajObjektoveHodnoty(cur).any { it instanceof Map }
            }
        }
    }

    def _ziskjHodnKlucDoArr(data) {
        def primitivne = _ziskajPrimitivneDoObjektu(data)
        def vnoreneObjekty = _ziskajNestedObj(data)
        def jednoducheObjekty = _ziskajJednoducheObjekty(data)
        def lord = _ziskajObjektoveHodnoty(data)
            .findAll { cur ->
                cur && !(cur instanceof List) && _ziskajObjektoveHodnoty(cur).any { it instanceof List }
            }
        def jednoducheArr = _ziskjJednTypyDatPoli(data)
        def arr = primitivne + vnoreneObjekty + jednoducheObjekty
        if (jednoducheArr) arr += jednoducheArr
        return arr.findAll { cur -> cur && !cur.isEmpty() }
    }
}

class SpracovanieDat extends ZiskDatZoServisov {

    def _ocislujDuplikaty(obj) {
        def i = 1
        if (obj instanceof List) {
            def cislaNecisla = obj.collect { cur ->
                def original = cur
                while (obj.contains(cur)) {
                    i++
                    cur = "${original}${i}"
                }
                i = 1
                return cur
            }.collect { it.replaceAll(/\d/, '') + "1" }
            return cislaNecisla
        }
        return obj
    }

    def _ziskjNepovolene(data, nepovolene) {
        def extracted = [:]
        data.each { key, value ->
            if (nepovolene.contains(key)) extracted[key] = value
        }
        return extracted
    }

    def _odstranNepovolene(data, nepovolene) {
        data.keySet().removeAll(nepovolene)
    }

    def _zjednotitData(result) {
        def zozbieraneData = _ziskjHodnKlucDoArr(result)
        def arrKluc = []
        def arrHodnota = []

        zozbieraneData.each { obj ->
            if (obj == null) return
            obj.each { key, val ->
                if (val instanceof List) {
                    _nieJePoleObjektov(val) ? val : []
                }
                if (val instanceof Map) {
                    val.each { k, v ->
                        arrKluc << k
                        arrHodnota << v
                    }
                }
                if (!(val instanceof Map)) {
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
            if (value instanceof Map) {
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
                element.each { ky, v ->
                    if (!ky.isNumber()) ky = "${ky + 1}"
                    array << "${kys}_${ky}"
                }
            }
        }
        def price = _ziskajPrimitivneDoObjektu(res)[0].entrySet().first()
        if (price) array.add(0, price.key)
        return array
    }

    def _ziskjHodnZArr(data) {
        def nepovolene = _ziskjNepovolene(data, _ziskajPrimitivneDoObjektu(data)[0].keySet().toList())
        _odstranNepovolene(data, nepovolene.keySet().toList())
        def ky1 = _menNazKlucZlozObj(data)
        def ky2 = _zjednotitData(data)[0]
        def val = _zjednotitData(data)[1]

        def ziskjHodn = { k1, k2 ->
            def spojene = k1.collect { item, i ->
                def string = "${item}_${k2[i]}"
                string = string.split('_').toList().unique()
                return string.join('_')
            }
            return spojene
        }

        def zbavSa = ziskjHodn(ky1, ky2)
        def brasil = zbavSa.collect { item ->
            item.split('_').collect { part, index ->
                if (index > 0 && !part.isNumber()) part else if (index == 0) part else "_${part}"
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
        prazdne.each { element -> println("${element}: null") }
        pouzFct.each { key, value -> println("${key}: ${value}") }
    }
}

def ziskDatZoServisov = new ZiskDatZoServisov()
def spracovanieDat = new SpracovanieDat()
spracovanieDat._ulozKlHdnDoProstr(odpoved, spracovanieDat._ziskjHodnZArr(odpoved));