import { saveCollectionItem, dispatchNetworkSignal } from './firebaseService';
import { calculateMConstant, calculateAgroCode, generateShardHash, mintCarbonShard } from '../systemFunctions';

/**
 * The Universal Dispatcher for EnvirosAgro Blockchain
 * This handles everything from Tokenz payments to Medicag data logging.
 * It provides a standardized entry point for all industrial and biological shards.
 */
export async function dispatchAgroProcess({ instruction, actor, payload }: { instruction: string, actor: string, payload: any }) {
    console.log(`[EnvirosAgro BC] Initializing instruction: ${instruction} for ${actor}`);

    const nonce = await generateShardHash(actor + instruction + Date.now().toString());

    const txHeader = {
        timestamp: Date.now(),
        instruction,
        actor,
        nonce, 
    };

    try {
        switch (instruction) {
            case 'MINT_CARBON':
                return await executeMinting(txHeader, payload);

            case 'PROCESS_PAYMENT':
                return await executePayment(txHeader, payload);

            case 'LOG_SUSTAINABILITY':
                return await executeDataLog(txHeader, payload);

            case 'UPDATE_SUPPLY_CHAIN':
                return await executeSupplyUpdate(txHeader, payload);

            default:
                throw new Error(`Unknown Instruction: ${instruction}`);
        }
    } catch (error: any) {
        handleProcessFailure(txHeader, error);
        throw error;
    }
}

async function executeMinting(header: any, payload: any) {
    const { value, unit } = mintCarbonShard(payload.amount || 0, payload.confidence || 0.85);
    
    const shardId = await saveCollectionItem('transactions', {
        type: 'TokenzMint',
        farmId: header.actor,
        details: `Carbon Mint: ${payload.amount || 0} tCO2e [Nonce: ${header.nonce}]`,
        value: value,
        unit: unit
    });
    
    await dispatchNetworkSignal({
        type: 'ledger_anchor',
        origin: 'CARBON',
        title: 'MINT_FINALITY_REACHED',
        message: `Carbon shard ${header.nonce} successfully minted to ledger. Yield: ${value} EAC.`,
        priority: 'high',
        actionIcon: 'Zap'
    });
    
    return { status: 'SUCCESS', shardId, header, value };
}

async function executePayment(header: any, payload: any) {
    const shardId = await saveCollectionItem('transactions', {
        type: 'Transfer',
        farmId: header.actor,
        details: `Payment: ${payload.reason || 'General Settlement'} [Nonce: ${header.nonce}]`,
        value: -(payload.amount || 0),
        unit: 'EAC'
    });
    
    return { status: 'SUCCESS', shardId, header };
}

async function executeDataLog(header: any, payload: any) {
    const shardId = await saveCollectionItem('media_ledger', {
        title: `LOG_${(payload.brand || 'GENERIC').toUpperCase()}_${header.nonce}`,
        type: 'INGEST',
        source: payload.brand || 'System',
        author: payload.stewardName || 'System',
        authorEsin: header.actor,
        timestamp: new Date().toISOString(),
        hash: header.nonce,
        mImpact: payload.mImpact || "1.42",
        content: payload.data || ""
    });
    
    return { status: 'SUCCESS', shardId, header };
}

async function executeSupplyUpdate(header: any, payload: any) {
    const shardId = await saveCollectionItem('orders', {
        ...payload,
        trackingHash: header.nonce,
        lastModified: header.timestamp
    });
    
    return { status: 'SUCCESS', shardId, header };
}

function handleProcessFailure(header: any, error: any) {
    console.error(`[EnvirosAgro BC] Process Failure: ${header.instruction}`, error);
    dispatchNetworkSignal({
        type: 'system',
        origin: 'ORACLE',
        title: 'DISPATCH_ERROR',
        message: `Instruction ${header.instruction} failed signature check or registry sync.`,
        priority: 'critical',
        actionIcon: 'ShieldAlert'
    });
}
