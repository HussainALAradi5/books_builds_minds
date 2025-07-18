import { useState } from "react";
import { FaEdit, FaRegEdit, FaTrash, FaTrashAlt } from "react-icons/fa";

const ReviewOperations = ({
  review,
  currentUserId,
  onEdit,
  onDeleteTrigger,
}) => {
  const [hoverTrash, setHoverTrash] = useState(false);
  const [hoverEdit, setHoverEdit] = useState(false);
  const isOwner = review.user_id == currentUserId;

  if (!isOwner) return null;

  return (
    <div className="form-actions">
      <button
        className="icon-button edit-icon"
        onClick={() => onEdit(review)}
        onMouseEnter={() => setHoverEdit(true)}
        onMouseLeave={() => setHoverEdit(false)}
      >
        {hoverEdit ? <FaRegEdit /> : <FaEdit />}
      </button>
      <button
        className="icon-button delete-icon"
        onClick={() => onDeleteTrigger(review.review_id)}
        onMouseEnter={() => setHoverTrash(true)}
        onMouseLeave={() => setHoverTrash(false)}
      >
        {hoverTrash ? <FaTrashAlt /> : <FaTrash />}
      </button>
    </div>
  );
};

export default ReviewOperations;
