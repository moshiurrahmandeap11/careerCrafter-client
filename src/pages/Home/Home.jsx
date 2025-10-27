import React from "react";
import Hero from "./Hero/Hero";
import { ReTitle } from "re-title";
import HiredPost from "../../components/HiredPost/HiredPost";
import Feed from "./Feed/Feed";
import { Helmet } from "react-helmet-async";
import RandomNetwork from "./RandomNetwork/RandomNetwork";
import TopJobs from "./TopJobs/TopJobs";
import AIMentorForHome from "./AIMentorForHome/AIMentorForHome";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>
          Career Crafter - AI-Powered Job Portal & Professional Network
        </title>
        <meta
          name="description"
          content="Find your dream job with AI-powered job matching, build professional resumes, connect with mentors, and grow your career. Join thousands of professionals today!"
        />
        <meta
          name="keywords"
          content="online job portal, AI job finder, career platform, LinkedIn alternative, job search"
        />
        <link
          rel="canonical"
          href="https://careercrafter.moshiurrahman.online/"
        />
      </Helmet>
      <ReTitle title="Career Crafter" />
      <Hero></Hero>
      <HiredPost></HiredPost>
      <Feed></Feed>
      <RandomNetwork></RandomNetwork>
      <TopJobs></TopJobs>
      <AIMentorForHome></AIMentorForHome>
    </div>
  );
};

export default Home;
