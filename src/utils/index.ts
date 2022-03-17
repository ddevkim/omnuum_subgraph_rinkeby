import { crypto, Entity, ethereum, log } from '@graphprotocol/graph-ts';
import { Approval, Transaction } from '../types/schema';
import { Address, BigInt } from '@graphprotocol/graph-ts/common/numbers';
import { ByteArray, Bytes } from '@graphprotocol/graph-ts/common/collections';

export function saveTransaction(event: ethereum.Event): Transaction {
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

export function convertContractTopicToString(topicHash: Bytes): string {
  if (crypto.keccak256(ByteArray.fromUTF8('NFT'))) {
    return 'NFT';
  } else if (crypto.keccak256(ByteArray.fromUTF8('VERIFIER'))) {
    return 'VERIFIER';
  } else if (crypto.keccak256(ByteArray.fromUTF8('TICKET'))) {
    return 'TICKET';
  } else if (crypto.keccak256(ByteArray.fromUTF8('MINTMANAGER'))) {
    return 'MINTMANAGER';
  } else if (crypto.keccak256(ByteArray.fromUTF8('EXCHANGE'))) {
    return 'EXCHANGE';
  } else if (crypto.keccak256(ByteArray.fromUTF8('WALLET'))) {
    return 'WALLET';
  } else if (crypto.keccak256(ByteArray.fromUTF8('REVEAL'))) {
    return 'REVEAL';
  } else {
    return 'UNRECOGNIZED';
  }
}
