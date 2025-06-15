import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '../components/Appbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/SuccessStory/ui';
import { Button } from '../components/SuccessStory/ui';
import { User, Calendar, Award, Tag, Clock, DollarSign, Eye } from 'lucide-react';
import { getInvestorDetails, getInvestorProducts } from '../services/investorService';

// Default profile picture
const DEFAULT_PROFILE_PICTURE = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

// Sample profile photo
const SAMPLE_PROFILE_PHOTO = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const InvestorProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [investorData, setInvestorData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [biddedProducts, setBiddedProducts] = useState(() => {
        // Initialize from location state if available
        if (location.state?.hasBidded && location.state?.biddedProductId) {
            return [location.state.biddedProductId];
        }
        return [];
    });

    useEffect(() => {
        const fetchInvestorData = async () => {
            try {
                // Hardcoded investorId for demonstration
                const investorId = 6634104;
                
                // Fetch investor details and products in parallel
                const [investorDetails, investorProducts] = await Promise.all([
                    getInvestorDetails(investorId),
                    getInvestorProducts()
                ]);

                // Add sample profile photo to investor details
                const investorWithPhoto = {
                    ...investorDetails,
                    profilePicture: SAMPLE_PROFILE_PHOTO
                };

                setInvestorData(investorWithPhoto);
                setProducts(investorProducts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvestorData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <AppBar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <AppBar />
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                        Investor Profile
                    </h1>
                    <p className="text-gray-600">View your profile and explore available investment opportunities</p>
                </div>

                {/* Investor Profile Section */}
                <Card className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Profile Information</h2>
                    </div>
                    <CardHeader className="bg-white">
                        <div className="flex items-center space-x-6">
                            <div className="relative group">
                                <img
                                    src={investorData?.profilePicture || DEFAULT_PROFILE_PICTURE}
                                    alt={investorData?.fullName}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = DEFAULT_PROFILE_PICTURE;
                                    }}
                                />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-900">{investorData?.fullName}</CardTitle>
                                <p className="text-gray-600 mt-1">{investorData?.email}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="bg-gradient-to-br from-gray-50 to-white p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <Calendar className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Birthday</p>
                                        <p className="font-semibold text-gray-900">{investorData?.birthday}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <Award className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Rank</p>
                                        <p className="font-semibold text-gray-900">{investorData?.rank}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm md:col-span-2">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <Tag className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Areas of Interest</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {investorData?.aoi?.map((area, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 rounded-t-2xl mb-6">
                        <h2 className="text-xl font-bold text-white">Available Products</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Card key={product.inventionId} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="text-gray-900">Invention #{product.inventionId}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            product.isLive 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                        }`}>
                                            {product.isLive ? 'Live' : 'Not Live'}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-700 leading-relaxed">{product.productDescription}</p>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <DollarSign className="h-5 w-5 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Expected Capital</p>
                                                <p className="font-semibold text-gray-900">${product.expectedCapital.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <Clock className="h-5 w-5 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Bid Start Date</p>
                                                <p className="font-semibold text-gray-900">
                                                    {product.bidStartDate ? new Date(product.bidStartDate).toLocaleDateString() : 'Not Set'}
                                                </p>
                                            </div>
                                        </div>
                                        {product.isLive && (
                                            <Button 
                                                onClick={() => navigate('/place-bid', { 
                                                    state: { 
                                                        product,
                                                        investorId: investorData?.id || 6634104, // Pass the investor ID from state
                                                        hasBidded: biddedProducts.includes(product.inventionId) // Pass if user has already bid
                                                    } 
                                                })}
                                                className={`w-full py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center ${
                                                    biddedProducts.includes(product.inventionId)
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white'
                                                }`}
                                            >
                                                {biddedProducts.includes(product.inventionId) ? (
                                                    <>
                                                        <Eye className="w-4 h-4 mr-2" /> Show My Bid
                                                    </>
                                                ) : (
                                                    'Start Bid'
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorProfile; 