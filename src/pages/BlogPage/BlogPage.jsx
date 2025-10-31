import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, Search, ChevronRight, Tag, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import MainButton from '../../components/sharedItems/MainButton/MainButton';



const BlogPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample categories
  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'career', name: 'Career Growth' },
    { id: 'interview', name: 'Interview Tips' },
    { id: 'resume', name: 'Resume Building' },
    { id: 'skills', name: 'Skills Development' },
    { id: 'industry', name: 'Industry Insights' }
  ];

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants matching Hero component
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Fetch blog posts (replace with actual API call)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const sampleBlogs = [
            {
              id: 1,
              title: 'Mastering the Art of Technical Interviews',
              excerpt: 'Learn the key strategies and techniques to excel in technical interviews and land your dream job.',
              category: 'interview',
              author: 'Sarah Chen',
              date: '2024-01-15',
              readTime: '8 min read',
              image: 'https://i.postimg.cc/t4qcPNXx/image.jpg',
              featured: true
            },
            {
              id: 2,
              title: 'Building a Resume That Stands Out',
              excerpt: 'Discover how to create a compelling resume that catches recruiters attention and gets you interviews.',
              category: 'resume',
              author: 'Mike Rodriguez',
              date: '2024-01-12',
              readTime: '6 min read',
              image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
              id: 3,
              title: 'The Future of Remote Work in Tech',
              excerpt: 'Explore how remote work is shaping the tech industry and what it means for your career.',
              category: 'industry',
              author: 'Emily Watson',
              date: '2024-01-10',
              readTime: '10 min read',
              image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
              id: 4,
              title: '5 Essential Skills for 2024',
              excerpt: 'Stay ahead of the curve with these must-have skills that employers are looking for this year.',
              category: 'skills',
              author: 'David Kim',
              date: '2024-01-08',
              readTime: '7 min read',
              image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
              id: 5,
              title: 'Navigating Career Transitions Successfully',
              excerpt: 'Practical advice for making smooth career transitions and adapting to new roles and industries.',
              category: 'career',
              author: 'Lisa Thompson',
              date: '2024-01-05',
              readTime: '9 min read',
              image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
              id: 6,
              title: 'Effective Networking Strategies',
              excerpt: 'Build meaningful professional connections that can accelerate your career growth and opportunities.',
              category: 'career',
              author: 'Alex Johnson',
              date: '2024-01-03',
              readTime: '5 min read',
              image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }
          ];
          
          setBlogs(sampleBlogs);
          setFeaturedPost(sampleBlogs.find(blog => blog.featured));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    (activeCategory === 'all' || blog.category === activeCategory) &&
    (searchQuery === '' || 
     blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-gray-50 border-b border-gray-200">
        <div className="w-11/12 mx-auto px-4 py-16 lg:py-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6"
              variants={itemVariants}
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Career Insights & Tips</span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6"
              variants={itemVariants}
            >
              Career Blog
              <span className="block text-blue-600"> & Insights</span>
            </motion.h1>

            <motion.p 
              className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8"
              variants={itemVariants}
            >
              Expert advice, industry trends, and career development tips to help you succeed in your professional journey.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              className="max-w-md mx-auto"
              variants={itemVariants}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="w-11/12 mx-auto px-4 py-12 lg:py-16">
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium mb-4">
                  <Tag className="w-4 h-4" />
                  <span>Featured Post</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                
                <p className="text-lg text-gray-600 mb-6">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                </div>
            
              </div>
              
              <div className="relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-11/12 mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Categories */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      {activeCategory === category.id && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs
                .filter(blog => !blog.featured)
                .map((blog) => (
                  <motion.article
                    key={blog.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 "
                  >
                    <div className="relative">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white text-gray-700 text-xs font-medium px-2 py-1 rounded">
                          {categories.find(cat => cat.id === blog.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{blog.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readTime}</span>
                          </div>
                        </div>
                    
                      </div>
                    </div>
                  </motion.article>
                ))}
            </motion.div>

            {/* Empty State */}
            {filteredBlogs.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;