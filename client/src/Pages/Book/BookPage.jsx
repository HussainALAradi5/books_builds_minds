import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchBookSlug,
  fetchPurchasedBooks,
  isUserLoggedIn,
  downloadReceipt,
} from "../../../service/auth";
import "../../styles/book.css";
import "../../styles/button.css";
import Review from "../../Components/Book/Review/Review";
import BookDetails from "../../Components/Book/BookDetails";
import Button from "../../Components/Button";

const BookPage = () => {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const data = await fetchBookSlug(slug);
        setBook(data);
        setError("");

        if (isUserLoggedIn()) {
          const userId = localStorage.getItem("user_id");
          const result = await fetchPurchasedBooks(userId);
          const match = result.books?.some((b) => b.slug === slug);
          setHasPurchased(match);
        }
      } catch (err) {
        console.error("Failed to fetch book:", err);
        setError("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [slug]);

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

  const handleDownloadReceipt = () => {
    try {
      downloadReceipt(slug);
    } catch {
      alert("Unable to download receipt. Please log in.");
    }
  };

  return (
    <div className="book-page">
      <div className="book-details-container">
        <div className="book-center-wrapper">
          {loading ? (
            <p>Loading book...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : book ? (
            <>
              <BookDetails book={book} hasPurchased={hasPurchased} />

              {isUserLoggedIn() && hasPurchased && (
                <Button
                  text={
                    <>
                      <i className="fas fa-file-download"></i> Download Receipt
                      (PDF)
                    </>
                  }
                  onClick={handleDownloadReceipt}
                  className="purchase-button"
                />
              )}

              {isUserLoggedIn() && !hasPurchased && (
                <Button
                  text={
                    <>
                      <i className="fas fa-shopping-cart"></i> Purchase Book
                    </>
                  }
                  onClick={handlePurchase}
                  className="purchase-button"
                />
              )}

              {isUserLoggedIn() && purchaseMessage && (
                <p className="purchase-message">{purchaseMessage}</p>
              )}

              <Review slug={slug} hasPurchased={hasPurchased} />
            </>
          ) : (
            <p>No book found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
