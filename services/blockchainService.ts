import { AgroBlock, AgroTransaction } from '../types';
import { saveCollectionItem } from './firebaseService';

/**
 * ENVIROSAGRO BLOCKCHAIN SERVICE (STAGING)
 * Verifiable SHA-256 hashing and Firestore persistence.
 */

export const generateHash = async (data: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(data + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32).toUpperCase();
};

export const createGenesisBlock = async (): Promise<AgroBlock> => {
  const genesis: AgroBlock = {
    hash: '0x0000_GENESIS_SYCAMORE_ROOT',
    prevHash: '0x0000_VOID',
    timestamp: new Date().toISOString(),
    transactions: [{
      id: 'TX-GENESIS',
      type: 'TokenzMint',
      farmId: 'CORE-HQ',
      details: 'EnvirosAgro Network Genesis Sequence',
      value: 1000000,
      unit: 'EAC'
    }],
    validator: 'EA-ORACLE-01',
    status: 'Confirmed'
  };

  await saveCollectionItem('blocks', genesis);
  return genesis;
};

export const mineBlock = async (prevBlock: AgroBlock, mempool: AgroTransaction[], validator: string): Promise<AgroBlock> => {
  const hash = await generateHash(prevBlock.hash + JSON.stringify(mempool) + validator);
  const block: AgroBlock = {
    hash,
    prevHash: prevBlock.hash,
    timestamp: new Date().toISOString(),
    transactions: [...mempool],
    validator,
    status: 'Confirmed'
  };

  // Persist block shard to the permanent registry
  await saveCollectionItem('blocks', block);
  
  return block;
};

export const VALIDATORS = [
  'Environmental_Validator_04',
  'Societal_Consensus_Node_82',
  'Technological_Auth_Shard_12',
  'Human_Wellness_Relay_01',
  'Industrial_Core_Finalizer'
];
