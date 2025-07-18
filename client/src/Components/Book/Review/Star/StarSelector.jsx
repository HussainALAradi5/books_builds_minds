import { Rating } from "react-simple-star-rating";
import "../../../../styles/star.css";

const StarSelector = ({ rating = 0, onChange }) => {
  const handleRating = (rate) => {
    onChange({ target: { name: "rating", value: rate } });
  };

  return (
    <div className="star-component-wrapper">
      <Rating
        onClick={handleRating}
        initialValue={rating}
        allowFraction
        fillColor="#f1c40f"
        emptyColor="#ccc"
        size={30}
        transition
      />
      <span className="star-selector-label">{rating.toFixed(2)} / 5</span>
    </div>
  );
};

export default StarSelector;
