import { BigInt, log } from '@graphprotocol/graph-ts';
import { Approved, FeeReceived, Requested, Revoked, Withdrawn } from '../types/OmnuumWallet/OmnuumWallet';
import { Approval, Fee, Request } from '../types/schema';

import { getEventName, saveTransaction, EventName } from '../utils';

/*
    @ Table: Request
    @ event signature: Requested(indexed uint256,indexed address,uint256)
    @ id: RequestId (hexString)
    @ main interaction contract: OmnuumWallet
*/
export function handleRequested(event: Requested): void {
  const id = event.params.reqId.toHexString();

  let requestEntity = Request.load(id);
  if (!requestEntity) {
    requestEntity = new Request(id);
  }
  const transaction = saveTransaction(event, getEventName(EventName.Requested));

  requestEntity.blockNumber = event.block.number;
  requestEntity.requester = event.params.requester;
  requestEntity.request_value = event.params.withdrawalValue;
  requestEntity.withdrawal_value = BigInt.zero();
  requestEntity.approval_count = BigInt.fromU32(1);
  requestEntity.request_transaction = transaction.id; // transaction hash
  requestEntity.save();
}

export function handleApproved(event: Approved): void {
  const reqId = event.params.reqId;
  const owner = event.params.owner;

  const id = `${reqId.toHexString()}_${owner.toHexString()}`;
  let approvalEntity = Approval.load(id);
  if (!approvalEntity) {
    approvalEntity = new Approval(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.Approved));

  approvalEntity.approver = owner;
  approvalEntity.is_last_approval_revoked = false;

  let approval_transactions = approvalEntity.approval_transactions;

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

  const approvalEntity = Approval.load(id);

  if (!approvalEntity) {
    log.error('NO approval entity of id {}', [id]);
  } else {
    // Update revoke boolean
    approvalEntity.is_last_approval_revoked = true;

    let revoked_transactions = approvalEntity.revoked_transactions;

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
  const id = event.params.reqId.toHexString();

  const transaction = saveTransaction(event, getEventName(EventName.Withdrawn));

  const requestEntity = Request.load(id);
  if (!requestEntity) {
    log.error('NO request entity of id {}', [id]);
  } else {
    requestEntity.withdrawal_value = event.params.value;
    requestEntity.withdrawal_transaction = transaction.id;
    requestEntity.save();
  }
}

export function handleFeeReceived(event: FeeReceived): void {
  const transaction = saveTransaction(event, getEventName(EventName.FeeReceived));

  log.debug('FEE____RECEIVED : {} {}', [transaction.id, event.params.sender.toHexString()]);
  const id = transaction.id; // transaction hash

  let feeEntity = Fee.load(id);
  if (!feeEntity) {
    feeEntity = new Fee(id);
  }

  feeEntity.sender = event.params.sender;
  feeEntity.fee_transaction = id;

  feeEntity.save();
}
