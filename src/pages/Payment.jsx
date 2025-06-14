import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/payment/card.jsx';
import { Button } from '../components/payment/button';
import { Input } from '../components/payment/input';
import { Label } from '../components/payment/label';
import { Check, Star, Crown, Building } from 'lucide-react';
import { toast } from 'sonner';
import StandardImage from '../assets/payment/Standard.png';
import EnterpriseImage from '../assets/payment/Enterprise.png';
import PremiumImage from '../assets/payment/Premium.png';

const Payment = () => {
    const [selectedPlan, setSelectedPlan] = useState('');
    const [inventionId, setInventionId] = useState('');
    const [inventorEmail, setInventorEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const pricingPlans = [
        {
            name: 'Standard',
            price: 100,
            icon: <Star className="h-6 w-6 text-blue-600" />,
            image: StandardImage,
            features: [
                'Basic patent search',
                'Standard documentation',
                'Email support',
                'Basic filing assistance',
                '30-day review period'
            ]
        },
        {
            name: 'Enterprise',
            price: 250,
            icon: <Building className="h-6 w-6 text-green-600" />,
            image: EnterpriseImage,
            features: [
                'Comprehensive patent search',
                'Professional documentation',
                'Priority email support',
                'Advanced filing assistance',
                'Patent landscape analysis',
                '60-day review period',
            ],
            popular: true
        },
        {
            name: 'Premium',
            price: 500,
            icon: <Crown className="h-6 w-6 text-purple-600" />,
            image: PremiumImage,
            features: [
                'Full patent search & analysis',
                'Expert document preparation',
                '24/7 dedicated support',
                'Complete landscape analysis',
                'International filing options',
                '90-day review period',
                'Legal consultation included'
            ]
        }
    ];

    const handlePayment = async () => {
        if (!selectedPlan || !inventionId || !inventorEmail) {
            toast.error('Please fill in all required fields and select a plan');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:5003/api/payments/${inventionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Payment_Package: selectedPlan,
                    Inventor_Email: inventorEmail,
                }),
            });

            const data = await response.json();

            if (response.ok && data.session_url) {
                // Redirect to Stripe Checkout
                window.location.href = data.session_url;
                toast.success('Redirecting to payment...');
            } else {
                toast.error(data.error || 'Payment initialization failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to initialize payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br bg-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Package</h1>
                    <div className="flex items-center max-w-3xl mx-auto mb-4">
                      <div className="flex-grow border-t border-gray-500"></div>
                      <p className="text-base text-gray-600 px-4 whitespace-nowrap">
                        Select the perfect package for your invention
                      </p>
                      <div className="flex-grow border-t border-gray-500"></div>
                    </div>
                </div>


                {/*{Remove this after connecting inventor page}*/}

                {/* Temporary */}
                <div className="max-w-md mx-auto mb-12">
                    <Card className="shadow-lg">
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="inventionId">Invention ID</Label>
                                <Input
                                    id="inventionId"
                                    type="text"
                                    value={inventionId}
                                    onChange={(e) => setInventionId(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={inventorEmail}
                                    onChange={(e) => setInventorEmail(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>


                {/*{Until this }*/}



                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {pricingPlans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl flex flex-col h-full ${
                                selectedPlan === plan.name
                                    ? 'ring-2 ring-blue-500 shadow-xl scale-105'
                                    : 'hover:scale-105'
                            } ${plan.popular ? 'border-2 border-blue-500' : ''}`}
                            onClick={() => setSelectedPlan(plan.name)}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <div className="flex justify-center mb-3">
                                    {plan.icon}
                                </div>
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>

                                {/* Package Image */}
                                <div className="flex justify-center my-4">
                                    <img
                                        src={plan.image}
                                        alt={`${plan.name} Package`}
                                        className="w-24 h-24 object-contain"
                                    />
                                </div>

                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-600 ml-2">one-time</span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-grow">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-6 mt-auto">
                                <Button
                                    className={`w-full ${
                                        selectedPlan === plan.name
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPlan(plan.name);
                                    }}
                                >
                                    {selectedPlan === plan.name ? 'Selected' : 'Select Plan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Proceed to Payment Button */}
                <div className="text-center">
                    <Button
                        size="lg"
                        onClick={handlePayment}
                        disabled={!selectedPlan || !inventionId || !inventorEmail || isLoading}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold"
                    >
                        {isLoading ? 'Processing...' : 'Proceed to Payment'}
                    </Button>

                    {selectedPlan && (
                        <p className="mt-4 text-gray-600">
                            You selected: <span className="font-semibold">{selectedPlan}</span> -
                            ${pricingPlans.find(p => p.name === selectedPlan)?.price}
                        </p>
                    )}
                </div>

                {/* Security Notice */}
                <div className="max-w-2xl mx-auto mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        🔒 Secure payment processing powered by Stripe. Your payment information is encrypted and secure.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;