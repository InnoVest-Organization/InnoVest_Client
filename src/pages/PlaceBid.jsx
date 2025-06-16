import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '../components/Appbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/SuccessStory/ui';
import { Button } from '../components/SuccessStory/ui';
import { DollarSign, Percent, Award, Clock, Tag, Check, ArrowLeft } from 'lucide-react';
import { getBidsByInventionId, placeBid } from '../services/biddingService';
import { toast } from 'sonner';

const PlaceBid = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product, investorId, hasBidded } = location.state || {};
    const [bidData, setBidData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [equity, setEquity] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [hasBid, setHasBid] = useState(hasBidded || false);
    
    // Use the investor ID passed from the InvestorProfile component
    const currentInvestorId = investorId || 6634104; // Fallback to the same ID used in InvestorProfile

    useEffect(() => {
        if (!product) {
            navigate('/investor-profile');
            return;
        }

        const fetchBidData = async () => {
            try {
                console.log(`Fetching bids for invention ID: ${product.inventionId}, using investor ID: ${currentInvestorId}`);
                const response = await getBidsByInventionId(product.inventionId);
                console.log('Bids API Response:', response);
                
                // Mark any bids that belong to the current investor and check if user has already bid
                const processedBids = (response.bids || []).map(bid => ({
                    ...bid,
                    isMine: bid.investorId === currentInvestorId
                }));
                
                // Check if the user already has a bid
                const userHasBid = processedBids.some(bid => bid.isMine);
                setHasBid(hasBidded || userHasBid);
                
                setBidData(processedBids);
            } catch (error) {
                console.error('Error fetching bid data:', error);
                toast.error('Failed to load bidding information');
            } finally {
                setLoading(false);
            }
        };

        fetchBidData();
    }, [product, navigate]);

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
            errors.bidAmount = 'Please enter a valid bid amount';
            isValid = false;
        }

        if (!equity || isNaN(equity) || Number(equity) <= 0 || Number(equity) > 100) {
            errors.equity = 'Please enter a valid equity percentage (between 0 and 100)';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                const bidPayload = {
                    inventionId: product.inventionId,
                    investorId: currentInvestorId,
                    bidAmount: Number(bidAmount),
                    equity: Number(equity)
                };
                
                console.log('Placing bid with payload:', bidPayload);
                const response = await placeBid(bidPayload);
                console.log('Bid placement response:', response);
                
                // Add the new bid to the top of the list
                const newBid = {
                    orderId: response?.orderId || Date.now(), // Use response ID if available, otherwise generate temporary ID
                    investorId: currentInvestorId,
                    bidAmount: Number(bidAmount),
                    equity: Number(equity),
                    selected: false,
                    isMine: true // Flag to identify our own bid
                };
                
                setBidData([newBid, ...bidData]);
                setHasBid(true);
                
                // Clear form
                setBidAmount('');
                setEquity('');
                
                // Show success modal instead of toast
                setShowSuccessModal(true);
            } catch (error) {
                console.error('Error placing bid:', error);
                toast.error('Failed to place bid. Please try again.');
            }
        }
    };

    const handleShowMyBid = () => {
        setShowSuccessModal(false);
        // Scroll to the bids section
        document.getElementById('bids-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleBackToProfile = () => {
        navigate('/investor-profile', { 
            state: { 
                hasBidded: true, 
                biddedProductId: product.inventionId 
            }
        });
    };

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

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <AppBar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-[60vh]">
                        <Card className="w-full max-w-md">
                            <CardContent className="p-6 text-center">
                                <p className="text-gray-700 mb-4">Product information not found.</p>
                                <Button 
                                    onClick={() => navigate('/investor-profile')}
                                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-2"
                                >
                                    Return to Profile
                                </Button>
                            </CardContent>
                        </Card>
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
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            {hasBid ? 'View Bid Details' : 'Place a Bid'}
                        </h1>
                        <Button 
                            onClick={handleBackToProfile}
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Profile
                        </Button>
                    </div>
                    <p className="text-gray-600">
                        {hasBid 
                            ? 'View your bid and track its status' 
                            : 'Submit your investment proposal for this invention'}
                    </p>
                </div>

                {/* Product Information */}
                <Card className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Invention #{product.inventionId}</h2>
                    </div>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                <p className="text-gray-700 leading-relaxed">{product.productDescription}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <p className="text-sm text-gray-500">Bid Started</p>
                                        <p className="font-semibold text-gray-900">
                                            {product.bidStartDate ? new Date(product.bidStartDate).toLocaleDateString() : 'Not Set'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bids List */}
                <Card id="bids-section" className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Current Bids</h2>
                    </div>
                    <CardContent className="p-6">
                        {bidData.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No bids have been placed yet. Be the first to invest!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {/* If user has their own bid, highlight it at the top */}
                                {hasBid && bidData.some(bid => bid.isMine) && (
                                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                                            <Check className="h-5 w-5 text-blue-600 mr-2" /> Your Bid
                                        </h3>
                                        {bidData.filter(bid => bid.isMine).map(myBid => (
                                            <div key={`my-bid-${myBid.orderId}`} className="flex flex-wrap gap-4">
                                                <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200">
                                                    <span className="text-xs text-gray-500 block">Bid Amount</span>
                                                    <span className="font-semibold text-gray-900">${myBid.bidAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200">
                                                    <span className="text-xs text-gray-500 block">Equity</span>
                                                    <span className="font-semibold text-gray-900">{myBid.equity}%</span>
                                                </div>
                                                <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200">
                                                    <span className="text-xs text-gray-500 block">Status</span>
                                                    {myBid.selected ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                            Selected
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                            Pending Approval
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
                                        <tr>
                                            <th className="px-6 py-3">Investor ID</th>
                                            <th className="px-6 py-3">Bid Amount</th>
                                            <th className="px-6 py-3">Equity (%)</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bidData.map((bid, index) => (
                                            <tr key={bid.orderId} className={`
                                                ${bid.isMine ? 'bg-blue-50 border-l-4 border-blue-500' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                                hover:bg-gray-100 transition-colors
                                            `}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {bid.isMine ? (
                                                            <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                You
                                                            </span>
                                                        ) : null}
                                                        #{bid.investorId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium">${bid.bidAmount.toLocaleString()}</td>
                                                <td className="px-6 py-4">{bid.equity}%</td>
                                                <td className="px-6 py-4">
                                                    {bid.selected ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Selected
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bid Form or Already Bid Message */}
                {hasBid ? (
                    <Card className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Your Bid Status</h2>
                        </div>
                        <CardContent className="p-6">
                            <div className="text-center py-4">
                                <div className="bg-blue-100 rounded-full p-3 inline-flex mb-4">
                                    <Check className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bid Placed Successfully</h3>
                                <p className="text-gray-600 mb-6">
                                    You have already placed a bid on this invention. You will be notified when the inventor reviews your proposal.
                                </p>
                                <div className="flex justify-center">
                                    <Button
                                        onClick={handleBackToProfile}
                                        className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-2 px-6"
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Back to Profile
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Submit Your Bid</h2>
                        </div>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                            Bid Amount ($)
                                        </label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="bidAmount"
                                                id="bidAmount"
                                                placeholder="10000"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                className={`block w-full pl-10 pr-12 py-2 border ${formErrors.bidAmount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
                                            />
                                        </div>
                                        {formErrors.bidAmount && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.bidAmount}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="equity" className="block text-sm font-medium text-gray-700 mb-2">
                                            Equity (%)
                                        </label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Percent className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="equity"
                                                id="equity"
                                                placeholder="5"
                                                min="0"
                                                max="100"
                                                value={equity}
                                                onChange={(e) => setEquity(e.target.value)}
                                                className={`block w-full pl-10 pr-12 py-2 border ${formErrors.equity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
                                            />
                                        </div>
                                        {formErrors.equity && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.equity}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-2 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                                    >
                                        Place Bid
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
                
                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-green-100 rounded-full p-3 mb-4">
                                    <Check className="h-10 w-10 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Bid Placed Successfully!</h3>
                                <p className="text-gray-600 mb-6">
                                    Thank you for placing the bid. You will be notified once the inventor approves your bid.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <Button
                                        onClick={handleShowMyBid}
                                        className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-2 flex-1"
                                    >
                                        Show My Bid
                                    </Button>
                                    <Button
                                        onClick={handleBackToProfile}
                                        variant="outline"
                                        className="border-gray-300 hover:bg-gray-100 text-gray-700 py-2 flex-1"
                                    >
                                        Back to Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaceBid;
