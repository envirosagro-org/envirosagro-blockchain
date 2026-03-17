
import { Type } from "@google/genai";
import { InternalControlState, UserRole } from "../types";
import { callBackendEA } from "./agroLangService";

const FALLBACK_STATE: InternalControlState = {
  balanceOfPowers: { stewardship: 50, governance: 50, treasury: 50, intelligence: 50 },
  activeRules: [
    { id: 'FALLBACK_1', name: 'System Integrity Check', description: 'Agro Lang Dispatcher is currently in fallback mode. Protocols are being enforced by static rules.', protocol: 'STATIC_FALLBACK', isActive: true, severity: 'MEDIUM' }
  ],
  responsibilities: [
    { id: 'RESP_FALLBACK', role: 'STEWARD', task: 'Verify system connectivity and API key configuration.', status: 'ACTIVE', priority: 1 }
  ],
  globalAnalysis: { networkHealth: 100, totalTreasury: 1000000, systemLiquidity: 500000, userLiquidity: 500000 }
};

export async function dispatchInternalControls(userRole: UserRole, currentPath: string): Promise<InternalControlState> {
  const prompt = `
    As the EnvirosAgro Agro Lang Internal Control Dispatcher, analyze the current system state for a user with role: ${userRole} at path: ${currentPath}.
    
    Generate a JSON response following this schema:
    {
      "balanceOfPowers": {
        "stewardship": number (0-100),
        "governance": number (0-100),
        "treasury": number (0-100),
        "intelligence": number (0-100)
      },
      "activeRules": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "protocol": "string",
          "isActive": boolean,
          "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
        }
      ],
      "responsibilities": [
        {
          "id": "string",
          "role": "${userRole}",
          "task": "string",
          "status": "PENDING" | "ACTIVE",
          "priority": number
        }
      ],
      "globalAnalysis": {
        "networkHealth": number (0-100),
        "totalTreasury": number,
        "systemLiquidity": number,
        "userLiquidity": number
      }
    }

    Ensure the rules and responsibilities are aligned with the EnvirosAgro Blockchain operations sequence and immutable internal control protocols.
  `;

  try {
    const response = await callBackendEA({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            balanceOfPowers: {
              type: Type.OBJECT,
              properties: {
                stewardship: { type: Type.NUMBER },
                governance: { type: Type.NUMBER },
                treasury: { type: Type.NUMBER },
                intelligence: { type: Type.NUMBER }
              },
              required: ["stewardship", "governance", "treasury", "intelligence"]
            },
            activeRules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  protocol: { type: Type.STRING },
                  isActive: { type: Type.BOOLEAN },
                  severity: { type: Type.STRING }
                },
                required: ["id", "name", "description", "protocol", "isActive", "severity"]
              }
            },
            responsibilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  role: { type: Type.STRING },
                  task: { type: Type.STRING },
                  status: { type: Type.STRING },
                  priority: { type: Type.NUMBER }
                },
                required: ["id", "role", "task", "status", "priority"]
              }
            },
            globalAnalysis: {
              type: Type.OBJECT,
              properties: {
                networkHealth: { type: Type.NUMBER },
                totalTreasury: { type: Type.NUMBER },
                systemLiquidity: { type: Type.NUMBER },
                userLiquidity: { type: Type.NUMBER }
              },
              required: ["networkHealth", "totalTreasury", "systemLiquidity", "userLiquidity"]
            }
          },
          required: ["balanceOfPowers", "activeRules", "responsibilities", "globalAnalysis"]
        }
      }
    });

    const text = response.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    
    // Validate result structure to prevent crashes
    if (!result.balanceOfPowers || !result.activeRules || !result.responsibilities || !result.globalAnalysis) {
      console.warn("Incomplete Internal Control State received from AI, merging with fallback.");
      return { ...FALLBACK_STATE, ...result };
    }

    return result as InternalControlState;
  } catch (error) {
    console.error("Internal Control Dispatcher Error:", error);
    return FALLBACK_STATE;
  }
}
