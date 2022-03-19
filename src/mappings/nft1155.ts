import { OwnershipTransferred, TransferSingle, Uri } from '../types/templates/OmnuumNFT1155/OmnuumNFT1155';
import { Contract, Mint } from '../types/schema';
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

  let mintEntity = Mint.load(id);
  if (!mintEntity) {
    mintEntity = new Mint(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.TransferSingle));

  mintEntity.blockNumber = event.block.number;
  mintEntity.contract = nftContractAddress;
  mintEntity.minter = minter;
  mintEntity.tokenId = tokenId;
  mintEntity.mint_transaction = transaction.id;
  mintEntity.save();
}

export function handleUri(event: Uri): void {
  const contractEntity = Contract.load(event.address.toHexString());

  saveTransaction(event, getEventName(EventName.Uri));

  if (contractEntity) {
    contractEntity.blockNumber = event.block.number;
    contractEntity.is_removed = true;
    contractEntity.reveal_url = event.params.uri;
    contractEntity.save();
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const contractEntity = Contract.load(event.address.toHexString());

  saveTransaction(event, getEventName(EventName.Uri));

  if (contractEntity) {
    contractEntity.blockNumber = event.block.number;
    contractEntity.owner = event.params.newOwner;
    contractEntity.save();
  }
}
