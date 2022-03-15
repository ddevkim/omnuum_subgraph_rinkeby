// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Approved extends ethereum.Event {
  get params(): Approved__Params {
    return new Approved__Params(this);
  }
}

export class Approved__Params {
  _event: Approved;

  constructor(event: Approved) {
    this._event = event;
  }

  get reqId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class FeeReceived extends ethereum.Event {
  get params(): FeeReceived__Params {
    return new FeeReceived__Params(this);
  }
}

export class FeeReceived__Params {
  _event: FeeReceived;

  constructor(event: FeeReceived) {
    this._event = event;
  }

  get nftContract(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get sender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Requested extends ethereum.Event {
  get params(): Requested__Params {
    return new Requested__Params(this);
  }
}

export class Requested__Params {
  _event: Requested;

  constructor(event: Requested) {
    this._event = event;
  }

  get reqId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get requester(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get withdrawalValue(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Revoked extends ethereum.Event {
  get params(): Revoked__Params {
    return new Revoked__Params(this);
  }
}

export class Revoked__Params {
  _event: Revoked;

  constructor(event: Revoked) {
    this._event = event;
  }

  get reqId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Withdrawn extends ethereum.Event {
  get params(): Withdrawn__Params {
    return new Withdrawn__Params(this);
  }
}

export class Withdrawn__Params {
  _event: Withdrawn;

  constructor(event: Withdrawn) {
    this._event = event;
  }

  get reqId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get receiver(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class OmnuumWallet__requestsResult {
  value0: Address;
  value1: BigInt;
  value2: boolean;

  constructor(value0: Address, value1: BigInt, value2: boolean) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    return map;
  }
}

export class OmnuumWallet extends ethereum.SmartContract {
  static bind(address: Address): OmnuumWallet {
    return new OmnuumWallet("OmnuumWallet", address);
  }

  approvalRequest(_withdrawalValue: BigInt): BigInt {
    let result = super.call(
      "approvalRequest",
      "approvalRequest(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_withdrawalValue)]
    );

    return result[0].toBigInt();
  }

  try_approvalRequest(_withdrawalValue: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "approvalRequest",
      "approvalRequest(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_withdrawalValue)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  checkApproval(_reqId: BigInt, _approver: Address): boolean {
    let result = super.call(
      "checkApproval",
      "checkApproval(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_reqId),
        ethereum.Value.fromAddress(_approver)
      ]
    );

    return result[0].toBoolean();
  }

  try_checkApproval(
    _reqId: BigInt,
    _approver: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "checkApproval",
      "checkApproval(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_reqId),
        ethereum.Value.fromAddress(_approver)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getApprovalCount(_reqId: BigInt): BigInt {
    let result = super.call(
      "getApprovalCount",
      "getApprovalCount(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_reqId)]
    );

    return result[0].toBigInt();
  }

  try_getApprovalCount(_reqId: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getApprovalCount",
      "getApprovalCount(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_reqId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isOwner(param0: Address): boolean {
    let result = super.call("isOwner", "isOwner(address):(bool)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBoolean();
  }

  try_isOwner(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isOwner", "isOwner(address):(bool)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  owners(param0: BigInt): Address {
    let result = super.call("owners", "owners(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toAddress();
  }

  try_owners(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("owners", "owners(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  requests(param0: BigInt): OmnuumWallet__requestsResult {
    let result = super.call(
      "requests",
      "requests(uint256):(address,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new OmnuumWallet__requestsResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBoolean()
    );
  }

  try_requests(
    param0: BigInt
  ): ethereum.CallResult<OmnuumWallet__requestsResult> {
    let result = super.tryCall(
      "requests",
      "requests(uint256):(address,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new OmnuumWallet__requestsResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBoolean()
      )
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _owners(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class DefaultCall extends ethereum.Call {
  get inputs(): DefaultCall__Inputs {
    return new DefaultCall__Inputs(this);
  }

  get outputs(): DefaultCall__Outputs {
    return new DefaultCall__Outputs(this);
  }
}

export class DefaultCall__Inputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class DefaultCall__Outputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class ApprovalRequestCall extends ethereum.Call {
  get inputs(): ApprovalRequestCall__Inputs {
    return new ApprovalRequestCall__Inputs(this);
  }

  get outputs(): ApprovalRequestCall__Outputs {
    return new ApprovalRequestCall__Outputs(this);
  }
}

export class ApprovalRequestCall__Inputs {
  _call: ApprovalRequestCall;

  constructor(call: ApprovalRequestCall) {
    this._call = call;
  }

  get _withdrawalValue(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ApprovalRequestCall__Outputs {
  _call: ApprovalRequestCall;

  constructor(call: ApprovalRequestCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get _reqId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }
}

export class RevokeApprovalCall extends ethereum.Call {
  get inputs(): RevokeApprovalCall__Inputs {
    return new RevokeApprovalCall__Inputs(this);
  }

  get outputs(): RevokeApprovalCall__Outputs {
    return new RevokeApprovalCall__Outputs(this);
  }
}

export class RevokeApprovalCall__Inputs {
  _call: RevokeApprovalCall;

  constructor(call: RevokeApprovalCall) {
    this._call = call;
  }

  get _reqId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class RevokeApprovalCall__Outputs {
  _call: RevokeApprovalCall;

  constructor(call: RevokeApprovalCall) {
    this._call = call;
  }
}

export class WithdrawalCall extends ethereum.Call {
  get inputs(): WithdrawalCall__Inputs {
    return new WithdrawalCall__Inputs(this);
  }

  get outputs(): WithdrawalCall__Outputs {
    return new WithdrawalCall__Outputs(this);
  }
}

export class WithdrawalCall__Inputs {
  _call: WithdrawalCall;

  constructor(call: WithdrawalCall) {
    this._call = call;
  }

  get _reqId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class WithdrawalCall__Outputs {
  _call: WithdrawalCall;

  constructor(call: WithdrawalCall) {
    this._call = call;
  }
}