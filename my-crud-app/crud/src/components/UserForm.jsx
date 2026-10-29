import React from 'react';

export default function UserForm({
  formData,
  isEditing,
  onChange,
  onSubmit,
  onCancel
}) {
  return (
    <section className="card form-card">
      <h2>{isEditing ? 'Edit User' : 'Add New User'}</h2>

      <form onSubmit={onSubmit} className="crud-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="e.g. john@example.com"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role / Position</label>
          <input
            id="role"
            type="text"
            name="role"
            placeholder="e.g. Frontend Engineer"
            value={formData.role}
            onChange={onChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Add User'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}