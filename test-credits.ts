
async function testCredits() {
    const baseUrl = 'http://localhost:3000';
    try {
        console.log('--- Testing Credit System ---');

        // 1. Fetch initial balance
        console.log('1. Checking initial balance...');
        const balanceRes = await fetch(`${baseUrl}/api/user/credits`);
        const balanceData = await balanceRes.json();
        console.log('Initial Balance:', balanceData.credits);

        // 2. Run a tool (should deducted 5 credits for viral-hooks)
        console.log('2. Running "viral-hooks" (5 credits)...');
        const runRes = await fetch(`${baseUrl}/api/run-tool`, {
            method: 'POST',
            body: JSON.stringify({ toolId: 'viral-hooks', credits: 5 })
        });
        const runData = await runRes.json();
        console.log('Run Result:', runData.result);
        console.log('New Balance:', runData.newBalance);

        // 3. Recharge credits
        console.log('3. Recharging 100 credits...');
        const rechargeRes = await fetch(`${baseUrl}/api/credits/recharge`, {
            method: 'POST',
            body: JSON.stringify({ packId: 'p1', amount: 12 })
        });
        const rechargeData = await rechargeRes.json();
        console.log('Recharge Status:', rechargeData.success ? 'Success (Pending Transaction Created)' : 'Failed');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCredits();
