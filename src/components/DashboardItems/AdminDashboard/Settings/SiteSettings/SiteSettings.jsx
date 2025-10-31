import React, { useState } from 'react';
import { 
  Image, 
  FileImage, 
  Type, 
  Upload,
  Settings as SettingsIcon,
  Map,
  Globe,
  ChevronRight
} from 'lucide-react';
import axiosIntense from '../../../../../hooks/AxiosIntense/axiosIntense';


const SiteSettings = () => {
  const [activeSection, setActiveSection] = useState(null);

  const settingsOptions = [
    { id: 'logo', label: 'Logo Settings', icon: Image, description: 'Configure your site logo' },
    { id: 'favicon', label: 'Favicon', icon: FileImage, description: 'Upload site favicon' },
    { id: 'sitemap', label: 'Sitemap', icon: Map, description: 'Generate and manage sitemap' },
    { id: 'general', label: 'General Settings', icon: SettingsIcon, description: 'Site name, description, meta tags' },
    { id: 'seo', label: 'SEO Settings', icon: Globe, description: 'Search engine optimization' },
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'logo':
        return <LogoSettings />;
      case 'favicon':
        return <FaviconSettings />;
      case 'sitemap':
        return <SitemapSettings />;
      case 'general':
        return <GeneralSettings />;
      case 'seo':
        return <SeoSettings />;
      default:
        return null;
    }
  };

  if (activeSection) {
    return (
      <div>
        <button
          onClick={() => setActiveSection(null)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Settings
        </button>
        {renderContent()}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Site Settings</h1>
      <p className="text-slate-600 mb-8">Manage your website configuration and settings</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => setActiveSection(option.id)}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 text-left group border border-slate-200 hover:border-blue-400"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{option.label}</h3>
              <p className="text-sm text-slate-600">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Logo Settings Component
const LogoSettings = () => {
  const [logoType, setLogoType] = useState('text');
  const [textLogo, setTextLogo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=af5080f6264ea38c18a1cf186815b22f', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error('Image upload failed');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let payload = { type: logoType };

      if (logoType === 'text') {
        payload.text = textLogo;
      } else if (logoType === 'image') {
        const imageUrl = await uploadToImgBB(imageFile);
        payload.imageUrl = imageUrl;
      } else if (logoType === 'image-text') {
        const imageUrl = await uploadToImgBB(imageFile);
        payload.imageUrl = imageUrl;
        payload.text = textLogo;
      }

      await axiosIntense.post('/logo', payload);
      setMessage('Logo updated successfully!');
    } catch (error) {
      setMessage('Error updating logo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Logo Settings</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">Select Logo Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'text', label: 'Text Logo', icon: Type },
              { value: 'image', label: 'Image Logo', icon: Image },
              { value: 'image-text', label: 'Image + Text', icon: Upload }
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setLogoType(type.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    logoType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${logoType === type.value ? 'text-blue-600' : 'text-slate-400'}`} />
                  <p className={`text-sm font-medium ${logoType === type.value ? 'text-blue-600' : 'text-slate-600'}`}>
                    {type.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {(logoType === 'text' || logoType === 'image-text') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo Text</label>
              <input
                type="text"
                value={textLogo}
                onChange={(e) => setTextLogo(e.target.value)}
                placeholder="Enter logo text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {(logoType === 'image' || logoType === 'image-text') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Logo Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="max-w-xs h-32 object-contain border border-slate-200 rounded-lg p-2" />
                </div>
              )}
            </div>
          )}

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Logo'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Favicon Settings Component
const FaviconSettings = () => {
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=af5080f6264ea38c18a1cf186815b22f', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error('Image upload failed');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const imageUrl = await uploadToImgBB(faviconFile);
      await axiosIntense.post('/favicon', { imageUrl });
      setMessage('Favicon updated successfully!');
    } catch (error) {
      setMessage('Error updating favicon: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Favicon Settings</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-slate-600 mb-6">Upload a favicon for your website (recommended size: 32x32px or 16x16px)</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Favicon</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {faviconPreview && (
              <div className="mt-4">
                <img src={faviconPreview} alt="Favicon Preview" className="w-16 h-16 object-contain border border-slate-200 rounded-lg p-2" />
              </div>
            )}
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Favicon'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Sitemap Settings Component
const SitemapSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateSitemap = async () => {
    setLoading(true);
    setMessage('');

    try {
      await axiosIntense.post('/sitemap/generate');
      setMessage('Sitemap generated successfully!');
    } catch (error) {
      setMessage('Error generating sitemap: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Sitemap Settings</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-slate-600 mb-6">Generate XML sitemap for search engines</p>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <button
          onClick={generateSitemap}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Sitemap'}
        </button>
      </div>
    </div>
  );
};

// General Settings Component
const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    footerText: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axiosIntense.post('/settings/general', formData);
      setMessage('Settings updated successfully!');
    } catch (error) {
      setMessage('Error updating settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">General Settings</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Career Crafter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
              <textarea
                value={formData.siteDescription}
                onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your career platform description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="contact@careercrafter.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Footer Text</label>
              <input
                type="text"
                value={formData.footerText}
                onChange={(e) => setFormData({...formData, footerText: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="© 2025 Career Crafter. All rights reserved."
              />
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

// SEO Settings Component
const SeoSettings = () => {
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axiosIntense.post('/settings/seo', formData);
      setMessage('SEO settings updated successfully!');
    } catch (error) {
      setMessage('Error updating SEO settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">SEO Settings</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Career Crafter - Find Your Dream Job"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Discover career opportunities..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meta Keywords</label>
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => setFormData({...formData, metaKeywords: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="jobs, career, employment, hiring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">OG Image URL</label>
              <input
                type="url"
                value={formData.ogImage}
                onChange={(e) => setFormData({...formData, ogImage: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SiteSettings;