import { useEffect, useState } from "react";
import {
  fetchBookReviews,
  addReview,
  editReview,
  deleteReview,
} from "../../service/auth";
import Button from "./Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ReviewOperations = ({ slug }) => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ rating: 0, comment: "" });
  const [editingId, setEditingId] = useState(null);
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchReviews();
  }, [slug]);

  const fetchReviews = () => {
    fetchBookReviews(slug)
      .then((data) => setReviews(data.reviews))
      .catch((err) => console.error("Failed to load reviews:", err));
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await editReview(slug, editingId, formData);
      } else {
        await addReview(slug, formData);
      }
      setFormData({ rating: 0, comment: "" });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      console.error("Review failed:", err);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.review_id);
    setFormData({ rating: review.rating, comment: review.comment });
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(slug, reviewId);
      fetchReviews();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="review-operations">
      <h3 className="review-header">Reviews</h3>

      <div className="review-list">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.review_id} className="review-card">
              <p className="review-rating">⭐ {review.rating}/5</p>
              <p className="review-comment">{review.comment}</p>
              <p className="review-author">By User {review.user_id}</p>

              {String(review.user_id) === currentUserId && (
                <div className="review-actions">
                  <Button
                    text={
                      <>
                        <FaEdit /> Edit
                      </>
                    }
                    onClick={() => handleEdit(review)}
                    className="review-edit-button"
                  />
                  <Button
                    text={
                      <>
                        <FaTrashAlt /> Delete
                      </>
                    }
                    onClick={() => handleDelete(review.review_id)}
                    className="review-delete-button"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="review-form">
        <h4>{editingId ? "Edit your review" : "Leave a review"}</h4>
        <input
          type="number"
          min="0"
          max="5"
          value={formData.rating}
          onChange={(e) =>
            setFormData({ ...formData, rating: Number(e.target.value) })
          }
          placeholder="Rating (0–5)"
        />
        <textarea
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          placeholder="Your comment..."
        />
        <Button
          text={editingId ? "Update" : "Submit"}
          onClick={handleSubmit}
          className="review-submit-button"
        />
      </div>
    </div>
  );
};

export default ReviewOperations;
