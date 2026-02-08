
async function testApi() {
    try {
        console.log('Testing /api/contact endpoint...');
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test',
                business: 'Test Biz',
                email: 'test@example.com',
                budget: '1k-5k',
                goal: 'growth',
                message: 'Hello'
            })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log('Raw Response:', text);

        try {
            const json = JSON.parse(text);
            console.log('Parsed JSON:', json);
        } catch (e) {
            console.log('Response is not valid JSON');
        }
    } catch (error) {
        console.error('Fetch failed (is the dev server running?):', error.message);
    }
}

testApi();
