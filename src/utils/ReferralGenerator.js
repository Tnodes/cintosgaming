const { ethers } = require('ethers');
const faker = require('faker');
const fs = require('fs');
const ProxyManager = require('./ProxyManager');
const axios = require('axios');
const referralCode = require('../config/config');

class ReferralGenerator {
    constructor() {
        this.url = 'https://boustneqsaombfmtfffq.supabase.co/rest/v1/waitlist?columns=%22full_name%22%2C%22email%22%2C%22eth_address%22%2C%22referral_code%22%2C%22points%22&select=*';
        this.proxyManager = new ProxyManager();
        this.delay = 1000;
    }

    generateRandomData() {
        const fullName = faker.name.findName();
        const email = faker.internet.email();
        return { fullName, email };
    }

    generateEthAddress() {
        const wallet = ethers.Wallet.createRandom();
        return { ethAddress: wallet.address, privateKey: wallet.privateKey };
    }

    savePrivateKey(privateKey, ethAddress, fullName, email) {
        const data = {
            privateKey,
            ethAddress,
            fullName,
            email,
            timestamp: new Date().toISOString()
        };
        
        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts');
        }
        
        const fileName = `accounts/${ethAddress}.json`;
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async sendReferral() {
        const { fullName, email } = this.generateRandomData();
        const { ethAddress, privateKey } = this.generateEthAddress();

        const payload = [
            {
                "full_name": fullName,
                "email": email,
                "eth_address": ethAddress,
                "referral_code": referralCode,
                "points": 30
            }
        ];

        const headers = {
            'accept': 'application/vnd.pgrst.object+json',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdXN0bmVxc2FvbWJmbXRmZmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MzA0NTQsImV4cCI6MjA1NTMwNjQ1NH0.FeSHmHVeSQvQ2hVz0PHYBhFTijOY2U_U_zl4LIxFG_w',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdXN0bmVxc2FvbWJmbXRmZmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MzA0NTQsImV4cCI6MjA1NTMwNjQ1NH0.FeSHmHVeSQvQ2hVz0PHYBhFTijOY2U_U_zl4LIxFG_w',
            'content-type': 'application/json',
            'dnt': '1',
            'origin': 'https://waitlist-cintosgaming.com',
            'prefer': 'return=representation',
            'referer': 'https://waitlist-cintosgaming.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
            'x-client-info': 'supabase-js-web/2.48.1'
        };

        try {
            const proxy = this.proxyManager.getNextProxy();
            if (!proxy) {
                throw new Error('No proxy available');
            }

            const agent = this.proxyManager.getProxyAgent(proxy);
            console.log(`Using proxy: ${proxy}`);

            const response = await axios.post(this.url, payload, { headers, httpsAgent: agent });

            console.log('Referral sent successfully:', {
                fullName,
                email,
                ethAddress,
                proxy
            });

            this.saveReferralInfo({ privateKey, ethAddress, fullName, email });

            await this.sleep(this.delay);

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error sending referral:', error.message);
            return { success: false, error: error.message };
        }
    }

    async sendMultipleReferrals(count) {
        const results = [];
        for (let i = 0; i < count; i++) {
            console.log(`Sending referral ${i + 1}/${count}`);
            const result = await this.sendReferral();
            results.push(result);
        }
        return results;
    }

    setDelay(ms) {
        this.delay = ms;
    }

    saveReferralInfo(referralInfo) {
        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts', { recursive: true });
        }

        const fileName = 'accounts/referrals.json';
        let referrals = [];

        if (fs.existsSync(fileName)) {
            try {
                const existingData = fs.readFileSync(fileName);
                referrals = JSON.parse(existingData);
            } catch (error) {
                console.error('Error reading existing referrals:', error.message);
                referrals = [];
            }
        }

        const referralWithTimestamp = {
            ...referralInfo,
            timestamp: new Date().toISOString()
        };

        referrals.push(referralWithTimestamp);

        try {
            fs.writeFileSync(fileName, JSON.stringify(referrals, null, 2));
        } catch (error) {
            console.error('Error saving referrals:', error.message);
            throw error;
        }
    }
}

module.exports = ReferralGenerator; 