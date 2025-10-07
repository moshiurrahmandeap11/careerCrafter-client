import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Globe,
  FileText,
  Award,
  Zap,
  CheckCircle,
  Building,
  Target
} from 'lucide-react';
import useAuth from '../../../hooks/UseAuth/useAuth';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';
import Swal from 'sweetalert2';

const ProfileHired = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    
    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        email: '',
        phone: '',
        location: '',
        portfolio: '',
        resumeLink: '', // New resume link field
        
        // Professional Information
        currentJobTitle: '',
        desiredJobTitle: '',
        currentCompany: '',
        industry: '',
        yearsOfExperience: '',
        
        // Job Preferences
        preferredJobType: '',
        preferredLocation: '',
        expectedSalary: '',
        noticePeriod: '',
        
        // Skills & Qualifications
        skills: [],
        education: '',
        certifications: [],
        
        // Job Search Status
        jobSearchStatus: 'active',
        availableFrom: '',
        relocation: false
    });

    useEffect(() => {
        if (user?.email) {
            fetchUserProfile();
        }
    }, [user?.email]);

    const fetchUserProfile = async () => {
        try {
            const response = await axiosIntense.get(`/users/email/${user.email}`);
            if (response.data) {
                setProfile(response.data);
                // Pre-fill form with existing data
                setFormData(prev => ({
                    ...prev,
                    fullName: response.data.fullName || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    location: response.data.location || '',
                    portfolio: response.data.portfolio || '',
                    resumeLink: response.data.resumeLink || '', // Pre-fill resume link
                    currentJobTitle: response.data.currentJobTitle || '',
                    desiredJobTitle: response.data.desiredJobTitle || '',
                    currentCompany: response.data.currentCompany || '',
                    industry: response.data.industry || '',
                    yearsOfExperience: response.data.yearsOfExperience || '',
                    preferredJobType: response.data.preferredJobType || '',
                    preferredLocation: response.data.preferredLocation || '',
                    expectedSalary: response.data.expectedSalary || '',
                    noticePeriod: response.data.noticePeriod || '',
                    skills: response.data.skills || [],
                    education: response.data.education || '',
                    certifications: response.data.certifications || [],
                    jobSearchStatus: response.data.jobSearchStatus || 'active',
                    availableFrom: response.data.availableFrom || '',
                    relocation: response.data.relocation || false
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSkillsChange = (e) => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
        setFormData(prev => ({
            ...prev,
            skills: skillsArray
        }));
    };

    const handleCertificationsChange = (e) => {
        const certsArray = e.target.value.split(',').map(cert => cert.trim()).filter(cert => cert);
        setFormData(prev => ({
            ...prev,
            certifications: certsArray
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosIntense.patch(`/users/email/${user.email}`, formData);
            
            if (response.data) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your profile has been updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Great!'
                });
                navigate('/profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update profile. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => navigate('/profile')}
                        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Profile
                    </button>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Target className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Hired</h1>
                        <p className="text-gray-600 text-lg">
                            Complete your profile to attract top employers and land your dream job
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <User className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Portfolio/Website
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="url"
                                        name="portfolio"
                                        value={formData.portfolio}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="https://yourportfolio.com"
                                    />
                                </div>
                            </div>

                            {/* Resume Link Field - Added here */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Resume Link *
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="url"
                                        name="resumeLink"
                                        required
                                        value={formData.resumeLink}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="https://drive.google.com/your-resume"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Provide a link to your resume (Google Drive, Dropbox, etc.)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Briefcase className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-bold text-gray-900">Professional Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Job Title
                                </label>
                                <input
                                    type="text"
                                    name="currentJobTitle"
                                    value={formData.currentJobTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., Senior Developer"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Desired Job Title *
                                </label>
                                <input
                                    type="text"
                                    name="desiredJobTitle"
                                    required
                                    value={formData.desiredJobTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., Lead Engineer"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Company
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="currentCompany"
                                        value={formData.currentCompany}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Company name"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Industry
                                </label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., Technology, Healthcare"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Years of Experience *
                                </label>
                                <select
                                    name="yearsOfExperience"
                                    required
                                    value={formData.yearsOfExperience}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select experience</option>
                                    <option value="0-1">0-1 years</option>
                                    <option value="1-3">1-3 years</option>
                                    <option value="3-5">3-5 years</option>
                                    <option value="5-8">5-8 years</option>
                                    <option value="8+">8+ years</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Job Preferences */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Target className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900">Job Preferences</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Job Type *
                                </label>
                                <select
                                    name="preferredJobType"
                                    required
                                    value={formData.preferredJobType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select job type</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="internship">Internship</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Location
                                </label>
                                <input
                                    type="text"
                                    name="preferredLocation"
                                    value={formData.preferredLocation}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., Remote, New York, etc."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected Salary (USD)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="expectedSalary"
                                        value={formData.expectedSalary}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="e.g., 75000"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notice Period
                                </label>
                                <select
                                    name="noticePeriod"
                                    value={formData.noticePeriod}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select notice period</option>
                                    <option value="immediately">Immediately</option>
                                    <option value="1 week">1 week</option>
                                    <option value="2 weeks">2 weeks</option>
                                    <option value="1 month">1 month</option>
                                    <option value="2 months">2 months</option>
                                    <option value="3 months">3 months</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Skills & Qualifications */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Award className="w-6 h-6 text-amber-600" />
                            <h2 className="text-xl font-bold text-gray-900">Skills & Qualifications</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills (comma separated) *
                                </label>
                                <textarea
                                    name="skills"
                                    required
                                    value={formData.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., JavaScript, React, Node.js, Python, AWS"
                                />
                                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Highest Education
                                </label>
                                <select
                                    name="education"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select education level</option>
                                    <option value="high-school">High School</option>
                                    <option value="associate">Associate Degree</option>
                                    <option value="bachelor">Bachelor's Degree</option>
                                    <option value="master">Master's Degree</option>
                                    <option value="phd">PhD</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Certifications (comma separated)
                                </label>
                                <textarea
                                    name="certifications"
                                    value={formData.certifications.join(', ')}
                                    onChange={handleCertificationsChange}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., AWS Certified, PMP, Google Analytics"
                                />
                                <p className="text-sm text-gray-500 mt-1">Separate certifications with commas</p>
                            </div>
                        </div>
                    </div>

                    {/* Job Search Status */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <Zap className="w-6 h-6 text-red-600" />
                            <h2 className="text-xl font-bold text-gray-900">Job Search Status</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Search Status *
                                </label>
                                <select
                                    name="jobSearchStatus"
                                    required
                                    value={formData.jobSearchStatus}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="active">Actively looking</option>
                                    <option value="passive">Open to opportunities</option>
                                    <option value="not-looking">Not looking</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Available From
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="date"
                                        name="availableFrom"
                                        value={formData.availableFrom}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        name="relocation"
                                        checked={formData.relocation}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Willing to relocate for the right opportunity
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Get Hired?</h3>
                                <p className="text-gray-600 text-sm">
                                    Complete your profile to start receiving job matches
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Complete Profile & Get Hired</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileHired;