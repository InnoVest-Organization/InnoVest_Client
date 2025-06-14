import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/payment/card.jsx';
import { Button } from '../components/payment/button';
import { XCircle, RefreshCw, Mail, ArrowLeft, CreditCard } from 'lucide-react';

const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [failureReason, setFailureReason] = useState('');
    const [loading, setLoading] = useState(true);

    const sessionId = searchParams.get('session_id');
    const error = searchParams.get('error');

    useEffect(() => {
        // Simulate determining failure reason
        setTimeout(() => {
            if (error) {
                setFailureReason(getFailureReason(error));
            } else {
                setFailureReason('Payment was cancelled or failed to process.');
            }
            setLoading(false);
        }, 500);
    }, [error]);

    const getFailureReason = (errorCode) => {
        const errorMessages = {
            'card_declined': 'Your card was declined. Please try a different payment method.',
            'insufficient_funds': 'Insufficient funds. Please check your account balance.',
            'expired_card': 'Your card has expired. Please use a different card.',
            'incorrect_cvc': 'The security code (CVC) is incorrect.',
            'processing_error': 'There was an error processing your payment.',
            'cancelled': 'Payment was cancelled.',
            'timeout': 'Payment session timed out.'
        };
        return errorMessages[errorCode] || 'Payment failed due to an unknown error.';
    };

    const handleRetryPayment = () => {
        navigate('/payment');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleContactSupport = () => {
        window.location.href = 'mailto:support@innovest.com?subject=Payment Issue&body=Session ID: ' + (sessionId || 'N/A');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing payment status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br bg-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Failure Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <XCircle className="h-16 w-16 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                    <p className="text-xl text-gray-600">
                        We couldn't process your payment. Don't worry, no charges were made.
                    </p>
                </div>

                {/* Error Details Card */}
                <Card className="mb-8 shadow-lg border-red-200">
                    <CardHeader className="bg-red-50">
                        <CardTitle className="text-center text-red-800">What Happened?</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-lg text-gray-700 mb-4">{failureReason}</p>
                            {sessionId && (
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm text-gray-500">Reference ID</p>
                                    <p className="font-mono text-sm text-gray-700">{sessionId}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Common Solutions */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Common Solutions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Check Your Card Details</h3>
                                    <p className="text-gray-600">Ensure your card number, expiry date, and security code are correct.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <span className="text-xs font-semibold text-blue-600">$</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Check Available Balance</h3>
                                    <p className="text-gray-600">Make sure you have sufficient funds in your account.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <span className="text-xs font-semibold text-blue-600">🏦</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Contact Your Bank</h3>
                                    <p className="text-gray-600">Your bank might be blocking the transaction for security reasons.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <span className="text-xs font-semibold text-blue-600">💳</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Try a Different Card</h3>
                                    <p className="text-gray-600">Use an alternative payment method if available.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                        onClick={handleRetryPayment}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
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
                        onClick={handleGoBack}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                </div>


                {/* Support Information */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 mb-2">
                        Need immediate assistance?
                    </p>
                    <p className="text-sm text-gray-600">
                        📧 support@innovest.com | 📞 +94-775678345 -INNOVEST
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Our support team is available 24/7 to help resolve payment issues.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
