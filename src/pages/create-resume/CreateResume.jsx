import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, FileText, Plus, Trash2, Sparkles, Award, Briefcase, GraduationCap, User, Mail, Phone, MapPin, Globe, Github, ExternalLink, Menu, X } from 'lucide-react';

const CreateResume = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeData, setResumeData] = useState({
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      github: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: []
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Close mobile menu when tab is selected
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [activeTab]);

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
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle array field changes
  const handleArrayFieldChange = (section, index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add new item to array
  const addArrayItem = (section, template) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  // Remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Validate form data
  const validateForm = () => {
    const { personal, education, skills } = resumeData;
    
    if (!personal.name || !personal.title || !personal.email || !personal.phone || !personal.location || !personal.summary) {
      showToast('Please fill all required personal information fields', 'error');
      return false;
    }
    
    if (education.length === 0) {
      showToast('Please add at least one education entry', 'error');
      return false;
    }
    
    if (skills.length === 0) {
      showToast('Please add at least one skill', 'error');
      return false;
    }
    
    return true;
  };

  // Save resume to backend
  const saveResume = async () => {
    if (!validateForm()) return;
    
    setIsCreating(true);
    try {
      // Simulate 3 second delay before API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await fetch('http://localhost:3000/v1/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      });
      
      if (response.ok) {
        const result = await response.json();
        setResumeId(result.id);
        setShowPreview(true);
        showToast('Resume created successfully!');
      } else {
        console.error('Failed to save resume');
        showToast('Failed to create resume. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      showToast('Error creating resume. Please check your connection.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // Download PDF
  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Simulate 3 second delay before API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await fetch('http://localhost:3000/v1/resumes/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${resumeData.personal.name.replace(/\s+/g, '_')}_resume.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showToast('PDF downloaded successfully!');
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showToast('Error downloading PDF. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  // Tab navigation
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'projects', label: 'Projects', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.5 }}
              className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
                toast.type === 'error' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                {toast.type === 'error' ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span className="font-medium">{toast.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2 shadow-sm mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">AI-Powered Resume Builder</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Create Your Professional
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resume
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build a stunning resume that gets you noticed by employers and lands you interviews.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Mobile Menu Button */}
              <div className="lg:hidden border-b border-gray-200 p-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                  <span className="font-medium">Menu</span>
                </button>
              </div>

              {/* Mobile Menu Overlay */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <>
                    <motion.div
                      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    <motion.div
                      className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 lg:hidden"
                      variants={mobileMenuVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Navigation</h3>
                          <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <nav className="p-4">
                        {tabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-xl transition-all duration-200 mb-2 ${
                                isActive
                                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{tab.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Tab Navigation - Desktop */}
              <div className="hidden lg:block border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Form Content */}
              <div className="p-4 sm:p-6">
                {activeTab === 'personal' && (
                  <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.name}
                          onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Professional Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.title}
                          onChange={(e) => handleInputChange('personal', 'title', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Software Engineer"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={resumeData.personal.email}
                            onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={resumeData.personal.phone}
                            onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={resumeData.personal.location}
                            onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="New York, NY"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website/Portfolio</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="url"
                            value={resumeData.personal.website}
                            onChange={(e) => handleInputChange('personal', 'website', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="https://portfolio.com"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="url"
                            value={resumeData.personal.github}
                            onChange={(e) => handleInputChange('personal', 'github', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Summary <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={resumeData.personal.summary}
                        onChange={(e) => handleInputChange('personal', 'summary', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Brief overview of your professional background and key achievements..."
                        required
                      />
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === 'education' && (
                  <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {resumeData.education.map((edu, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900">Education #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('education', index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                              placeholder="University Name"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                              placeholder="Degree"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => handleArrayFieldChange('education', index, 'field', e.target.value)}
                              placeholder="Field of Study"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <input
                              type="text"
                              value={edu.duration}
                              onChange={(e) => handleArrayFieldChange('education', index, 'duration', e.target.value)}
                              placeholder="Duration (e.g., 2020-2024)"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.button
                      variants={itemVariants}
                      onClick={() => addArrayItem('education', { institution: '', degree: '', field: '', duration: '' })}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Education</span>
                    </motion.button>
                  </motion.div>
                )}

                {activeTab === 'experience' && (
                  <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {resumeData.experience.map((exp, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900">Experience #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('experience', index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                                placeholder="Company Name"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)}
                                placeholder="Position"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'duration', e.target.value)}
                                placeholder="Duration (e.g., Jan 2022 - Present)"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'location', e.target.value)}
                                placeholder="Location"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={exp.description}
                              onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                              placeholder="Describe your responsibilities and achievements..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.button
                      variants={itemVariants}
                      onClick={() => addArrayItem('experience', { company: '', position: '', duration: '', location: '', description: '' })}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Experience</span>
                    </motion.button>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {resumeData.skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => handleArrayFieldChange('skills', index, 'name', e.target.value)}
                            placeholder="Skill name"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                          <select
                            value={skill.level}
                            onChange={(e) => handleArrayFieldChange('skills', index, 'level', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                        <button
                          onClick={() => removeArrayItem('skills', index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 mt-5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                    
                    <motion.button
                      variants={itemVariants}
                      onClick={() => addArrayItem('skills', { name: '', level: '' })}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Skill</span>
                    </motion.button>
                  </motion.div>
                )}

                {activeTab === 'projects' && (
                  <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {resumeData.projects.map((project, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900">Project #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('projects', index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)}
                              placeholder="Project Name"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                            <input
                              type="text"
                              value={project.technologies}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
                              placeholder="Technologies Used"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                            <textarea
                              value={project.keyFeatures}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'keyFeatures', e.target.value)}
                              placeholder="List key features and functionalities..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
                              <div className="relative">
                                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="url"
                                  value={project.liveLink}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'liveLink', e.target.value)}
                                  placeholder="https://demo.com"
                                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                              <div className="relative">
                                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="url"
                                  value={project.githubLink}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'githubLink', e.target.value)}
                                  placeholder="https://github.com/user/repo"
                                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={project.description}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                              placeholder="Project description and your contributions..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.button
                      variants={itemVariants}
                      onClick={() => addArrayItem('projects', { 
                        name: '', 
                        technologies: '', 
                        keyFeatures: '', 
                        liveLink: '', 
                        githubLink: '', 
                        description: '' 
                      })}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Actions & Preview */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Actions</h3>
              <div className="space-y-4">
                <motion.button
                  onClick={saveResume}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  variants={buttonHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Create Resume</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-5 h-5" />
                  <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </motion.button>

                {showPreview && (
                  <motion.button
                    onClick={downloadPDF}
                    disabled={isDownloading}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    variants={buttonHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isDownloading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Preview Panel */}
            {showPreview && (
              <motion.div
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Preview</h3>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200 min-h-[400px]">
                  <div className="space-y-4">
                    <div className="text-center border-b pb-4">
                      <h2 className="text-2xl font-bold text-gray-900">{resumeData.personal.name}</h2>
                      <p className="text-gray-600">{resumeData.personal.title}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Email:</strong> {resumeData.personal.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {resumeData.personal.phone}
                      </div>
                      <div>
                        <strong>Location:</strong> {resumeData.personal.location}
                      </div>
                      {resumeData.personal.website && (
                        <div>
                          <strong>Website:</strong> {resumeData.personal.website}
                        </div>
                      )}
                      {resumeData.personal.github && (
                        <div>
                          <strong>GitHub:</strong> {resumeData.personal.github}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                      <p className="text-sm text-gray-600">{resumeData.personal.summary}</p>
                    </div>

                    {resumeData.skills.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.education.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="mb-2">
                            <p className="font-medium text-sm">{edu.institution}</p>
                            <p className="text-sm text-gray-600">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                            <p className="text-xs text-gray-500">{edu.duration}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.projects.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Projects</h3>
                        {resumeData.projects.map((project, index) => (
                          <div key={index} className="mb-4">
                            <p className="font-medium text-sm">{project.name}</p>
                            <p className="text-xs text-gray-600 mb-1">Technologies: {project.technologies}</p>
                            {project.keyFeatures && (
                              <p className="text-xs text-gray-600 mb-1">Features: {project.keyFeatures}</p>
                            )}
                            <div className="flex space-x-4 text-xs">
                              {project.liveLink && (
                                <span className="text-blue-600">Live Demo</span>
                              )}
                              {project.githubLink && (
                                <span className="text-blue-600">GitHub</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tips */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Pro Tips</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use action verbs to describe your achievements</li>
                <li>• Quantify your accomplishments with numbers</li>
                <li>• Keep your resume to 1-2 pages maximum</li>
                <li>• Tailor your resume for each job application</li>
                <li>• Use keywords from the job description</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;