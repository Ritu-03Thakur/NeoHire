import React, { useState } from 'react';
import { FaMicrosoft, FaApple, FaGoogle, FaLinkedin, FaGithub } from "react-icons/fa";
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Briefcase, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  BarChart, 
  MessageSquare,
  Eye,
  EyeOff,
} from 'lucide-react';
import { FaMeta } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const testimonials = [
  {
    text: "NeoHire reduced our hiring process time by 60%! AI-driven matching is a game-changer.",
    author: "John Doe",
    position: "HR Manager",
    company: "XYZ Corp",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    text: "The blockchain verification feature has completely transformed how we verify candidate credentials.",
    author: "Sarah Smith",
    position: "Talent Acquisition Lead",
    company: "Tech Solutions Inc",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const companies = [
  { 
    name: "Apple", 
    icon: <FaApple className="w-8 h-8 text-gray-800 dark:text-gray-200" />,
    color: "hover:text-[#A2AAAD]"
  },
  { 
    name: "Microsoft", 
    icon: <FaMicrosoft className="w-8 h-8 text-gray-800 dark:text-gray-200" />,
    color: "hover:text-[#00A4EF]"
  },
  { 
    name: "Meta", 
    icon: <FaMeta className="w-8 h-8 text-gray-800 dark:text-gray-200" />,
    color: "hover:text-[#1877F2]"
  },
  { 
    name: "Google", 
    icon: <FaGoogle className="w-8 h-8 text-gray-800 dark:text-gray-200" />,
    color: "hover:text-[#4285F4]"
  },
  { 
    name: "LinkedIn", 
    icon: <FaLinkedin className="w-8 h-8 text-gray-800 dark:text-gray-200" />,
    color: "hover:text-[#0A66C2]"
  },
  { 
    name: "GitHub", 
    icon: <FaGithub className="w-8 h-8 text-gray-800 dark:text-gray-200" />,
    color: "hover:text-[#24292F]"
  }
];

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Resume Screening",
    description: "Instantly analyze resumes & shortlist candidates with advanced AI algorithms."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Blockchain-Verified Credentials",
    description: "Secure and authentic candidate records using blockchain technology."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Smart Job Matching",
    description: "AI-driven recommendations based on role requirements & candidate skills."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaborative Hiring",
    description: "Invite your HR team & manage hiring together seamlessly."
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Real-Time Analytics",
    description: "Track candidate progress & hiring efficiency with detailed insights."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "AI Recruiter Assistant",
    description: "Get instant answers and suggestions from our AI assistant."
  }
];

const faqs = [
  {
    question: "How does AI-powered hiring work?",
    answer: "Our AI analyzes resumes and job descriptions to find the best matches based on skills, experience, and cultural fit."
  },
  {
    question: "How does blockchain verification help?",
    answer: "Blockchain ensures that candidate credentials are authentic and tamper-proof, reducing verification time."
  },
  {
    question: "Is NeoHire free to use?",
    answer: "Yes! You can start with our free plan and upgrade for advanced features as your needs grow."
  }
];

const DEMO_USER = {
  email: 'demo@neohire.com',
  password: 'Demo@123'
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: '',
    position: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Handle login
      if (formData.email === DEMO_USER.email && formData.password === DEMO_USER.password) {
        const userData = {
          email: DEMO_USER.email,
          name: 'Demo User',
          company: 'NeoHire',
          position: 'HR Manager'
        };  
        await login(userData);
        navigate('/', { replace: true });
      } else {
        const { success, error } = await login(formData.email, formData.password);
        if (success) {
          navigate('/', { replace: true });
        } else {
          setError(error);
        }
      }
    } else {
      // Handle registration
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match!");
        return;
      }
      
      const { success, error } = await signup(formData);
      if (success) {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      } else {
        setError(error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Neo<span className="text-blue-600">Hire</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
             NeoHire - AI-Powered Hiring.
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smarter, Faster, Verified.
            </span>
          </h1>
          <div className="space-y-2">
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300">
              Leverage AI & Blockchain for effortless talent acquisition.
            </p>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300">
              Secure, transparent, and efficient hiring starts here!
            </p>
          </div>
        </div>

        {/* Trusted By Section with Icons */}
        <div className="text-center lg:text-left mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Trusted By Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {companies.map((company, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${company.color}`}
              >
                {company.icon}
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                  {company.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Features & Content */}
          <div className="space-y-16">
            {/* Features Grid */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Powerful Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg backdrop-filter"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.position} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Auth Form */}
          <div className="sticky top-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-lg backdrop-filter hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isLogin ? 'Welcome back, Recruiter!' : 'Join NeoHire Today'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isLogin ? 'Access your recruitment dashboard' : 'Start hiring smarter'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <User className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors z-10" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors z-10" />
                        </div>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required={!isLogin}
                          value={formData.company}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500"
                          placeholder="Company Inc."
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Position
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Briefcase className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors z-10" />
                        </div>
                        <input
                          id="position"
                          name="position"
                          type="text"
                          required={!isLogin}
                          value={formData.position}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500"
                          placeholder="HR Manager"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Work Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors z-10" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors z-10" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Lock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors z-10" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required={!isLogin}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 transition-all duration-150 active:scale-95"
                >
                  {isLogin ? 'Sign in' : 'Create recruiter account'}
                </button>
              </form>

              {isLogin && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Demo Credentials:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Email: {DEMO_USER.email}<br />
                    Password: {DEMO_USER.password}
                  </p>
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                >
                  {isLogin ? "New recruiter? Create an account" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
        <p>© 2025 NeoHire. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Auth;