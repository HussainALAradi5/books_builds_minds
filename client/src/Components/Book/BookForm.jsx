import Button from "../Button";
import "../../styles/form.css";

const BookForm = ({ formData, handleChange, onSubmit }) => {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>Add Book</h2>

      <input
        name="isbn"
        value={formData.isbn}
        onChange={handleChange}
        placeholder="ISBN"
        required
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
        required
      />
      <input
        name="author"
        value={formData.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />
      <input
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
        placeholder="Publisher"
        required
      />
      <input
        type="date"
        name="published_at"
        value={formData.published_at}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
        min="1"
        step="any"
      />

      <div className="form-actions">
        <Button text="Add Book" type="submit" className="form-button" />
      </div>
    </form>
  );
};

export default BookForm;
