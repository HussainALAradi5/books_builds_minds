import { FaStar } from "react-icons/fa";
import "../../../styles/star.css";

const StarRating = ({ rating = 0 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const fill = Math.min(Math.max(rating - (i - 1), 0), 1);
    stars.push(
      <div className="star-wrapper" key={i}>
        <FaStar className="star-background" />
        <FaStar className="star-overlay" style={{ width: `${fill * 100}%` }} />
      </div>
    );
  }

  return (
    <div className="star-rating-container">
      {stars}
      <span className="rating-value">({rating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;
