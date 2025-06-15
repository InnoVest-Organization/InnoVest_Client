import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/Appbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/SuccessStory/ui';
import { Button } from '../components/SuccessStory/ui';
import { User, Lock, AlertCircle } from 'lucide-react';

const InvestorLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hardcoded credentials for demonstration
    const VALID_CREDENTIALS = {
        username: 'MarkH@gmail.com',
        password: '123456'
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (formData.username === VALID_CREDENTIALS.username && 
                formData.password === VALID_CREDENTIALS.password) {
                // Successful login
                navigate('/investor-profile');
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <AppBar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            Investor Login
                        </h1>
                        <p className="text-gray-600">Access your investor dashboard</p>
                    </div>

                    {/* Login Card */}
                    <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Sign In</h2>
                        </div>
                        <CardContent className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-start">
                                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="flex-1">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                            placeholder="Enter your username"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>                            
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InvestorLogin; 