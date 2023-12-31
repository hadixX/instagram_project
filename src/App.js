import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import {db,auth} from './firebase';
import Box from '@mui/material/Box';
import {Button,Input, useMediaQuery, useTheme} from '@mui/material';
import Modal from '@mui/material/Modal';
import ImageUploader from './ImageUploader';


function App() {
  const [posts,setPost] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: isSmallScreen ? 300:400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
 
  
};
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [user,setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const handleSignIn = () => setOpenSignIn(true);
  const closeSignIn = () => setOpenSignIn(false);


  useEffect(() =>{

    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot =>{
      setPost(snapshot.docs.map(doc => ({
        id:doc.id,
        post:doc.data()
      })));

    })
  },[]);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser)
      {
        console.log(authUser);
        setUser(authUser);

      }else{
        setUser(null);
      }
     
    })

    return () =>{
      unsubscribe();
    }
  },[user,username]);

  const signUp = (event) =>{
      event.preventDefault();

      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser) => {
         return authUser.user.updateProfile({
          displayName: username
         })
      })
      .catch((error) => alert(error.message)) 
      setOpen(false);
  }

  const signIn = (event) =>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password).catch((error) => alert(error.message))
    setOpenSignIn(false);
  }
  return (
    
    <div className="app">
   
   
     <div className="app__header">
      <img  
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
      />

       {user ? (
      <Button onClick={() => auth.signOut()}>Logout</Button>
     
     ):(
      <div className="app__loinContainer">
        <Button onClick={handleSignIn}>Sign In</Button>
        <Button onClick={handleOpen}>Sign Up</Button>
      </div> 
     )}

     </div>
    
    
     <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
        <form className="app__signup">
                <div className="app__image">
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
                </div>
                
                <Input 
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input 
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input 
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                <Button type="submit" onClick={signUp} >Sign Up</Button>
             
        </form>
        
        </Box>
      </Modal>

      <Modal
        keepMounted
        open={openSignIn}
        onClose={closeSignIn}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
        <form className="app__signup">
                <div className="app__image">
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
                </div>
                
                <Input 
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                <Button type="submit" onClick={signIn} >Sign-In</Button>
             
        </form>
        
        </Box>
      </Modal>

    
    <div className="app__posts">
    {
      posts.map(({id,post}) =>(
        <Post 
        key={id}
        postid={id}
        user={user}
        username={post.username}
        caption={post.caption}
        imageUrl={post.imageUrl}/>
      ))
    }

    </div>
    
    {user?.displayName ? (
      <ImageUploader username={user.displayName} />
    ):(
      <h3 className='notLoggedIn'>Sorry you need to login to upload</h3>
    )}
    
    </div>
   
  );
}

export default App;
