import "../../styles/book.css";
import formatPublishedDate from "../../utilities/formatDate";
import { FaCheck, FaTimesCircle } from "react-icons/fa";
import { isUserLoggedIn } from "../../../service/auth";
import StarRating from "./Review/Star/StarRating";

const BookDetails = ({ book, hasPurchased }) => {
  const publishAt = formatPublishedDate(book.published_at);
  const isLoggedIn = isUserLoggedIn();

  return (
    <div className="book-info">
      <img src={book.book_image} alt={book.title} className="cover" />
      <div className="book-meta">
        <h1 className="book-title">
          {book.title}
          {isLoggedIn && hasPurchased && (
            <span className="purchased-badge">
              <FaCheck /> Purchased
            </span>
          )}
          {isLoggedIn && !hasPurchased && (
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

        <div className="average-rating">
          <strong>Average Rating:</strong>
          <StarRating rating={book.average_rating} />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
