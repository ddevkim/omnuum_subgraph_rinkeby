import { Mint, MintSchedule } from '../types/schema';
import { SetTicketSchedule, TicketMint } from '../types/TicketManager/TicketManager';
import { saveTransaction, getEventName, EventName, getUniqueIdFromTxLog, getMintTopic, MintTopic } from '../utils';

export function handleSetTicketSchedule(event: SetTicketSchedule): void {
  const nftContractAddress = event.params.nft.toHexString();
  const mintScheduleGroupId = event.params.groupId;

  const id = `${nftContractAddress}_${mintScheduleGroupId.toHexString()}`;

  let mintScheduleEntity = MintSchedule.load(id);
  if (!mintScheduleEntity) {
    mintScheduleEntity = new MintSchedule(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.SetTicketSchedule));

  mintScheduleEntity.block_number = event.block.number;
  mintScheduleEntity.mint_schedule_transaction = transaction.id;
  mintScheduleEntity.nft_contract = nftContractAddress;
  mintScheduleEntity.group_id = mintScheduleGroupId;
  mintScheduleEntity.end_date = event.params.endDate;
  mintScheduleEntity.topic = getMintTopic(MintTopic.TICKET);

  mintScheduleEntity.save();
}

/*
 * Target Entity: [Mint]
 * id: transactionHash(hex)_logIndex(hex)
 * */
export function handlerTicketMint(event: TicketMint): void {
  const id = getUniqueIdFromTxLog(event);

  let mintEntity = Mint.load(id);
  if (!mintEntity) {
    mintEntity = new Mint(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.TicketMint));

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
