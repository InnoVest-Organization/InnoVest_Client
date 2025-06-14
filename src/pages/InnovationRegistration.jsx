import React, { useState, useEffect } from 'react';
import AppBar from '../components/Appbar.jsx';
import { getInnovationsByInventor, createInnovation } from '../services/innovationService';
import { toast } from 'sonner';

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
            toast.success('Video uploaded successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Video upload failed:', error);
            setError('Failed to upload product video');
            toast.error('Failed to upload video');
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
            toast.error(validationResult.message);
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
            toast.success('Innovation registered successfully!');
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
            setError(`Failed to register innovation: ${error.message}`);
            toast.error(`Registration failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AppBar position="static">
                <div>Header</div>
            </AppBar>            <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                        <div className="bg-gray-800 py-6 px-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Innovation Registration</h1>
                                    <p className="text-gray-300 mt-2">Register your innovation and connect with potential investors</p>
                                </div>
                                <button 
                                    onClick={() => window.history.back()} 
                                    className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back
                                </button>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="mx-8 mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-700">{error}</span>
                                </div>
                            </div>
                        )}
                        
                        {successMessage && (
                            <div className="mx-8 mt-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-green-700">{successMessage}</span>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                                        <textarea
                                            name="productDescription"
                                            value={formData.productDescription}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
                                            rows="4"
                                            placeholder="Describe your product in detail..."
                                            required
                                        ></textarea>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Capital ($)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="capital"
                                                    value={formData.capital}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Capital ($)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="expectedCapital"
                                                    value={formData.expectedCapital}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Financial Details</h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Breakup Revenue ($)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="breakupRevenue"
                                                    value={formData.breakupRevenue}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Data</label>
                                            <input
                                                type="text"
                                                name="salesData"
                                                value={formData.salesData.join(', ')}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, salesData: e.target.value.split(',').map((item) => item.trim()) }))}
                                                onBlur={handleSalesDataBlur}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
                                                placeholder="100, 200, 300, etc."
                                                required
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Enter comma-separated integers</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cost Description</label>
                                        <textarea
                                            name="costDescription"
                                            value={formData.costDescription}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
                                            rows="3"
                                            placeholder="Describe the cost structure..."
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Sale Options & Scheduling</h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mode of Sale</label>
                                            <select
                                                name="modeOfSale"
                                                value={formData.modeOfSale}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow bg-white"
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
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow bg-white"
                                                required
                                            >
                                                <option value="STANDARD">Standard</option>
                                                <option value="PREMIUM">Premium</option>
                                                <option value="ENTERPRISE">Enterprise</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bid Start Date</label>
                                            <input
                                                type="date"
                                                name="bidStartDate"
                                                value={formData.bidStartDate}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
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
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
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
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Information</h2>
                                <div className="space-y-5">
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
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow"
                                            placeholder="Technology, Healthcare, Education, etc."
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Enter comma-separated values</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Video</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500">
                                                        <span>Upload a video</span>
                                                        <input
                                                            id="video-upload"
                                                            name="video-upload"
                                                            type="file"
                                                            accept="video/*"
                                                            onChange={handleVideoUpload}
                                                            className="sr-only"
                                                            disabled={isVideoUploading}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">MP4, WebM, MOV up to 10MB</p>
                                            </div>
                                        </div>
                                        {formData.productVideo && (
                                            <p className="mt-2 text-sm text-green-600">Video uploaded successfully</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    className="px-6 py-3 mr-4 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        // Reset form logic if needed
                                        if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
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
                                        }
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-md"
                                    disabled={isSubmitting || isVideoUploading}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Registering...
                                        </div>
                                    ) : isVideoUploading ? (
                                        'Uploading Video...'
                                    ) : (
                                        'Register Innovation'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InnovationRegistration;
