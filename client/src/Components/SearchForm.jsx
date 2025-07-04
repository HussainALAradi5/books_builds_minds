import "../styles/form.css";
import Button from "./Button";

const SearchForm = ({
  formData,
  handleChange,
  handleReset,
  handleSubmit,
  onClose,
}) => {
  return (
    <>
      <div className="search-popup-backdrop" onClick={onClose}></div>

      <div className="search-popup">
        <h2 className="search-title">Find Your Book</h2>

        <form onSubmit={handleSubmit}>
          <div className="search-fields">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
            />
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="ISBN"
            />
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Publisher"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
          </div>

          <div className="form-actions">
            <Button text="Search" className="form-button" type="submit" />
            <Button
              text="Clear"
              className="form-button"
              onClick={handleReset}
            />
            <Button text="Close" className="form-button" onClick={onClose} />
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchForm;
