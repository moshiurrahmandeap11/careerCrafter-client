import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const ReviewSection = () => {
  // Review data with 10+ reviews
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Software Engineer',
      company: 'Google',
      rating: 5,
      text: 'This platform completely transformed my job search. Found my dream job in just 2 weeks!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Product Manager',
      company: 'Microsoft',
      rating: 5,
      text: 'The mock interview feature helped me ace my final round. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'UX Designer',
      company: 'Apple',
      rating: 4,
      text: 'Great community and excellent resources for career growth. Love the resume builder!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Data Scientist',
      company: 'Amazon',
      rating: 5,
      text: 'The personalized job recommendations are spot on. Saved me hours of searching.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Jessica Williams',
      position: 'Frontend Developer',
      company: 'Meta',
      rating: 5,
      text: 'From resume creation to interview prep, this platform has everything you need.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 6,
      name: 'Alex Thompson',
      position: 'DevOps Engineer',
      company: 'Netflix',
      rating: 4,
      text: 'Excellent platform for tech professionals. The community support is amazing.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 7,
      name: 'Priya Patel',
      position: 'Backend Developer',
      company: 'Uber',
      rating: 5,
      text: 'Landed 3 interviews in the first week. The job matching algorithm is incredible.',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 8,
      name: 'James Wilson',
      position: 'Full Stack Developer',
      company: 'Twitter',
      rating: 5,
      text: 'The career guidance and mentorship opportunities are invaluable for growth.',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 9,
      name: 'Lisa Garcia',
      position: 'Mobile Developer',
      company: 'Spotify',
      rating: 4,
      text: 'User-friendly interface and great customer support. Made my job hunt stress-free.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 10,
      name: 'Ryan Cooper',
      position: 'Cloud Architect',
      company: 'AWS',
      rating: 5,
      text: 'Best career platform I have used. The interview preparation materials are top-notch.',
      avatar: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 11,
      name: 'Maya Singh',
      position: 'AI Engineer',
      company: 'OpenAI',
      rating: 5,
      text: 'The platform connected me with industry leaders I never thought I would meet.',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 12,
      name: 'Daniel Brown',
      position: 'Security Engineer',
      company: 'CrowdStrike',
      rating: 4,
      text: 'Comprehensive resources and real-time job alerts helped me stay ahead in my search.',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face'
    }
  ];

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Review card component
  const ReviewCard = ({ review }) => (
    <motion.div
      className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-6 mx-4"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-blue-600 opacity-20" />
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
        "{review.text}"
      </p>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={review.rating} />
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center space-x-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
        />
        <div>
          <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
          <div className="text-xs text-gray-600">
            {review.position} at {review.company}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gray-50 py-16 lg:py-20">
      <div className="w-11/12 mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their careers with our platform
          </p>
        </motion.div>

        {/* Marquee Rows */}
        <div className="space-y-8">
          {/* First Row - Left to Right */}
          <div className="relative overflow-hidden">
            {/* Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
            
            <motion.div
              className="flex"
              animate={{ 
                x: [0, -1920], // Adjust based on total width of all cards
              }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                }
              }}
            >
              {/* Double the reviews for seamless looping */}
              {[...reviews.slice(0, 10), ...reviews.slice(0, 10)].map((review, index) => (
                <ReviewCard key={`row1-${review.id}-${index}`} review={review} />
              ))}
            </motion.div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="relative overflow-hidden">
            {/* Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
            
            <motion.div
              className="flex"
              animate={{ 
                x: [-1920, 0], // Reverse direction
              }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                }
              }}
            >
              {/* Double the reviews for seamless looping */}
              {[...reviews.slice(2, 12), ...reviews.slice(2, 12)].map((review, index) => (
                <ReviewCard key={`row2-${review.id}-${index}`} review={review} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;