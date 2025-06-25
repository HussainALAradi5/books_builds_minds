import { useState } from "react";
import Form from "../Components/Form";
import Button from "../Components/Button";

const AdminPanel = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggle = () => {
    setShowAddForm((prev) => !prev);
  };

  return (
    <div className={`admin-panel ${showAddForm ? "show-popup" : ""}`}>
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Button
          text={showAddForm ? "Close Add Book Form" : "Add New Book"}
          onClick={handleToggle}
          className="admin-action-button"
        />
      </div>

      {showAddForm && (
        <div className="admin-form-wrapper">
          <Form mode="add-book" />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
