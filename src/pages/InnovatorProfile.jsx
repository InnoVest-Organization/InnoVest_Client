import React, { useState, useEffect } from 'react';
import { getInnovatorProfile, updateInnovatorProfile, getInnovatorInventions, updateBidTimes } from '../services/innovatorService';
import AppBar from '../components/Appbar.jsx';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

// Default profile picture
const DEFAULT_PROFILE_PICTURE = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const InnovatorProfile = () => {
    const innovatorId = 1;
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [inventions, setInventions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'funded'
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthday: ''
    });
    const [error, setError] = useState('');
    const [isEditingBidTimes, setIsEditingBidTimes] = useState(false);
    const [selectedInvention, setSelectedInvention] = useState(null);
    const [bidTimeForm, setBidTimeForm] = useState({
        bidStartDate: '',
        bidStartTime: '',
        bidEndTime: ''
    });
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchInventions();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getInnovatorProfile(innovatorId);
            setProfile(data);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                gender: data.gender,
                birthday: data.birthday
            });
        } catch (error) {
            setError('Failed to fetch profile');
        }
    };    const fetchInventions = async () => {
        try {
            const data = await getInnovatorInventions(innovatorId);
            setInventions(data);
        } catch (error) {
            setError('Failed to fetch inventions');
        }
    };

    // Function to create chart data for sales performance
    const createSalesChartData = (salesData) => {
        if (!salesData || salesData.length === 0) {
            return null;
        }

        const months = salesData.map((_, index) => `Month ${index + 1}`);        const data = salesData.map(sale => sale || 0); // Replace null/undefined with 0

        return {
            labels: months,
            datasets: [
                {
                    label: 'Sales ($)',
                    data: data,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(16, 185, 129)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(16, 185, 129)',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };
    };    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Sales: $${context.parsed.y.toLocaleString()}`;
                    }
                },
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(156, 163, 175, 0.3)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    },
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                },
                ticks: {
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 11
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 4,
                hoverRadius: 6,
                backgroundColor: 'rgb(16, 185, 129)',
                borderColor: '#fff',
                borderWidth: 2,
                hoverBackgroundColor: 'rgb(16, 185, 129)',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 3,
            },
            line: {
                borderWidth: 3,
                tension: 0.4,
            }
        }
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
        try {
            setIsUpdating(true);
            const updatedData = {
                ...formData,
                profilePicture: formData.profilePicture || profile.profilePicture // Include profile picture
            };
            await updateInnovatorProfile(innovatorId, updatedData);
            await fetchProfile();
            setIsEditing(false);
            setError('');
            setUpdateSuccess('Profile updated successfully!');
            setTimeout(() => {
                setUpdateSuccess('');
            }, 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        // If time is in HH:MM format, add :00
        if (time.length === 5) {
            return `${time}:00`;
        }
        // If time is in HH:MM:SS format, ensure seconds are 00
        if (time.length === 8) {
            return `${time.substring(0, 6)}00`;
        }
        return time;
    };

    const handleBidTimeUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            // Format time to ensure HH:MM:00 format
            const formatTime = (time) => {
                if (!time) return '';
                // If time is in HH:MM format, add :00
                if (time.length === 5) {
                    return `${time}:00`;
                }
                // If time is in HH:MM:SS format, ensure seconds are 00
                if (time.length === 8) {
                    return `${time.substring(0, 6)}00`;
                }
                return time;
            };

            const formattedStartTime = formatTime(bidTimeForm.bidStartTime);
            const formattedEndTime = formatTime(bidTimeForm.bidEndTime);

            // Validate times
            if (!formattedStartTime || !formattedEndTime) {
                setUpdateError('Start time and end time are required');
                return;
            }

            // Validate date
            if (!bidTimeForm.bidStartDate) {
                setUpdateError('Start date is required');
                return;
            }

            // Validate that end time is after start time
            const startTime = new Date(`2000-01-01T${formattedStartTime}`);
            const endTime = new Date(`2000-01-01T${formattedEndTime}`);
            if (endTime <= startTime) {
                setUpdateError('End time must be after start time');
                return;
            }

            const updateData = {
                inventionId: selectedInvention.inventionId,
                bidStartTime: formattedStartTime,
                bidEndTime: formattedEndTime,
                bidStartDate: bidTimeForm.bidStartDate
            };

            console.log('Sending bid time update:', updateData);
            
            await updateBidTimes(
                updateData.inventionId,
                updateData.bidStartTime,
                updateData.bidEndTime,
                updateData.bidStartDate
            );
            await fetchInventions();
            setIsEditingBidTimes(false);
            setSelectedInvention(null);
            setUpdateError('');
            setUpdateSuccess('Bid times updated successfully!');
            setTimeout(() => {
                setUpdateSuccess('');
            }, 3000);
        } catch (error) {
            console.error('Bid time update error:', error);
            setUpdateError(error.message || 'Failed to update bid times');
            setUpdateSuccess('');
        } finally {
            setIsUpdating(false);
        }
    };

    const openBidTimeEditor = (invention) => {
        setSelectedInvention(invention);
        setBidTimeForm({
            bidStartDate: invention.bidStartDate || '',
            bidStartTime: formatTime(invention.bidStartTime) || '',
            bidEndTime: formatTime(invention.bidEndTime) || ''
        });
        setIsEditingBidTimes(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Generate the signed URL dynamically using the innovatorId
        const signedUrl = `https://storage.googleapis.com/profile_imges/${innovatorId}/signed-url-example`;

        try {
            const response = await fetch(signedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type
                },
                body: file
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const publicUrl = `${signedUrl.split('?')[0]}?timestamp=${Date.now()}`; // Force refresh by appending timestamp
            setFormData((prev) => ({ ...prev, profilePicture: publicUrl }));
            setUpdateSuccess('Profile picture uploaded successfully!');
            setTimeout(() => {
                setUpdateSuccess('');
            }, 3000);
            console.log('Image uploaded successfully:', publicUrl);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const activeInventions = inventions.filter(inv => !inv.investorId);
    const fundedInventions = inventions.filter(inv => inv.investorId);

    if (!profile) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
        </div>
    );

    return (
        <>
            <AppBar position="static">
                <div>Header</div>
            </AppBar>            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {profile && (
                        <>
                            {/* Success Message */}
                            {updateSuccess && (
                                <div className="fixed top-4 right-4 bg-green-50 text-green-600 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {updateSuccess}
                                </div>
                            )}
                            
                            {/* Loading Overlay */}
                            {isUpdating && (
                                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-xl shadow-2xl transform transition-all">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                                                <div className="w-12 h-12 border-4 border-gray-600 rounded-full absolute top-0 left-0 animate-spin border-t-transparent"></div>
                                            </div>
                                            <span className="text-gray-700 font-medium">Updating...</span>
                                        </div>
                                    </div>
                                </div>
                            )}                            {/* Page Header */}
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                                    Innovator Profile
                                </h1>
                                <p className="text-gray-600">Manage your profile and track your innovations with detailed analytics</p>
                            </div>                            {/* Profile Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 sm:px-8 py-4">
                                    <h2 className="text-xl font-bold text-white">Profile Information</h2>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                        <div className="relative group">
                                            <img
                                                src={profile.profilePicture || DEFAULT_PROFILE_PICTURE}
                                                alt="Profile"
                                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm transition-transform group-hover:scale-105"
                                                style={{ objectFit: 'cover', width: '128px', height: '128px' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = DEFAULT_PROFILE_PICTURE;
                                                }}
                                            />
                                            {isEditing && (
                                                <button className="absolute bottom-0 right-0 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-110">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900">
                                                        {profile.firstName} {profile.lastName}
                                                    </h2>
                                                    <p className="text-gray-500 mt-1">Innovator</p>
                                                </div>                                                <button
                                                    onClick={() => setIsEditing(!isEditing)}
                                                    className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
                                                >
                                                    {isEditing ? (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            Cancel
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Edit Profile
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                            {error && (
                                                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-start">
                                                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="flex-1">{error}</span>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Gender
                                                    </label>
                                                    <select
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                                        required
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Birthday
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="birthday"
                                                        value={formData.birthday}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Profile Picture
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (                                        <div className="mt-8">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        Personal Information
                                                    </h3>                                                    <div className="space-y-4">
                                                        <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
                                                            <p className="text-sm text-gray-600 mb-1 font-medium">First Name</p>
                                                            <p className="text-gray-900 font-semibold">{profile.firstName}</p>
                                                        </div>
                                                        <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
                                                            <p className="text-sm text-gray-600 mb-1 font-medium">Last Name</p>
                                                            <p className="text-gray-900 font-semibold">{profile.lastName}</p>
                                                        </div>
                                                        <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
                                                            <p className="text-sm text-gray-600 mb-1 font-medium">Email Address</p>
                                                            <p className="text-gray-900 font-semibold">{profile.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Additional Details
                                                    </h3>                                                    <div className="space-y-4">
                                                        <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
                                                            <p className="text-sm text-gray-600 mb-1 font-medium">Gender</p>
                                                            <p className="text-gray-900 font-semibold">{profile.gender}</p>
                                                        </div>
                                                        <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
                                                            <p className="text-sm text-gray-600 mb-1 font-medium">Birthday</p>
                                                            <p className="text-gray-900 font-semibold">{profile.birthday}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>                            {/* Register New Innovation Button */}
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() => navigate('/innovation-registration')}
                                    className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Register New Innovation
                                </button>
                            </div>                            {/* Inventions Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                        Your Innovations
                                    </h2>
                                </div>
                                <div className="border-b border-gray-200">                                    <nav className="flex space-x-1 p-2">
                                        <button
                                            onClick={() => setActiveTab('active')}
                                            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                                                activeTab === 'active'
                                                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg'
                                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Active Inventions
                                            <span className={`ml-1 py-0.5 px-2 rounded-full text-xs font-bold ${
                                                activeTab === 'active' 
                                                    ? 'bg-white/20 text-white' 
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}>
                                                {activeInventions.length}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('funded')}
                                            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                                                activeTab === 'funded'
                                                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg'
                                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            Funded Inventions
                                            <span className={`ml-1 py-0.5 px-2 rounded-full text-xs font-bold ${
                                                activeTab === 'funded' 
                                                    ? 'bg-white/20 text-white' 
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}>
                                                {fundedInventions.length}
                                            </span>
                                        </button>
                                    </nav>
                                </div>                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {(activeTab === 'active' ? activeInventions : fundedInventions).map((invention) => (
                                            <div key={invention.inventionId} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">                                                {/* Product Description - Full width at top */}
                                                <div className="mb-4">
                                                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 border-l-4 border-gray-500 mb-3">
                                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                            {invention.productDescription}
                                                        </h3>
                                                    </div>
                                                    {/* IDs on separate line */}
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-3 py-1 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-full text-xs font-semibold border border-gray-400">
                                                            ID: {invention.inventionId}
                                                        </span>
                                                        <span className="px-3 py-1 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-full text-xs font-semibold border border-gray-400">
                                                            Investor: {invention.investorId || 'Not Available'}
                                                        </span>
                                                    </div>
                                                </div>                                                {/* Financial Information Section */}
                                                <div className="mb-4">
                                                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-t-xl px-4 py-2">
                                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                            </svg>
                                                            Financial Details
                                                        </h4>
                                                    </div>
                                                    <div className="space-y-2 bg-white rounded-b-xl p-4 border border-gray-300">
                                                        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-lg border border-gray-300">
                                                            <span className="text-gray-700 font-medium text-sm">Initial Capital</span>
                                                            <span className="font-bold text-gray-900">${invention.capital.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-lg border border-gray-300">
                                                            <span className="text-gray-700 font-medium text-sm">Expected Capital</span>
                                                            <span className="font-bold text-gray-900">${invention.expectedCapital.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-lg border border-gray-300">
                                                            <span className="text-gray-700 font-medium text-sm">Breakup Revenue</span>
                                                            <span className="font-bold text-gray-900">${invention.breakupRevenue.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>                                                {/* Cost Description Section */}
                                                <div className="mb-4">
                                                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-t-xl px-4 py-2">
                                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Cost Description
                                                        </h4>
                                                    </div>
                                                    <div className="bg-white rounded-b-xl p-4 border border-gray-300">
                                                        <p className="text-gray-900 leading-relaxed text-sm">{invention.costDescription}</p>
                                                    </div>
                                                </div>                                                {/* Sales Performance Section with Chart */}
                                                <div className="mb-4">
                                                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-t-xl px-4 py-2">
                                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                            </svg>
                                                            Sales Performance
                                                        </h4>
                                                    </div>
                                                    <div className="bg-white rounded-b-xl p-4 border border-gray-300">
                                                        {invention.salesData && invention.salesData.length > 0 ? (
                                                            <div className="h-32 mb-3 bg-gradient-to-br from-gray-50 to-white rounded-lg p-2 border border-gray-200">
                                                                <Line 
                                                                    data={createSalesChartData(invention.salesData)} 
                                                                    options={chartOptions}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-6 text-gray-500">
                                                                <svg className="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                                </svg>
                                                                <p className="text-xs">No sales data available</p>
                                                            </div>
                                                        )}
                                                        {/* Sales Data Summary */}
                                                        {invention.salesData && invention.salesData.length > 0 && (
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-200">
                                                                {invention.salesData.map((sale, index) => (
                                                                    <div key={index} className="text-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-2 border border-gray-300">
                                                                        <div className="text-xs text-gray-600 font-medium">M{index + 1}</div>
                                                                        <div className="font-bold text-gray-900 text-xs">
                                                                            ${sale ? sale.toLocaleString() : '0'}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Bidding Information Section */}
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Bidding Details</h4>
                                                    <div className="space-y-2 bg-white rounded-lg p-3">
                                                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                                                            <span className="text-gray-500">Start Date</span>
                                                            <span className="font-medium text-gray-900">
                                                                {invention.bidStartDate ? new Date(invention.bidStartDate).toLocaleDateString() : 'Not set'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                                                            <span className="text-gray-500">Start Time</span>
                                                            <span className="font-medium text-gray-900">{invention.bidStartTime}</span>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                                                            <span className="text-gray-500">End Time</span>
                                                            <span className="font-medium text-gray-900">{invention.bidEndTime}</span>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                                                            <span className="text-gray-500">Payment Package</span>
                                                            <span className="font-medium text-gray-900">{invention.paymentPackage}</span>
                                                        </div>
                                                        {activeTab === 'active' && (
                                                            <button
                                                                onClick={() => openBidTimeEditor(invention)}
                                                                className="mt-2 w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                            >
                                                                Update Bid Times
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Additional Information Section */}
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                                                    <div className="space-y-2 bg-white rounded-lg p-3">
                                                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                                                            <span className="text-gray-500">Mode of Sale</span>
                                                            <span className="font-medium text-gray-900">{invention.modeOfSale}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 block mb-1">Areas of Interest</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {invention.aoi.map((area, index) => (
                                                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                                        {area}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {invention.productVideo && (
                                                            <div className="mt-2">
                                                                <a 
                                                                    href={invention.productVideo} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    View Product Video
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status and Action Button */}
                                                <div className="mt-4">
                                                    {activeTab === 'active' && (
                                                        <>
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                                        invention.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                        {invention.isPaid ? 'Paid' : 'Unpaid'}
                                                                    </span>
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                                        invention.isLive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {invention.isLive ? 'Live' : 'Not Live'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {invention.isPaid ? (
                                                                <button
                                                                    className={`w-full px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                                                                        invention.isLive
                                                                            ? 'bg-gray-700 text-white hover:bg-gray-800'
                                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                    }`}
                                                                    disabled={!invention.isLive}
                                                                >
                                                                    {invention.isLive ? 'View Bidding Session' : 'Bidding Session Not Live'}
                                                                </button>
                                                            ) : (
                                                                <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105">
                                                                    Pay Now
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bid Time Update Modal */}
            {isEditingBidTimes && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Update Bid Times</h3>
                        {updateError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                                {updateError}
                            </div>
                        )}
                        <form onSubmit={handleBidTimeUpdate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={bidTimeForm.bidStartDate}
                                        onChange={(e) => setBidTimeForm(prev => ({ ...prev, bidStartDate: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={bidTimeForm.bidStartTime}
                                        onChange={(e) => setBidTimeForm(prev => ({ ...prev, bidStartTime: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={bidTimeForm.bidEndTime}
                                        onChange={(e) => setBidTimeForm(prev => ({ ...prev, bidEndTime: e.target.value }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingBidTimes(false);
                                        setSelectedInvention(null);
                                        setUpdateError('');
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                                >
                                    Update Times
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default InnovatorProfile;