import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  Clock, 
  Heart,
  Zap,
  Globe,
  Coffee,
  Laptop,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import SEO from '@/components/SEO';

const openPositions = [
  {
    title: 'Senior Frontend Developer',
    location: 'Remote / Brussels',
    type: 'Full-time',
    department: 'Engineering',
    experience: '3-5 years',
    description: 'Build amazing user experiences with React, TypeScript, and modern web technologies.',
    requirements: [
      '3+ years of React/TypeScript experience',
      'Experience with modern build tools (Vite, Webpack)',
      'Strong understanding of web performance',
      'Experience with testing frameworks'
    ]
  },
  {
    title: 'Product Manager',
    location: 'Brussels',
    type: 'Full-time',
    department: 'Product',
    experience: '2-4 years',
    description: 'Shape the future of inventory management by leading product strategy and development.',
    requirements: [
      '2+ years in product management',
      'Experience with B2B SaaS products',
      'Strong analytical and communication skills',
      'Experience with agile development'
    ]
  },
  {
    title: 'Customer Success Manager',
    location: 'Remote / Brussels',
    type: 'Full-time',
    department: 'Customer Success',
    experience: '1-3 years',
    description: 'Help our customers succeed and grow with StockFlow through exceptional support.',
    requirements: [
      '1+ years in customer success or support',
      'Excellent communication skills',
      'Experience with SaaS platforms',
      'Problem-solving mindset'
    ]
  },
  {
    title: 'Backend Developer',
    location: 'Remote',
    type: 'Full-time',
    department: 'Engineering',
    experience: '2-4 years',
    description: 'Build scalable backend services and APIs that power our inventory management platform.',
    requirements: [
      '2+ years of backend development experience',
      'Experience with Node.js/Python/Go',
      'Database design and optimization',
      'API design and development'
    ]
  }
];

const benefits = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and wellness programs'
  },
  {
    icon: <Laptop className="h-6 w-6" />,
    title: 'Remote Work',
    description: 'Work from anywhere with flexible remote options'
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Learning Budget',
    description: 'Annual budget for courses, conferences, and books'
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Travel Opportunities',
    description: 'Team retreats and conference attendance'
  },
  {
    icon: <Coffee className="h-6 w-6" />,
    title: 'Flexible Hours',
    description: 'Work-life balance with flexible scheduling'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Great Team',
    description: 'Work with talented, passionate people'
  }
];

const companyValues = [
  {
    title: 'Innovation',
    description: 'We constantly push boundaries and embrace new technologies to solve real business problems.'
  },
  {
    title: 'Customer Focus',
    description: 'Our customers success is our success. We build features that truly matter to their business.'
  },
  {
    title: 'Transparency',
    description: 'Open communication, honest feedback, and clear expectations in everything we do.'
  },
  {
    title: 'Growth',
    description: 'We invest in our people with learning opportunities and career development paths.'
  }
];

export default function CareersPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Careers - StockFlow",
    "description": "Join the StockFlow team. We're building the future of inventory management with talented people who share our vision.",
    "url": "https://www.stockflow.be/careers",
    "mainEntity": {
      "@type": "Organization",
      "name": "StockFlow",
      "description": "Inventory management software company"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Careers - StockFlow"
        description="Join the StockFlow team. Open positions for developers, product managers, and customer success. Remote-friendly company with great benefits."
        keywords="careers, jobs, employment, remote work, developer jobs, product manager, customer success, Brussels, Belgium"
        url="https://www.stockflow.be/careers"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-green-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              We're building the future of inventory management. Join us in creating software that helps businesses grow and succeed.
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              View Open Positions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Company Values */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="text-center p-6">
                <CardHeader>
                  <CardTitle className="text-xl mb-3">{value.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {value.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
            <p className="text-xl text-gray-600">Great benefits and a supportive work environment</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">Join our growing team</p>
          </div>
          
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {position.type}
                        </Badge>
                        <Badge variant="outline">{position.department}</Badge>
                        <Badge variant="outline">{position.experience}</Badge>
                      </div>
                    </div>
                    <Button className="lg:ml-4">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{position.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {position.requirements.map((requirement, reqIndex) => (
                        <li key={reqIndex} className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our Culture
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We believe in creating an environment where everyone can do their best work and grow their career.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-blue-100">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Remote Friendly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Application Process</h2>
            <p className="text-xl text-gray-600">Simple and transparent hiring process</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Apply</h3>
              <p className="text-gray-600 text-sm">Submit your application with resume and cover letter</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Initial Review</h3>
              <p className="text-gray-600 text-sm">We review your application within 3-5 business days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Interview</h3>
              <p className="text-gray-600 text-sm">Video interview with the team (1-2 rounds)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Decision</h3>
              <p className="text-gray-600 text-sm">We make a decision within 1 week of final interview</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Don't See Your Role?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for talented people. Send us your resume and tell us how you'd like to contribute.
          </p>
          <Button size="lg">
            <Mail className="mr-2 h-5 w-5" />
            Send Us Your Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
