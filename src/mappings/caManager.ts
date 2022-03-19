import { log } from '@graphprotocol/graph-ts';
import {
  OmnuumCAManager,
  ManagerContractRegistered,
  ManagerContractRemoved,
  NftContractRegistered,
} from '../types/OmnuumCAManager/OmnuumCAManager';

import { Contract } from '../types/schema';
import { OmnuumNFT1155 } from '../types/templates';
import { OmnuumNFT1155 as NftContract } from '../types/templates/OmnuumNFT1155/OmnuumNFT1155';
import { getEventName, saveTransaction, EventName, convertContractTopicHashToString } from '../utils';

export function handleNftContractRegistered(event: NftContractRegistered): void {
  OmnuumNFT1155.create(event.params.nftContract);

  const id = event.params.nftContract.toHexString();

  let contractEntity = Contract.load(id);
  if (!contractEntity) {
    contractEntity = new Contract(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.NftContractRegistered));
  const nftContract = NftContract.bind(event.params.nftContract);

  contractEntity.blockNumber = event.block.number;
  contractEntity.register_transaction = transaction.id;
  contractEntity.owner = event.params.nftOwner;
  contractEntity.topic = 'NFT';
  contractEntity.is_removed = false;
  contractEntity.max_supply = nftContract.maxSupply();
  contractEntity.is_revealed = nftContract.isRevealed();
  contractEntity.cover_url = nftContract.coverUri();

  contractEntity.save();

  log.debug('CONTRACT_NFT_____TOPIC {}', ['NFT']);
}

export function handleManagerContractRegistered(event: ManagerContractRegistered): void {
  const id = event.params.managerContract.toHexString();

  let contractEntity = Contract.load(id);
  if (!contractEntity) {
    contractEntity = new Contract(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.ManagerContractRegistered));

  contractEntity.blockNumber = event.block.number;
  contractEntity.register_transaction = transaction.id;
  contractEntity.owner = event.transaction.from;
  contractEntity.topic = convertContractTopicHashToString(event.params.topic.toHexString());
  contractEntity.is_removed = false;
  contractEntity.save();

  log.debug('CONTRACT_MANAGER_____TOPIC {}', [event.params.topic.toHexString()]);
}
export function handleManagerContractRemoved(event: ManagerContractRemoved): void {
  const id = event.params.managerContract.toHexString();

  let contractEntity = Contract.load(id);

  const transaction = saveTransaction(event, getEventName(EventName.ManagerContractRemoved));

  if (contractEntity) {
    contractEntity.blockNumber = event.block.number;
    contractEntity.remove_transaction = transaction.id;
    contractEntity.is_removed = true;
    contractEntity.save();
  }
}
