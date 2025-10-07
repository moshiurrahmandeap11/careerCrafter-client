import { Award, Briefcase, Download, Edit3, ExternalLink, Eye, Github, Globe, GraduationCap, Link, Mail, MapPin, Phone, Plus, Target, Trash2, User, Wand2, X } from "lucide-react";
import { useState } from "react";
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

// Import actions
import {
    updatePersonalInfo,
    updateCareerObjective,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    addProjectFeature,
    removeProjectFeature,
    updateProjectFeature,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addLanguage,
    updateLanguage,
    removeLanguage
} from '../../redux-slices/resumeSlice';

// Import selectors
import { selectResumeData } from '../../redux-selectors/resumeSelectors';

export const CreateResumeSection = ({
    showPreview,
    setShowPreview,
    downloadResumePDF,
    resumePreviewRef
}) => {
    const dispatch = useDispatch();
    const resumeData = useSelector(selectResumeData);
    const [newSkill, setNewSkill] = useState('');

    // Handler functions
    const handlePersonalInfoChange = (field, value) => {
        dispatch(updatePersonalInfo({ [field]: value }));
    };

    const handleCareerObjectiveChange = (value) => {
        dispatch(updateCareerObjective(value));
    };

    const handleAddSkill = (skill) => {
        dispatch(addSkill(skill));
    };

    const handleRemoveSkill = (skill) => {
        dispatch(removeSkill(skill));
    };

    const handleAddProject = () => {
        dispatch(addProject());
    };

    const handleUpdateProject = (id, updates) => {
        dispatch(updateProject({ id, updates }));
    };

    const handleRemoveProject = (id) => {
        dispatch(removeProject(id));
    };

    const handleAddProjectFeature = (projectId) => {
        dispatch(addProjectFeature(projectId));
    };

    const handleRemoveProjectFeature = (projectId, featureIndex) => {
        dispatch(removeProjectFeature({ projectId, featureIndex }));
    };

    const handleUpdateProjectFeature = (projectId, featureIndex, value) => {
        dispatch(updateProjectFeature({ projectId, featureIndex, value }));
    };

    const handleAddExperience = () => {
        dispatch(addExperience());
    };

    const handleUpdateExperience = (id, updates) => {
        dispatch(updateExperience({ id, updates }));
    };

    const handleRemoveExperience = (id) => {
        dispatch(removeExperience(id));
    };

    const handleAddEducation = () => {
        dispatch(addEducation());
    };

    const handleUpdateEducation = (id, updates) => {
        dispatch(updateEducation({ id, updates }));
    };

    const handleRemoveEducation = (id) => {
        dispatch(removeEducation(id));
    };

    const handleAddLanguage = () => {
        dispatch(addLanguage());
    };

    const handleUpdateLanguage = (id, updates) => {
        dispatch(updateLanguage({ id, updates }));
    };

    const handleRemoveLanguage = (id) => {
        dispatch(removeLanguage(id));
    };

    if (showPreview) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Resume Preview</h2>
                                <p className="text-blue-100">Review your resume before downloading</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <Edit3 className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={downloadResumePDF}
                                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div ref={resumePreviewRef} className="bg-white p-8 border border-gray-300 max-w-4xl mx-auto">
                            {/* Resume Preview Content - Same as before */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {resumeData.personalInfo.fullName || 'Your Name'}
                                </h1>
                                <p className="text-xl text-gray-600 mb-4">
                                    {resumeData.personalInfo.title || 'Your Title'}
                                </p>
                                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                                    {resumeData.personalInfo.email && (
                                        <div className="flex items-center space-x-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{resumeData.personalInfo.email}</span>
                                        </div>
                                    )}
                                    {resumeData.personalInfo.phone && (
                                        <div className="flex items-center space-x-1">
                                            <Phone className="w-4 h-4" />
                                            <span>{resumeData.personalInfo.phone}</span>
                                        </div>
                                    )}
                                    {resumeData.personalInfo.location && (
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{resumeData.personalInfo.location}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 mt-2">
                                    {resumeData.personalInfo.linkedin && (
                                        <a href={resumeData.personalInfo.linkedin} className="flex items-center space-x-1 text-blue-600 text-sm">
                                            <Link className="w-4 h-4" />
                                            <span>LinkedIn</span>
                                        </a>
                                    )}
                                    {resumeData.personalInfo.github && (
                                        <a href={resumeData.personalInfo.github} className="flex items-center space-x-1 text-gray-700 text-sm">
                                            <Github className="w-4 h-4" />
                                            <span>GitHub</span>
                                        </a>
                                    )}
                                    {resumeData.personalInfo.portfolio && (
                                        <a href={resumeData.personalInfo.portfolio} className="flex items-center space-x-1 text-purple-600 text-sm">
                                            <ExternalLink className="w-4 h-4" />
                                            <span>Portfolio</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Career Objective */}
                            {resumeData.careerObjective && (
                                <section className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">Career Objective</h2>
                                    <p className="text-gray-700">{resumeData.careerObjective}</p>
                                </section>
                            )}

                            {/* Skills */}
                            {resumeData.skills.length > 0 && (
                                <section className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills.map((skill, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Projects */}
                            {resumeData.projects.length > 0 && (
                                <section className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">Projects</h2>
                                    {resumeData.projects.map((project, index) => (
                                        <div key={project.id} className="mb-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-gray-800">{project.name}</h3>
                                                <div className="flex space-x-2">
                                                    {project.githubUrl && (
                                                        <a href={project.githubUrl} className="text-gray-600 hover:text-gray-900">
                                                            <Github className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {project.liveUrl && (
                                                        <a href={project.liveUrl} className="text-blue-600 hover:text-blue-800">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            {project.techStack && (
                                                <p className="text-sm text-gray-600 mb-2">{project.techStack}</p>
                                            )}
                                            <p className="text-gray-700 mb-2">{project.description}</p>
                                            {project.keyFeatures.length > 0 && (
                                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                                    {project.keyFeatures.map((feature, idx) => (
                                                        <li key={idx}>{feature}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Experience */}
                            {resumeData.experience.length > 0 && (
                                <section className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">Experience</h2>
                                    {resumeData.experience.map((exp, index) => (
                                        <div key={exp.id} className="mb-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                                                <span className="text-sm text-gray-600">
                                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-1">{exp.company}, {exp.location}</p>
                                            <p className="text-gray-700">{exp.description}</p>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Education */}
                            {resumeData.education.length > 0 && (
                                <section className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">Education</h2>
                                    {resumeData.education.map((edu, index) => (
                                        <div key={edu.id} className="mb-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                                                <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                                            </div>
                                            <p className="text-gray-700">{edu.institution}, {edu.location}</p>
                                            {edu.gpa && <p className="text-gray-700">GPA: {edu.gpa}</p>}
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Languages */}
                            {resumeData.languages.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">Languages</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {resumeData.languages.map((lang, index) => (
                                            <div key={lang.id} className="text-gray-700">
                                                <span className="font-medium">{lang.language}</span>
                                                <span className="text-sm text-gray-600 ml-1">({lang.proficiency})</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Builder Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Resume Builder</h2>
                            <p className="text-blue-100">Fill in your details to create an ATS-friendly resume</p>
                        </div>
                    </div>
                </div>

                {/* Builder Content */}
                <div className="p-8 space-y-8">
                    {/* Personal Information */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Full Name *"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={resumeData.personalInfo.fullName}
                                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Title (e.g., Frontend Developer) *"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={resumeData.personalInfo.title}
                                onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={resumeData.personalInfo.email}
                                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number *"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={resumeData.personalInfo.phone}
                                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={resumeData.personalInfo.location}
                                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                            />
                            <input
                                type="url"
                                placeholder="LinkedIn URL"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={resumeData.personalInfo.linkedin}
                                onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                            />
                            <input
                                type="url"
                                placeholder="GitHub URL"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={resumeData.personalInfo.github}
                                onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                            />
                            <input
                                type="url"
                                placeholder="Portfolio URL"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={resumeData.personalInfo.portfolio}
                                onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                            />
                        </div>
                    </section>

                    {/* Career Objective */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                <Target className="w-4 h-4 text-purple-600" />
                            </div>
                            Career Objective
                        </h3>
                        <textarea
                            placeholder="Write a compelling career objective that summarizes your experience and goals..."
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={resumeData.careerObjective}
                            onChange={(e) => handleCareerObjectiveChange(e.target.value)}
                        />
                        <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1">
                            <Wand2 className="w-4 h-4" />
                            <span>Generate with AI</span>
                        </button>
                    </section>

                    {/* Skills */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <Award className="w-4 h-4 text-green-600" />
                            </div>
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {resumeData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                                >
                                    <span>{skill}</span>
                                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-blue-900">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Add a skill..."
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddSkill(newSkill);
                                        setNewSkill('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    handleAddSkill(newSkill);
                                    setNewSkill('');
                                }}
                                className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </section>

                    {/* Projects */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <Briefcase className="w-4 h-4 text-orange-600" />
                                </div>
                                Projects
                            </h3>
                            <button
                                onClick={handleAddProject}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Project</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {resumeData.projects.map((project, index) => (
                                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-semibold text-gray-800">Project {index + 1}</h4>
                                        <button
                                            onClick={() => handleRemoveProject(project.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Project Name"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            value={project.name}
                                            onChange={(e) => handleUpdateProject(project.id, { name: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            value={project.techStack}
                                            onChange={(e) => handleUpdateProject(project.id, { techStack: e.target.value })}
                                        />
                                    </div>

                                    <textarea
                                        placeholder="Project Description"
                                        rows="3"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                                        value={project.description}
                                        onChange={(e) => handleUpdateProject(project.id, { description: e.target.value })}
                                    />

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="url"
                                            placeholder="GitHub URL"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            value={project.githubUrl}
                                            onChange={(e) => handleUpdateProject(project.id, { githubUrl: e.target.value })}
                                        />
                                        <input
                                            type="url"
                                            placeholder="Live Site URL"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            value={project.liveUrl}
                                            onChange={(e) => handleUpdateProject(project.id, { liveUrl: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium text-gray-700">Key Features</h5>
                                            <button
                                                onClick={() => handleAddProjectFeature(project.id)}
                                                className="text-sm text-orange-600 hover:text-orange-700 flex items-center space-x-1"
                                            >
                                                <Plus className="w-3 h-3" />
                                                <span>Add Feature</span>
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {project.keyFeatures.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        placeholder={`Feature ${featureIndex + 1}`}
                                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                        value={feature}
                                                        onChange={(e) => handleUpdateProjectFeature(project.id, featureIndex, e.target.value)}
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveProjectFeature(project.id, featureIndex)}
                                                        className="text-red-600 hover:text-red-800 p-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                    <Briefcase className="w-4 h-4 text-indigo-600" />
                                </div>
                                Work Experience
                            </h3>
                            <button
                                onClick={handleAddExperience}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Experience</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {resumeData.experience.map((exp, index) => (
                                <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-semibold text-gray-800">Experience {index + 1}</h4>
                                        <button
                                            onClick={() => handleRemoveExperience(exp.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Job Title"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            value={exp.title}
                                            onChange={(e) => handleUpdateExperience(exp.id, { title: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Company"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            value={exp.company}
                                            onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            value={exp.location}
                                            onChange={(e) => handleUpdateExperience(exp.id, { location: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Start Date"
                                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                value={exp.startDate}
                                                onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="End Date"
                                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                value={exp.endDate}
                                                onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                                                disabled={exp.current}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            id={`current-${exp.id}`}
                                            checked={exp.current}
                                            onChange={(e) => handleUpdateExperience(exp.id, { current: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">
                                            I currently work here
                                        </label>
                                    </div>

                                    <textarea
                                        placeholder="Job Description and Responsibilities"
                                        rows="3"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={exp.description}
                                        onChange={(e) => handleUpdateExperience(exp.id, { description: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                                    <GraduationCap className="w-4 h-4 text-teal-600" />
                                </div>
                                Education
                            </h3>
                            <button
                                onClick={handleAddEducation}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Education</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {resumeData.education.map((edu, index) => (
                                <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-semibold text-gray-800">Education {index + 1}</h4>
                                        <button
                                            onClick={() => handleRemoveEducation(edu.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Degree"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            value={edu.degree}
                                            onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Institution"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            value={edu.institution}
                                            onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            value={edu.location}
                                            onChange={(e) => handleUpdateEducation(edu.id, { location: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Graduation Date"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            value={edu.graduationDate}
                                            onChange={(e) => handleUpdateEducation(edu.id, { graduationDate: e.target.value })}
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="GPA"
                                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        value={edu.gpa}
                                        onChange={(e) => handleUpdateEducation(edu.id, { gpa: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Languages */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                                    <Globe className="w-4 h-4 text-pink-600" />
                                </div>
                                Languages
                            </h3>
                            <button
                                onClick={handleAddLanguage}
                                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Language</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {resumeData.languages.map((lang, index) => (
                                <div key={lang.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-semibold text-gray-800">Language {index + 1}</h4>
                                        <button
                                            onClick={() => handleRemoveLanguage(lang.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Language"
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            value={lang.language}
                                            onChange={(e) => handleUpdateLanguage(lang.id, { language: e.target.value })}
                                        />
                                        <select
                                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            value={lang.proficiency}
                                            onChange={(e) => handleUpdateLanguage(lang.id, { proficiency: e.target.value })}
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Native">Native</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                        <motion.button
                            onClick={() => setShowPreview(true)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Eye className="w-5 h-5" />
                            <span>Preview Resume</span>
                        </motion.button>
                        <motion.button
                            onClick={downloadResumePDF}
                            className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Download className="w-5 h-5" />
                            <span>Download PDF</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};