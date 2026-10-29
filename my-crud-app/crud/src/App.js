import React, {useState, useEffect} from 'react';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import './App.css';
const API_URL = 'http://localhost:5000/api/users';
// const initialUsers=[
//   {
//   "id":1,
//   "name":"Sathiya Narayanan",
//   "email": "sathiya.gsn@gmail.com",
//   "role":"Developer"
//   },
//     {
//   "id":2,
//   "name":"Kavipriya",
//   "email": "kavipriyasn@gmail.com",
//   "role":"Developer"
//   },
//     {
//   "id":3,
//   "name":"Thejasvitha",
//   "email": "sathiya.gsn@gmail.com",
//   "role":"Developer"
//   }
// ]
function App() {
  const [users, setUsers]= useState([]);
  const [formData, setFormData]=useState({
  id:"", name:"", email:"",role:""
  })
  const [editingId, setEditingId]=useState(null);
  const [searchTerm, setSearchTerm]=useState('');
  // useEffect(()=>{
  //   localStorage.setItem('crud_users', JSON.stringify(users));
  // },[users])

 const loadUsers = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Fetch error:', err));
  };

  useEffect(() => {
    loadUsers();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler (handles both Add and Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    // if (editingId !== null) {
    //   setUsers((prev) =>
    //     prev.map((u) => (u.id === editingId ? { ...u, ...formData } : u))
    //   );
    //   setEditingId(null);
    // } else {
    //   const newUser = { id: Date.now(), ...formData };
    //   setUsers((prev) => [newUser, ...prev]);
    // }
   if (editingId !== null) {
      // UPDATE (PUT)
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to update');
          return res.json(); // Wait for server to finish writing
        })
        .then(() => {
          setEditingId(null);
          setFormData({ name: '', email: '', role: '' });
          loadUsers(); // Runs ONLY after the server response is fully complete
        })
        .catch((err) => console.error(err));
    } else {
      // CREATE (POST)
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then((res) => res.json())
        .then(() => {
          setFormData({ name: '', email: '', role: '' });
          loadUsers();
        })
        .catch((err) => console.error(err));
    }

    setFormData({ name: '', email: '', role: '' });
  };

  // Trigger edit mode
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: '' });
  };

  // Delete user
  // const handleDelete = (id) => {
  //   if (window.confirm('Are you sure you want to delete this user?')) {
  //     setUsers((prev) => prev.filter((u) => u.id !== id));
  //     if (editingId === id) {
  //       handleCancelEdit();
  //     }
  //   }
  // };
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    }).then(() => {
      loadUsers(); // Refresh list from server
    });
  };

  // Derived state: calculate filtered users on the fly
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className='crud-container'>
      <header className='crud-header'>
          <h1>User Management</h1>
          <p>A simple CRUD Operation with pure CSS</p>
      </header>
      <div className='crud-grid'>
       <UserForm
          formData={formData}
          isEditing={editingId !== null}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />

        <UserTable
          users={filteredUsers}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          editingId={editingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
