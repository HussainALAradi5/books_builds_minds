import { useParams } from "react-router-dom";
import Review from "../Components/Review";
import "../styles/review.css";

const ReviewPage = () => {
  const { slug } = useParams();

  return (
    <div className="review-page">
      <h2 className="review-page-title">Book Reviews</h2>
      <Review slug={slug} />
    </div>
  );
};

export default ReviewPage;
