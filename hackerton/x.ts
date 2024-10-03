type Engine = {
  type: string;
  horsepower: number;
  capacity: number;
};

type Features = {
  airConditioning: boolean;
  sunroof: boolean;
  gps: boolean;
  bluetooth: boolean;
};

type Address = {
  street: string;
  city: string;
  country: string;
};

type Contact = {
  phone: string;
  email: string;
};

type Owner = {
  name: string;
  address: Address;
  contact: Contact;
};

type ServiceHistory = {
  date: string;
  service: string;
  mileage: number;
};

type Car = {
  type: string;
  model: string;
  color: string;
  year: number;
  engine: Engine;
  features: Features;
  owner: Owner;
  serviceHistory: ServiceHistory[];
  isInsured: boolean;
  calculateAge: () => number;
};

const car: Car = {
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
  serviceHistory: [
    {
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
  calculateAge: function (): number {
    const currentYear = new Date().getFullYear();
    return currentYear - this.year;
  }
};

console.log(car.calculateAge()); // Outputs the car's age
