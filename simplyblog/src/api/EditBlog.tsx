import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    axios.get(`/blogs/show/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setBody(res.data.body);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    try {
      await axios.put(`/blogs/update/${id}`, {
        title,
        body,
        id, // make sure ID is sent
      });
      navigate(`/blog/${id}`); // redirect to the blog view page
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Blog</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea className="form-control" value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        <button className="btn btn-success" type="submit">Update Blog</button>
      </form>
    </div>
  );
};

export default EditBlog;
