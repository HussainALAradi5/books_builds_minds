import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../styles/form.css";
import "../styles/button.css";
import Button from "./Button";
import SearchForm from "./SearchForm";
import {
  normalize,
  matchExact,
  matchPrice,
  clearedFields,
} from "../utilities/searchUtils";

const Search = ({ books, setFilteredBooks }) => {
  const [formData, setFormData] = useState({ ...clearedFields });
  const [visible, setVisible] = useState(false);

  const handleSearch = () => {
    const filtered = books.filter((book) => {
      return (
        matchExact(normalize(formData.title), normalize(book.title)) &&
        matchExact(normalize(formData.isbn), normalize(book.isbn)) &&
        matchExact(normalize(formData.publisher), normalize(book.publisher)) &&
        matchPrice(formData.price, book.price)
      );
    });

    setFilteredBooks(filtered);
    setVisible(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({ ...clearedFields });
    setFilteredBooks(books);
  };

  return (
    <>
      <Button
        text={<FaSearch />}
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
