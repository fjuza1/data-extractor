const car = {
    type: "Fiat",
    model: "500",
    color: "white",
    year: 2020,
    engine: {
        type: "petrol",
        horsepower: 120,
        capacity: 1.4
    },
    features: {
        airConditioning: true,
        sunroof: false,
        gps: true,
        bluetooth: true
    },
    owner: {
        name: "John Doe",
        address: {
            street: "123 Main St",
            city: "Somewhere",
            country: "Italy"
        },
        contact: {
            phone: "+1234567890",
            email: "johndoe@example.com"
        }
    },
    serviceHistory: [{
            date: "2023-06-15",
            service: "Oil change",
            mileage: 15000
        },
        {
            date: "2022-11-30",
            service: "Tire rotation",
            mileage: 10000
        }
    ],
    isInsured: true,
    calculateAge: function() {
        const currentYear = new Date().getFullYear();
        return currentYear - this.year;
    }
};
console.log(car.engine?.type ?? {});

let rating = 3;
switch (rating) {
    case 1:
        console.log('Very bad')
        break;
    case 2:
        console.log('Bad')
        break;
    case 3:
        console.log('Average')
        break;
    case 4:
        console.log('Good')
        break;
    case 5:
        console.log('Excellent')
        break;
}