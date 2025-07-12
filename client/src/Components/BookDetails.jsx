import "../styles/book.css";
import formatPublishedDate from "../utilities/formatDate";
import { FaCheck, FaTimesCircle } from "react-icons/fa";

const BookDetails = ({ book, hasPurchased }) => {
  const publishAt = formatPublishedDate(book.published_at);

  return (
    <div className="book-info">
      <img src={book.book_image} alt={book.title} className="cover" />
      <div className="book-meta">
        <h1 className="book-title">
          {book.title}
          {hasPurchased ? (
            <span className="purchased-badge">
              <FaCheck /> Purchased
            </span>
          ) : (
            <span className="not-purchased-badge">
              <FaTimesCircle /> Not Purchased
            </span>
          )}
        </h1>
        <p>
          <strong>ISBN:</strong> {book.isbn}
        </p>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>Publisher:</strong> {book.publisher}
        </p>
        <p>
          <strong>Published:</strong> {publishAt}
        </p>
        <p>
          <strong>Price:</strong> {book.price} BHD
        </p>
      </div>
    </div>
  );
};

export default BookDetails;
