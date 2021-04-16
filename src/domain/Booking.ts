export interface Booking {
    datum: Date;
    konto: string;
    gegenKonto: string;
    taxKonto: String;
    taxGegenKonto: String;
    bu: String;
    betrag: number;
    text: String;
    stid: String;
    saldo: number;
    validated: boolean;
}