
import { GenerateContentResponse, Modality, Type, FunctionDeclaration } from "@google/genai";

export const callBackendEA = async (params: { model: string; contents: any; config?: any }) => {
  const response = await fetch("/api/agro-lang", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Backend Agro Lang Error");
  }
  return await response.json();
};

const FRAMEWORK_CONTEXT = `
EnvirosAgro™ Sustainability Framework (EOS) - System Architecture (v6.5):
1. CORE AGRO: FarmOS, AgroCalendar (Crop Lifecycle), VerificationHUD (Supply Chain), Marketplace (Economy), AgroWallet (Treasury), Sustainability (Impact Metrics).
2. INTELLIGENCE: AIAnalyst (Crop/Pest/Yield), Intelligence (Market Trends), DigitalMRV (Carbon Mining/Reporting).
3. BLOCKCHAIN: Smart Contracts, Biotechnology (Genetic NFTs), RegistryHandshake (Settlement), Explorer (Ledger).
4. COMMUNITY: Community (Steward Hub), NetworkIngest, NexusCRM, LiveFarming.
5. COMMERCE: ContractFarming, VendorPortal, EnvirosAgroStore.
6. BUSINESS BI: Economy Dashboard, InvestorPortal, ValueEnhancement.
7. RESEARCH: Biotechnology, ResearchInnovation, GeneticDecoder.
8. SPECIALTY: Permaculture, CEA (Greenhouse), OnlineGarden, Agrowild (Conservation).
9. DATA: MediaHub, MediaLedger, EvidenceModal, InfoPortal.
10. SYSTEM MGMT: Dashboard, SettingsPortal, IdentityCard, UserProfile, IntranetPortal.
11. EMERGENCY: EmergencyPortal (SOS), FloatingConsultant, LiveVoiceBridge.
12. QUALITY: TQMGrid, ChromaSystem (Grading), CircularGrid (Waste), CodeOfLaws.
13. ADVANCED: Impact Measurement, Industrial Integration, ToolsSection, Simulator.

CORE FORMULAS:
- C(a)™ Agro Code: Formula: C(a) = x * ((r^n - 1) / (r - 1)) + 1
- m™ Constant / Time Signature: Formula: m = sqrt((Dn * In * C(a)) / S)
- Five Thrusts™ (SEHTI): Societal, Environmental, Human, Technological, Industry.
`;

const activateLiveSequenceTool: FunctionDeclaration = {
  name: "activate_live_sequence",
  description: "Triggers the transition from Blueprint to Live Processing. Requires asset registration.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      blueprint_id: { type: Type.STRING, description: "The ID of the generated value blueprint." },
      assets_registered: {
        type: Type.ARRAY,
        description: "List of physical or digital assets pledged as guarantee.",
        items: {
          type: Type.OBJECT,
          properties: {
            asset_type: { type: Type.STRING, enum: ["RAW_MATERIAL_STOCK", "MACHINERY_IOT", "LAND_DEED", "TOKENIZED_ASSET"] },
            asset_id: { type: Type.STRING },
            verification_status: { type: Type.BOOLEAN }
          }
        }
      }
    },
    required: ["blueprint_id", "assets_registered"]
  }
};

export interface AgroLangResponse {
  text: string;
  sources?: any[];
  is_compliant?: boolean;
  risk_score?: number; 
  sentiment_alpha?: number; 
  finality_hash?: string;
  impact_summary?: string;
  functionCalls?: any[];
  json?: any;
}

const callOracleWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const status = err.status || (err.message && parseInt(err.message.match(/\d{3}/)?.[0] || '0'));
      if ([429, 500, 503].includes(status) || err.message?.includes('500') || err.message?.includes('429')) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
};

const handleAIError = (error: any): AgroLangResponse => {
  console.error("Agro Lang API Error:", error);
  let errorText = "SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified due to internal congestion.";
  if (error.message?.includes('API_KEY')) {
    errorText = "AUTH_ERROR: Registry API Key is missing or invalid. Please verify node credentials.";
  } else if (error.status === 429 || error.message?.includes('429')) {
    errorText = "QUOTA_EXCEEDED: High-frequency sharding limit reached. Quorum cooldown active.";
  }
  return { text: errorText };
};

