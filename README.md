Skuska mimo Postman
skuska_postman expl:
Functionality:
The provided code defines two classes, ZiskDatZoServisov and SpracovanieDat, which are designed to process data from service responses. Here's a breakdown of their functionality:

ZiskDatZoServisov Class:

ziskajObjektoveHodnoty: Retrieves values from an object.
ziskajObjektoveKluce: Retrieves keys from an object.
jePrimitivna: Checks if a value is primitive.
nieJePoleObjektov: Checks if an array does not contain any objects.
ziskjJednTypyDatPoli: Retrieves data types from an array.
ziskajPrimitivneDoObjektu: Retrieves primitive values from an object.
ziskajNestedObj: Retrieves nested objects.
ziskajJednoducheObjekty: Retrieves simple objects from data.
ziskjHodnKlucDoArr: Retrieves a combined array of keys and values from data.
SpracovanieDat Class (extends ZiskDatZoServisov):

ocislujDuplikaty: Numbers duplicates in an array.
ziskjNepovolene: Retrieves disallowed data from an object.
odstranNepovolene: Removes disallowed data from an object.
zjednotitData: Combines data into a unified format.
ziskajObjektPodlaHodnoty: Retrieves an object based on a specific value.
jeJednObj: Checks if all elements in the object are of primitive types.
menNazKlucZlozObj: Generates an array of key names for a complex object.
ziskjHodnZArr: Retrieves values from an array.
ulozKlHdnDoProstr: Saves keys and values to an environment.