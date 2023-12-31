import React, {useState} from 'react';
import {Button} from '@mui/material';
import {storage,db} from './firebase';
import firebase from 'firebase/compat/app';
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { collection, addDoc, } from "firebase/firestore"; 
import 'firebase/firestore';
import './imageUploader.css'
function ImageUploader({username}) {

    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);
    const [caption,setCaption] = useState('');

    const handlChange = (e) =>{
        if(e.target.files[0])
        {
            setImage(e.target.files[0]);
        }
    };

    const handlUpload = () =>{
        const storageRef = ref(storage,`/images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef,image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) =>{
                console.log(error.message);
                alert(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) =>{
                    addDoc(collection(db, "posts"),{
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption:caption,
                    imageUrl:url,
                    username: username
                   });
                   
                
                   setProgress(0);
                   setCaption('');
                   setImage(null);
                });
            }
        )
    }

    return(
        <div className='imageUpload'>
            <div className='imageWidth'>
                <progress className="imageUpload__progress" value={progress} max="100" />
                <input type="text" placeholder="Enter a caption " onChange={event => setCaption(event.target.value)} value={caption} />
                <input type="file" onChange={handlChange} />
                <Button onClick={handlUpload}>Upload</Button>
            </div>
            
        </div>
    )
}

export default ImageUploader