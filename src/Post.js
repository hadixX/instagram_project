import React, { useEffect,useState } from 'react'
import './Post.css';
import Avatar from '@mui/joy/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import {db} from './firebase';
import firebase from 'firebase/compat/app';
function Post({postid,username,user,caption,imageUrl}) {
  const [comments,setComments] = useState([]);
  const [comment,setComment] = useState('');

  useEffect(()=>{
    let unsubscribe;
    if(postid){
      unsubscribe = 
      db.collection("posts").doc(postid).collection("comments").orderBy('timestamp','desc').onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      })

    }

    return () =>{
      unsubscribe();
    };
  }, [postid]);

  const postComment = (event) =>{
    event.preventDefault();

    db.collection("posts").doc(postid).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }
  return (
    <div className="post"> 
         <div className="post__header">
         <Avatar
            className="post__avatar"
            sx={{ bgcolor: deepPurple[100] }}
            alt={username}
            src="/static/images/avatar/1.jpg"
          />

            <h3>{username}</h3>
        </div>
        <img
            className="post__image"
            src={imageUrl}
        />

        <h4 className="post__text" ><strong>{username}</strong> {caption}</h4>

        <div className="post__comments">
          {comments.map((comment) =>(
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>  
          ))}
        </div>

        {user && (
          <form className="post__commentBox">
            <input 
              className="post__input"
              type="text"
              placeholder="Add a comment...."
              value={comment}
              onChange={(e)=> setComment(e.target.value)}
            />
            <button
            className="post__button"
              disabled={!comment}
              type="submit"
              onClick={postComment}
              >
              Post
            </button>
          </form>
        )}
       

        
    </div>
    
  )
}

export default Post