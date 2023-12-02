import React, { useState } from "react";
import image1 from "../assets/delete.png";
import image2 from "../assets/edit.png";
import "./RecordItem.css";

const RecordItem = ({ record, isSelected, onSelect, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({ ...record });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(editedValues);
    console.log(editedValues);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDeleteClick = () => {
    console.log("Deleting record with ID:", record.id);
    onDelete(record.id);
  };

  return (
    <tr
      className={`${isSelected ? "selected-row" : ""} ${
        record.isDeleted ? "deleted-row" : ""
      }`}
    >
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(record.id)}
        />
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editedValues.name}
            onChange={handleInputChange}
          />
        ) : (
          record.name
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="email"
            value={editedValues.email}
            onChange={handleInputChange}
          />
        ) : (
          record.email
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="role"
            value={editedValues.role}
            onChange={handleInputChange}
          />
        ) : (
          record.role
        )}
      </td>
      <td>
        {isEditing ? (
          <button onClick={handleSaveClick} className="save">
            Save
          </button>
        ) : (
          <button onClick={handleEditClick} className="edit">
            <img src={image2} alt="Edit" className="small-image" />
          </button>
        )}
        <button onClick={handleDeleteClick} className="delete">
          <img src={image1} alt="Delete" className="small-image" />
        </button>
      </td>
    </tr>
  );
};

export default RecordItem;
