


const API_URL = 'http://localhost:5000/api/partnerships';

async function test() {
    try {
        console.log('1. Creating Partnership...');
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                organizationName: 'Test Org ' + Date.now(),
                contactPerson: 'Tester',
                email: 'test@test.com',
                phone: '1234567890',
                partnershipType: 'Sponsorship',
                message: 'Auto test message',
                linkedin: 'https://linkedin.com/in/test'
            })
        });

        if (!createRes.ok) {
            console.error('Create failed:', createRes.status, await createRes.text());
        } else {
            console.log('Create success:', await createRes.json());
        }

        console.log('\n2. Fetching Partnerships...');
        const getRes = await fetch(API_URL);
        if (!getRes.ok) {
            console.error('Get failed:', getRes.status, await getRes.text());
        } else {
            const data = await getRes.json();
            console.log('Get success, count:', data.length);
            console.log('First item:', data[0]);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
