import React from 'react';
import Hero from './Hero/Hero';
import { ReTitle } from 're-title';
import HiredPost from '../../components/HiredPost/HiredPost';
import Feed from './Feed/Feed';

const Home = () => {
    return (
        <div>
            <ReTitle title='Career Crafter'/>
            <HiredPost></HiredPost>
            <Hero></Hero>
            <Feed></Feed>
        </div>
    );
};

export default Home;