import Button from "../Button";
import "../../styles/form.css";

const SearchForm = ({
  formData,
  handleChange,
  handleReset,
  handleSearch,
  onClose,
}) => {
  const fields = [
    { name: "title", type: "text", placeholder: "Title" },
    { name: "isbn", type: "text", placeholder: "ISBN" },
    { name: "publisher", type: "text", placeholder: "Publisher" },
    { name: "price", type: "number", placeholder: "Price" },
  ];

  return (
    <>
      <div className="search-popup-backdrop" onClick={onClose}></div>

      <div className="search-popup">
        <h2 className="search-title">Find Your Book</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="search-fields">
            {fields.map(({ name, type, placeholder }) => (
              <input
                key={name}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            ))}
          </div>

          <div className="form-actions">
            <Button
              text="Search"
              className="form-button"
              onClick={handleSearch}
            />
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
