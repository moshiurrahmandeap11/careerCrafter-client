import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Quote, Award, TrendingUp, MapPin, Calendar, ArrowRight, X } from 'lucide-react';

const SuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Success stories data
  const successStories = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      company: 'Google',
      previousCompany: 'Startup Tech',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      videoThumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
      duration: '3 months',
      salaryIncrease: '85%',
      location: 'Mountain View, CA',
      story: 'After struggling to get noticed by top tech companies, I used the platform\'s resume builder and mock interview features. Within 3 months, I went from a small startup to landing my dream job at Google with an 85% salary increase!',
      achievements: [
        '5 final round interviews',
        '3 job offers',
        '85% salary increase',
        'Relocation package'
      ],
      rating: 5,
      category: 'technology'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Product Manager',
      company: 'Microsoft',
      previousCompany: 'Mid-level Company',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      videoThumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      duration: '2 months',
      salaryIncrease: '65%',
      location: 'Seattle, WA',
      story: 'The career coaching and networking opportunities through this platform were incredible. I connected with Microsoft recruiters directly and received personalized guidance that helped me navigate the complex interview process.',
      achievements: [
        'Direct recruiter connection',
        'Personalized career coaching',
        '65% salary increase',
        'Stock options'
      ],
      rating: 5,
      category: 'product'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'Lead UX Designer',
      company: 'Apple',
      previousCompany: 'Design Agency',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      videoThumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      duration: '4 months',
      salaryIncrease: '70%',
      location: 'Cupertino, CA',
      story: 'As a designer, portfolio presentation is everything. The platform helped me showcase my work effectively and prepare for Apple\'s rigorous design challenges. The mock interviews were particularly helpful!',
      achievements: [
        'Portfolio optimization',
        'Design challenge preparation',
        '70% salary increase',
        'Leadership role'
      ],
      rating: 4,
      category: 'design'
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Data Science Manager',
      company: 'Amazon',
      previousCompany: 'Research Institute',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      videoThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      duration: '3 months',
      salaryIncrease: '90%',
      location: 'Seattle, WA',
      story: 'Transitioning from academia to industry was challenging. The platform provided me with industry insights, interview preparation, and helped me understand what top tech companies look for in data science candidates.',
      achievements: [
        'Industry transition success',
        'Management position',
        '90% salary increase',
        'Research freedom'
      ],
      rating: 5,
      category: 'data'
    },
    {
      id: 5,
      name: 'Jessica Williams',
      position: 'Frontend Architect',
      company: 'Meta',
      previousCompany: 'E-commerce Company',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      videoThumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      duration: '2 months',
      salaryIncrease: '75%',
      location: 'Menlo Park, CA',
      story: 'The technical interview preparation was outstanding. I practiced with real-world system design problems and received feedback from senior engineers. This gave me the confidence to ace my Meta interviews.',
      achievements: [
        'System design mastery',
        'Multiple competing offers',
        '75% salary increase',
        'Architect-level position'
      ],
      rating: 5,
      category: 'technology'
    },
    {
      id: 6,
      name: 'Alex Thompson',
      position: 'Cloud Solutions Architect',
      company: 'Netflix',
      previousCompany: 'Consulting Firm',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      videoThumbnail: 'https://images.unsplash.com/photo-1526379879527-855a8c4a8211?w=400&h=300&fit=crop',
      duration: '5 months',
      salaryIncrease: '110%',
      location: 'Los Gatos, CA',
      story: 'The platform helped me transition from consulting to a product company. The career guidance and interview preparation specifically for Netflix\'s unique culture were invaluable in my success.',
      achievements: [
        'Career transition success',
        '110% salary increase',
        'Flexible work arrangement',
        'Impactful projects'
      ],
      rating: 5,
      category: 'technology'
    }
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'All Stories', count: successStories.length },
    { id: 'technology', name: 'Technology', count: successStories.filter(s => s.category === 'technology').length },
    { id: 'product', name: 'Product', count: successStories.filter(s => s.category === 'product').length },
    { id: 'design', name: 'Design', count: successStories.filter(s => s.category === 'design').length },
    { id: 'data', name: 'Data Science', count: successStories.filter(s => s.category === 'data').length }
  ];

  // Filtered stories based on active category
  const filteredStories = activeCategory === 'all' 
    ? successStories 
    : successStories.filter(story => story.category === activeCategory);

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

  // Story card component
  const StoryCard = ({ story }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group cursor-pointer"
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      onClick={() => setSelectedStory(story)}
    >
      {/* Image/Video Thumbnail */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 text-blue-600 ml-1" />
          </div>
        </div>
        
        {/* Success Badge */}
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
          <TrendingUp className="w-4 h-4" />
          <span>Hired</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={story.image}
            alt={story.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{story.name}</h3>
            <p className="text-sm text-gray-600">{story.position}</p>
          </div>
        </div>

        {/* Company & Location */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{story.company}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{story.location}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{story.salaryIncrease}</div>
            <div className="text-xs text-gray-600">Salary Increase</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{story.duration}</div>
            <div className="text-xs text-gray-600">Job Search</div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <StarRating rating={story.rating} />
        </div>
      </div>
    </motion.div>
  );

  // Story Detail Modal
  const StoryDetailModal = ({ story, onClose }) => (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <img
              src={story.videoThumbnail}
              alt={story.name}
              className="w-full h-64 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* User Info */}
            <div className="flex items-start space-x-6 mb-6">
              <img
                src={story.image}
                alt={story.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{story.name}</h2>
                <div className="flex items-center space-x-4 text-gray-600 mb-2">
                  <div>
                    <span className="font-semibold">{story.position}</span> at{' '}
                    <span className="font-semibold text-blue-600">{story.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{story.location}</span>
                  </div>
                </div>
                <StarRating rating={story.rating} />
              </div>
            </div>

            {/* Journey */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Journey</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Previous Role</span>
                    <span className="font-semibold">{story.previousCompany}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">New Role</span>
                    <span className="font-semibold text-blue-600">{story.company}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Salary Increase</span>
                    <span className="font-semibold text-green-600">{story.salaryIncrease}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-600">Search Duration</span>
                    <span className="font-semibold text-purple-600">{story.duration}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Achievements</h3>
                <div className="space-y-3">
                  {story.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Story */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Quote className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Success Story</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{story.story}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="w-11/12 mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Real People, Real Success
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how professionals transformed their careers and achieved their dreams with our platform
          </p>
        </motion.div>

        {/* Success Stories Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default SuccessStories;