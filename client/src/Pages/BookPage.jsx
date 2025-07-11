import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBookSlug } from "../../service/auth";
import BookDetails from "../Components/BookDetails";
import "../styles/book.css";

const BookPage = () => {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchBookSlug(slug)
      .then((data) => {
        setBook(data);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch book:", err);
        setError("Failed to load book details.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="book-page">
      <div className="book-details-container">
        {loading ? (
          <p>Loading book...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : book ? (
          <BookDetails book={book} />
        ) : (
          <p>No book found.</p>
        )}
      </div>
    </div>
  );
};

export default BookPage;
