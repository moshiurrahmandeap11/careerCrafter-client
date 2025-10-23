import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Download, 
  Eye, 
  FileText, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  ExternalLink, 
  Menu, 
  X,
  Award,
  Users,
  Calendar,
  Star
} from 'lucide-react';

// Redux actions and selectors
import {
  setActiveTab,
  setShowPreview,
  setMobileMenuOpen,
  updatePersonalInfo,
  updateProfileImage,
  addEducation,
  updateEducation,
  removeEducation,
  addExperience,
  updateExperience,
  removeExperience,
  addSkill,
  updateSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  addLanguage,
  updateLanguage,
  removeLanguage,
  addCertification,
  updateCertification,
  removeCertification,
  addReference,
  updateReference,
  removeReference,
  hideToast,
  saveCV,
  generatePDF
} from '../../redux-slices/cvSlice';

import {
  selectCVData,
  selectActiveTab,
  selectShowPreview,
  selectIsCreating,
  selectIsDownloading,
  selectCVId,
  selectMobileMenuOpen,
  selectToast,
  selectIsFormValid
} from '../../redux-selectors/cvSelectors';

const CreateCV = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Select data from Redux store
  const cvData = useSelector(selectCVData);
  const activeTab = useSelector(selectActiveTab);
  const showPreview = useSelector(selectShowPreview);
  const isCreating = useSelector(selectIsCreating);
  const isDownloading = useSelector(selectIsDownloading);
  const cvId = useSelector(selectCVId);
  const mobileMenuOpen = useSelector(selectMobileMenuOpen);
  const toast = useSelector(selectToast);
  const isFormValid = useSelector(selectIsFormValid);

  // Close mobile menu when tab is selected
  useEffect(() => {
    if (mobileMenuOpen) {
      dispatch(setMobileMenuOpen(false));
    }
  }, [activeTab, dispatch, mobileMenuOpen]);

  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, dispatch]);

  // Event handlers
  const handleInputChange = (field, value) => {
    dispatch(updatePersonalInfo({ field, value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      dispatch(updateProfileImage(file));
    }
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    const updateActions = {
      education: updateEducation,
      experience: updateExperience,
      skills: updateSkill,
      projects: updateProject,
      languages: updateLanguage,
      certifications: updateCertification,
      references: updateReference
    };

    dispatch(updateActions[section]({ index, field, value }));
  };

  const addArrayItem = (section) => {
    const addActions = {
      education: addEducation,
      experience: addExperience,
      skills: addSkill,
      projects: addProject,
      languages: addLanguage,
      certifications: addCertification,
      references: addReference
    };

    dispatch(addActions[section]());
  };

  const removeArrayItem = (section, index) => {
    const removeActions = {
      education: removeEducation,
      experience: removeExperience,
      skills: removeSkill,
      projects: removeProject,
      languages: removeLanguage,
      certifications: removeCertification,
      references: removeReference
    };

    dispatch(removeActions[section](index));
  };

  const handleSaveCV = () => {
    if (!isFormValid) return;
    dispatch(saveCV(cvData));
  };

  const handleDownloadPDF = () => {
    dispatch(generatePDF(cvData));
  };

  // Tab navigation
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Star },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'references', label: 'References', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm ${
            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === 'error' ? <X className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Professional CV
          </h1>
          <p className="text-gray-600 text-lg">
            Build a comprehensive CV that showcases your qualifications and experience
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Mobile Menu Button */}
              <div className="lg:hidden border-b border-gray-200 p-4 bg-gray-50">
                <button
                  onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  <span>Navigation Menu</span>
                </button>
              </div>

              {/* Mobile Menu Overlay */}
              {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
                  <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">CV Sections</h3>
                        <button
                          onClick={() => dispatch(setMobileMenuOpen(false))}
                          className="text-gray-500 hover:text-gray-700 p-2"
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
                            onClick={() => dispatch(setActiveTab(tab.id))}
                            className={`flex items-center gap-4 w-full px-4 py-3 text-left rounded-xl mb-2 transition-all ${
                              isActive
                                ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              )}

              {/* Tab Navigation - Desktop */}
              <div className="hidden lg:block border-b border-gray-200 bg-gray-50">
                <nav className="flex overflow-x-auto px-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => dispatch(setActiveTab(tab.id))}
                        className={`flex items-center gap-3 px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-all ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 bg-white rounded-t-lg'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white hover:rounded-t-lg'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        {cvData.personal.profileImage ? (
                          <img
                            src={URL.createObjectURL(cvData.personal.profileImage)}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                            <User className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Click the + button to upload profile photo</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cvData.personal.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                          value={cvData.personal.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Senior Software Engineer"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={cvData.personal.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="john.doe@example.com"
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
                            value={cvData.personal.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={cvData.personal.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={cvData.personal.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={cvData.personal.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="United States"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={cvData.personal.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                        <input
                          type="text"
                          value={cvData.personal.nationality}
                          onChange={(e) => handleInputChange('nationality', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="American"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="url"
                            value={cvData.personal.linkedin}
                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="url"
                            value={cvData.personal.github}
                            onChange={(e) => handleInputChange('github', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Summary <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={cvData.personal.summary}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Experienced software engineer with 5+ years in web development..."
                        required
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-6">
                    {cvData.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">Education #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('education', index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                              placeholder="University Name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                              placeholder="Bachelor of Science"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => handleArrayFieldChange('education', index, 'field', e.target.value)}
                              placeholder="Computer Science"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => handleArrayFieldChange('education', index, 'location', e.target.value)}
                              placeholder="City, Country"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                              type="date"
                              value={edu.startDate}
                              onChange={(e) => handleArrayFieldChange('education', index, 'startDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                              type="date"
                              value={edu.endDate}
                              onChange={(e) => handleArrayFieldChange('education', index, 'endDate', e.target.value)}
                              disabled={edu.currentlyStudying}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100"
                            />
                            <label className="flex items-center mt-2">
                              <input
                                type="checkbox"
                                checked={edu.currentlyStudying}
                                onChange={(e) => handleArrayFieldChange('education', index, 'currentlyStudying', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-600">Currently studying here</span>
                            </label>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={edu.description}
                              onChange={(e) => handleArrayFieldChange('education', index, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              placeholder="Relevant coursework, achievements, or additional information..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem('education')}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add Education</span>
                    </button>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    {cvData.experience.map((exp, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">Experience #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('experience', index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                              placeholder="Company Name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)}
                              placeholder="Job Title"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => handleArrayFieldChange('experience', index, 'location', e.target.value)}
                              placeholder="City, Country"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => handleArrayFieldChange('experience', index, 'startDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => handleArrayFieldChange('experience', index, 'endDate', e.target.value)}
                              disabled={exp.currentlyWorking}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100"
                            />
                            <label className="flex items-center mt-2">
                              <input
                                type="checkbox"
                                checked={exp.currentlyWorking}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'currentlyWorking', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-600">I currently work here</span>
                            </label>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Describe your responsibilities, achievements, and key contributions..."
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem('experience')}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add Experience</span>
                    </button>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    {cvData.skills.map((skill, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">Skill #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('skills', index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => handleArrayFieldChange('skills', index, 'name', e.target.value)}
                              placeholder="JavaScript"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                            <select
                              value={skill.level}
                              onChange={(e) => handleArrayFieldChange('skills', index, 'level', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">Select Level</option>
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                              value={skill.category}
                              onChange={(e) => handleArrayFieldChange('skills', index, 'category', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="Technical">Technical</option>
                              <option value="Soft Skills">Soft Skills</option>
                              <option value="Language">Language</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem('skills')}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    {cvData.projects.map((project, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">Project #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('projects', index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)}
                              placeholder="E-commerce Website"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                            <input
                              type="text"
                              value={project.technologies}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
                              placeholder="React, Node.js, MongoDB"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                              type="date"
                              value={project.startDate}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'startDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                              type="date"
                              value={project.endDate}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'endDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                            <input
                              type="text"
                              value={project.role}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'role', e.target.value)}
                              placeholder="Full Stack Developer"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                            <input
                              type="number"
                              value={project.teamSize}
                              onChange={(e) => handleArrayFieldChange('projects', index, 'teamSize', e.target.value)}
                              placeholder="5"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                          <textarea
                            value={project.description}
                            onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Describe the project, your contributions, and the outcomes..."
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                            <div className="relative">
                              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="url"
                                value={project.liveLink}
                                onChange={(e) => handleArrayFieldChange('projects', index, 'liveLink', e.target.value)}
                                placeholder="https://demo-project.com"
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                            <div className="relative">
                              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="url"
                                value={project.githubLink}
                                onChange={(e) => handleArrayFieldChange('projects', index, 'githubLink', e.target.value)}
                                placeholder="https://github.com/username/project"
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem('projects')}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add Project</span>
                    </button>
                  </div>
                )}

                {activeTab === 'languages' && (
                  <div className="space-y-6">
                    {cvData.languages.map((language, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">Language #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('languages', index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                            <input
                              type="text"
                              value={language.name}
                              onChange={(e) => handleArrayFieldChange('languages', index, 'name', e.target.value)}
                              placeholder="English"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                            <select
                              value={language.proficiency}
                              onChange={(e) => handleArrayFieldChange('languages', index, 'proficiency', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">Select Level</option>
                              <option value="Native">Native</option>
                              <option value="Fluent">Fluent</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Basic">Basic</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem('languages')}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add Language</span>
                    </button>
                  </div>
                )}

                {activeTab === 'certifications' && (
                  <div className="space-y-6">
                    {cvData.certifications.map((cert, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">Certification #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('certifications', index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => handleArrayFieldChange('certifications', index, 'name', e.target.value)}
                              placeholder="AWS Certified Solutions Architect"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => handleArrayFieldChange('certifications', index, 'issuer', e.target.value)}
                              placeholder="Amazon Web Services"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                            <input
                              type="date"
                              value={cert.issueDate}
                              onChange={(e) => handleArrayFieldChange('certifications', index, 'issueDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input
                              type="date"
                              value={cert.expiryDate}
                              onChange={(e) => handleArrayFieldChange('certifications', index, 'expiryDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID/URL</label>
                            <input
                              type="text"
                              value={cert.credentialId}
                              onChange={(e) => handleArrayFieldChange('certifications', index, 'credentialId', e.target.value)}
                              placeholder="Credential ID or URL"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem('certifications')}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add Certification</span>
                    </button>
                  </div>
                )}

                {activeTab === 'references' && (
                  <div className="space-y-6">
                    {cvData.references.map((ref, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">Reference #{index + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('references', index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              value={ref.name}
                              onChange={(e) => handleArrayFieldChange('references', index, 'name', e.target.value)}
                              placeholder="John Smith"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <input
                              type="text"
                              value={ref.position}
                              onChange={(e) => handleArrayFieldChange('references', index, 'position', e.target.value)}
                              placeholder="Senior Manager"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <input
                              type="text"
                              value={ref.company}
                              onChange={(e) => handleArrayFieldChange('references', index, 'company', e.target.value)}
                              placeholder="Tech Company Inc."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                              type="email"
                              value={ref.email}
                              onChange={(e) => handleArrayFieldChange('references', index, 'email', e.target.value)}
                              placeholder="john.smith@company.com"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                              type="tel"
                              value={ref.phone}
                              onChange={(e) => handleArrayFieldChange('references', index, 'phone', e.target.value)}
                              placeholder="+1 (555) 123-4567"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                            <input
                              type="text"
                              value={ref.relationship}
                              onChange={(e) => handleArrayFieldChange('references', index, 'relationship', e.target.value)}
                              placeholder="Former Manager"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem('references')}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg py-3 px-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add Reference</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Actions & Preview */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CV Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={handleSaveCV}
                  disabled={isCreating || !isFormValid}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-lg"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating CV...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>{isFormValid ? 'Create CV' : 'Fill Required Fields'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => dispatch(setShowPreview(!showPreview))}
                  className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>

                {showPreview && (
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors shadow-lg"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download CV as PDF</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CV Preview</h3>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-300 min-h-[500px] text-sm">
                  <div className="space-y-4">
                    {/* Personal Information */}
                    <div className="text-center border-b pb-4">
                      <div className="flex items-center justify-center mb-4">
                        {cvData.personal.profileImage ? (
                          <img
                            src={URL.createObjectURL(cvData.personal.profileImage)}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{cvData.personal.name || "Your Name"}</h2>
                      <p className="text-gray-600 text-lg">{cvData.personal.title || "Professional Title"}</p>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {cvData.personal.email && <div><strong>Email:</strong> {cvData.personal.email}</div>}
                      {cvData.personal.phone && <div><strong>Phone:</strong> {cvData.personal.phone}</div>}
                      {cvData.personal.address && <div><strong>Address:</strong> {cvData.personal.address}</div>}
                      {cvData.personal.city && <div><strong>City:</strong> {cvData.personal.city}</div>}
                      {cvData.personal.country && <div><strong>Country:</strong> {cvData.personal.country}</div>}
                      {cvData.personal.linkedin && <div><strong>LinkedIn:</strong> {cvData.personal.linkedin}</div>}
                      {cvData.personal.github && <div><strong>GitHub:</strong> {cvData.personal.github}</div>}
                    </div>

                    {/* Professional Summary */}
                    {cvData.personal.summary && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Professional Summary</h3>
                        <p className="text-gray-600">{cvData.personal.summary}</p>
                      </div>
                    )}

                    {/* Education */}
                    {cvData.education.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Education</h3>
                        {cvData.education.map((edu, index) => (
                          <div key={index} className="mb-3">
                            <p className="font-semibold">{edu.institution || "Institution Name"}</p>
                            <p className="text-gray-600">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                            <p className="text-gray-500 text-xs">
                              {edu.startDate} {edu.endDate && ` - ${edu.currentlyStudying ? 'Present' : edu.endDate}`}
                              {edu.location && ` | ${edu.location}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Experience */}
                    {cvData.experience.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Professional Experience</h3>
                        {cvData.experience.map((exp, index) => (
                          <div key={index} className="mb-3">
                            <p className="font-semibold">{exp.position} at {exp.company}</p>
                            <p className="text-gray-500 text-xs">
                              {exp.startDate} {exp.endDate && ` - ${exp.currentlyWorking ? 'Present' : exp.endDate}`}
                              {exp.location && ` | ${exp.location}`}
                            </p>
                            {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {cvData.skills.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                              {skill.name} {skill.level && `(${skill.level})`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {cvData.projects.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Projects</h3>
                        {cvData.projects.map((project, index) => (
                          <div key={index} className="mb-3">
                            <p className="font-semibold">{project.name}</p>
                            {project.technologies && <p className="text-gray-600 text-xs">Tech: {project.technologies}</p>}
                            {project.description && <p className="text-gray-600 mt-1">{project.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Languages */}
                    {cvData.languages.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {cvData.languages.map((lang, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                              {lang.name} {lang.proficiency && `(${lang.proficiency})`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {cvData.certifications.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">Certifications</h3>
                        {cvData.certifications.map((cert, index) => (
                          <div key={index} className="mb-2">
                            <p className="font-semibold">{cert.name}</p>
                            <p className="text-gray-600 text-xs">{cert.issuer} | {cert.issueDate}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">CV Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Keep your CV to 2 pages maximum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use action verbs to describe achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Tailor your CV for each job application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Include relevant keywords from job descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use a professional profile photo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Proofread carefully for spelling and grammar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCV;