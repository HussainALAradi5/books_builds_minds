import Button from "../../Button";

const ReviewPopup = ({ countdown, onConfirm, onCancel }) => (
  <>
    <div className="popup-backdrop" onClick={onCancel} />
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
          onClick={onConfirm}
        />
        <Button text="Cancel" className="form-button" onClick={onCancel} />
      </div>
    </div>
  </>
);

export default ReviewPopup;
