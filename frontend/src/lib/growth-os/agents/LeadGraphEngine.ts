import { CanonicalLead } from "./types";

export interface GraphNode {
  id: string;
  type:
    | "BUSINESS"
    | "WEBSITE"
    | "GOOGLE_PLACE"
    | "INSTAGRAM"
    | "FACEBOOK"
    | "LINKEDIN"
    | "X_TWITTER"
    | "YOUTUBE"
    | "PINTEREST"
    | "REDDIT"
    | "CONTACT"
    | "REVIEW"
    | "CAMPAIGN"
    | "CRM_ACTIVITY";
  label: string;
  properties: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: "OWNS" | "LISTED_ON" | "ACTIVE_ON" | "ENGAGED_WITH" | "AUTHORED" | "HAS_PROBLEM";
  confidence: number;
}

export interface LeadGraphView {
  businessNodeId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  reachabilityScore: number;
}

export class LeadGraphEngine {
  public buildLeadGraph(lead: CanonicalLead): LeadGraphView {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Central Business Node
    const businessNodeId = `node_biz_${lead.id}`;
    nodes.push({
      id: businessNodeId,
      type: "BUSINESS",
      label: lead.canonicalName,
      properties: {
        city: lead.city,
        icpScore: lead.icpScore,
        crmStage: lead.crmStage,
      },
    });

    // Website Node
    if (lead.normalizedDomain) {
      const webNodeId = `node_web_${lead.id}`;
      nodes.push({
        id: webNodeId,
        type: "WEBSITE",
        label: lead.normalizedDomain,
        properties: { domain: lead.normalizedDomain },
      });
      edges.push({
        id: `edge_${businessNodeId}_${webNodeId}`,
        source: businessNodeId,
        target: webNodeId,
        relation: "OWNS",
        confidence: 0.98,
      });
    }

    // Phone / Contact Node
    if (lead.normalizedPhone) {
      const contactNodeId = `node_contact_${lead.id}`;
      nodes.push({
        id: contactNodeId,
        type: "CONTACT",
        label: lead.normalizedPhone,
        properties: { phone: lead.normalizedPhone },
      });
      edges.push({
        id: `edge_${businessNodeId}_${contactNodeId}`,
        source: businessNodeId,
        target: contactNodeId,
        relation: "OWNS",
        confidence: 0.95,
      });
    }

    // Social & Channel Nodes
    for (const identity of lead.identities) {
      const nodeId = `node_${identity.platform}_${identity.id}`;
      let nodeType: GraphNode["type"] = "BUSINESS";

      switch (identity.platform) {
        case "google_places":
          nodeType = "GOOGLE_PLACE";
          break;
        case "instagram":
          nodeType = "INSTAGRAM";
          break;
        case "facebook":
          nodeType = "FACEBOOK";
          break;
        case "linkedin":
          nodeType = "LINKEDIN";
          break;
        case "x":
          nodeType = "X_TWITTER";
          break;
        case "youtube":
          nodeType = "YOUTUBE";
          break;
        case "pinterest":
          nodeType = "PINTEREST";
          break;
        case "reddit":
          nodeType = "REDDIT";
          break;
        default:
          nodeType = "WEBSITE";
      }

      nodes.push({
        id: nodeId,
        type: nodeType,
        label: identity.rawName,
        properties: {
          platform: identity.platform,
          followers: identity.followerCount,
          rating: identity.rating,
          reviewCount: identity.reviewCount,
          url: identity.profileUrl || identity.websiteUrl,
        },
      });

      edges.push({
        id: `edge_${businessNodeId}_${nodeId}`,
        source: businessNodeId,
        target: nodeId,
        relation: "ACTIVE_ON",
        confidence: identity.sourceConfidence || 0.9,
      });
    }

    // Calculate reachability score based on channels and contactability
    let reachability = 30;
    if (lead.normalizedPhone) reachability += 35;
    if (lead.normalizedDomain) reachability += 20;
    if (lead.identities.some((i) => i.platform === "instagram")) reachability += 10;
    if (lead.identities.some((i) => i.platform === "linkedin")) reachability += 5;

    return {
      businessNodeId,
      nodes,
      edges,
      reachabilityScore: Math.min(100, reachability),
    };
  }
}

export const leadGraphEngine = new LeadGraphEngine();
