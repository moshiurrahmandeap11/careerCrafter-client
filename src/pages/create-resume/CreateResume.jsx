import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "lucide-react";

// Redux actions and selectors
import {
  setActiveTab,
  setShowPreview,
  setMobileMenuOpen,
  updatePersonalInfo,
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
  addProjectFeature,
  updateProjectFeature,
  removeProjectFeature,
  addLanguage,
  updateLanguage,
  removeLanguage,
  hideToast,
  saveResume,
  generatePDF,
} from "../../redux-slices/resumeSlice";

import {
  selectResumeData,
  selectActiveTab,
  selectShowPreview,
  selectIsCreating,
  selectIsDownloading,
  selectResumeId,
  selectMobileMenuOpen,
  selectToast,
  selectIsFormValid,
} from "../../redux-selectors/resumeSelectors";

const CreateResume = () => {
  const dispatch = useDispatch();

  // Select data from Redux store
  const resumeData = useSelector(selectResumeData);
  const activeTab = useSelector(selectActiveTab);
  const showPreview = useSelector(selectShowPreview);
  const isCreating = useSelector(selectIsCreating);
  const isDownloading = useSelector(selectIsDownloading);
  const resumeId = useSelector(selectResumeId);
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

  const handleArrayFieldChange = (section, index, field, value) => {
    const updateActions = {
      education: updateEducation,
      experience: updateExperience,
      skills: updateSkill,
      projects: updateProject,
      languages: updateLanguage,
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
    };

    dispatch(removeActions[section](index));
  };

  // Project features handlers
  const handleAddProjectFeature = (projectIndex) => {
    dispatch(addProjectFeature({ projectIndex }));
  };

  const handleUpdateProjectFeature = (projectIndex, featureIndex, value) => {
    dispatch(updateProjectFeature({ projectIndex, featureIndex, value }));
  };

  const handleRemoveProjectFeature = (projectIndex, featureIndex) => {
    dispatch(removeProjectFeature({ projectIndex, featureIndex }));
  };

  const handleSaveResume = () => {
    if (!isFormValid) return;
    dispatch(saveResume(resumeData));
  };

  const handleDownloadPDF = () => {
    dispatch(generatePDF(resumeData));
  };

  // Tab navigation
  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "skills", label: "Skills", icon: FileText },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "languages", label: "Languages", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {toast.show && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm ${
              toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "error" ? (
                <X className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Create Your Resume
          </h1>
          <p className="text-gray-600">
            Build a professional resume that gets you noticed
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {/* Mobile Menu Button */}
              <div className="lg:hidden border-b border-gray-300 p-3">
                <button
                  onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
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
              {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
                  <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg">
                    <div className="p-4 border-b border-gray-300">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Navigation
                        </h3>
                        <button
                          onClick={() => dispatch(setMobileMenuOpen(false))}
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
                            onClick={() => dispatch(setActiveTab(tab.id))}
                            className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg mb-1 ${
                              isActive
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {tab.label}
                            </span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              )}

              {/* Tab Navigation - Desktop */}
              <div className="hidden lg:block border-b border-gray-300">
                <nav className="flex items-center justify-between overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => dispatch(setActiveTab(tab.id))}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
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
                {activeTab === "personal" && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Shariful Islam Udoy"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Title{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Frontend Developer"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            value={resumeData.personal.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            value={resumeData.personal.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1234567890"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={resumeData.personal.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="City, Country"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website/Portfolio
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="url"
                            value={resumeData.personal.website}
                            onChange={(e) =>
                              handleInputChange("website", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://portfolio.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Career Objective <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={resumeData.personal.summary}
                        onChange={(e) =>
                          handleInputChange("summary", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of your career goals..."
                        required
                      />
                    </div>
                  </div>
                )}

                {activeTab === "education" && (
                  <div className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">
                            Education #{index + 1}
                          </h3>
                          <button
                            onClick={() => removeArrayItem("education", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Institution
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "education",
                                  index,
                                  "institution",
                                  e.target.value
                                )
                              }
                              placeholder="University Name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Degree
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "education",
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                              placeholder="Bachelor's Degree"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "education",
                                  index,
                                  "field",
                                  e.target.value
                                )
                              }
                              placeholder="Computer Science"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={edu.duration}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "education",
                                  index,
                                  "duration",
                                  e.target.value
                                )
                              }
                              placeholder="2020 - 2024"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem("education")}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Education</span>
                    </button>
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">
                            Experience #{index + 1}
                          </h3>
                          <button
                            onClick={() => removeArrayItem("experience", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    "experience",
                                    index,
                                    "company",
                                    e.target.value
                                  )
                                }
                                placeholder="Company Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                              </label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    "experience",
                                    index,
                                    "position",
                                    e.target.value
                                  )
                                }
                                placeholder="Job Title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    "experience",
                                    index,
                                    "duration",
                                    e.target.value
                                  )
                                }
                                placeholder="Jan 2022 - Present"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                              </label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    "experience",
                                    index,
                                    "location",
                                    e.target.value
                                  )
                                }
                                placeholder="City, Country"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={exp.description}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "experience",
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe your responsibilities and achievements..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem("experience")}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Experience</span>
                    </button>
                  </div>
                )}

                {activeTab === "skills" && (
                  <div className="space-y-4">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Skill Name
                          </label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "skills",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="React.js"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Level
                          </label>
                          <select
                            value={skill.level}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "skills",
                                index,
                                "level",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                        <button
                          onClick={() => removeArrayItem("skills", index)}
                          className="text-red-500 hover:text-red-700 p-2 mt-5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem("skills")}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="space-y-4">
                    {resumeData.projects.map((project, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">
                            Project #{index + 1}
                          </h3>
                          <button
                            onClick={() => removeArrayItem("projects", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Project Name
                            </label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "projects",
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Project Name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Technologies Used
                            </label>
                            <input
                              type="text"
                              value={project.technologies}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "projects",
                                  index,
                                  "technologies",
                                  e.target.value
                                )
                              }
                              placeholder="React, Node.js, MongoDB"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          {/* Features Section */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Key Features
                            </label>
                            <div className="space-y-2">
                              {project.features.map((feature, featureIndex) => (
                                <div
                                  key={featureIndex}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                  <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) =>
                                      handleUpdateProjectFeature(
                                        index,
                                        featureIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter a key feature..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <button
                                    onClick={() =>
                                      handleRemoveProjectFeature(
                                        index,
                                        featureIndex
                                      )
                                    }
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => handleAddProjectFeature(index)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add Feature</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Live Demo URL
                              </label>
                              <div className="relative">
                                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="url"
                                  value={project.liveLink}
                                  onChange={(e) =>
                                    handleArrayFieldChange(
                                      "projects",
                                      index,
                                      "liveLink",
                                      e.target.value
                                    )
                                  }
                                  placeholder="https://demo.com"
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                GitHub URL
                              </label>
                              <div className="relative">
                                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="url"
                                  value={project.githubLink}
                                  onChange={(e) =>
                                    handleArrayFieldChange(
                                      "projects",
                                      index,
                                      "githubLink",
                                      e.target.value
                                    )
                                  }
                                  placeholder="https://github.com/user/repo"
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={project.description}
                              onChange={(e) =>
                                handleArrayFieldChange(
                                  "projects",
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Project description..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem("projects")}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </button>
                  </div>
                )}

                {activeTab === "languages" && (
                  <div className="space-y-4">
                    {resumeData.languages.map((language, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <input
                            type="text"
                            value={language.name}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "languages",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="English"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proficiency
                          </label>
                          <select
                            value={language.proficiency}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "languages",
                                index,
                                "proficiency",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Level</option>
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                          </select>
                        </div>
                        <button
                          onClick={() => removeArrayItem("languages", index)}
                          className="text-red-500 hover:text-red-700 p-2 mt-5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => addArrayItem("languages")}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Language</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Actions & Preview */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg border border-gray-300 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Resume Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleSaveResume}
                  disabled={isCreating || !isFormValid}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>
                        {isFormValid ? "Create Resume" : "Fill Required Fields"}
                      </span>
                    </>
                  )}
                </button>

                {/* <button
                  onClick={() => dispatch(setShowPreview(!showPreview))}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
                </button> */}

                {showPreview && (
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Resume Preview
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-300 min-h-[400px] text-sm">
                  <div className="space-y-3">
                    {/* Personal Information */}
                    <div className="text-center border-b pb-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {resumeData.personal.name || "Your Name"}
                      </h2>
                      <p className="text-gray-600">
                        {resumeData.personal.title || "Professional Title"}
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <strong>Email:</strong>{" "}
                        {resumeData.personal.email || "your.email@example.com"}
                      </div>
                      <div>
                        <strong>Phone:</strong>{" "}
                        {resumeData.personal.phone || "+1234567890"}
                      </div>
                      <div>
                        <strong>Location:</strong>{" "}
                        {resumeData.personal.location || "Your Location"}
                      </div>
                      {resumeData.personal.website && (
                        <div>
                          <strong>Website:</strong>{" "}
                          {resumeData.personal.website}
                        </div>
                      )}
                    </div>

                    {/* Career Objective */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Career Objective
                      </h3>
                      <p className="text-gray-600">
                        {resumeData.personal.summary ||
                          "Your career objective..."}
                      </p>
                    </div>

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {resumeData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Projects
                        </h3>
                        {resumeData.projects.map((project, index) => (
                          <div key={index} className="mb-2">
                            <p className="font-medium">
                              {project.name || "Project Name"}
                            </p>
                            <p className="text-gray-600 text-xs">
                              Tech: {project.technologies || "Technologies"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Experience
                        </h3>
                        {resumeData.experience.map((exp, index) => (
                          <div key={index} className="mb-2">
                            <p className="font-medium">
                              {exp.position} at {exp.company}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {exp.duration} | {exp.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Education
                        </h3>
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="mb-1">
                            <p className="font-medium">
                              {edu.institution || "Institution"}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {edu.degree} {edu.field && `in ${edu.field}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tips</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Use action verbs to describe achievements</li>
                <li>• Keep resume to 1-2 pages maximum</li>
                <li>• Tailor resume for each job application</li>
                <li>• Use keywords from job description</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;
