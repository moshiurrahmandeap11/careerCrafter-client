import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Star, ExternalLink, Filter, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import MainButton from '../../components/sharedItems/MainButton/MainButton';


const Companies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 9;

  // Extended companies data with 30+ companies
  const companies = [
    {
      id: 1,
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/800px-Google_2015_logo.svg.png',
      industry: 'Technology',
      size: '10K+',
      location: 'Mountain View, CA',
      rating: 4.8,
      jobs: 234,
      description: 'A global technology company specializing in Internet-related services and products.',
      website: 'https://google.com'
    },
    {
      id: 2,
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1024px-Microsoft_logo_%282012%29.svg.png',
      industry: 'Technology',
      size: '10K+',
      location: 'Redmond, WA',
      rating: 4.7,
      jobs: 189,
      description: 'Develops, manufactures, licenses, supports, and sells computer software and related services.',
      website: 'https://microsoft.com'
    },
    {
      id: 3,
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
      industry: 'E-commerce',
      size: '10K+',
      location: 'Seattle, WA',
      rating: 4.5,
      jobs: 312,
      description: 'Multinational technology company focusing on e-commerce, cloud computing, and AI.',
      website: 'https://amazon.com'
    },
    {
      id: 4,
      name: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png',
      industry: 'Technology',
      size: '10K+',
      location: 'Cupertino, CA',
      rating: 4.9,
      jobs: 156,
      description: 'Designs, develops, and sells consumer electronics, computer software, and online services.',
      website: 'https://apple.com'
    },
    {
      id: 5,
      name: 'Meta',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1024px-Meta_Platforms_Inc._logo.svg.png',
      industry: 'Technology',
      size: '10K+',
      location: 'Menlo Park, CA',
      rating: 4.4,
      jobs: 198,
      description: 'Social media and technology company that connects people through its platforms.',
      website: 'https://meta.com'
    },
    {
      id: 6,
      name: 'Netflix',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1024px-Netflix_2015_logo.svg.png',
      industry: 'Entertainment',
      size: '5K-10K',
      location: 'Los Gatos, CA',
      rating: 4.6,
      jobs: 87,
      description: 'Streaming entertainment service offering TV series, films, and games.',
      website: 'https://netflix.com'
    },
    {
      id: 7,
      name: 'Tesla',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1024px-Tesla_Motors.svg.png',
      industry: 'Automotive',
      size: '5K-10K',
      location: 'Austin, TX',
      rating: 4.3,
      jobs: 134,
      description: 'Electric vehicle and clean energy company developing sustainable energy solutions.',
      website: 'https://tesla.com'
    },
    {
      id: 8,
      name: 'Adobe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Adobe_Corporate_logo.svg/1024px-Adobe_Corporate_logo.svg.png',
      industry: 'Software',
      size: '5K-10K',
      location: 'San Jose, CA',
      rating: 4.7,
      jobs: 92,
      description: 'Computer software company known for multimedia and creativity software products.',
      website: 'https://adobe.com'
    },
    {
      id: 9,
      name: 'Spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png',
      industry: 'Music',
      size: '1K-5K',
      location: 'Stockholm, Sweden',
      rating: 4.5,
      jobs: 67,
      description: 'Audio streaming and media services provider with millions of songs and podcasts.',
      website: 'https://spotify.com'
    },
    {
      id: 10,
      name: 'Uber',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Uber_logo_2018.svg/1024px-Uber_logo_2018.svg.png',
      industry: 'Transportation',
      size: '10K+',
      location: 'San Francisco, CA',
      rating: 4.2,
      jobs: 145,
      description: 'Mobility and delivery service provider connecting riders and drivers worldwide.',
      website: 'https://uber.com'
    },
    {
      id: 11,
      name: 'Airbnb',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/1024px-Airbnb_Logo_B%C3%A9lo.svg.png',
      industry: 'Travel',
      size: '1K-5K',
      location: 'San Francisco, CA',
      rating: 4.4,
      jobs: 78,
      description: 'Online marketplace for lodging, primarily homestays for vacation rentals.',
      website: 'https://airbnb.com'
    },
    {
      id: 12,
      name: 'Salesforce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1024px-Salesforce.com_logo.svg.png',
      industry: 'Software',
      size: '10K+',
      location: 'San Francisco, CA',
      rating: 4.6,
      jobs: 223,
      description: 'Cloud-based software company providing customer relationship management services.',
      website: 'https://salesforce.com'
    },
    {
      id: 13,
      name: 'Intel',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/1024px-Intel_logo_%282006-2020%29.svg.png',
      industry: 'Semiconductor',
      size: '10K+',
      location: 'Santa Clara, CA',
      rating: 4.3,
      jobs: 167,
      description: 'Technology company and semiconductor chip manufacturer driving computing innovation.',
      website: 'https://intel.com'
    },
    {
      id: 14,
      name: 'IBM',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1024px-IBM_logo.svg.png',
      industry: 'Technology',
      size: '10K+',
      location: 'Armonk, NY',
      rating: 4.2,
      jobs: 189,
      description: 'Multinational technology and consulting company with focus on hybrid cloud and AI.',
      website: 'https://ibm.com'
    },
    {
      id: 15,
      name: 'Oracle',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/1024px-Oracle_logo.svg.png',
      industry: 'Software',
      size: '10K+',
      location: 'Austin, TX',
      rating: 4.1,
      jobs: 156,
      description: 'Computer technology corporation specializing in database software and cloud systems.',
      website: 'https://oracle.com'
    },
    {
      id: 16,
      name: 'Cisco',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1024px-Cisco_logo_blue_2016.svg.png',
      industry: 'Networking',
      size: '10K+',
      location: 'San Jose, CA',
      rating: 4.4,
      jobs: 134,
      description: 'Multinational technology conglomerate developing networking hardware and software.',
      website: 'https://cisco.com'
    },
    {
      id: 17,
      name: 'HP',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1024px-HP_logo_2012.svg.png',
      industry: 'Hardware',
      size: '10K+',
      location: 'Palo Alto, CA',
      rating: 4.0,
      jobs: 98,
      description: 'Technology company providing personal computing and other access devices.',
      website: 'https://hp.com'
    },
    {
      id: 18,
      name: 'Dell',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dell_logo_2016.svg/1024px-Dell_logo_2016.svg.png',
      industry: 'Hardware',
      size: '10K+',
      location: 'Round Rock, TX',
      rating: 4.1,
      jobs: 112,
      description: 'Technology company that develops, sells, and supports computers and related products.',
      website: 'https://dell.com'
    },
    {
      id: 19,
      name: 'NVIDIA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/1024px-Nvidia_logo.svg.png',
      industry: 'Technology',
      size: '5K-10K',
      location: 'Santa Clara, CA',
      rating: 4.7,
      jobs: 145,
      description: 'Technology company designing graphics processing units and AI computing platforms.',
      website: 'https://nvidia.com'
    },
    {
      id: 20,
      name: 'AMD',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_logo_2018.svg/1024px-AMD_logo_2018.svg.png',
      industry: 'Semiconductor',
      size: '5K-10K',
      location: 'Santa Clara, CA',
      rating: 4.3,
      jobs: 89,
      description: 'Semiconductor company developing computer processors and related technologies.',
      website: 'https://amd.com'
    },
    {
      id: 21,
      name: 'Twitter',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1024px-Logo_of_Twitter.svg.png',
      industry: 'Social Media',
      size: '1K-5K',
      location: 'San Francisco, CA',
      rating: 3.9,
      jobs: 45,
      description: 'Social networking service for microblogging and social networking.',
      website: 'https://twitter.com'
    },
    {
      id: 22,
      name: 'LinkedIn',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/1024px-LinkedIn_logo_initials.png',
      industry: 'Social Media',
      size: '5K-10K',
      location: 'Sunnyvale, CA',
      rating: 4.5,
      jobs: 78,
      description: 'Business and employment-focused social media platform.',
      website: 'https://linkedin.com'
    },
    {
      id: 23,
      name: 'PayPal',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1024px-PayPal.svg.png',
      industry: 'Fintech',
      size: '10K+',
      location: 'San Jose, CA',
      rating: 4.2,
      jobs: 123,
      description: 'Online payments system that supports online money transfers worldwide.',
      website: 'https://paypal.com'
    },
    {
      id: 24,
      name: 'Stripe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1024px-Stripe_Logo%2C_revised_2016.svg.png',
      industry: 'Fintech',
      size: '1K-5K',
      location: 'San Francisco, CA',
      rating: 4.6,
      jobs: 67,
      description: 'Technology company building economic infrastructure for the internet.',
      website: 'https://stripe.com'
    },
    {
      id: 25,
      name: 'Slack',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/1024px-Slack_icon_2019.svg.png',
      industry: 'Software',
      size: '1K-5K',
      location: 'San Francisco, CA',
      rating: 4.4,
      jobs: 56,
      description: 'Business communication platform offering many IRC-style features.',
      website: 'https://slack.com'
    },
    {
      id: 26,
      name: 'Zoom',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/1024px-Zoom_Communications_Logo.svg.png',
      industry: 'Software',
      size: '1K-5K',
      location: 'San Jose, CA',
      rating: 4.3,
      jobs: 48,
      description: 'Video conferencing platform used for teleconferencing and remote work.',
      website: 'https://zoom.us'
    },
    {
      id: 27,
      name: 'Dropbox',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/1024px-Dropbox_Icon.svg.png',
      industry: 'Software',
      size: '1K-5K',
      location: 'San Francisco, CA',
      rating: 4.1,
      jobs: 52,
      description: 'File hosting service offering cloud storage and collaborative editing.',
      website: 'https://dropbox.com'
    },
    {
      id: 28,
      name: 'GitHub',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1024px-Octicons-mark-github.svg.png',
      industry: 'Software',
      size: '1K-5K',
      location: 'San Francisco, CA',
      rating: 4.7,
      jobs: 34,
      description: 'Platform for version control and collaboration using Git.',
      website: 'https://github.com'
    },
    {
      id: 29,
      name: 'Atlassian',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Atlassian_logo.svg/1024px-Atlassian_logo.svg.png',
      industry: 'Software',
      size: '1K-5K',
      location: 'Sydney, Australia',
      rating: 4.5,
      jobs: 89,
      description: 'Software company that develops products for software developers and managers.',
      website: 'https://atlassian.com'
    },
    {
      id: 30,
      name: 'Shopify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/1024px-Shopify_logo_2018.svg.png',
      industry: 'E-commerce',
      size: '5K-10K',
      location: 'Ottawa, Canada',
      rating: 4.4,
      jobs: 76,
      description: 'E-commerce platform for online stores and retail point-of-sale systems.',
      website: 'https://shopify.com'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter companies based on search and filters
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || company.industry === selectedIndustry;
    const matchesSize = selectedSize === 'All' || company.size === selectedSize;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  // Pagination
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const handleCompanyClick = (companyId) => {
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="md:w-11/12 mx-auto md:px-4 w-full px-3">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
            Explore Top Companies
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Discover amazing companies and find your perfect career match. 
            Browse through 30+ leading organizations across various industries.
          </p>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
        >
          <p className="text-gray-600">
            Showing {currentCompanies.length} of {filteredCompanies.length} companies
          </p>
        </motion.div>

        {/* Companies Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentCompanies.map((company) => (
            <motion.div
              key={company.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer group"
              onClick={() => handleCompanyClick(company.id)}
            >
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 p-2 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{company.industry}</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              {/* Company Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {company.description}
              </p>

              {/* Company Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{company.size}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{company.rating}</span>
                    <span className="text-gray-500">Rating</span>
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {company.jobs} jobs
                  </div>
                </div>
              </div>

              {/* View Jobs Button */}
              <MainButton 
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Building className="w-4 h-4" />
                <span>View Jobs</span>
              </MainButton>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center space-x-2"
            variants={itemVariants}
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* No Results Message */}
        {currentCompanies.length === 0 && (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No companies found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters to find more companies.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Companies;