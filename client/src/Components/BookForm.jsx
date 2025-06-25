import "../styles/form.css";

const BookForm = ({ formData, handleChange }) => {
  return (
    <>
      <h2>Add Book</h2>

      <input
        name="isbn"
        value={formData.isbn}
        onChange={handleChange}
        placeholder="ISBN"
      />
      <input
        name="book_image"
        value={formData.book_image}
        onChange={handleChange}
        placeholder="Image URL (optional)"
      />
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <input
        name="author"
        value={formData.author}
        onChange={handleChange}
        placeholder="Author"
      />
      <input
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
        placeholder="Publisher"
      />
      <input
        type="date"
        name="published_at"
        value={formData.published_at}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
      />
    </>
  );
};

export default BookForm;
