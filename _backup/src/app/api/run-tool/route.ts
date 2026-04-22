import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { toolId, credits } = body;

        console.log(`Running tool ${toolId} - Deducting ${credits} credits`);

        // Simulate tool processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        return NextResponse.json({
            success: true,
            toolId,
            creditsDeducted: credits,
            result: `Successfully ran ${toolId} agent. Check your dashboard for the detailed report.`
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Tool execution failed' }, { status: 500 });
    }
}
