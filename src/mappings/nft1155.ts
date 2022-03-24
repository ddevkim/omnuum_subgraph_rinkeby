import { OwnershipTransferred, TransferSingle, Uri } from '../types/templates/OmnuumNFT1155/OmnuumNFT1155';
import { Contract, Nft } from '../types/schema';
import { saveTransaction, getEventName, EventName } from '../utils';
import { log } from '@graphprotocol/graph-ts';

export function handleTransferSingle(event: TransferSingle): void {
  const nftContractAddress = event.address.toHexString();
  const tokenId = event.params.id;
  const id = `${nftContractAddress}_${tokenId}`;
  const minter = event.params.to;

  log.info('___LOG handleTransferSingle id: {} token_id: {} nftContractAddress: {} minter: {}', [
    id,
    tokenId.toHexString(),
    nftContractAddress,
    minter.toHexString(),
  ]);

  let nftEntity = Nft.load(id);
  if (!nftEntity) {
    nftEntity = new Nft(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.TransferSingle));

  nftEntity.block_number = event.block.number;
  nftEntity.nft_contract = nftContractAddress;
  nftEntity.minter = minter;
  nftEntity.token_id = tokenId;
  nftEntity.nft_transaction = transaction.id;

  // Todo - group id 를 추출하는 것

  // const input = event.transaction.input;
  // const startByte = 7;
  // const byteLen = 1;
  // const groupIdByte = input.subarray(4 + 32 * startByte, 4 + 32 * (startByte + byteLen)) as ByteArray;
  // const groupIdHex = groupIdByte.toHexString();
  // log.debug('___LOG___groupIdByte_DECODE {}', [groupIdHex]);
  // const groupId = Bytes.fromUint8Array(event.transaction.input.subarray(4 + 32 * 7, 4 + 32 * 8));
  // const val = BigInt.fromString(groupId.toHexString());
  // log.debug('___LOG___GROUPID_DECODE {}', [val.toHexString()]);
  /* const scheduleId = `${nftContractAddress}_${groupIdHex}`;
  const mintScheduleEntity = MintSchedule.load(scheduleId);
  if (mintScheduleEntity) {
    nftEntity.mintSchedule = scheduleId;
    mintScheduleEntity.mintedTotal = mintScheduleEntity.mintedTotal.plus(BigInt.fromI32(1));
    mintScheduleEntity.save();
  }*/

  nftEntity.save();
}

export function handleUri(event: Uri): void {
  const contractEntity = Contract.load(event.address.toHexString());

  const transaction = saveTransaction(event, getEventName(EventName.Uri));

  if (contractEntity) {
    contractEntity.block_number = event.block.number;
    contractEntity.is_revealed = true;
    contractEntity.reveal_url = event.params.uri;
    contractEntity.save();
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const contractEntity = Contract.load(event.address.toHexString());

  saveTransaction(event, getEventName(EventName.Uri));

  if (contractEntity) {
    contractEntity.block_number = event.block.number;
    contractEntity.owner = event.params.newOwner;
    contractEntity.save();
  }
}
