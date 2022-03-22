import { Mint, MintSchedule } from '../types/schema';
import { PublicMint, SetPublicSchedule } from '../types/OmnuumMintManager/OmnuumMintManager';
import { EventName, getEventName, getMintTopic, getUniqueIdFromTxLog, MintTopic, saveTransaction } from '../utils';

export function handleSetPublicSchedule(event: SetPublicSchedule): void {
  const nftContractAddress = event.params.nft.toHexString();
  const mintScheduleGroupId = event.params.groupId;

  const id = `${nftContractAddress}_${mintScheduleGroupId.toHexString()}`;

  let mintScheduleEntity = MintSchedule.load(id);
  if (!mintScheduleEntity) {
    mintScheduleEntity = new MintSchedule(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.SetPublicSchedule));

  mintScheduleEntity.block_number = event.block.number;
  mintScheduleEntity.mint_schedule_transaction = transaction.id;
  mintScheduleEntity.nft_contract = nftContractAddress;
  mintScheduleEntity.topic = getMintTopic(MintTopic.PUBLIC);
  mintScheduleEntity.group_id = mintScheduleGroupId;
  mintScheduleEntity.end_date = event.params.endDate;
  mintScheduleEntity.base_price = event.params.basePrice;
  mintScheduleEntity.mint_supply = event.params.supply;
  mintScheduleEntity.max_qty_per_address = event.params.maxMintAtAddress;

  mintScheduleEntity.save();
}

/*
 * Target Entity: [Mint]
 * id: transactionHash(hex)_logIndex(hex)
 * */
export function handlePublicMint(event: PublicMint): void {
  const id = getUniqueIdFromTxLog(event);

  let mintEntity = Mint.load(id);
  if (!mintEntity) {
    mintEntity = new Mint(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.PublicMint));

  const nftContractAddress = event.params.nftContract.toHexString();

  mintEntity.block_number = event.block.number;
  mintEntity.mint_transaction = transaction.id;
  mintEntity.nft_contract = nftContractAddress;
  mintEntity.mint_schedule = `${nftContractAddress}_${event.params.groupId.toHexString()}`;
  mintEntity.minter = event.params.minter;
  mintEntity.mint_quantity = event.params.quantity;
  mintEntity.max_quantity = event.params.maxQuantity;
  mintEntity.price = event.params.price;
  mintEntity.save();
}
