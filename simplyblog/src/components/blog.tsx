import {useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import { Card } from 'react-bootstrap';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LikeStatusType, BlogType }  from '../types/api-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { deletePost } from '../api/blogsapi';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const BLOG_API = '/blogs/show/';
const BLOG_UPDATE_API = '/blogs/update/';
const PUBLIC_SINGLE_BLOG_API = '/blogs/show/';
const BLOG_LIKES_API = '/blogs/likes/';
const BLOG_UNLIKES_API = '/blogs/unlikes/';
const BLOG_ADD_LIKEUNLIKE_API = '/blogs/likeunlike/';
const BLOG_REMOVE_LIKEUNLIKE_API = '/blogs/likeunlike/remove/';
const BLOG_DELETE_API = '/blogs/delete/';

export default function Blog(){
const [isEditing, setIsEditing] = useState(false);
const [editedTitle, setEditedTitle] = useState('');
const [editedBody, setEditedBody] = useState('');

    const [blogdata, setBlogdata] = useState<BlogType>();
    const [likes, setLikes] = useState(0);
    const [unlikes, setUnlikes] = useState(0);
    const [likeStatus, setLikeStatus] = useState<LikeStatusType>();
    const [isLikedUnliked, setIsLikedUnliked] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    let blogId = useParams().id;
    let userAuth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
  const getBlog = async () => {
    try {
      const response = await axios.get(PUBLIC_SINGLE_BLOG_API + blogId);
      setBlogdata(response.data);

      // 👉 Pre-fill input fields for editing
      setEditedTitle(response.data.title);
      setEditedBody(response.data.body);
    } catch (error) {
      console.error(error);
    }
  };
  getBlog();
}, [blogId]);


    useEffect(()=> {
        const getBlog = async() => {
            const response = await axios.get(PUBLIC_SINGLE_BLOG_API+blogId);
            setBlogdata(response.data);
        }
        getBlog();
    }, [blogId]);

    useEffect(()=> {
      const getBlogLikes = async() => {
          const response = await axios.get(BLOG_LIKES_API+blogId);
          setLikes(response.data);
      }
      getBlogLikes();
    }, [blogId, isLikedUnliked]);

    useEffect(()=> {
      const getBlogUnLikes = async() => {
          const response = await axios.get(BLOG_UNLIKES_API+blogId);
          setUnlikes(response.data);
      }
      getBlogUnLikes();
    }, [blogId, isLikedUnliked]);

    useEffect(()=> {
      if(userAuth.isAuthenticated){
        const likeStatus = async() => {
            const response = await axios.get('blogs/'+blogId+'/'+userAuth.username);
            setLikeStatus(response.data);
        }
        likeStatus();
      }
    }, [blogId, userAuth.isAuthenticated, isLikedUnliked]);

    const handleLikeUnlike = async(status: string) => {
      if(status === 'like'){
        if(likeStatus?.id){
          await axios.post(BLOG_REMOVE_LIKEUNLIKE_API+likeStatus.id);
          await axios.post(BLOG_ADD_LIKEUNLIKE_API, {
            blog: {id: blogId},
            likedBy: {id: userAuth.userId}
          })
          setIsLikedUnliked(!isLikedUnliked);
        } else {
          await axios.post(BLOG_ADD_LIKEUNLIKE_API, {
            blog: {id: blogId},
            likedBy: {id: userAuth.userId}
          })
          setIsLikedUnliked(!isLikedUnliked);
        }
      } else if(status === 'unlike'){
        if(likeStatus?.id){
          await axios.post(BLOG_REMOVE_LIKEUNLIKE_API+likeStatus.id);
          await axios.post(BLOG_ADD_LIKEUNLIKE_API, {
            blog: {id: blogId},
            unlikedBy: {id: userAuth.userId}
          })
          setIsLikedUnliked(!isLikedUnliked);
        } else {
          await axios.post(BLOG_ADD_LIKEUNLIKE_API, {
            blog: {id: blogId},
            unlikedBy: {id: userAuth.userId}
          })
          setIsLikedUnliked(!isLikedUnliked);
        }
      }
    }

    const handleDelete = async () => {
  try {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deletePost(Number(blogId));
      alert("Blog deleted successfully!");
      window.location.href = "/"; // or use a navigation hook to redirect
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete blog.");
  }
};
const handleEditSubmit = async () => {
  try {
    await axios.put(`/blogs/update/${blogId}`, {
      title: editedTitle,
      body: editedBody,
      publishedDate: new Date() // Optional: only if needed
    });
    setIsEditing(false);
    window.location.reload(); // You can also refetch the blog if preferred
  } catch (error) {
    console.error("Edit failed", error);
  }
};


    return (
      <div>
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <Card.Img 
              variant="top"
              src="https://random.imagecdn.app/900/300"/>
            <h1 className="display-5 fw-bold mt-5 text-center">{blogdata?.title}</h1>
            <Link to={`/user/${blogdata?.myUsers.userName}`} className="text-decoration-none">
              <p className="fs-10 mt-2 text-center">
                <img 
                  src={`https://avatars.dicebear.com/api/avataaars/${blogdata?.myUsers.userName}.svg`}
                  style={{height: '30px', width: '30px', borderRadius: '50%'}}
                />
                {blogdata?.myUsers.userName}
              </p>
            </Link>
            <p className="col-md-8 fs-4 mt-5">{blogdata?.body}</p>
            
            <div className="d-flex align-items-center">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={()=> handleLikeUnlike('like')}
                disabled={(likeStatus?.likedBy?.userName===userAuth.username)?true:false} 
                type="button"
              >
                {likes} <FontAwesomeIcon icon={faThumbsUp} />
              </button>
              
              <button
                className="btn btn-secondary btn-sm me-2"
                onClick={()=> handleLikeUnlike('unlike')}
                disabled={(likeStatus?.unlikedBy?.userName===userAuth.username)?true:false}
                type="button"
              >
                {unlikes} <FontAwesomeIcon icon={faThumbsDown} />
              </button>
              {userAuth.isAuthenticated && 
  userAuth.username === blogdata?.myUsers?.userName && (
    <>
      {!isEditing ? (
        <button
          className="btn btn-warning btn-sm ms-2"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      ) : (
        <>
          <div className="mt-3">
            <input
              className="form-control mb-2"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Edit Title"
            />
            <textarea
              className="form-control mb-2"
              rows={4}
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              placeholder="Edit Body"
            />
            <button
              className="btn btn-success btn-sm me-2"
              onClick={handleEditSubmit}
            >
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  )
}


              {userAuth.isAuthenticated && 
                (userAuth.username === blogdata?.myUsers.userName) && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faTrash} /> {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
              )}
            </div>

            <p className="fs-10 text-end mt-3">Published on: {blogdata?.publishedDate}</p>
          </div>
        </div>  
      </div>
    )
}