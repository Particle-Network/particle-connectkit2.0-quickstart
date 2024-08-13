
<div align="center">
  <a href="https://particle.network/">
    <img src="https://i.imgur.com/xmdzXU4.png" />
  </a>
  <h3>
 @particle-network/auth-core Demo Application 
  </h3>
</div>

# Particle Connect 2.0 Starter

**Particle Connect** enables a unified modal driving connection with social logins (through Particle Auth) and standard Web3 wallets, creating an equally accessible experience for Web3 natives and traditional consumers. Particle Connect is an all-in-one SDK capable of handling end-to-end onboarding and wallet connection.

This app enables you to log in using social logins or Web3 methods via Particle Connect and interact with the Ethereum Sepolia, Base Sepolia, and Avalanche Fuji testnets. You can view your account information and send transfer transactions to any address you input in the UI.

Built using:

- **Particle Connect 2.0**
- **ethers.js V6.x.x**
- **TypeScript**
- **Tailwind CSS**

> Find the [Particle Connect SDK docs](https://developers.particle.network/api-reference/connect/desktop/web).

## 🔑 Particle Connect

Particle Connect provides a unified mechanism for facilitating dApp connections through both Web2 (via Particle Auth) and Web3 (using WalletConnect, Solana’s wallet-adapter, and private key imports) logins. This approach significantly reduces the entry barriers for decentralized applications, offering tailored onboarding paths that cater to a wide range of users, from Web3 natives to traditional Web2 consumers.

***

👉 Learn more about [Particle Network](https://particle.network).

## 🛠️ Quickstart

### Clone this repository
```
git clone 
```

### Move into the app directory

```sh
cd particle-connect
```

### Install dependencies

```sh
yarn install
```

Or

```sh
npm install
```

### Set environment variables
This project requires several keys from Particle Network to be defined in `.env`. The following should be defined:
- `NEXT_PUBLIC_PROJECT_ID`, the ID of the corresponding application in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).
- `NEXT_PUBLIC_CLIENT_KEY`, the ID of the corresponding project in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).
-  `NEXT_PUBLIC_APP_ID`, the client key of the corresponding project in your [Particle Network dashboard](https://dashboard.particle.network/#/applications).

### Start the project
```sh
npm run dev
```

Or

```sh
yarn dev
```

## Build with Particle Connect

To get started with Particle Connect  from scracth in your application, follow these steps:

### 🛠 Configuration & Integration

> This is based on a standard Next JS application initialized with `npx create-next-app@latest`.

1. **Install the SDK**: 

   Begin by installing the ConnectKit SDK:

   ```bash
   yarn add @particle-network/connectkit viem@^2
   ```

2. **Create `Connectkit.tsx` and Configure the SDK**: 

  Create a new component named `Connectkit.tsx` to set up your Particle Connect configuration.

   **Required Configurations:**
   - `projectId`, `clientKey`, and `appId` — Obtain these from the [Particle dashboard](https://dashboard.particle.network/).
   - `chains` — Specify the supported chains for your dApp.
   - `walletConnectors` — Define the wallets you want to support.

   **Optional Configurations:**
   - `theme` and `language` for the connection modal UI.
   - Additional appearance customizations.

   ```tsx
   'use client';

   import { ConnectKitProvider, createConfig } from '@particle-network/connectkit';
   import { authWalletConnectors } from '@particle-network/connectkit/auth';
   import { mainnet, solana } from '@particle-network/connectkit/chains';
   import { evmWalletConnectors } from '@particle-network/connectkit/evm';
   import { injected as solaInjected, solanaWalletConnectors } from '@particle-network/connectkit/solana';
   import { wallet, EntryPosition } from '@particle-network/connectkit/wallet';
   import React from 'react';

   const config = createConfig({
       projectId: 'Replace with your Particle Project ID',
       clientKey: 'Replace with your Particle Client Key', // Retrieved from https://dashboard.particle.network
       appId: 'Replace with your Particle App ID',
       appearance: { 
           recommendedWallets: [
               { walletId: 'metaMask', label: 'Recommended' },
               { walletId: 'coinbaseWallet', label: 'Popular' },
           ],
           splitEmailAndPhone: false, 
           collapseWalletList: false, 
           hideContinueButton: false, 
           connectorsOrder: ['email', 'phone', 'social', 'wallet'], 
           language: 'en-US', 
           mode: 'light', 
           theme: {
               '--pcm-accent-color': '#ff4d4f',
           },
           logo: 'https://...',
           filterCountryCallingCode: (countries) => {
               return countries.filter((item) => item === 'US');
           },
       },
       walletConnectors: [
           evmWalletConnectors({
               metadata: { name: 'My App', icon: '', description: '', url: '' },
               walletConnectProjectId: 'Replace with your WalletConnect Project ID', 
           }),
           authWalletConnectors({
               authTypes: ["email", "google", "apple", "twitter", "github"],
               fiatCoin: "USD",
               promptSettingConfig: {
                   promptMasterPasswordSettingWhenLogin: 1,
                   promptPaymentPasswordSettingWhenSign: 1,
               },
           }),
           solanaWalletConnectors(), 
       ],
       plugins: [
           wallet({
               entryPosition: EntryPosition.BR, 
               visible: true,
           }),
       ],
       chains: [mainnet, solana],
   });

   export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
       return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
   };
   ```

  Then, wrap your application with the `ParticleConnectkit` component to enable various customizations. 

3. **Wrap Your App**:

   Import and wrap your application with the `ParticleConnectKit` component in your `index` or `layout` file. Here’s an example for a `layout.tsx` file:

   ```tsx
   import type { Metadata } from "next";
   import { Inter } from "next/font/google";
   import "./globals.css";
   import { ParticleConnectkit } from "./components/Connectkit";

   const inter = Inter({ subsets: ["latin"] });

   export const metadata: Metadata = {
     title: "Particle Connect",
     description: "Demo showcasing a quickstart for Particle Connect 2.0",
   };

   export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
     return (
       <html lang="en">
         <body className={inter.className}>
           <ParticleConnectkit>{children}</ParticleConnectkit>
         </body>
       </html>
     );
   }
   ```

4. **Add a Connection Button**:

   Include the **Connect** button in your main `App` component to allow users to log in via Particle Connect. Use `isConnected` from `useAccount()` to manage the display of account information. 

   Example integration:

   ```tsx
   import { ConnectButton, useAccount } from '@particle-network/connectkit';

   export const App = () => {
       const { address, isConnected, chainId } = useAccount();

       return (
           <>
           {isConnected ? (
               <>
               <h2>Address: {address}</h2>
               <h2>Chain ID: {chainId}</h2>
               </>
           ) : (
               <ConnectButton />
           )}
           </>
       );
   };
   ```

### 🌐 Configure Social Logins

Below is a list of available social logins that you can configure:

```json
{
  email: 'email',
  phone: 'phone',
  facebook: 'facebook',
  google: 'google',
  apple: 'apple',
  twitter: 'twitter',
  discord: 'discord',
  github: 'github',
  twitch: 'twitch',
  microsoft: 'microsoft',
  linkedin: 'linkedin',
  jwt: 'jwt'
}
```

## Particle Connect features

Find the features available in the [Particle Connect SDK docs](https://developers.particle.network/api-reference/connect/desktop/web#particle-connect-for-web).
