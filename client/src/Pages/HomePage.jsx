import { useEffect, useState } from "react";
import { fetchAllBooks, fetchPurchasedBooks } from "../../service/auth";
import Card from "../Components/Card";
import Header from "../Components/Header";
import "../styles/home.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("user_id");

        const booksData = await fetchAllBooks();

        let purchasedSlugs = [];

        if (userId) {
          const purchasedData = await fetchPurchasedBooks(userId);
          const purchasedBooks = Array.isArray(purchasedData)
            ? purchasedData
            : purchasedData.books || [];

          purchasedSlugs = purchasedBooks.map((book) => book.slug);
        }

        const booksWithStatus = booksData.map((book) => ({
          ...book,
          hasPurchased: purchasedSlugs.includes(book.slug),
        }));

        setBooks(booksWithStatus);
        setFilteredBooks(booksWithStatus);
      } catch (err) {
        console.error("Failed to fetch books:", err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header books={books} setFilteredBooks={setFilteredBooks} />
      <div className="homepage">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <Card key={index} type="book" data={book} />
          ))
        ) : (
          <p>No matching books found.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;