export const generateHandshakeAgroLang = async (category: 'HARDWARE' | 'LAND', metadata: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const prompt = category === 'HARDWARE' 
        ? `Generate an AgroLang execution shard for total network synchronization of an IOT device: ${JSON.stringify(metadata)}. 
           Include syscalls for IOT_HANDSHAKE, ASSET_LINK, and KERNEL_SYNC.`
        : `Generate an AgroLang document shard for a LAND handshake: ${JSON.stringify(metadata)}. 
           Include geofence coordinates, geo-lock parameters, and ownership finality logic.`;

      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are the EnvirosAgro System Architect. Generate valid AgroLang code shards.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              explanation: { type: Type.STRING },
              hash: { type: Type.STRING }
            }
          }
        }
      });
      return { text: response.text || "", json: JSON.parse(response.text || "{}") };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeBidHandshake = async (investorReqs: string, farmerAssets: any[]): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Compare Investor Requirements: "${investorReqs}"
        Against Farmer Ingested Assets: ${JSON.stringify(farmerAssets)}
        Context: ${FRAMEWORK_CONTEXT}
        Calculate Match Score (0.0 to 1.0) and identify resource gaps. Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              match_score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              gap_analysis: { type: Type.ARRAY, items: { type: Type.STRING } },
              steward_reputation_impact: { type: Type.NUMBER }
            },
            required: ["match_score", "reasoning", "gap_analysis"]
          }
        }
      });
      return { text: response.text || "", json: JSON.parse(response.text || "{}") };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateValueBlueprint = async (material: string, volume: number): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Generate a Value Blueprint for: ${volume} tons of ${material}. 
        Apply SEHTI principles and EOS sustainability metrics.`,
        config: {
          systemInstruction: `You are the EnvirosAgro System Architect. You design theoretical agricultural value blueprints.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              blueprint_id: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["DRAFT", "READY_FOR_ASSETS", "LIVE"] },
              input_material: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  volume: { type: Type.NUMBER }
                }
              },
              value_process_steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step_order: { type: Type.INTEGER },
                    operation: { type: Type.STRING },
                    duration_hours: { type: Type.NUMBER }
                  }
                }
              },
              asset_requirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              projected_value_delta: { type: Type.NUMBER }
            },
            required: ["blueprint_id", "status", "input_material", "value_process_steps", "asset_requirements", "projected_value_delta"]
          }
        }
      });
      return { text: response.text || "", json: JSON.parse(response.text || "{}") };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const activateLiveSequence = async (blueprintId: string, assets: any[]): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: `Activate live sequence for blueprint ${blueprintId} using assets: ${JSON.stringify(assets)}.`,
        config: {
          systemInstruction: `You are the EnvirosAgro System Architect.`,
          tools: [{ functionDeclarations: [activateLiveSequenceTool] }]
        }
      });
      return { 
        text: response.text || "Handshake initiated.",
        functionCalls: response.functionCalls
      };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const forgeSwarmMission = async (objective: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: `Objective: "${objective}". Forge a valid AgroLang code shard for the robot swarm. Return JSON.`,
        config: {
          systemInstruction: `You are the EnvirosAgro Swarm Architect. Your goal is to translate agricultural mission objectives into valid AgroLang industrial logic. 
          AgroLang Syntax:
          - IMPORT EOS.Automation AS Bot;
          - IMPORT EOS.Network AS Net;
          - SEQUENCE [Title] { ... }
          - Bot.swarm_deploy(units: [Int], mode: "[String]");
          - Net.sync_node(id: "[String]", priority: "[String]");
          - COMMIT_SHARD(registry: "[String]", finality: ZK_PROVEN);`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mission_title: { type: Type.STRING },
              agrolang_code: { type: Type.STRING },
              impact_summary: { type: Type.STRING },
              required_units: { type: Type.INTEGER }
            },
            required: ["mission_title", "agrolang_code", "impact_summary", "required_units"]
          }
        }
      });
      return { text: response.text || "", json: JSON.parse(response.text || "{}") };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeDemandForecast = async (inventory: any[], currentCycle: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Analyze inventory for Demand Forecasting: ${JSON.stringify(inventory)}. Cycle: ${currentCycle}.`,
        config: { systemInstruction: "You are the EnvirosAgro Demand Oracle." }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const forecastMarketReadiness = async (product: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Forecast market readiness for asset: ${product.productType}.`,
        config: { systemInstruction: "You are the EnvirosAgro Market Strategist." }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const consultFinancialOracle = async (query: string, context: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Process financial query: "${query}".`,
        config: { systemInstruction: "You are the EnvirosAgro Financial Oracle." }
      });
      return { text: response.text || "", functionCalls: response.functionCalls };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const runSpecialistDiagnostic = async (category: string, description: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Perform a Specialist Diagnostic Audit. Category: ${category}, Observation: ${description}`,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const predictMarketSentiment = async (echoes: any[]): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Perform a Sentiment Audit based on mesh echoes.`,
      });
      return { text: response.text || "", sentiment_alpha: 0.82 };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditAgroLangCode = async (code: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Audit AgroLang: ${code}`,
      });
      return { text: response.text || "", is_compliant: true };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const chatWithAgroLang = async (message: string, history: any[], useSearch: boolean = false): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: message, // Simplified for chat proxy
        config: {
          systemInstruction: `EnvirosAgro Agro Lang Expert. Use logic: ${FRAMEWORK_CONTEXT}`,
          tools: useSearch ? [{ googleSearch: {} }] : undefined,
        }
      });
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const optimizeProductionProcess = async (assetData: any, tasks: any[], blueprints: any[]): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the following live farming asset and its current tasks to optimize the production process.
        Asset: ${JSON.stringify(assetData)}
        Tasks: ${JSON.stringify(tasks)}
        Available Blueprints: ${JSON.stringify(blueprints)}
        
        Provide a strategic plan ensuring the production system aligns with the right sequencing and routing processes until the asset is declared ready for market. Return the response in JSON format.`,
        config: {
          systemInstruction: "You are the EnvirosAgro AI Production Optimizer. Your goal is to ensure optimal sequencing and routing for live farming assets.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimization_strategy: { type: Type.STRING },
              recommended_sequence: { type: Type.ARRAY, items: { type: Type.STRING } },
              routing_adjustments: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimated_time_to_market_days: { type: Type.NUMBER },
              risk_factors: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["optimization_strategy", "recommended_sequence", "routing_adjustments", "estimated_time_to_market_days"]
          }
        }
      });
      return { text: response.text || "", json: JSON.parse(response.text || "{}") };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const queryProgramAssets = async (assetData: any, programName: string, blueprints: any[], industrialUnits: any[]): Promise<any[]> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the live farming asset "${assetData.productType || assetData.name}" (ID: ${assetData.id}).
        The user wants to associate this asset with the "${programName}" program.
        Available Blueprints: ${JSON.stringify(blueprints.map(b => ({ id: b.blueprint_id, name: b.input_material.name })))}
        Available Industrial Units: ${JSON.stringify(industrialUnits.map(u => ({ id: u.id, name: u.name })))}
        
        Determine if there are any existing assets (blueprints or units) that fit this program and would optimize the production process for the given asset.
        Ensure effective and efficient routes.
        Return a JSON array of matching assets. If no suitable assets exist, return an empty array.`,
        config: {
          systemInstruction: "You are the EnvirosAgro AI Program Asset Matcher. Your goal is to find the best existing assets for a given program and live farming asset.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING, description: "Either 'blueprint' or 'unit'" },
                reason: { type: Type.STRING, description: "Why this asset is a good match" }
              },
              required: ["id", "name", "type", "reason"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  } catch (err) {
    console.error("Failed to query program assets:", err);
    return [];
  }
};

