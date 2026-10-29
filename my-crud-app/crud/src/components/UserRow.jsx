import React from 'react';

export default function UserRow({ user, isEditing, onEdit, onDelete }) {
  return (
    <tr className={isEditing ? 'row-editing' : ''}>
      <td>
        <strong>{user.name}</strong>
      </td>
      <td>{user.email}</td>
      <td>
        <span className="badge">{user.role}</span>
      </td>
      <td className="actions-cell">
        <button
          className="btn-link btn-edit"
          onClick={() => onEdit(user)}
        >
          Edit
        </button>
        <button
          className="btn-link btn-delete"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}