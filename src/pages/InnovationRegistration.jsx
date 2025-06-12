import React, { useState, useEffect } from 'react';
import AppBar from '../components/Appbar.jsx';
import { getInnovationsByInventor, createInnovation } from '../services/innovationService';

const InnovationRegistration = () => {
    const inventorId = 1; // Hardcoded inventor ID
    const [formData, setFormData] = useState({
        productDescription: '',
        capital: '',
        modeOfSale: 'DIRECT',
        costDescription: '',
        expectedCapital: '',
        breakupRevenue: '',
        paymentPackage: 'STANDARD',
        bidStartTime: '',
        bidEndTime: '',
        bidStartDate: '',
        aoi: [],
        productVideo: '',
        salesData: []
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVideoUploading, setIsVideoUploading] = useState(false); // Track video upload status

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsVideoUploading(true); // Disable the button
            setSuccessMessage('Video is uploading...'); // Display uploading message

            // Fetch the number of existing innovations
            const innovations = await getInnovationsByInventor(inventorId);
            const innovationCount = innovations.length;

            // Generate the signed URL dynamically
            const signedUrl = `https://storage.googleapis.com/product_video/${inventorId}/innovation_${innovationCount + 1}`;

            const uploadResponse = await fetch(signedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type
                },
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload video');
            }

            const publicUrl = `${signedUrl.split('?')[0]}?timestamp=${Date.now()}`;
            setFormData((prev) => ({ ...prev, productVideo: publicUrl }));
            setSuccessMessage('Product video uploaded successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Video upload failed:', error);
            setError('Failed to upload product video');
        } finally {
            setIsVideoUploading(false); // Enable the button
        }
    };

    const validateSalesData = (salesDataString) => {
        // Ensure commas are properly handled
        const salesDataArray = salesDataString.split(',').map((item) => item.trim());
        const invalidItems = salesDataArray.filter((item) => item === '' || isNaN(parseInt(item, 10)));

        if (invalidItems.length > 0) {
            return {
                isValid: false,
                message: `Invalid values: ${invalidItems.join(', ')}. Please enter comma-separated integers.`
            };
        }

        return { isValid: true, salesData: salesDataArray.map((item) => parseInt(item, 10)) };
    };

    const handleSalesDataBlur = (e) => {
        const { value } = e.target;
        const validationResult = validateSalesData(value);

        if (!validationResult.isValid) {
            setError(validationResult.message);
        } else {
            setError('');
            setFormData((prev) => ({
                ...prev,
                salesData: validationResult.salesData
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await createInnovation({
                ...formData,
                inventorId
            });
            setSuccessMessage('Innovation registered successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            setFormData({
                productDescription: '',
                capital: '',
                modeOfSale: 'DIRECT',
                costDescription: '',
                expectedCapital: '',
                breakupRevenue: '',
                paymentPackage: 'STANDARD',
                bidStartTime: '',
                bidEndTime: '',
                bidStartDate: '',
                aoi: [],
                productVideo: '',
                salesData: []
            });
        } catch (error) {
            console.error('Innovation registration failed:', error);
            setError(`Failed to register innovation: ${error.message}`); // Display reason in red
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AppBar position="static">
                <div>Header</div>
            </AppBar>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Innovation Registration</h1>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg mb-4">
                            {successMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                            <textarea
                                name="productDescription"
                                value={formData.productDescription}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                required
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Capital ($)</label>
                                <input
                                    type="number"
                                    name="capital"
                                    value={formData.capital}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Capital ($)</label>
                                <input
                                    type="number"
                                    name="expectedCapital"
                                    value={formData.expectedCapital}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Breakup Revenue ($)</label>
                                <input
                                    type="number"
                                    name="breakupRevenue"
                                    value={formData.breakupRevenue}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Description</label>
                                <textarea
                                    name="costDescription"
                                    value={formData.costDescription}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Data</label>
                                <input
                                    type="text"
                                    name="salesData"
                                    value={formData.salesData.join(', ')}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, salesData: e.target.value.split(',').map((item) => item.trim()) }))}
                                    onBlur={handleSalesDataBlur}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    placeholder="Comma-separated integers"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mode of Sale</label>
                                <select
                                    name="modeOfSale"
                                    value={formData.modeOfSale}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                >
                                    <option value="DIRECT">Direct</option>
                                    <option value="SHARED">Shared</option>
                                    <option value="PARTNERSHIP">Partnership</option>
                                    <option value="LICENSE">License</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Package</label>
                                <select
                                    name="paymentPackage"
                                    value={formData.paymentPackage}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                >
                                    <option value="STANDARD">Standard</option>
                                    <option value="PREMIUM">Premium</option>
                                    <option value="ENTERPRISE">Enterprise</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bid Start Date</label>
                                <input
                                    type="date"
                                    name="bidStartDate"
                                    value={formData.bidStartDate}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bid Start Time</label>
                                <input
                                    type="time"
                                    name="bidStartTime"
                                    value={formData.bidStartTime}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bid End Time</label>
                                <input
                                    type="time"
                                    name="bidEndTime"
                                    value={formData.bidEndTime}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
                            <input
                                type="text"
                                name="aoi"
                                value={formData.aoi.join(', ')}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        aoi: e.target.value.split(',').map((item) => item.trim())
                                    }))
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                placeholder="Comma-separated values"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Video</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                disabled={isSubmitting || isVideoUploading}
                            >
                                {isSubmitting ? 'Submitting...' : 'Register Innovation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default InnovationRegistration;
