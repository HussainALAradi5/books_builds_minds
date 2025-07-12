import { useEffect, useState } from "react";
import Form from "./Form";
import Button from "./Button";
import { fetchBookReviews, deleteReview } from "../../service/auth";

const Review = ({ slug, hasPurchased }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [targetReviewId, setTargetReviewId] = useState(null);

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
    } else if (countdown === 0) {
      handleDelete();
    }
    return () => clearTimeout(timer);
  }, [showConfirmPopup, countdown]);

  return (
    <div className="review-wrapper">
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
                    <Button
                      text="Edit"
                      className="form-button"
                      onClick={() => setShowFormPopup(true)}
                    />
                    <Button
                      text="Delete"
                      className="form-button"
                      onClick={() => {
                        setTargetReviewId(review.review_id);
                        setShowConfirmPopup(true);
                      }}
                    />
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

      {hasPurchased && userHasReviewed && !showFormPopup && (
        <p className="review-warning">You've already reviewed this book.</p>
      )}

      {/* Add/Edit Popup */}
      {showFormPopup && (
        <>
          <div
            className="popup-backdrop"
            onClick={() => setShowFormPopup(false)}
          ></div>
          <div className="popup-panel">
            <Form mode="add-review" onSubmit={handleReviewSubmitted} />
          </div>
        </>
      )}

      {/* Delete Confirmation Popup */}
      {showConfirmPopup && (
        <>
          <div
            className="popup-backdrop"
            onClick={() => setShowConfirmPopup(false)}
          ></div>
          <div className="popup-panel">
            <h3>Are you sure you want to delete this review?</h3>
            <p>
              Confirming in <strong>{countdown}</strong> seconds...
            </p>
            <div className="form-actions">
              <Button
                text="Yes, Delete Now"
                className="form-button"
                onClick={() => setCountdown(0)}
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
