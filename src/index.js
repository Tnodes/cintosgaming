const ReferralGenerator = require('./utils/ReferralGenerator');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askForReferrals() {
    return new Promise((resolve) => {
        rl.question('How many referrals do you want to generate? ', (answer) => {
            const count = parseInt(answer, 10);
            if (isNaN(count) || count <= 0) {
                console.log('Please enter a valid number greater than 0.');
                resolve(0);
            } else {
                resolve(count);
            }
        });
    });
}

async function main() {
    try {
        const referralGenerator = new ReferralGenerator();
        
        referralGenerator.setDelay(2000); // 2 seconds between requests
        
        const numberOfReferrals = await askForReferrals();
        if (numberOfReferrals === 0) {
            console.log('No referrals to generate. Exiting.');
            rl.close();
            return;
        }
        
        console.log(`Starting to generate ${numberOfReferrals} referrals...`);
        
        const results = await referralGenerator.sendMultipleReferrals(numberOfReferrals);
        
        const successful = results.filter(r => r.success).length;
        console.log('\nReferral Generation Summary:');
        console.log(`Total Attempted: ${numberOfReferrals}`);
        console.log(`Successful: ${successful}`);
        console.log(`Failed: ${numberOfReferrals - successful}`);
        
    } catch (error) {
        console.error('Error in main process:', error);
    } finally {
        rl.close();
    }
}

main(); 