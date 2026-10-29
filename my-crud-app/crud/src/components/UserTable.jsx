import React from 'react';
import UserRow from './UserRow';

export default function UserTable({
  users,
  searchTerm,
  onSearchChange,
  editingId,
  onEdit,
  onDelete
}) {
  return (
    <section className="card list-card">
      <div className="list-top-bar">
        <h2>User Directory ({users.length})</h2>
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        {users.length === 0 ? (
          <p className="empty-message">No users found.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isEditing={editingId === user.id}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}