import { useEffect, useState } from "react";
import Form from "./Form";
import Button from "./Button";
import { fetchBookReviews, deleteReview } from "../../service/auth";
import { FaEdit, FaRegEdit, FaTrash, FaTrashAlt } from "react-icons/fa";

const Review = ({ slug, hasPurchased }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [targetReviewId, setTargetReviewId] = useState(null);
  const [editingReviewData, setEditingReviewData] = useState(null);
  const [hoverTrash, setHoverTrash] = useState(false);
  const [hoverEdit, setHoverEdit] = useState(false);

  const currentUserId = localStorage.getItem("user_id");
  const userHasReviewed = reviews.some((r) => r.user_id == currentUserId);

  const fetchReviews = async () => {
    try {
      const result = await fetchBookReviews(slug);
      setReviews(result.reviews || []);
      setError("");
    } catch (err) {
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setShowFormPopup(false);
    setEditingReviewData(null);
    fetchReviews();
  };

  const handleDelete = async () => {
    await deleteReview(slug, targetReviewId);
    setShowConfirmPopup(false);
    setCountdown(5);
    fetchReviews();
  };

  useEffect(() => {
    localStorage.setItem("review_slug", slug);
    fetchReviews();
  }, [slug]);

  useEffect(() => {
    let timer;
    if (showConfirmPopup && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showConfirmPopup, countdown]);

  return (
    <div className="review-wrapper">
      {hasPurchased &&
        userHasReviewed &&
        !showFormPopup &&
        !editingReviewData && (
          <p className="review-warning">You've already reviewed this book.</p>
        )}
      <h2 className="review-heading">Book Reviews</h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((review) => {
            const isOwner = review.user_id == currentUserId;
            return (
              <div key={review.review_id} className="review-box">
                <p className="review-user">
                  <strong>{review.user_name}</strong> rated{" "}
                  <span className="review-rating">{review.rating}/5</span>
                </p>
                <p className="review-comment">{review.comment}</p>
                {isOwner && (
                  <div className="form-actions">
                    <button
                      className="icon-button edit-icon"
                      onClick={() => {
                        setEditingReviewData(review);
                        setShowFormPopup(true);
                      }}
                      onMouseEnter={() => setHoverEdit(true)}
                      onMouseLeave={() => setHoverEdit(false)}
                    >
                      {hoverEdit ? <FaRegEdit /> : <FaEdit />}
                    </button>
                    <button
                      className="icon-button delete-icon"
                      onClick={() => {
                        setTargetReviewId(review.review_id);
                        setShowConfirmPopup(true);
                      }}
                      onMouseEnter={() => setHoverTrash(true)}
                      onMouseLeave={() => setHoverTrash(false)}
                    >
                      {hoverTrash ? <FaTrashAlt /> : <FaTrash />}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No reviews yet for this book.</p>
      )}

      {hasPurchased && !userHasReviewed && (
        <Button
          text="Add Review"
          className="form-button"
          onClick={() => setShowFormPopup(true)}
        />
      )}

      {showFormPopup && (
        <>
          <div
            className="popup-backdrop"
            onClick={() => {
              setShowFormPopup(false);
              setEditingReviewData(null);
            }}
          />
          <div className="popup-panel">
            <Form
              mode="add-review"
              isEditing={Boolean(editingReviewData)}
              initialData={editingReviewData}
              onSubmit={handleReviewSubmitted}
            />
          </div>
        </>
      )}

      {showConfirmPopup && (
        <>
          <div
            className="popup-backdrop"
            onClick={() => setShowConfirmPopup(false)}
          />
          <div className="popup-panel">
            <h3>Are you sure you want to delete this review?</h3>
            <p>
              Confirming in <strong>{countdown}</strong> seconds...
            </p>
            <div className="form-actions">
              <Button
                text="Yes, Delete Now"
                disabled={countdown > 0}
                className="form-button"
                onClick={handleDelete}
              />
              <Button
                text="Cancel"
                className="form-button"
                onClick={() => {
                  setShowConfirmPopup(false);
                  setCountdown(5);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Review;
