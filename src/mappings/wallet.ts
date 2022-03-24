import { BigInt, log } from '@graphprotocol/graph-ts';
import { Approved, PaymentReceived, Requested, Revoked, Withdrawn } from '../types/OmnuumWallet/OmnuumWallet';
import { Approval, Payment, Request } from '../types/schema';

import {
  getEventName,
  saveTransaction,
  EventName,
  convertPaymentTopicHashToString,
  getUniqueIdFromTxLog,
} from '../utils';

/*
    @ Table: Request
    @ event signature: Requested(indexed uint256,indexed address,uint256)
    @ id: RequestId (hexString)
    @ main interaction contract: OmnuumWallet
*/
export function handleRequested(event: Requested): void {
  const id = event.params.reqId.toHexString();
  const transaction = saveTransaction(event, getEventName(EventName.Requested));

  log.info('___LOG handleRequested id: {}, tx_id: {}', [id, transaction.id]);

  let requestEntity = Request.load(id);
  if (!requestEntity) {
    requestEntity = new Request(id);
  }

  requestEntity.block_number = event.block.number;
  requestEntity.requester = event.params.requester;
  requestEntity.request_value = event.params.withdrawalValue;
  requestEntity.withdrawal_value = BigInt.zero();
  requestEntity.approval_count = BigInt.fromU32(1);
  requestEntity.request_transaction = transaction.id; // transaction hash
  requestEntity.save();
}

export function handleApproved(event: Approved): void {
  const owner = event.params.owner;
  const reqId = event.params.reqId;
  const id = `${reqId.toHexString()}_${owner.toHexString()}`;

  const transaction = saveTransaction(event, getEventName(EventName.Approved));

  log.info('___LOG handleApproved id: {} req_id: {} tx_id: {}', [id, reqId.toHexString(), transaction.id]);

  let approvalEntity = Approval.load(id);
  if (!approvalEntity) {
    approvalEntity = new Approval(id);
  }

  approvalEntity.approver = owner;
  approvalEntity.is_last_approval_revoked = false;

  const approval_transactions = approvalEntity.approval_transactions;

  if (!approval_transactions) {
    log.debug('APPROVAL_____COUNT___NO_LENGTH', []);
    approvalEntity.approval_transactions = [transaction.id];
  } else {
    log.debug('APPROVAL_____COUNT___PUSH_LENGTH', []);

    approval_transactions.push(transaction.id);
    approvalEntity.approval_transactions = approval_transactions;
  }

  // Increment request approval count
  const request = Request.load(reqId.toHexString());
  if (request) {
    log.debug('APPROVAL_____COUNT___INCREMENT', []);
    request.approval_count = request.approval_count.plus(BigInt.fromU32(1));
    request.save();
  }

  approvalEntity.request_id = reqId.toHexString();
  approvalEntity.save();
}

export function handleRevoked(event: Revoked): void {
  const reqId = event.params.reqId;
  const owner = event.params.owner;
  const id = `${reqId.toHexString()}_${owner.toHexString()}`;
  const transaction = saveTransaction(event, getEventName(EventName.Revoked));

  log.info('___LOG handleApproved id: {} req_id: {} tx_id: {}', [id, reqId.toHexString(), transaction.id]);

  const approvalEntity = Approval.load(id);

  if (!approvalEntity) {
    log.error('NO approval entity of id {}', [id]);
  } else {
    // Update revoke boolean
    approvalEntity.is_last_approval_revoked = true;

    const revoked_transactions = approvalEntity.revoked_transactions;

    if (!revoked_transactions) {
      // Insert revoked transaction
      approvalEntity.revoked_transactions = [transaction.id];
    } else {
      // Push and update revoked transaction
      revoked_transactions.push(transaction.id);
      approvalEntity.revoked_transactions = revoked_transactions;
    }

    // Decrement approval_count on request
    const requestEntity = Request.load(reqId.toHexString());
    if (requestEntity) {
      log.debug('APPROVAL_____COUNT___DECREMENT', []);
      requestEntity.approval_count = requestEntity.approval_count.minus(BigInt.fromU32(1));
      requestEntity.save();
    } else {
      log.error('NO request entity of id {}', [id]);
    }
    approvalEntity.save();
  }
}

export function handleWithdrawn(event: Withdrawn): void {
  const reqId = event.params.reqId.toHexString();

  const transaction = saveTransaction(event, getEventName(EventName.Withdrawn));

  log.info('LOG ___handleWithdrawn req_id: {} tx_id: {}', [reqId, transaction.id]);

  const requestEntity = Request.load(reqId);
  if (!requestEntity) {
    log.error('NO request entity of id {}', [reqId]);
  } else {
    requestEntity.withdrawal_value = event.params.value;
    requestEntity.withdrawal_transaction = transaction.id;
    requestEntity.save();
  }
}

export function handlePaymentReceived(event: PaymentReceived): void {
  const transaction = saveTransaction(event, getEventName(EventName.PaymentReceived));
  const id = getUniqueIdFromTxLog(event); // transaction hash
  const sender = event.transaction.from;

  log.info('___LOG handlePaymentReceived tx_id: {} sender: {}', [id, sender.toHexString()]);

  let paymentEntity = Payment.load(id);
  if (!paymentEntity) {
    paymentEntity = new Payment(id);
  }

  paymentEntity.block_number = event.block.number;
  paymentEntity.payment_transaction = transaction.id;
  paymentEntity.sender = sender;
  paymentEntity.value = event.transaction.value;

  paymentEntity.topic = convertPaymentTopicHashToString(event.params.topic.toHexString());
  paymentEntity.description = event.params.description;

  paymentEntity.save();
}
