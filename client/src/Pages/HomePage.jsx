import { useEffect, useState } from "react";
import { fetchAllBooks } from "../../service/auth";
import Card from "../Components/Card";
import "../styles/home.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchAllBooks()
      .then(setBooks)
      .catch((err) => console.error("Failed to fetch books:", err.message));
  }, []);

  return (
    <div className="homepage">
      {books.length > 0 ? (
        books.map((book, index) => <Card key={index} type="book" data={book} />)
      ) : (
        <p>No books available yet.</p>
      )}
    </div>
  );
};

export default HomePage;
