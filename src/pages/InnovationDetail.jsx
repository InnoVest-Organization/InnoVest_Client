import React, { useEffect, useState } from 'react';
import AppBar from '../components/Appbar.jsx';
import { getInnovationDetail } from '../services/innovationService';

const InnovationDetail = () => {
    const inventionId = 4010; // Hardcoded invention ID
    const [innovation, setInnovation] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInnovationDetail = async () => {
            try {
                const data = await getInnovationDetail(inventionId);
                setInnovation(data);
            } catch (err) {
                setError('Failed to fetch innovation details.');
            }
        };

        fetchInnovationDetail();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppBar position="static">
                    <div>Header</div>
                </AppBar>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!innovation) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppBar position="static">
                    <div>Header</div>
                </AppBar>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-gray-600">Loading innovation details...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar position="static">
                <div>Header</div>
            </AppBar>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Innovation Details</h1>
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Invention ID</h2>
                        <p className="text-gray-900">{innovation.inventionId}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Inventor ID</h2>
                        <p className="text-gray-900">{innovation.inventorId}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Product Description</h2>
                        <p className="text-gray-900">{innovation.productDescription}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Capital</h2>
                        <p className="text-gray-900">${innovation.capital.toLocaleString()}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Sales Data</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {innovation.salesData.map((sale, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-xs text-gray-500">Month {index + 1}</div>
                                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                                        ${sale.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Mode of Sale</h2>
                        <p className="text-gray-900">{innovation.modeOfSale}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Cost Description</h2>
                        <p className="text-gray-900">{innovation.costDescription}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Expected Capital</h2>
                        <p className="text-gray-900">${innovation.expectedCapital.toLocaleString()}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Breakup Revenue</h2>
                        <p className="text-gray-900">${innovation.breakupRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Payment Package</h2>
                        <p className="text-gray-900">{innovation.paymentPackage}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Bid Start Date</h2>
                        <p className="text-gray-900">{new Date(innovation.bidStartDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Bid Start Time</h2>
                        <p className="text-gray-900">{innovation.bidStartTime}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Bid End Time</h2>
                        <p className="text-gray-900">{innovation.bidEndTime}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Areas of Interest</h2>
                        <div className="flex flex-wrap gap-2">
                            {innovation.aoi.map((area, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>
                    {innovation.productVideo && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Product Video</h2>
                            <a
                                href={innovation.productVideo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                View Product Video
                            </a>
                        </div>
                    )}
                    <div className="mt-4">
                        {innovation.isLive ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Is Live</span>
                        ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Not Live</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InnovationDetail;
