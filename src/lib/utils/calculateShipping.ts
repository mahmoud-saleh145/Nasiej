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
    | "Luxor"
    | "Aswan";

const shippingRates: Record<Governorate, number> = {
    Cairo: 50,
    Giza: 60,
    Alexandria: 70,
    Dakahlia: 80,
    Sharqia: 80,
    Gharbia: 80,
    Qalyubia: 70,
    Ismailia: 90,
    Suez: 90,
    "Port Said": 90,
    Luxor: 120,
    Aswan: 130,
};

export function calculateShipping(governorate: string) {
    if (governorate in shippingRates) {
        return shippingRates[governorate as Governorate];
    }

    return 100;
}

