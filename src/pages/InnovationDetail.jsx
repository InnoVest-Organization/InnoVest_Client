import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import AppBar from '../components/Appbar.jsx';
import { getInnovationDetail } from '../services/innovationService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InnovationDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const inventionId = 4001; // Hardcoded invention ID
    const [innovation, setInnovation] = useState(null);
    const [error, setError] = useState('');
    
    // Check if there's a selected bid in the location state
    const selectedBidFromState = location.state?.selectedBid;

    // Function to create chart data for sales performance
    const createSalesChartData = (salesData) => {
        if (!salesData || salesData.length === 0) {
            return {
                labels: ['No Data'],
                datasets: [{
                    label: 'Sales Performance',
                    data: [0],
                    borderColor: 'rgb(156, 163, 175)',
                    backgroundColor: 'rgba(156, 163, 175, 0.2)',
                    tension: 0.1
                }]
            };
        }        return {
            labels: salesData.map((_, index) => `Month ${index + 1}`),
            datasets: [{
                label: 'Sales Performance ($)',
                data: salesData.map(sale => sale || 0),
                borderColor: 'rgb(107, 114, 128)', // Changed to grey
                backgroundColor: 'rgba(107, 114, 128, 0.1)', // Changed to grey
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(107, 114, 128)', // Changed to grey
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgb(107, 114, 128)', // Changed to grey
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3,
            }]
        };
    };    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 14,
                        weight: '500'
                    }
                }
            },
            title: {
                display: true,
                text: 'Monthly Sales Performance',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                color: 'rgb(75, 85, 99)'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.3)',
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    },
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.3)',
                },
                ticks: {
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchInnovationDetail = async () => {
            try {
                const data = await getInnovationDetail(inventionId);
                
                // If we have a selected bid from navigation state, add it to the innovation data
                if (selectedBidFromState) {
                    setInnovation({
                        ...data,
                        selectedBid: selectedBidFromState
                    });
                } else {
                    setInnovation(data);
                }
            } catch (err) {
                setError('Failed to fetch innovation details.');
            }
        };

        fetchInnovationDetail();
    }, [selectedBidFromState, inventionId]);    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppBar position="static">
                    <div>Header</div>
                </AppBar>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Innovation Details</h1>
                        <button
                            onClick={handleGoBack}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }    if (!innovation) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppBar position="static">
                    <div>Header</div>
                </AppBar>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Innovation Details</h1>
                        <button
                            onClick={handleGoBack}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>
                    <div className="text-gray-600">Loading innovation details...</div>
                </div>
            </div>
        );
    }    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar position="static">
                <div>Header</div>
            </AppBar>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            Innovation Details
                        </h1>
                        <p className="text-gray-600 mt-2">Comprehensive overview of innovation metrics and performance</p>
                    </div>
                    <button
                        onClick={handleGoBack}
                        className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 font-medium shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Overview Card */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-gray-700 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">Product Overview</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Product Description</h3>
                                    <p className="text-gray-900 text-lg leading-relaxed">{innovation.productDescription}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-gray-400">
                                        <h3 className="text-sm font-medium text-gray-700">Invention ID</h3>
                                        <p className="text-2xl font-bold text-gray-900">{innovation.inventionId}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-gray-400">
                                        <h3 className="text-sm font-medium text-gray-700">Inventor ID</h3>
                                        <p className="text-2xl font-bold text-gray-900">{innovation.inventorId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sales Performance Chart */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-gray-700 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Sales Performance
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="h-72 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <Line data={createSalesChartData(innovation.salesData)} options={chartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-gray-700 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">Additional Information</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Cost Description</h3>
                                    <p className="text-gray-900 leading-relaxed">{innovation.costDescription}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Mode of Sale</h3>
                                    <p className="text-gray-900 font-semibold">{innovation.modeOfSale}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Areas of Interest</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {innovation.aoi.map((area, index) => (
                                            <span key={index} className="px-3 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        {/* Financial Details */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-gray-700 px-6 py-4">
                                <h2 className="text-lg font-bold text-white">Financial Details</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-300">
                                    <h3 className="text-sm font-medium text-gray-700">Capital</h3>
                                    <p className="text-2xl font-bold text-gray-900">${innovation.capital.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-300">
                                    <h3 className="text-sm font-medium text-gray-700">Expected Capital</h3>
                                    <p className="text-2xl font-bold text-gray-900">${innovation.expectedCapital.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-300">
                                    <h3 className="text-sm font-medium text-gray-700">Breakup Revenue</h3>
                                    <p className="text-2xl font-bold text-gray-900">${innovation.breakupRevenue.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-300">
                                    <h3 className="text-sm font-medium text-gray-700">Payment Package</h3>
                                    <p className="text-lg font-semibold text-gray-900">{innovation.paymentPackage}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bidding Information */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-gray-700 px-6 py-4">
                                <h2 className="text-lg font-bold text-white">Bidding Schedule</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-sm font-medium text-gray-700">Start Date</h3>
                                    <p className="text-lg font-semibold text-gray-900">{new Date(innovation.bidStartDate).toLocaleDateString()}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-300">
                                        <h3 className="text-xs font-medium text-gray-700">Start Time</h3>
                                        <p className="text-sm font-bold text-gray-900">{innovation.bidStartTime}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-300">
                                        <h3 className="text-xs font-medium text-gray-700">End Time</h3>
                                        <p className="text-sm font-bold text-gray-900">{innovation.bidEndTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-gray-700 px-6 py-4">
                                <h2 className="text-lg font-bold text-white">Status & Actions</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="text-center">
                                    {innovation.isLive ? (
                                        <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-300">
                                            <span className="w-2 h-2 bg-gray-700 rounded-full mr-2 animate-pulse"></span>
                                            Live Now
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium border border-gray-300">
                                            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                            Not Live
                                        </span>
                                    )}
                                </div>
                                
                                {/* See Available Bids Button - shown when no bid is accepted */}
                                {innovation.isLive && !innovation.selectedBid && (
                                    <button
                                        onClick={() => navigate('/accept-bids', { state: { 
                                            inventionId: innovation.id || inventionId,
                                            innovationTitle: innovation.title || `Innovation #${inventionId}`
                                        }})}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        See Available Bids
                                    </button>
                                )}
                                
                                {/* Selected Bid Details - shown when a bid is accepted */}
                                {innovation.isLive && innovation.selectedBid && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Selected Bid</h3>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Investor ID:</span> #{innovation.selectedBid.investorId}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Amount:</span> ${innovation.selectedBid.bidAmount.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Equity:</span> {innovation.selectedBid.equity}%
                                            </p>
                                            <div className="pt-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    Accepted
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {innovation.productVideo && (
                                    <a
                                        href={innovation.productVideo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        View Product Video
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InnovationDetail;
