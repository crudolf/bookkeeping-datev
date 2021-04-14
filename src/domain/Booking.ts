export interface Booking {
    datum: Date;
    konto: String;
    taxKonto: String;
    gegenKonto: String;
    taxGegenKonto: String;
    bu: String;
    betrag: number;
    text: String;
    stid: String;
    saldo: number;
}