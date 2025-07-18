import { Rating } from "react-simple-star-rating";
import "../../../../styles/star.css";

const StarRating = ({ rating = 0 }) => {
  return (
    <div className="star-component-wrapper">
      <Rating
        readonly
        initialValue={rating}
        allowFraction
        fillColor="#f1c40f"
        emptyColor="#ccc"
        size={24}
      />
      <span className="star-selector-label">{rating.toFixed(2)} / 5</span>
    </div>
  );
};

export default StarRating;
