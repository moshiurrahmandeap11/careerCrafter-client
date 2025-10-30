import React, { useEffect } from "react";
import Hero from "./Hero/Hero";
import { ReTitle } from "re-title";
import HiredPost from "../../components/HiredPost/HiredPost";
import Feed from "./Feed/Feed";
import { Helmet } from "react-helmet-async";
import TopJobs from "./TopJobs/TopJobs";
import AIMentorForHome from "./AIMentorForHome/AIMentorForHome";
import AOS from "aos";
import "aos/dist/aos.css";
import ReviewSection from "./ReviewSection/ReviewSection";
import BuildFor from "./BuildFor/BuildFor";
import Founder from "./Founder/Founder";
import Launch from "./Launch/Launch";

const Home = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      easing: "ease-in-out", // Easing type
      once: true, // Whether animation should happen only once
      offset: 100, // Offset (in px) from the original trigger point
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Hero Section */}
      <section className="bg-white" data-aos="fade-up">
        <Hero />
      </section>
      <section className="bg-white" data-aos="fade-up">
        <ReviewSection />
      </section>

      {/* Main Content Grid */}
      <div className="w-11/12 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <section
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <AIMentorForHome />
            </section>

            <section
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Feed />
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <section
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <HiredPost />
            </section>

            <section
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <TopJobs />
            </section>
          </div>
        </div>
      </div>

      <section className="bg-white" data-aos="fade-up">
        <BuildFor />
      </section>

      <section className="bg-white" data-aos="fade-up">
        <Founder />
      </section>

      <section className="bg-white" data-aos="fade-up">
        <Launch />
      </section>
    </div>
  );
};

export default Home;
