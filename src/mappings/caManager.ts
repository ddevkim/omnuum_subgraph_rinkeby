import { ManagerContractRegistered, ManagerContractRemoved, NftContractRegistered } from '../types/OmnuumCAManager/OmnuumCAManager';
import { NftContract } from '../types/schema';
import { saveTransaction } from '../utils';

export function handleNftContractRegistered(event: NftContractRegistered): void {
    const id = event.params.
}
export function handleContractRegistered(event: ManagerContractRegistered): void {}
export function handleContractRemoved(event: ManagerContractRemoved): void {}
