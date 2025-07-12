import "../styles/book.css";
import formatPublishedDate from "../utilities/formatDate";

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
              <i className="fas fa-check"></i> Purchased
            </span>
          ) : (
            <span className="not-purchased-badge">
              <i className="fas fa-times-circle"></i> Not Purchased
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
