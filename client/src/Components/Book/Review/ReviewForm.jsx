import "../../../styles/form.css";
import Button from "../../Button";
import StarSelector from "./Star/StarSelector";

const ReviewForm = ({ formData, handleChange, isEditing, onSubmit }) => {
  return (
    <form className="review-form" onSubmit={onSubmit}>
      <h2>{isEditing ? "Edit Review" : "Write a Review"}</h2>

      <label htmlFor="rating">
        <strong>Select Rating:</strong>
      </label>
      <StarSelector rating={formData.rating} onChange={handleChange} />

      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        placeholder="Your comment..."
        rows={5}
        required
      />

      <div className="form-actions">
        <Button
          type="submit"
          text={isEditing ? "Update" : "Submit"}
          className="form-button"
        />
      </div>
    </form>
  );
};

export default ReviewForm;
