import "../styles/review.css";
import ReviewOperations from "./ReviewOperations";

const Review = ({ slug }) => {
  return (
    <div className="review-wrapper">
      <ReviewOperations slug={slug} />
    </div>
  );
};

export default Review;
