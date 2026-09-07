import { NextRequest, NextResponse } from "next/server";
import { isFounderAuthenticated } from "@/lib/founder-auth";
import { runAutonomousGrowthAgent, AgentJobRequest } from "@/lib/engines/autonomous-agent-swarm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isFounderAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized access to Founder Swarm API" }, { status: 401 });
    }

    const body: AgentJobRequest = await request.json();
    const result = await runAutonomousGrowthAgent(body);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    console.error("[Swarm API Error]", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Agent execution failed" },
      { status: 500 }
    );
  }
}
