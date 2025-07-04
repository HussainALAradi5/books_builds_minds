import { useState } from "react";
import "../styles/form.css";
import "../styles/button.css";
import Button from "./Button";
import SearchForm from "./SearchForm";

const Search = ({ books, setFilteredBooks }) => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publisher: "",
    price: "",
  });

  const [visible, setVisible] = useState(false);

  const normalize = (str) => str?.toLowerCase().trim();
  const matchExact = (input, value) => (input ? value === input : true);
  const matchPrice = (input, value) =>
    input ? String(value) === String(input) : true;

  const handleSearch = () => {
    const filtered = books.filter((book) => {
      const bookTitle = normalize(book.title);
      const bookIsbn = normalize(book.isbn);
      const bookPublisher = normalize(book.publisher);
      const inputTitle = normalize(formData.title);
      const inputIsbn = normalize(formData.isbn);
      const inputPublisher = normalize(formData.publisher);

      return (
        matchExact(inputTitle, bookTitle) &&
        matchExact(inputIsbn, bookIsbn) &&
        matchExact(inputPublisher, bookPublisher) &&
        matchPrice(formData.price, book.price)
      );
    });

    setFilteredBooks(filtered);
    setVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    const cleared = { title: "", isbn: "", publisher: "", price: "" };
    setFormData(cleared);
    setFilteredBooks(books);
  };

  return (
    <>
      <Button
        text="Search Books"
        className="search-trigger-button"
        onClick={() => setVisible(true)}
      />

      {visible && (
        <SearchForm
          formData={formData}
          handleChange={handleChange}
          handleReset={handleReset}
          handleSearch={handleSearch}
          onClose={() => setVisible(false)}
        />
      )}
    </>
  );
};

export default Search;
