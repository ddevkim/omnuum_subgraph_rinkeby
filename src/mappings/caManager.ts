import { log } from '@graphprotocol/graph-ts';
import {
  ManagerContractRegistered,
  ManagerContractRemoved,
  NftContractRegistered,
} from '../types/OmnuumCAManager/OmnuumCAManager';

import { Contract } from '../types/schema';
import { OmnuumNFT1155 } from '../types/templates';
import { OmnuumNFT1155 as NftContract } from '../types/templates/OmnuumNFT1155/OmnuumNFT1155';
import {
  getEventName,
  saveTransaction,
  EventName,
  ContractTopic,
  convertContractTopicHashToString,
  getContractTopicFromString,
} from '../utils';

export function handleNftContractRegistered(event: NftContractRegistered): void {
  const id = event.params.nftContract.toHexString();
  const contractTopic = getContractTopicFromString(ContractTopic.NFT);

  log.info('___handleNftContractRegistered id: {} topic: {}', [id, contractTopic]);

  OmnuumNFT1155.create(event.params.nftContract);

  let contractEntity = Contract.load(id);
  if (!contractEntity) {
    contractEntity = new Contract(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.NftContractRegistered), contractTopic);

  const nftContract = NftContract.bind(event.params.nftContract);

  contractEntity.blockNumber = event.block.number;
  contractEntity.register_transaction = transaction.id;
  contractEntity.owner = event.params.nftOwner;
  contractEntity.topic = contractTopic;
  contractEntity.is_removed = false;
  contractEntity.max_supply = nftContract.maxSupply();
  contractEntity.is_revealed = nftContract.isRevealed();
  contractEntity.cover_url = nftContract.coverUri();

  contractEntity.save();
}

export function handleManagerContractRegistered(event: ManagerContractRegistered): void {
  const id = event.params.managerContract.toHexString();
  const contractTopic = convertContractTopicHashToString(event.params.topic.toHexString());

  log.info('___handleManagerContractRegistered id: {} topic: {}', [id, contractTopic]);

  let contractEntity = Contract.load(id);
  if (!contractEntity) {
    contractEntity = new Contract(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.ManagerContractRegistered), contractTopic);

  contractEntity.blockNumber = event.block.number;
  contractEntity.register_transaction = transaction.id;
  contractEntity.owner = event.transaction.from;
  contractEntity.topic = contractTopic;
  contractEntity.is_removed = false;
  contractEntity.save();

  log.debug('CONTRACT_MANAGER_____TOPIC: {}', [event.params.topic.toHexString()]);
}
export function handleManagerContractRemoved(event: ManagerContractRemoved): void {
  const id = event.params.managerContract.toHexString();

  log.info('___handleManagerContractRemoved id: {}', [id]);

  let contractEntity = Contract.load(id);

  const transaction = saveTransaction(event, getEventName(EventName.ManagerContractRemoved));

  if (contractEntity) {
    contractEntity.blockNumber = event.block.number;
    contractEntity.remove_transaction = transaction.id;
    contractEntity.is_removed = true;
    contractEntity.save();
  }
}
