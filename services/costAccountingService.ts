
import { SustainabilityMetrics, ShardCostCalibration } from '../types';
import { calculateMConstant } from '../systemFunctions';

/**
 * ENVIROSAGRO COST ACCOUNTING ORACLE
 * Logic: C_s = (C_b / m) * (1 + S_load)
 */

export const calibrateShardCost = (
  baseCost: number, 
  metrics: SustainabilityMetrics, 
  loadFactor: number = 0.05
): number => {
  // Use the system m-constant for calibration
  // Assume Dn=0.92, In=0.78 as regional defaults for cost baseline
  const m = calculateMConstant(0.92, 0.78, metrics.agriculturalCodeU, 0.12);
  
  // Normalization: Nodes at genesis resonance (m=1.0) pay full price.
  // Nodes at peak resonance (m=1.618) receive ~38% discount.
  const resonanceMultiplier = 1 / Math.max(m, 0.5);
  
  // Apply load factor (stress on the network)
  const stressMultiplier = 1 + loadFactor;
  
  return Math.ceil(baseCost * resonanceMultiplier * stressMultiplier);
};

export const calibrateMintingYield = (
  baseReward: number,
  metrics: SustainabilityMetrics
): number => {
  const m = calculateMConstant(0.92, 0.78, metrics.agriculturalCodeU, 0.12);
  const ca = metrics.agriculturalCodeU;
  
  // Formula: R_s = R_b * m * Ca
  // High resonance and stewardship result in exponentially higher minting rewards.
  return Math.floor(baseReward * m * ca);
};

export const getFullCostAudit = (
  baseCost: number, 
  metrics: SustainabilityMetrics
): ShardCostCalibration => {
  const m = calculateMConstant(0.92, 0.78, metrics.agriculturalCodeU, 0.12);
  const calibrated = calibrateShardCost(baseCost, metrics);
  
  return {
    shardId: `ACC-AUDIT-${Date.now()}`,
    baseCost,
    calibratedCost: calibrated,
    mConstant: m,
    caFactor: metrics.agriculturalCodeU,
    sehtiBonus: m > 1.42 ? 15 : 0,
    stressPenalty: m < 1.0 ? 25 : 0,
    finalYield: calibrateMintingYield(100, metrics)
  };
};
