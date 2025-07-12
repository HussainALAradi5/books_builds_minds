import Button from "./Button";
import "../styles/form.css";

const ReviewForm = ({ formData, handleChange, isEditing, onSubmit }) => {
  return (
    <form className="review-form" onSubmit={onSubmit}>
      <h2>{isEditing ? "Edit Review" : "Write a Review"}</h2>

      <input
        type="number"
        name="rating"
        min="0"
        max="5"
        step="0.5"
        value={formData.rating}
        onChange={handleChange}
        placeholder="Rating (0–5)"
        required
      />

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
