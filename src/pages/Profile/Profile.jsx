import React from 'react';
import useAuth from '../../hooks/UseAuth/useAuth';
import Loader from '../../components/sharedItems/Loader/Loader';
import { useNavigate } from 'react-router';

const Profile = () => {
    const {user, loading, userLogOut} = useAuth();
    const navigate = useNavigate();

    const handleLogOut = () => {
        userLogOut();
        navigate("/")
    } 

    if(loading){
        return <Loader></Loader>
    }
    return (
        <div>
            <button onClick={handleLogOut}>Logout</button>
        </div>
    );
};

export default Profile;