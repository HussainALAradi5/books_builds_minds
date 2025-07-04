import { useEffect, useState } from "react";
import { fetchAllBooks } from "../../service/auth";
import Card from "../Components/Card";
import Button from "../Components/Button";
import SearchForm from "../Components/SearchForm";
import "../styles/home.css";
import "../styles/form.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    isbn: "",
    publisher: "",
    price: "",
  });
  const [showSearchForm, setShowSearchForm] = useState(false);

  useEffect(() => {
    fetchAllBooks()
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((err) => console.error("Failed to fetch books:", err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedQuery = { ...searchQuery, [name]: value };
    setSearchQuery(updatedQuery);
    applySearch(updatedQuery);
  };

  const handleReset = () => {
    const cleared = { title: "", isbn: "", publisher: "", price: "" };
    setSearchQuery(cleared);
    setFilteredBooks(books);
  };

  const applySearch = (query) => {
    const filtered = books.filter((book) => {
      return (
        (!query.title ||
          book.title?.toLowerCase().includes(query.title.toLowerCase())) &&
        (!query.isbn ||
          book.isbn?.toLowerCase().includes(query.isbn.toLowerCase())) &&
        (!query.publisher ||
          book.publisher
            ?.toLowerCase()
            .includes(query.publisher.toLowerCase())) &&
        (!query.price || String(book.price).includes(query.price))
      );
    });
    setFilteredBooks(filtered);
  };

  return (
    <div className="homepage">
      <Button
        text="Search Books"
        onClick={() => setShowSearchForm(true)}
        className="search-trigger-button"
      />
      {showSearchForm && (
        <SearchForm
          formData={searchQuery}
          handleChange={handleChange}
          handleReset={handleReset}
          onClose={() => setShowSearchForm(false)}
        />
      )}

      {filteredBooks.length > 0 ? (
        filteredBooks.map((book, index) => (
          <Card key={index} type="book" data={book} />
        ))
      ) : (
        <p>No matching books found.</p>
      )}
    </div>
  );
};

export default HomePage;
