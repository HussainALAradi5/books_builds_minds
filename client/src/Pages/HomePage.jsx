import { useEffect, useState } from "react";
import { fetchAllBooks } from "../../service/auth";
import Card from "../Components/Card";
import Search from "../Components/Search";
import "../styles/home.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    fetchAllBooks()
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((err) => console.error("Failed to fetch books:", err.message));
  }, []);

  return (
    <div className="homepage">
      <Search books={books} setFilteredBooks={setFilteredBooks} />

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
