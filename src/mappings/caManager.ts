import { log } from '@graphprotocol/graph-ts';
import {
  ManagerContractRegistered,
  ManagerContractRemoved,
  NftContractRegistered,
} from '../types/OmnuumCAManager/OmnuumCAManager';

import { Contract } from '../types/schema';
import { OmnuumNFT1155 as NftTemplate } from '../types/templates';
import { OmnuumNFT1155 as NftContract } from '../types/templates/OmnuumNFT1155/OmnuumNFT1155';
import {
  getEventName,
  saveTransaction,
  EventName,
  ContractTopic,
  convertContractTopicHashToString,
  getContractTopic,
} from '../utils';

export function handleNftContractRegistered(event: NftContractRegistered): void {
  const nftAddress = event.params.nftContract;
  const id = nftAddress.toHexString();
  const contractTopic = getContractTopic(ContractTopic.NFT);

  log.info('___LOG handleNftContractRegistered id: {} topic: {}', [id, contractTopic]);

  let contractEntity = Contract.load(id);
  if (!contractEntity) {
    log.debug('___LOGGER nft_template_creation nftAddress: {}', [id]);
    contractEntity = new Contract(id);
    NftTemplate.create(nftAddress);
  } else {
    log.debug('___LOGGER nft_template_duplication nftAddress: {}', [id]);
  }

  const transaction = saveTransaction(event, getEventName(EventName.NftContractRegistered));

  contractEntity.block_number = event.block.number;
  contractEntity.register_transaction = transaction.id;
  contractEntity.owner = event.params.nftOwner;
  contractEntity.topic = contractTopic;
  contractEntity.is_removed = false;
  contractEntity.save();

  // const nftContract = NftContract.bind(event.params.nftContract);
  // log.debug('___LOGGER NftContract_binding nftAddress: {}', [event.params.nftContract.toHexString()]);
  //
  // const maxSupplyResult = nftContract.try_maxSupply();
  // if (maxSupplyResult.reverted) {
  //   log.debug('maxSupply reverted', []);
  // } else {
  //   contractEntity.max_supply = maxSupplyResult.value;
  // }
  //
  // const isRevealedResult = nftContract.try_isRevealed();
  // if (isRevealedResult.reverted) {
  //   log.debug('is_revealed reverted', []);
  // } else {
  //   contractEntity.is_revealed = isRevealedResult.value;
  // }
  //
  // const coverUriResult = nftContract.try_coverUri();
  // if (coverUriResult.reverted) {
  //   log.debug('coverUri reverted', []);
  // } else {
  //   contractEntity.cover_url = coverUriResult.value;
  // }
  // contractEntity.save();
}

export function handleManagerContractRegistered(event: ManagerContractRegistered): void {
  const id = event.params.managerContract.toHexString();
  const contractTopic = convertContractTopicHashToString(event.params.topic.toHexString());

  log.info('___LOG handleManagerContractRegistered id: {} topic: {}', [id, contractTopic]);

  let contractEntity = Contract.load(id);
  if (!contractEntity) {
    contractEntity = new Contract(id);
  }

  const transaction = saveTransaction(
    event,
    getEventName(EventName.ManagerContractRegistered),
    contractTopic === 'CAMANAGER' ? contractTopic : ''
  );

  contractEntity.block_number = event.block.number;
  contractEntity.register_transaction = transaction.id;
  contractEntity.owner = event.transaction.from;
  contractEntity.topic = contractTopic;
  contractEntity.is_removed = false;
  contractEntity.save();

  log.debug('CONTRACT_MANAGER_____TOPIC: {}', [event.params.topic.toHexString()]);
}
export function handleManagerContractRemoved(event: ManagerContractRemoved): void {
  const id = event.params.managerContract.toHexString();

  log.info('___LOG handleManagerContractRemoved id: {}', [id]);

  const contractEntity = Contract.load(id);

  const transaction = saveTransaction(event, getEventName(EventName.ManagerContractRemoved));

  if (contractEntity) {
    contractEntity.block_number = event.block.number;
    contractEntity.remove_transaction = transaction.id;
    contractEntity.is_removed = true;
    contractEntity.save();
  }
}
