const BookDetails = ({ book }) => {
  if (!book) return null;

  const bookImage = book.image || book.book_image;

  return (
    <>
      <h3>{book.title}</h3>
      {bookImage && <img className="cover" src={bookImage} alt={book.title} />}
      <p>Author: {book.author}</p>
      <p>Publisher: {book.publisher}</p>
      <p>Price: {book.price} BD</p>
    </>
  );
};

export default BookDetails;
