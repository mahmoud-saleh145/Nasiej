type Governorate =
    | "Cairo"
    | "Giza"
    | "Alexandria"
    | "Dakahlia"
    | "Sharqia"
    | "Gharbia"
    | "Qalyubia"
    | "Ismailia"
    | "Suez"
    | "Port Said"
    | "North Sinai"
    | "South Sinai"
    | "Minya"
    | "Asyut"
    | "Beheira"
    | "Fayoum"
    | "Beni Suef"
    | "Sohag"
    | "Qena"
    | "Luxor"
    | "Aswan"
    | "Red Sea"
    | "Matrouh"
    | "New Valley";

const shippingRates: Record<Governorate, number> = {
    Cairo: 100,
    Giza: 100,
    Alexandria: 100,
    Dakahlia: 100,
    Sharqia: 100,
    Gharbia: 100,
    Qalyubia: 100,
    Ismailia: 100,
    Suez: 100,
    "Port Said": 100,
    "North Sinai": 150,
    "South Sinai": 150,
    Minya: 100,
    Asyut: 100,
    Beheira: 100,
    Fayoum: 100,
    "Beni Suef": 100,
    Sohag: 100,
    Qena: 150,
    Luxor: 150,
    Aswan: 150,
    "Red Sea": 150,
    Matrouh: 100,
    "New Valley": 150,
};


export function calculateShipping(governorate: string) {
    if (governorate in shippingRates) {
        return shippingRates[governorate as Governorate];
    }

    return 100;
}

