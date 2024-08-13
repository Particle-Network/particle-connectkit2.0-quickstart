import React from "react";
import { truncateAddress, copyToClipboard } from "../utils/utils";

interface TransactionLinkProps {
  hash: string;
}

const TxNotification: React.FC<TransactionLinkProps> = ({ hash }) => {
  const handleCopyClick = () => {
    copyToClipboard(hash);
  };

  return (
    <div className="mt-4 p-4 border border-purple-500 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white">
        Transaction Successful!
      </h3>
      <p className="text-white flex items-center">
        Hash: <span className="ml-2">{truncateAddress(hash)}</span>
        <button
          onClick={handleCopyClick}
          className="ml-2 p-1 text-blue-500 hover:underline bg-transparent border-none cursor-pointer"
        >
          Copy
        </button>
      </p>
    </div>
  );
};

export default TxNotification;
