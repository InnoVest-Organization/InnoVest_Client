import React from 'react';
import { Button } from '../components/SuccessStory/ui';
import { Star, User, Quote } from 'lucide-react';
import { SuccessStorySection } from '../components/SuccessStory';

const About = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br bg-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">About InnoVest</h1>
                    <p></p>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                        InnoVest is dedicated to helping inventors protect and commercialize their innovations.
                        We provide comprehensive patent services and connect inventors with investors to bring
                        groundbreaking ideas to life.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
                            <p className="text-gray-600">Professional patent experts guide you through every step</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Investor Network</h3>
                            <p className="text-gray-600">Connect with investors ready to fund your innovation</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Quote className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Success Stories</h3>
                            <p className="text-gray-600">Join hundreds of successful inventors and entrepreneurs</p>
                        </div>
                    </div>
                </div>

                {/* Success Stories Section */}
                <SuccessStorySection />

                {/* Company Stats */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Impact</h2>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-gray-600">Patents Filed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">$50M+</div>
                            <div className="text-gray-600">Funding Raised</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">200+</div>
                            <div className="text-gray-600">Success Stories</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
                            <div className="text-gray-600">Success Rate</div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Started Today</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Ready to protect your innovation and connect with investors?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                        >
                            Start Your Patent Journey
                        </Button>
                        <Button
                            variant="outline"
                            className="px-8 py-3 text-lg"
                            onClick={() => window.location.href = 'mailto:contact@innovest.com'}
                        >
                            Contact Us
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
