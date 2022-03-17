import {
  ManagerContractRegistered,
  ManagerContractRemoved,
  NftContractRegistered,
} from '../types/OmnuumCAManager/OmnuumCAManager';
import { Contract } from '../types/schema';
import { convertContractTopicToString, saveTransaction } from '../utils';

export function handleNftContractRegistered(event: NftContractRegistered): void {
  const id = event.params.nftContract.toHexString();

  let contractEntity = Contract.load(id);
  if (!contractEntity) {
    contractEntity = new Contract(id);
  }
  const transaction = saveTransaction(event);

  contractEntity.id = id;
  contractEntity.register_transaction = transaction.id;
  contractEntity.owner = event.params.nftOwner;
  contractEntity.topic = 'NFT';
  contractEntity.is_removed = false;
  contractEntity.save();
}
export function handleContractRegistered(event: ManagerContractRegistered): void {
  const id = event.params.managerContract.toHexString();

  let contractEntity = Contract.load(id);
  if (!contractEntity) {
    contractEntity = new Contract(id);
  }
  const transaction = saveTransaction(event);

  contractEntity.id = id;
  contractEntity.register_transaction = transaction.id;
  contractEntity.owner = event.transaction.from;
  contractEntity.topic = convertContractTopicToString(event.params.topic);
  contractEntity.is_removed = false;
  contractEntity.save();
}
export function handleContractRemoved(event: ManagerContractRemoved): void {
  const id = event.params.managerContract.toHexString();

  let contractEntity = Contract.load(id);
  const transaction = saveTransaction(event);

  if (contractEntity) {
    contractEntity.is_removed = true;
    contractEntity.remove_transaction = transaction.id;
    contractEntity.save();
  }
}
