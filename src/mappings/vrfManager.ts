import { RequestVRF, ResponseVRF } from '../types/OmnuumVRFManager/OmnuumVRFManager';
import { Reveal } from '../types/schema';
import { convertVrfTopicHashToString, EventName, getEventName, saveTransaction } from '../utils';
import { log } from '@graphprotocol/graph-ts';
import { getDebugMessgage, LogMessage } from '../utils/logger';

export function handleRequestVRF(event: RequestVRF): void {
  const topicString = convertVrfTopicHashToString(event.params.topic.toHexString());

  // Process revel entity only when VRF topic is REVEAL_PFP
  if (topicString === 'REVEAL_PFP') {
    const id = event.params.requestId.toHexString();

    let revealEntity = Reveal.load(id);
    if (!revealEntity) {
      revealEntity = new Reveal(id);
    }

    const transaction = saveTransaction(event, getEventName(EventName.RequestVRF));

    revealEntity.block_number = event.block.number;
    revealEntity.nft_contract = event.params.roller.toHexString();
    revealEntity.random_request_transaction = transaction.id;
    revealEntity.topic = topicString;
    revealEntity.save();
  }
}

export function handleResponseVRF(event: ResponseVRF): void {
  const topicString = convertVrfTopicHashToString(event.params.topic.toHexString());

  // Process revel entity only when VRF topic is REVEAL_PFP
  if (topicString === 'REVEAL_PFP') {
    const id = event.params.requestId.toHexString();

    const revealEntity = Reveal.load(id);

    // Expect revealEntity exists due to request event occurred prior to response
    if (revealEntity) {
      const transaction = saveTransaction(event, getEventName(EventName.ResponseVRF));
      revealEntity.block_number = event.block.number;
      revealEntity.random_response_transaction = transaction.id;
      revealEntity.random_number = event.params.randomness;
      revealEntity.save();
    } else {
      log.debug(`${getDebugMessgage(LogMessage.___NO_ENTITY)} @ revealEntity with id: {}`, [id]);
    }
  }
}
