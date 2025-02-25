const fs = require('fs');
const { HttpsProxyAgent } = require('https-proxy-agent');

class ProxyManager {
    constructor(proxyFilePath = 'proxy.txt') {
        this.proxyFilePath = proxyFilePath;
        this.proxies = [];
        this.currentIndex = 0;
        this.loadProxies();
    }

    loadProxies() {
        try {
            const content = fs.readFileSync(this.proxyFilePath, 'utf-8');
            this.proxies = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));
            
            if (this.proxies.length === 0) {
                throw new Error('No valid proxies found in proxy file');
            }
        } catch (error) {
            console.error('Error loading proxies:', error.message);
            throw error;
        }
    }

    getNextProxy() {
        if (this.proxies.length === 0) {
            return null;
        }

        const proxy = this.proxies[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
        return proxy;
    }

    getProxyAgent(proxy) {
        try {
            return new HttpsProxyAgent(`http://${proxy}`);
        } catch (error) {
            console.error('Error creating proxy agent:', error);
            return null;
        }
    }
}

module.exports = ProxyManager;