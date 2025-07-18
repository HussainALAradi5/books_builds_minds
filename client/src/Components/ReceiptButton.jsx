import Button from "../../Button";
import { FaReceipt } from "react-icons/fa";
import { downloadReceipt } from "../../../service/auth/services";

const ReceiptButton = ({ slug, hasPurchased }) => {
  if (!hasPurchased) return null;

  const handleDownload = () => {
    try {
      downloadReceipt(slug);
    } catch (error) {
      alert("Unable to download receipt. Please log in first.");
    }
  };

  return (
    <Button
      text={
        <>
          <FaReceipt />
          Download Receipt (PDF)
        </>
      }
      onClick={handleDownload}
      className="receipt-button"
    />
  );
};

export default ReceiptButton;
