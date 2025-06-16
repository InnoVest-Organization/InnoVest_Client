import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '../components/Appbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/SuccessStory/ui';
import { Button } from '../components/SuccessStory/ui';
import { ArrowLeft, DollarSign, Percent, Check, AlertTriangle } from 'lucide-react';
import { getBidsByInventionId, acceptBid } from '../services/biddingService';
import { toast } from 'sonner';

const AcceptBids = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { inventionId, innovationTitle } = location.state || {};
    
    const [bidData, setBidData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);

    useEffect(() => {
        if (!inventionId) {
            navigate('/innovation-detail');
            return;
        }

        const fetchBidData = async () => {
            try {
                console.log(`Fetching bids for invention ID: ${inventionId}`);
                const response = await getBidsByInventionId(inventionId);
                console.log('Bids API Response:', response);
                
                setBidData(response.bids || []);
            } catch (error) {
                console.error('Error fetching bid data:', error);
                toast.error('Failed to load bidding information');
            } finally {
                setLoading(false);
            }
        };

        fetchBidData();
    }, [inventionId, navigate]);

    const handleAcceptBid = async (bid) => {
        try {
            console.log(`Accepting bid with order ID: ${bid.orderId}`, bid);
            
            // Make sure the orderId exists
            if (!bid.orderId) {
                toast.error('Invalid bid data: Missing order ID');
                return;
            }
            
            const result = await acceptBid(bid.orderId);
            console.log('Bid acceptance response:', result);
            
            setSelectedBid(bid);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error accepting bid:', error);
            toast.error('Failed to accept bid. Please try again.');
        }
    };

    const handleBackToInnovation = () => {
        navigate('/innovation-detail', { 
            state: { 
                selectedBid: selectedBid,
                inventionId: inventionId 
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <AppBar />
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                                Available Bids
                            </h1>
                            <p className="text-gray-600">
                                Review and accept investor bids for {innovationTitle || `Innovation #${inventionId}`}
                            </p>
                        </div>
                        <Button 
                            onClick={handleBackToInnovation}
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Innovation
                        </Button>
                    </div>
                </div>

                {/* Bids List */}
                <Card className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Investor Bids</h2>
                    </div>
                    <CardContent className="p-6">
                        {bidData.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bids Available</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    There are no investor bids for this innovation yet. Check back later or promote your invention to attract more investors.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
                                        <tr>
                                            <th className="px-6 py-3">Investor ID</th>
                                            <th className="px-6 py-3">Bid Amount</th>
                                            <th className="px-6 py-3">Equity (%)</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bidData.map((bid, index) => (
                                            <tr key={bid.orderId} className={`
                                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                                hover:bg-gray-100 transition-colors
                                            `}>
                                                <td className="px-6 py-4">
                                                    #{bid.investorId}
                                                </td>
                                                <td className="px-6 py-4 font-medium">${bid.bidAmount.toLocaleString()}</td>
                                                <td className="px-6 py-4">{bid.equity}%</td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        onClick={() => handleAcceptBid(bid)}
                                                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 text-sm rounded-lg transition-all duration-300"
                                                    >
                                                        Accept Bid
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Comparison Chart (optional feature) */}
                {bidData.length > 1 && (
                    <Card className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Bid Comparison</h2>
                        </div>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-4">Highest Bid Amount</h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${Math.max(...bidData.map(bid => bid.bidAmount)).toLocaleString()}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        The maximum amount offered by investors
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-4">Lowest Equity</h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {Math.min(...bidData.map(bid => bid.equity))}%
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        The minimum equity percentage requested
                                    </p>
                                </div>
                            </div>
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
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Bid Accepted Successfully!</h3>
                                <p className="text-gray-600 mb-6">
                                    Congratulations for accepting the bid. We will notify the investor via email. Stay tuned!
                                </p>
                                <Button
                                    onClick={handleBackToInnovation}
                                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-2 w-full"
                                >
                                    Back to Innovation Details
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptBids;
