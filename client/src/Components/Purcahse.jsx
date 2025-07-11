import { useState } from "react";
import Button from "./Button";
import { purchaseBook, fetchPurchasedBooks } from "../../service/auth";

const Purchase = ({ slug }) => {
  const user_id = localStorage.getItem("user_id");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [message, setMessage] = useState("");

  // Check if the user already owns the book
  const checkPurchaseStatus = async () => {
    try {
      const data = await fetchPurchasedBooks(user_id);
      const match = data.books?.some((b) => b.slug === slug);
      setHasPurchased(match);
    } catch (err) {
      console.error("Purchase check failed:", err);
    }
  };

  useState(() => {
    checkPurchaseStatus();
  }, [slug]);

  const handlePurchase = async () => {
    try {
      const result = await purchaseBook(slug);
      setMessage(result.message);
      setHasPurchased(true);
    } catch (err) {
      setMessage(err.message || "Failed to purchase book.");
    }
  };

  if (hasPurchased) {
    return <p className="purchase-status">✅ Already purchased</p>;
  }

  return (
    <div className="purchase-container">
      <Button
        text="Purchase Book"
        onClick={handlePurchase}
        className="purchase-button"
      />
      {message && <p className="purchase-message">{message}</p>}
    </div>
  );
};

export default Purchase;
