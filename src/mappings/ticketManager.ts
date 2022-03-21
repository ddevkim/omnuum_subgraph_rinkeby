import { log, BigInt } from '@graphprotocol/graph-ts';
import { MintSchedule } from '../types/schema';
import { SetTicketSchedule } from '../types/TicketManager/TicketManager';
import { saveTransaction, getEventName, EventName } from '../utils';

export function handleSetTicketSchedule(event: SetTicketSchedule): void {
  const nftContractAddress = event.params.nft;
  const mintScheduleGroupId = event.params.groupId;

  const id = `${nftContractAddress}_${mintScheduleGroupId}`;

  let mintScheduleEntity = MintSchedule.load(id);
  if (!mintScheduleEntity) {
    mintScheduleEntity = new MintSchedule(id);
  }

  const transaction = saveTransaction(event, getEventName(EventName.SetTicketSchedule));

  mintScheduleEntity.blockNumber = event.block.number;
  mintScheduleEntity.mint_schedule_transaction = transaction.id;
  mintScheduleEntity.contract = nftContractAddress.toHexString();
  mintScheduleEntity.groupId = mintScheduleGroupId;
  mintScheduleEntity.topic = 'Ticket';
  mintScheduleEntity.mintedTotal = BigInt.zero();

  mintScheduleEntity.save();
}
