import {  ethereum } from '@graphprotocol/graph-ts'
import { Transaction } from '../types/schema'
import {Bytes} from "@graphprotocol/graph-ts/common/collections";
import {Address, BigInt} from "@graphprotocol/graph-ts/common/numbers";

export function loadTransaction(event: ethereum.Event): Transaction {
    let transaction = Transaction.load(event.transaction.hash.toHexString())
    if (transaction === null) {
        transaction = new Transaction(event.transaction.hash.toHexString())
    }
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.gasUsed = event.transaction.gasUsed
    transaction.gasPrice = event.transaction.gasPrice
    transaction.save()
    return transaction as Transaction
}


public hash: Bytes,
    public index: BigInt,
    public from: Address,
    public to: Address | null,
    public value: BigInt,
    public gasLimit: BigInt,
    public gasPrice: BigInt,
    public input: Bytes,
    public nonce: BigInt,