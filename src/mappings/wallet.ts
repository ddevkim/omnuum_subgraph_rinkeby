import { BigInt, log } from '@graphprotocol/graph-ts';
import { Approved, FeeReceived, Requested, Revoked, Withdrawn } from '../types/OmnuumWallet/OmnuumWallet';
import { Approval, Fee, Request } from '../types/schema';

import { saveTransaction } from '../utils';

export function handleRequested(event: Requested): void {
  const id = event.params.reqId.toHexString();

  let request = Request.load(id);
  if (!request) {
    request = new Request(id);
  }
  const transaction = saveTransaction(event);

  request.requester = event.params.requester;
  request.request_value = event.params.withdrawalValue;
  request.withdrawal_value = BigInt.zero();
  request.approval_count = BigInt.fromU32(1);
  request.request_transaction = transaction.id; // transaction hash
  request.save();
}

export function handleApproved(event: Approved): void {
  const reqId = event.params.reqId;
  const owner = event.params.owner;

  const id = `${reqId.toHexString()}_${owner.toHexString()}`;
  let approval = Approval.load(id);
  if (!approval) {
    approval = new Approval(id);
  }

  const transaction = saveTransaction(event);

  approval.approver = owner;
  approval.is_last_approval_revoked = false;

  let approval_transactions = approval.approval_transactions;

  if (!approval_transactions) {
    log.debug('APPROVAL_____COUNT___NO_LENGTH', []);
    approval.approval_transactions = [transaction.id];
  } else {
    log.debug('APPROVAL_____COUNT___PUSH_LENGTH', []);

    approval_transactions.push(transaction.id);
    approval.approval_transactions = approval_transactions;
  }

  // Increment request approval count
  const request = Request.load(reqId.toHexString());
  if (request) {
    log.debug('APPROVAL_____COUNT___INCREMENT', []);
    request.approval_count = request.approval_count.plus(BigInt.fromU32(1));
    request.save();
  }

  approval.request_id = reqId.toHexString();
  approval.save();
}

export function handleRevoked(event: Revoked): void {
  const reqId = event.params.reqId;
  const owner = event.params.owner;
  const id = `${reqId.toHexString()}_${owner.toHexString()}`;

  const transaction = saveTransaction(event);

  const approval = Approval.load(id);

  if (!approval) {
    log.error('NO approval entity of id {}', [id]);
  } else {
    // Update revoke boolean
    approval.is_last_approval_revoked = true;

    let revoked_transactions = approval.revoked_transactions;

    if (!revoked_transactions) {
      // Insert revoked transaction
      approval.revoked_transactions = [transaction.id];
    } else {
      // Push and update revoked transaction
      revoked_transactions.push(transaction.id);
      approval.revoked_transactions = revoked_transactions;
    }

    // Decrement approval_count on request
    const request = Request.load(reqId.toHexString());
    if (request) {
      log.debug('APPROVAL_____COUNT___DECREMENT', []);
      request.approval_count = request.approval_count.minus(BigInt.fromU32(1));
      request.save();
    } else {
      log.error('NO request entity of id {}', [id]);
    }
    approval.save();
  }
}

export function handleWithdrawn(event: Withdrawn): void {
  const id = event.params.reqId.toHexString();
  const transaction = saveTransaction(event);
  const request = Request.load(id);
  if (!request) {
    log.error('NO request entity of id {}', [id]);
  } else {
    request.withdrawal_value = event.params.value;
    request.withdrawal_transaction = transaction.id;
    request.save();
  }
}

export function handleFeeReceived(event: FeeReceived): void {
  const transaction = saveTransaction(event);

  log.debug('FEE____RECEIVED : {} {}', [transaction.id, event.params.sender.toHexString()]);
  const id = transaction.id; // transaction hash

  let fee = Fee.load(id);
  if (!fee) {
    fee = new Fee(id);
  }

  fee.sender = event.params.sender;
  fee.fee_transaction = id;

  fee.save();
}
