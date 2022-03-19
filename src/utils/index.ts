import { crypto, ethereum, log } from '@graphprotocol/graph-ts';
import { Contract, Transaction } from '../types/schema';
import { ByteArray, Bytes } from '@graphprotocol/graph-ts/common/collections';

export function getContractTopicFromAddress(contractAddress: Bytes): string {
  log.debug('___LOG getContractTopicFromAddress address: {}', [contractAddress.toHexString()]);
  const contractEntity = Contract.load(contractAddress.toHexString());
  return contractEntity ? contractEntity.topic : 'undefined';
}

/*
    @ Table: Transaction
    @ event signature: Various
    @ id: transactionHash (hexString)
    @ main interaction contract: Various
*/
export function saveTransaction(event: ethereum.Event, eventName: string, contractTopic: string = ''): Transaction {
  const id = event.transaction.hash.toHexString();
  const eventSelector =
    contractTopic !== ''
      ? `${contractTopic}_${eventName}`
      : `${getContractTopicFromAddress(event.address)}_${eventName}`;
  log.info('___LOG HANDLING TRANSACTION HASH:{} EVENT_SELECTOR:{}', [id, eventSelector]);

  let transaction = Transaction.load(id);

  if (!transaction) {
    // if not exist transaction => create transaction row
    log.info('___LOG INSERT TRANSACTION {} {}', [event.transaction.hash.toHexString(), eventSelector]);
    transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.blockNumber = event.block.number;
    transaction.eventSelectors = [eventSelector];
    transaction.from = event.transaction.from;
    transaction.to = event.transaction.to!;
    transaction.gasUsed = event.block.gasUsed;
    transaction.value = event.transaction.value;
    transaction.timestamp = event.block.timestamp;
    transaction.gasPrice = event.transaction.gasPrice;
    transaction.save();
  } else {
    // if previous exists transaction in case of a transaction contains multiple events,
    // push eventSelector to eventSelectors array to keep tracking all the multiple events
    if (!transaction.eventSelectors.includes(eventSelector)) {
      log.info('___LOG PUSH EVENTS at the SAME TRANSACTION {} {}', [
        event.transaction.hash.toHexString(),
        eventSelector,
      ]);
      // if the same events emitted in the same transaction, just ignore it avoid duplication
      transaction.blockNumber = event.block.number;
      transaction.timestamp = event.block.timestamp;
      const eventSelectors = transaction.eventSelectors;
      eventSelectors.push(eventSelector);
      transaction.eventSelectors = eventSelectors;
      transaction.save();
    } else {
      log.info('___LOG DUPLICATE EVENTS at the SAME TRANSACTION {} {}', [
        event.transaction.hash.toHexString(),
        eventSelector,
      ]);
    }
  }

  return transaction as Transaction;
}

export function getUniqueIdFromTxLog(event: ethereum.Event): string {
  const trxHash = event.transaction.hash.toHexString();
  const logIndex = event.logIndex.toHexString();
  return `${trxHash}_${logIndex}`;
}

export function convertContractTopicHashToString(topicHashStr: string): string {
  if (crypto.keccak256(ByteArray.fromUTF8('NFT')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT NFT {}', [crypto.keccak256(ByteArray.fromUTF8('NFT')).toHexString()]);
    return 'NFT';
  } else if (crypto.keccak256(ByteArray.fromUTF8('CAMANAGER')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT VERIFIER {}', [crypto.keccak256(ByteArray.fromUTF8('CAMANAGER')).toHexString()]);
    return 'CAMANAGER';
  } else if (crypto.keccak256(ByteArray.fromUTF8('VERIFIER')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT VERIFIER {}', [crypto.keccak256(ByteArray.fromUTF8('VERIFIER')).toHexString()]);
    return 'VERIFIER';
  } else if (crypto.keccak256(ByteArray.fromUTF8('VRF')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT TICKET {}', [crypto.keccak256(ByteArray.fromUTF8('VRF')).toHexString()]);
    return 'VRF';
  } else if (crypto.keccak256(ByteArray.fromUTF8('TICKET')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT TICKET {}', [crypto.keccak256(ByteArray.fromUTF8('TICKET')).toHexString()]);
    return 'TICKET';
  } else if (crypto.keccak256(ByteArray.fromUTF8('MINTMANAGER')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT MINTMANAGER {}', [crypto.keccak256(ByteArray.fromUTF8('MINTMANAGER')).toHexString()]);
    return 'MINTMANAGER';
  } else if (crypto.keccak256(ByteArray.fromUTF8('EXCHANGE')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT EXCHANGE {}', [crypto.keccak256(ByteArray.fromUTF8('EXCHANGE')).toHexString()]);
    return 'EXCHANGE';
  } else if (crypto.keccak256(ByteArray.fromUTF8('WALLET')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT WALLET {}', [crypto.keccak256(ByteArray.fromUTF8('WALLET')).toHexString()]);
    return 'WALLET';
  } else if (crypto.keccak256(ByteArray.fromUTF8('REVEAL')).toHexString() == topicHashStr) {
    log.debug('KECCAK___RESULT REVEAL {}', [crypto.keccak256(ByteArray.fromUTF8('REVEAL')).toHexString()]);
    return 'REVEAL';
  } else {
    return 'UNRECOGNIZED';
  }
}

export enum ContractTopic {
  CAMANAGER,
  NFT,
  VRF,
  VERIFIER,
  TICKET,
  MINTMANAGER,
  EXCHANGE,
  WALLET,
  REVEAL,
}

export enum EventName {
  Requested,
  Approved,
  Revoked,
  Withdrawn,
  FeeReceived,
  NftContractRegistered,
  ManagerContractRegistered,
  ManagerContractRemoved,
  TransferSingle,
  Uri,
}

export function getContractTopicFromString(contractTopic: ContractTopic): string {
  switch (contractTopic) {
    case ContractTopic.CAMANAGER:
      return 'CAMANAGER';
    case ContractTopic.NFT:
      return 'NFT';
    case ContractTopic.VRF:
      return 'VRF';
    case ContractTopic.VERIFIER:
      return 'VERIFIER';
    case ContractTopic.TICKET:
      return 'TICKET';
    case ContractTopic.MINTMANAGER:
      return 'MINTMANAGER';
    case ContractTopic.EXCHANGE:
      return 'EXCHANGE';
    case ContractTopic.WALLET:
      return 'WALLET';
    case ContractTopic.REVEAL:
      return 'REVEAL';
    default:
      return 'UNRECOGNIZED';
  }
}

export function getEventName(eventName: EventName): string {
  switch (eventName) {
    case EventName.Requested:
      return 'Requested';
    case EventName.Approved:
      return 'Approved';
    case EventName.Revoked:
      return 'Revoked';
    case EventName.Withdrawn:
      return 'Withdrawn';
    case EventName.FeeReceived:
      return 'FeeReceived';
    case EventName.NftContractRegistered:
      return 'NftContractRegistered';
    case EventName.ManagerContractRegistered:
      return 'ManagerContractRegistered';
    case EventName.ManagerContractRemoved:
      return 'ManagerContractRemoved';
    case EventName.Uri:
      return 'Uri';
    default:
      return 'undefined';
  }
}
