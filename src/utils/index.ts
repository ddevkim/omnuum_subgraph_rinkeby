import { Entity, ethereum, log } from '@graphprotocol/graph-ts';
import { Approval, Transaction } from '../types/schema';
import { Address, BigInt } from '@graphprotocol/graph-ts/common/numbers';
import { Bytes } from '@graphprotocol/graph-ts/common/collections';

export function saveTransaction(event: ethereum.Event): Transaction {
  log.debug('_____TRANSACTION {}', [event.transaction.hash.toHexString()]);
  log.debug('_______TRANSACTION {} {} {} {} {} {} {}', [
    event.transaction.from.toHexString(),
    event.transaction.to!.toHexString(),
    event.block.gasUsed.toString(),
    event.transaction.value.toString(),
    event.block.number.toString(),
    event.block.timestamp.toString(),
    event.transaction.gasPrice.toString(),
  ]);
  const id: string = event.transaction.hash.toHexString();
  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (!transaction) {
    transaction = new Transaction(event.transaction.hash.toHexString());
  }

  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to!;
  transaction.gasUsed = event.block.gasUsed;
  transaction.value = event.transaction.value;
  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.gasPrice = event.transaction.gasPrice;

  transaction.save();

  return transaction as Transaction;
}

export function getUniqueIdFromTxLog(event: ethereum.Event): string {
  const trxHash = event.transaction.hash.toHexString();
  const logIndex = event.logIndex.toHexString();
  return `${trxHash}_${logIndex}`;
}
