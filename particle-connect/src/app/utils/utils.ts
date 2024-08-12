import { toast } from "react-toastify";

/**
 * Utility function to format the balance to 6 decimal places.
 * This is more accurate than using .toFixed() because it does not round it.
 * 
 * @param {string} balanceInEther - The balance in Ether as a string.
 * @returns {string} The formatted balance with up to 6 decimal places.
 */
export const formatBalance = (balanceInEther: string): string => {
  const [integerPart, decimalPart] = balanceInEther.split(".");
  const truncatedDecimalPart = decimalPart ? decimalPart.slice(0, 5) : "0000";
  return `${integerPart}.${truncatedDecimalPart}`;
};

/**
 * Function to truncate Ethereum addresses for display purposes.
 * 
 * @param {string} address - The Ethereum address to truncate.
 * @returns {string} The truncated address in the format `0x1234...abcd`.
 */
export const truncateAddress = (address: string): string => {
  return address ? `${address.slice(0, 6)}...${address.slice(address.length - 4)}` : '';
};

/**
 * Copies the provided text to the clipboard and shows a toast notification.
 * 
 * @param {string} text - The text to copy to the clipboard.
 * @param {string} [message="Copied to clipboard!"] - The message to display in the toast notification.
 */
export const copyToClipboard = (text: string, message: string = "Copied to clipboard!") => {
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      toast(message, {
        position: "top-left",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  }
};
