"use client";

import React, { useEffect, useState } from "react";
import LinksGrid from "./components/Links";
import Header from "./components/Header";
import TxNotification from "./components/TxNotification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the utility functions
import { formatBalance, truncateAddress, copyToClipboard } from "./utils/utils";

// Particle imports
import {
  ConnectButton,
  useAccount,
  useDisconnect,
  usePublicClient,
  useParticleAuth,
  useWallets,
} from "@particle-network/connectkit";

// Connectkit uses Viem, so we can use all Viem's features
import { formatEther, parseEther } from "viem";

export default function Home() {
  const { address, isConnected, isConnecting, isDisconnected, chainId } =
    useAccount();
  const { disconnect, disconnectAsync } = useDisconnect();
  const { getUserInfo } = useParticleAuth();

  // Init public client
  const publicClient = usePublicClient();

  // Init wallet
  const [primaryWallet] = useWallets();

  // Set states
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState<string>(""); // States for fetching and displaying the balance
  const [userAddress, setUserAddress] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null); // State to store user info
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(false); // Loading state for user info
  const [userInfoError, setUserInfoError] = useState<string | null>(null); // Error state for user info
  const [recipientAddress, setRecipientAddress] = useState<string>(""); // states to get the address to send tokens to from the UI
  const [transactionHash, setTransactionHash] = useState<string | null>(null); // states for the transaction hash
  const [isSending, setIsSending] = useState<boolean>(false); // state to display 'Sending...' while waiting for a hash

  // Derive connection status
  const connectionStatus = isConnecting
    ? "Connecting..."
    : isConnected
    ? "Connected"
    : isDisconnected
    ? "Disconnected"
    : "Unknown";

  useEffect(() => {
    // Fetch user info and store it in state
    const fetchUserInfo = async () => {
      setIsLoadingUserInfo(true);
      setUserInfoError(null);

      try {
        const userInfo = await getUserInfo();
        setUserInfo(userInfo); // Store user info in state
      } catch (error) {
        setUserInfoError(
          "Error fetching user info: The current wallet is not a particle wallet."
        );
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    if (isConnected) {
      fetchUserInfo(); // Fetch user info when the user is connected
    }
  }, [isConnected, getUserInfo]);

  // Load the active account and fetch the balance
  useEffect(() => {
    async function loadAccount() {
      if (address) {
        setAccount(account);
        setUserAddress(address);
        await fetchBalance();
      }
    }
    loadAccount();
  }, [chainId, address]); // Trigger useEffect when chainId or address changes

  // Fetch the user's balance in Ether
  const fetchBalance = async () => {
    try {
      if (!address) return; // Ensure address is defined
      const balanceResponse = await publicClient?.getBalance({ address });

      const balanceInEther = formatEther(balanceResponse!); // Use formatEther from 'viem'
      console.log(balanceResponse);
      const fixedBalance = formatBalance(balanceInEther);
      setBalance(fixedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Handle user disconnect
  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  const executeTxEthers = async () => {
    try {
      // Prepare the transaction object
      const tx = {
        to: recipientAddress,
        value: parseEther("0.01"), // Convert Ether to Wei
        data: "0x", // No contract interaction, so data is empty
        chainId: primaryWallet.chainId, // Use the current chainId
        account: primaryWallet.accounts[0], // Use the first account
      };

      setIsSending(true);
      // Get the wallet client and send the transaction
      const walletClient = primaryWallet.getWalletClient();
      const transactionResponse = await walletClient.sendTransaction(tx);

      setTransactionHash(transactionResponse);
      setIsSending(false);
      console.log("Transaction sent:", transactionResponse);
    } catch (error) {
      console.error("Failed to send transaction:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-black text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
        {/* Display connection status */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm mx-auto mb-4">
          <h2 className="text-md font-semibold text-white">
            Status: {connectionStatus}
          </h2>
        </div>

        {isConnected ? (
          <>
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="border border-purple-500 p-6 rounded-lg">
                  {isLoadingUserInfo ? (
                    <div>Loading user info...</div>
                  ) : userInfoError ? (
                    <div className="text-red-500">{userInfoError}</div>
                  ) : (
                    userInfo && ( // Conditionally render user info
                      <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-white mr-2">
                          Name: {userInfo.name || "N/A"}
                        </h2>
                        {userInfo.avatar && (
                          <img
                            src={userInfo.avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                      </div>
                    )
                  )}
                  <h2 className="text-lg font-semibold mb-2 text-white flex items-center">
                    Address: <code>{truncateAddress(userAddress)}</code>
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 ml-2 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center"
                      onClick={() => copyToClipboard(userAddress)}
                    >
                      📋
                    </button>
                  </h2>
                  <h2 className="text-lg font-semibold mb-2 text-white">
                    Chain ID: <code>{chainId}</code>
                  </h2>
                  <h2 className="text-lg font-semibold mb-2 text-white flex items-center">
                    Balance: {balance !== "" ? balance : "Loading..."}
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 ml-2 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center"
                      onClick={fetchBalance}
                    >
                      🔄
                    </button>
                  </h2>

                  <div>
                    <button
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                <div className="border border-purple-500 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    Send a transaction
                  </h2>
                  <h2 className="text-lg">Send 0.01</h2>
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="mt-4 p-2 w-full rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    onClick={executeTxEthers}
                    disabled={!recipientAddress || isSending}
                  >
                    {isSending ? "Sending..." : `Send 0.01`}
                  </button>
                  {/* You can use chainInfo.blockExplorerUrl to always link the correct block explorer dynamically*/}
                  {transactionHash && (
                    <TxNotification
                      hash={transactionHash}
                      blockExplorerUrl={"chainInfo.blockExplorerUrl"}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <ConnectButton />
        )}
        <LinksGrid />
      </main>
      <ToastContainer /> {/* This is the copy notification */}
    </div>
  );
}
