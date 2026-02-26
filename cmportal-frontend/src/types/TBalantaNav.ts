import {TCustLedgerEntry} from "@/types/TCustLedgerEntry";

export type TBalantaNav = {
    Name: string,
    No: string,
    SoldCredit: string,
    SoldDebit: string,
    SoldInit: string,
    SumCredit: string,
    SumDebit: string,
    invoices:Array<string>,
    CustLedgerEntry:Array<TCustLedgerEntry>
}