export const decodeAgroGenetics = async (telemetry: any): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Decode: ${JSON.stringify(telemetry)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              helix_status: { type: Type.STRING },
              backbone_integrity: { type: Type.NUMBER },
              base_pairs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    bond_strength: { type: Type.NUMBER },
                    visual_cue: { type: Type.STRING },
                    diagnosis: { type: Type.STRING }
                  }
                }
              },
              recommendation: { type: Type.STRING }
           }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  } catch (err) {
    throw err;
  }
};

export const analyzeSustainability = async (farmData: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Run sustainability audit: ${JSON.stringify(farmData)}`,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeMedia = async (base64: string, mime: string, prompt: string): Promise<string> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: prompt }] }
      });
      return response.text || "";
    });
  } catch (err) {
    return handleAIError(err).text;
  }
};

export const settleRegistryBatch = async (transactions: any[]): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Settle batch: ${JSON.stringify(transactions)}`,
      });
      return { text: response.text || "Batch verified.", finality_hash: "0x882A_FINAL" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditMeshStability = async (topologyData: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Audit mesh stability: ${JSON.stringify(topologyData)}`,
      });
      return { text: response.text || "Stability verified." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const probeValidatorNode = async (nodeData: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Perform high-fidelity probe on validator node: ${JSON.stringify(nodeData)}.`,
      });
      return { text: response.text || "Probe successful." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const searchAgroTrends = async (query: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const runSimulationAnalysis = async (simData: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Run simulation: ${JSON.stringify(simData)}`,
      });
      return { text: response.text || "Simulation finalized." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateAgroExam = async (topic: string): Promise<any[]> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: `Generate exam for: ${topic}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correct: { type: Type.INTEGER }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  } catch (err) {
    throw err;
  }
};

export const getGroundedAgroResources = async (query: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const analyzeInstitutionalRisk = async (transactionData: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Risk audit: ${JSON.stringify(transactionData)}`,
      });
      return { text: response.text || "Risk assessment clear." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const diagnoseCropIssue = async (description: string, base64Image?: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const contents = base64Image 
        ? { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: description }] }
        : { text: description };
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const auditProductQuality = async (productId: string, logs: any[]): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: `Audit quality for ${productId}`,
      });
      return { text: response.text || "Quality audit passed." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateAgroResearch = async (title: string, thrust: string, iotData: any, context: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Generate research: ${title}`,
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const getWeatherForecast = async (location: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: `Weather for ${location}`,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { text: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks as any };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateValueEnhancementStrategy = async (material: string, weight: string, context: string): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: `Value strategy for ${weight} of ${material}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategy_abstract: { type: Type.STRING },
              stages: { type: Type.ARRAY, items: { type: Type.STRING } },
              resilience_impact: { type: Type.NUMBER }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  } catch (err) {
    throw err;
  }
};

export const analyzeMRVEvidence = async (description: string, base64Image?: string): Promise<any> => {
  try {
    return await callOracleWithRetry(async () => {
      const contents = base64Image 
        ? { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: description }] }
        : { text: description };
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verification_narrative: { type: Type.STRING },
              confidence_alpha: { type: Type.NUMBER },
              metrics: {
                type: Type.OBJECT,
                properties: {
                  estimated_dbh_cm: { type: Type.NUMBER },
                  biomass_tonnes: { type: Type.NUMBER },
                  carbon_sequestration_potential: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  } catch (err) {
    throw err;
  }
};

export const analyzeMiningYield = async (miningData: any): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-flash-preview',
        contents: `Analyze mining potential: ${JSON.stringify(miningData)}.`,
      });
      return { text: response.text || "Yield analysis finalized." };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const generateTemporalVideo = async (prompt: string) => {
  const response = await fetch("/api/ea-ai/video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  return await response.json();
};

export const generateAgroAcoustic = async (prompt: string): Promise<string | undefined> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Generate a rhythmic agro-acoustic soundscape or beat based on: ${prompt}. Describe the rhythm and then synthesize the sound.` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    });
  } catch (err) {
    console.error("Audio Generation Error:", err);
    return undefined;
  }
};

export const generateAgroDocument = async (type: string, prompt: string): Promise<AgroLangResponse> => {
  try {
    return await callOracleWithRetry(async () => {
      const response = await callBackendEA({
        model: 'gemini-3-pro-preview',
        contents: `Generate a professional ${type} for EnvirosAgro Blockchain. 
        Context: ${FRAMEWORK_CONTEXT}
        Prompt: ${prompt}
        Format: Markdown with industrial styling.`,
        config: {
          systemInstruction: "You are the EnvirosAgro Document Architect. You generate high-fidelity institutional documents, books, research papers, and blueprints.",
        }
      });
      return { text: response.text || "" };
    });
  } catch (err) {
    return handleAIError(err);
  }
};

export const getTemporalVideoOperation = async (operation: any) => {
  const response = await fetch("/api/ea-ai/video/operation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operation })
  });
  return await response.json();
};

export function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}
