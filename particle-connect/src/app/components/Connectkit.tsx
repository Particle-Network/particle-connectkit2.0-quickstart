"use client";

import { ConnectKitProvider, createConfig } from "@particle-network/connectkit";
import { authWalletConnectors } from "@particle-network/connectkit/auth";
import {
  avalancheFuji,
  baseSepolia,
  mainnet,
  sepolia,
  solana,
} from "@particle-network/connectkit/chains";
import { evmWalletConnectors } from "@particle-network/connectkit/evm";
import {
  injected as solaInjected,
  solanaWalletConnectors,
} from "@particle-network/connectkit/solana";
import { wallet, EntryPosition } from "@particle-network/connectkit/wallet";

import React from "react";

const config = createConfig({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
  appId: process.env.NEXT_PUBLIC_APP_ID!,
  appearance: {
    // optional, define wallet label and sort wallets.
    recommendedWallets: [
      { walletId: "walletConnect", label: "Recommended" },
      { walletId: "coinbaseWallet", label: "popular" },
    ],
    splitEmailAndPhone: false,
    collapseWalletList: false,
    hideContinueButton: true,
    //  optional, sort wallet connectors
    connectorsOrder: ["email", "phone", "social", "wallet"],
    language: "en-US",
    mode: "auto", // dark or auto.
    logo: "/logo.png",
    filterCountryCallingCode: (countries) => {
      // set only support USA, default support all country code.
      return countries.filter((item) => item === "IT");
    },
  },
  walletConnectors: [
    evmWalletConnectors({
      metadata: { name: "Connect 2.0", icon: "", description: "", url: "" }, // optional, your app metadata, use for WalletConnect and Coinbase.
      walletConnectProjectId:
        process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "", // optional, WalletConnect project id.
    }), // optional, you need to configure it when using social or email/phone connect.
    authWalletConnectors({
      // optional, supported login methods, and display sequence from Particle Auth
      authTypes: ["email", "google", "apple", "twitter", "github"],
      fiatCoin: "USD",
      promptSettingConfig: {
        promptMasterPasswordSettingWhenLogin: 1, // optional
        promptPaymentPasswordSettingWhenSign: 1, // optional
      },
    }),
  ],
  plugins: [
    wallet({
      entryPosition: EntryPosition.TR,
      visible: true,
    }), // optional, embedded wallet, support solana and evm chains.
  ],
  chains: [sepolia, baseSepolia, avalancheFuji],
});

// Wrap your application with this component.
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
