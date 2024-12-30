export enum FeePayer {
    SENDER = "SENDER",
    RECEVIER = "RECEIVER"
}

export type PaymentTransaction = {
    id: number,
    amount: number,
    content: string,
    desOwner: string,
    desAccount: string,
    desBankName: string,
    fee: number,
    feePayer: FeePayer
}