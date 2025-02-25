# Cintos geming Referral Generator

## Features
- Generates random user data (full name, email, Ethereum address).
- Support http proxy
- Saves referral information to a single JSON file.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tnodes/cintosgaming
   cd cintosgaming
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Configure your referral codes and delay in `src/config/config.js`.
2. Run the referral generator:
   ```bash
   npm start
   ```

3. To send multiple referrals, you can call the `sendMultipleReferrals` method with the desired count.

## Configuration
- **Referral Codes**: Update the `referralCodes` array in `src/config/config.js` to include your referral codes.
- **Proxy**: Create `proxy.txt` and paste your proxy, example:
`username:password@ip:port`