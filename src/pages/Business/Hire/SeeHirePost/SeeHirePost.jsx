import React, { useEffect, useState } from 'react';
import axiosIntense from '../../../../hooks/AxiosIntense/axiosIntense';

const SeeHirePost = () => {
    const axiosPublic=axiosIntense
    const [allpost,setaAllpost]=useState([])
    useEffect(()=>{
        axiosPublic.get('/hired-post/allpost').then(res=>setaAllpost(res.data))
    },[axiosPublic])

    const handleDelete=(id)=>{
        axiosPublic.delete(`/hired-post/post-delete/${id}`).then(res=>console.log(res.data))
    }
    

    console.log(allpost)
    return (
        <div>
            {
                allpost.map(all=>(
                    <div key={all._id}>
                        <h1>{all.title}</h1>
                        <button onClick={()=>handleDelete(all._id)}>delete</button>
                    </div>
                ))
            }
            
        </div>
    );
};

export default SeeHirePost;