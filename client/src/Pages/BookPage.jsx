import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBookSlug, fetchPurchasedBooks } from "../../service/auth";
import BookDetails from "../Components/BookDetails";
import Review from "../Components/Review";
import Button from "../Components/Button";
import "../styles/book.css";
import "../styles/button.css";

const BookPage = () => {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    fetchBookSlug(slug)
      .then((data) => {
        setBook(data);
        setError("");
        checkPurchaseStatus(data?.slug);
      })
      .catch((err) => {
        console.error("Failed to fetch book:", err);
        setError("Failed to load book details.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const checkPurchaseStatus = async (slug) => {
    try {
      const result = await fetchPurchasedBooks(user_id);
      const match = result.books?.some((b) => b.slug === slug);
      setHasPurchased(match);
    } catch (err) {
      console.error("Failed to check purchase status:", err);
    }
  };

  const handlePurchase = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/book/${slug}/purchase`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to purchase");
      setHasPurchased(true);
      setPurchaseMessage(data.message || "Book purchased successfully");
    } catch (err) {
      setPurchaseMessage(err.message || "Purchase failed");
    }
  };

  return (
    <div className="book-page">
      <div className="book-details-container">
        {loading ? (
          <p>Loading book...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : book ? (
          <>
            <BookDetails book={book} />

            {!hasPurchased ? (
              <Button
                text="Purchase Book"
                onClick={handlePurchase}
                className="purchase-button"
              />
            ) : (
              <p className="purchase-status">✅ Already purchased</p>
            )}

            {purchaseMessage && (
              <p className="purchase-message">{purchaseMessage}</p>
            )}

            <Review slug={slug} />
          </>
        ) : (
          <p>No book found.</p>
        )}
      </div>
    </div>
  );
};

export default BookPage;
