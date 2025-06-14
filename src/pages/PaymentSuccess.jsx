import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/payment/card.jsx';
import { Button } from '../components/payment/button';
import { CheckCircle, Download, Mail, Home } from 'lucide-react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            fetch(`http://localhost:5003/api/payments/details?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    setPaymentDetails(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [sessionId]);


    const handleDownloadReceipt = async () => {
        alert("This feature will be availbale on next update!");
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleContactSupport = () => {
        // Implement contact support functionality
        window.location.href = 'mailto:support@innovest.com?subject=Payment Confirmation';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Confirming your payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br bg-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-xl text-gray-600">
                        Thank you for your purchase. Your payment has been processed successfully.
                    </p>
                </div>

                {/* Payment Details Card */}
                {paymentDetails && (
                    <Card className="mb-8 shadow-lg">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="text-center text-green-800">Payment Confirmation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Payment Date/Time</p>
                                    <p className="text-sm font-medium text-gray-900">{paymentDetails.paymentDatetime}</p>
                                </div>
                                <div></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                                    <p className="text-sm font-medium text-gray-900">{paymentDetails.paymentIntentId}</p>
                                </div>
                                {/*<div>*/}
                                {/*    <p className="text-sm font-medium text-gray-500">Amount Paid</p>*/}
                                {/*    <p className="text-lg font-semibold text-gray-900">{paymentDetails.amount}</p>*/}
                                {/*</div>*/}
                                {/*<div>*/}
                                {/*    <p className="text-sm font-medium text-gray-500">Package</p>*/}
                                {/*    <p className="text-lg font-semibold text-gray-900">{paymentDetails.packageName}</p>*/}
                                {/*</div>*/}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Next Steps */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>What's Next?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-blue-600">1</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Confirmation Email</h3>
                                    <p className="text-gray-600">You'll receive a confirmation email with your receipt and next steps within 5 minutes.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-blue-600">2</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Expert Review</h3>
                                    <p className="text-gray-600">Our patent experts will begin reviewing your invention within 24 hours.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-blue-600">3</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Progress Updates</h3>
                                    <p className="text-gray-600">We'll keep you informed throughout the patent application process.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={handleDownloadReceipt}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download Receipt
                    </Button>
                    <Button
                        onClick={handleContactSupport}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Mail className="h-4 w-4" />
                        Contact Support
                    </Button>
                    <Button
                        onClick={handleGoHome}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Go to Dashboard
                    </Button>
                </div>

                {/* Support Information */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 mb-2">
                        Need help? Contact our support team
                    </p>
                    <p className="text-sm text-gray-600">
                        📧 support@innovest.com | 📞+94-775678345 -INNOVEST
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
