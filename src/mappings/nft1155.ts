import { OwnershipTransferred, TransferSingle, Uri } from '../types/templates/OmnuumNFT1155/OmnuumNFT1155';
import { Contract, Mint } from '../types/schema';
import { saveTransaction, getEventName, EventName } from '../utils';

export function handleTransferSingle(event: TransferSingle): void {
  const nftContractAddress = event.address;
  const tokenId = event.params.id;
  const id = `${nftContractAddress}_${tokenId}`;

  let mintEntity = Mint.load(id);
  if (!mintEntity) {
    mintEntity = new Mint(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.TransferSingle));

  mintEntity.blockNumber = event.block.number;
  mintEntity.contract = nftContractAddress.toHexString();
  mintEntity.minter = event.params.to;
  mintEntity.tokenId = tokenId;
  mintEntity.mint_transaction = transaction.id;
  mintEntity.save();
}

export function handleUri(event: Uri): void {
  const contractEntity = Contract.load(event.address.toHexString());
  if (contractEntity) {
    contractEntity.blockNumber = event.block.number;
    contractEntity.is_removed = true;
    contractEntity.reveal_url = event.params.uri;
    contractEntity.save();
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const contractEntity = Contract.load(event.address.toHexString());
  if (contractEntity) {
    contractEntity.blockNumber = event.block.number;
    contractEntity.owner = event.params.newOwner;
    contractEntity.save();
  }
}
