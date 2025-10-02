import React from 'react';
import Hero from './Hero/Hero';
import { ReTitle } from 're-title';

const Home = () => {
    return (
        <div>
            <ReTitle title='Career Crafter'/>
            <Hero></Hero>
        </div>
    );
};

export default Home;