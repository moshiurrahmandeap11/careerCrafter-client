import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Briefcase, GraduationCap, ArrowRight, Filter, X } from 'lucide-react';

const SuccessStories = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

      useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

    // Categories for filtering
    const categories = [
        { id: 'all', name: 'All Stories', count: 58 },
        { id: 'tech', name: 'Technology', count: 22 },
        { id: 'business', name: 'Business', count: 15 },
        { id: 'healthcare', name: 'Healthcare', count: 8 },
        { id: 'education', name: 'Education', count: 7 },
        { id: 'design', name: 'Design', count: 6 },
    ];

    // Generate 58 success stories with realistic data
    const successStories = [
        {
            id: 1,
            name: "Sarah Chen",
            role: "Senior Software Engineer",
            company: "Google",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            story: "From coding bootcamp to leading projects at Google. Landed 3 offers within 2 months of job searching.",
            rating: 5,
            salary: "$185,000",
            location: "San Francisco, CA",
            category: "tech",
            duration: "3 months",
            previousRole: "Bootcamp Graduate"
        },
        {
            id: 2,
            name: "Marcus Rodriguez",
            role: "Product Manager",
            company: "Microsoft",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            story: "Transitioned from marketing to product management. Used mock interviews to ace the case study round.",
            rating: 5,
            salary: "$160,000",
            location: "Seattle, WA",
            category: "tech",
            duration: "6 months",
            previousRole: "Marketing Manager"
        },
        {
            id: 3,
            name: "Emily Watson",
            role: "Data Scientist",
            company: "Amazon",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            story: "Master's graduate turned Amazon data scientist. Built portfolio projects that impressed hiring managers.",
            rating: 4,
            salary: "$155,000",
            location: "New York, NY",
            category: "tech",
            duration: "4 months",
            previousRole: "Graduate Student"
        },
        {
            id: 4,
            name: "James Kim",
            role: "UX Designer",
            company: "Apple",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            story: "Self-taught designer who created an outstanding portfolio. Received offer after portfolio review.",
            rating: 5,
            salary: "$145,000",
            location: "Cupertino, CA",
            category: "design",
            duration: "8 months",
            previousRole: "Freelance Designer"
        },
        {
            id: 5,
            name: "Dr. Amanda Foster",
            role: "Medical Director",
            company: "Mayo Clinic",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
            story: "Advanced from resident to medical director using strategic networking and interview preparation.",
            rating: 5,
            salary: "$320,000",
            location: "Rochester, MN",
            category: "healthcare",
            duration: "1 year",
            previousRole: "Medical Resident"
        },
        {
            id: 6,
            name: "David Thompson",
            role: "Investment Banker",
            company: "Goldman Sachs",
            image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
            story: "Finance major who leveraged campus recruiting to secure competitive investment banking position.",
            rating: 4,
            salary: "$180,000",
            location: "New York, NY",
            category: "business",
            duration: "2 months",
            previousRole: "College Graduate"
        },
        {
            id: 7,
            name: "Lisa Wang",
            role: "Machine Learning Engineer",
            company: "Tesla",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
            story: "PhD researcher transitioned to industry role. Published research helped stand out in applications.",
            rating: 5,
            salary: "$195,000",
            location: "Palo Alto, CA",
            category: "tech",
            duration: "5 months",
            previousRole: "PhD Researcher"
        },
        {
            id: 8,
            name: "Michael Brown",
            role: "Sales Director",
            company: "Salesforce",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            story: "Promoted from account executive to director in 18 months through exceptional performance.",
            rating: 4,
            salary: "$210,000",
            location: "San Francisco, CA",
            category: "business",
            duration: "18 months",
            previousRole: "Account Executive"
        },
        // Adding more stories to reach 50+
        {
            id: 9,
            name: "Jennifer Lopez",
            role: "DevOps Engineer",
            company: "Netflix",
            image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150&h=150&fit=crop&crop=face",
            story: "Transitioned from system admin to DevOps. Certifications and hands-on projects made the difference.",
            rating: 5,
            salary: "$175,000",
            location: "Los Gatos, CA",
            category: "tech",
            duration: "7 months",
            previousRole: "System Administrator"
        },
        {
            id: 10,
            name: "Robert Johnson",
            role: "High School Principal",
            company: "Chicago Public Schools",
            image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
            story: "From teacher to principal in 5 years through leadership programs and advanced degrees.",
            rating: 4,
            salary: "$115,000",
            location: "Chicago, IL",
            category: "education",
            duration: "5 years",
            previousRole: "Teacher"
        },
        // Continue adding more stories following the same pattern...
        {
            id: 11,
            name: "Maria Garcia",
            role: "Clinical Researcher",
            company: "Pfizer",
            image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
            story: "Postdoc to industry transition. Networked effectively at scientific conferences.",
            rating: 5,
            salary: "$135,000",
            location: "New York, NY",
            category: "healthcare",
            duration: "6 months",
            previousRole: "Postdoctoral Researcher"
        },
        {
            id: 12,
            name: "Thomas Wilson",
            role: "Cybersecurity Analyst",
            company: "CrowdStrike",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            story: "Military background helped transition to cybersecurity. Security clearance was a key advantage.",
            rating: 4,
            salary: "$145,000",
            location: "Austin, TX",
            category: "tech",
            duration: "3 months",
            previousRole: "Military IT Specialist"
        },
        // Add 46 more stories following the same pattern...
    ].concat(
        // Generating additional stories to reach 58 total
        ...Array.from({ length: 46 }, (_, i) => ({
            id: i + 13,
            name: `Success Story ${i + 13}`,
            role: ["Software Engineer", "Product Manager", "Data Analyst", "Marketing Director", "Research Scientist"][i % 5],
            company: ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "SpaceX"][i % 8],
            image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=150&h=150&fit=crop&crop=face`,
            story: `Inspiring career journey ${i + 13}. Achieved remarkable success through dedication and smart strategies.`,
            rating: [4, 5, 4, 5, 5][i % 5],
            salary: `$${120000 + (i * 5000)}`,
            location: ["San Francisco", "New York", "Seattle", "Austin", "Boston"][i % 5],
            category: ["tech", "business", "healthcare", "education", "design"][i % 5],
            duration: `${[3, 6, 9, 12, 18][i % 5]} months`,
            previousRole: ["Student", "Junior Role", "Career Changer", "Promotion", "Relocation"][i % 5]
        }))
    );

    // Filter stories based on category and search query
    const filteredStories = successStories.filter(story => {
        const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
        const matchesSearch = story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="w-11/12 mx-auto px-4">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 rounded-full px-4 py-2 mb-4">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">Success Stories</span>
                    </div>

                    <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
                        Real Stories, Real Success
                    </h1>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

                        {/* Filter Button for Mobile */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                        </button>

                        {/* Category Filters - Desktop */}
                        <div className="hidden lg:flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-lg border transition-all duration-200 ${selectedCategory === category.id
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                        }`}
                                >
                                    {category.name} ({category.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Filter Panel */}
                    {showFilters && (
                        <motion.div
                            className="lg:hidden mt-4 p-4 bg-white rounded-xl border border-gray-200"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-900">Filters</h3>
                                <button onClick={() => setShowFilters(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            setShowFilters(false);
                                        }}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${selectedCategory === category.id
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Stories Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filteredStories.map((story) => (
                        <motion.div
                            key={story.id}
                            variants={itemVariants}
                            className="bg-white rounded-xl flex flex-col justify-between border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Story Header */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={story.image}
                                            alt={story.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{story.name}</h3>
                                            <p className="text-sm text-gray-600">{story.previousRole}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium text-gray-700">{story.rating}</span>
                                    </div>
                                </div>

                                {/* Current Role */}
                                <div className="mb-3">
                                    <h4 className="font-bold text-gray-900 text-lg">{story.role}</h4>
                                    <p className="text-blue-600 font-medium">{story.company}</p>
                                </div>

                                {/* Story Excerpt */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {story.story}
                                </p>

                                {/* Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Salary:</span>
                                        <span className="font-semibold text-gray-900">{story.salary}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Location:</span>
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-900">{story.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Duration:</span>
                                        <span className="font-medium text-gray-900">{story.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Category Badge */}
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredStories.length === 0 && (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-gray-400 mb-4">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No stories found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search or filter criteria
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SuccessStories;