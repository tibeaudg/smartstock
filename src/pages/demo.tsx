import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Header } from '@/components/HeaderPublic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { logger } from '../lib/logger';
import { GoogleAdsTracking } from '@/utils/googleAdsTracking';
import Footer from '@/components/Footer';

// Fade-in animation component
const FadeInWhenVisible = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};

type ContactFormValues = { 
  name: string; 
  email: string; 
  company?: string;
  phone?: string;
  message: string; 
};

export const DemoPage = () => {
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    defaultValues: { name: '', email: '', company: '', phone: '', message: '' }
  });

  const onSubmitContact = async (values: ContactFormValues) => {
    try {
      // Track Google Ads conversion for contact form submission
      try {
        GoogleAdsTracking.trackContactFormConversion(
          'demo_contact_form',
          values.email,
          10 // Higher value for demo page contacts
        );
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Google Ads tracking failed:', error);
        }
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (!res.ok) throw new Error('Failed to send');
      
      reset();
      setSubmitStatus('success');
      logger.info('Contact form submitted from demo page', { email: values.email });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (e) {
      setSubmitStatus('error');
      logger.error('Contact form submission failed', { error: e });
      
      // Reset error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us - Get in Touch with StockFlow"
        description="Have questions about StockFlow inventory management? Contact our team for personalized support, demos, and pricing information. We're here to help your business succeed."
        keywords="contact StockFlow, inventory management support, get demo, pricing questions, customer support"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
        <Header 
          onLoginClick={() => navigate('/auth?mode=login')}
          onNavigate={() => {}}
          simplifiedNav={false}
          hideNotifications={true}
        />
        
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Get in Touch with Us
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Have questions about StockFlow? We're here to help you find the perfect inventory management solution for your business.
                </p>
              </div>
            </FadeInWhenVisible>

            {/* Contact Methods */}
            <FadeInWhenVisible delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <Card className="bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600 text-sm mb-3">Send us an email anytime</p>
                    <a href="mailto:info@stockflow.be" className="text-blue-600 hover:text-blue-700 font-medium">
                      info@stockflow.be
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600 text-sm mb-3">Mon-Fri 9AM-6PM CET</p>
                    <a href="tel:+32123456789" className="text-blue-600 hover:text-blue-700 font-medium">
                      +32 123 456 789
                    </a>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-7 w-7 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
                    <p className="text-gray-600 text-sm mb-3">We typically respond within</p>
                    <p className="text-blue-600 font-medium">
                      5 minutes
                    </p>
                  </CardContent>
                </Card>
              </div>
            </FadeInWhenVisible>

            {/* Contact Form */}
            <FadeInWhenVisible delay={400}>
              <div className="max-w-3xl mx-auto">
                <Card className="bg-white shadow-xl">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                        <p className="text-gray-600">Fill out the form below and we'll get back to you shortly</p>
                      </div>
                    </div>

                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-800 font-medium">
                          Thank you! We've received your message and will contact you soon.
                        </p>
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <p className="text-red-800 font-medium">
                          Oops! Something went wrong. Please try again or email us directly.
                        </p>
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <Input 
                            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })} 
                            placeholder="Your full name" 
                            className="h-12 text-base"
                            disabled={isSubmitting}
                          />
                          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <Input 
                            type="email" 
                            {...register('email', { 
                              required: 'Email is required', 
                              pattern: { 
                                value: /.+@.+\..+/, 
                                message: 'Please enter a valid email' 
                              } 
                            })} 
                            placeholder="your@email.com" 
                            className="h-12 text-base"
                            disabled={isSubmitting}
                          />
                          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <Input 
                            {...register('company')} 
                            placeholder="Your company" 
                            className="h-12 text-base"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <Input 
                            type="tel" 
                            {...register('phone')} 
                            placeholder="+32 123 456 789" 
                            className="h-12 text-base"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea 
                          rows={6} 
                          {...register('message', { 
                            required: 'Message is required', 
                            minLength: { 
                              value: 10, 
                              message: 'Message must be at least 10 characters' 
                            } 
                          })} 
                          placeholder="Tell us about your inventory management needs, questions, or how we can help..." 
                          className="text-base resize-none"
                          disabled={isSubmitting}
                        />
                        {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                        <p className="text-sm text-gray-500">
                          <span className="text-red-500">*</span> Required fields
                        </p>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </FadeInWhenVisible>

            {/* Additional Info */}
            <FadeInWhenVisible delay={600}>
              <div className="mt-16 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Prefer to Start Right Away?
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  You can sign up for free and start managing your inventory in minutes. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/pricing')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    onClick={() => navigate('/pricing')}
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
                  >
                    View Pricing
                  </Button>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default DemoPage;
