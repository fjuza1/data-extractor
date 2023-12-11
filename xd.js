const AutomatizaciaResReq = {
    __ziskajObjektoveHodnoty(objekt) {
      return Object.values(objekt);
    },
  
    __ziskajObjekty(objekt) {
      let data = [];
  
      this.__ziskajObjektoveHodnoty(objekt).forEach(datovyTyp => {
        if (typeof datovyTyp === 'object' && datovyTyp !== null) {
          for (const vnutornyObjekt in datovyTyp) {
            if (datovyTyp.hasOwnProperty.call(datovyTyp, vnutornyObjekt)) {
              const element = datovyTyp[vnutornyObjekt];
              console.log("🚀 ~ file: xd.js:14 ~ this.__ziskajObjektoveHodnoty ~ element:", element)
              // Do something with the element, for example, push it to the data array
              data.push(element);
            }
          }
        }
      });
  
      return data;
    }
  };
  
  // Example usage
  const response = {
    name: "John Doe",
    age: 30,
    address: {
      street: "123 Main St",
      city: "Anytown",
      country: "USA"
    },
    hobbies: ["reading", "coding", "traveling"],
    friends: [
      {
        friendName: "Alice",
        age: 28
      },
      {
        friendName: "Bob",
        age: 32
      }
    ]
  };
  
//   const extraktovaneObjekty = AutomatizaciaResReq.__ziskajObjekty(response);
//   console.log("🚀 ~ extraktovaneObjekty:", extraktovaneObjekty);

  var variable = {
    "contact":{
      "fr":"contactvalue",
      "en":"contactvalue2",
      "es":"contactvalue3"
    },
    "presentation":{
      "fr":"presentationvalue",
      "en":"presentationvalue2"
    },
  };
  Object.keys(variable).forEach(function(k) {
    if (k == typeof valuechecked === 'object') {
      var entry = variable[k];
      Object.keys(entry).forEach(function(a) {
        console.log(entry[a]);
      });
    }
  });