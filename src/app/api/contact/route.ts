import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, business, email, budget, goal, message } = data;

        // Path to leads.csv in the project root
        const filePath = path.join(process.cwd(), 'leads.csv');

        // CSV Header if file doesn't exist
        const header = 'Timestamp,Name,Business,Email,Budget,Goal,Message\n';

        // Escape commas in message and other fields for CSV safety
        const clean = (text: string) => `"${(text || '').replace(/"/g, '""')}"`;

        const timestamp = new Date().toISOString();
        const row = `${timestamp},${clean(name)},${clean(business)},${clean(email)},${clean(budget)},${clean(goal)},${clean(message)}\n`;

        // Create file with header if it doesn't exist, otherwise append
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, header + row);
        } else {
            fs.appendFileSync(filePath, row);
        }

        return NextResponse.json({ success: true, message: 'Lead saved successfully' });
    } catch (error) {
        console.error('Lead submission error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save lead' },
            { status: 500 }
        );
    }
}
