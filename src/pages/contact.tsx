import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { logger } from '../lib/logger';
import { Header } from '@/components/HeaderPublic';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// A reusable component for fade-in animations when scrolling
const FadeInWhenVisible = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
    >
      {children}
    </motion.div>
  );
};

type ContactFormValues = { 
  name: string; 
  email: string; 
  subject: string;
  message: string; 
};

export default function ContactPage() {
  usePageRefresh();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    defaultValues: { name: '', email: '', subject: '', message: '' }
  });

  // Handle subject from URL parameter (e.g., from business tier)
  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      const formattedSubject = subjectParam === 'business-tier' 
        ? 'Business Tier Inquiry' 
        : subjectParam;
      setSelectedSubject(formattedSubject);
      setValue('subject', formattedSubject);
    }
  }, [searchParams, setValue]);

  const onSubmitContact = async (values: ContactFormValues) => {
    try {
      // Validate subject is selected
      if (!values.subject || values.subject.trim() === '') {
        alert('Please select a subject for your inquiry.');
        return;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) throw new Error('Failed to send');
      
      // Reset form and selected subject
      reset();
      setSelectedSubject('');
      
      logger.info('Contact message sent', { email: values.email, subject: values.subject });
      alert('Thank you! We will contact you soon. We typically respond within 1 hour during business hours.');
    } catch (e) {
      console.error('Contact form error:', e);
      alert('Sending failed. Please try again or email us directly at info@stockflow.be');
    }
  };

  // Structured data for contact page to help with sitelinks
  const structuredData = generateComprehensiveStructuredData(
    'contact',
    {
      title: 'Contact StockFlow - Support & Vragen',
      url: 'https://www.stockflow.be/contact',
      description: 'Neem contact op met ons team. We beantwoorden meestal binnen 1 uur. Vragen over voorraadbeheer, demo\'s of support.',
      breadcrumbs: [
        { name: 'Home', url: 'https://www.stockflow.be', position: 1 },
        { name: 'Contact', url: 'https://www.stockflow.be/contact', position: 2 }
      ]
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
      <SEO
        title="Contact StockFlow - Support & Vragen"
        description="Neem contact op met ons team. We beantwoorden meestal binnen 1 uur. Vragen over voorraadbeheer, demo's of support? Contact StockFlow voor hulp."
        keywords="stockflow contact, voorraadbeheer support, inventory management help, contact, klantenservice, hulp, demo aanvragen"
        url="https://www.stockflow.be/contact"
        structuredData={structuredData}
      />
      <Header 
        onLoginClick={() => navigate('/auth?mode=login')}
        onNavigate={() => {}}
        simplifiedNav={false}
        hideNotifications={true}
      />
      {/* Hero Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeInWhenVisible>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageCircle className="h-4 w-4" />
              <span>Get in Touch</span>
            </div>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible>
            <h1 className="text-5xl md:text-7xl font-light mb-6 text-gray-800">
              Questions? Contact us
            </h1>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We usually respond within 1 hour. Get in touch with our team for support, sales inquiries, or general questions.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <FadeInWhenVisible>
                <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-indigo-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">support@stockflow.be</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-indigo-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">+32 XXX XXX XXX</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-indigo-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">Belgium</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-800">
                      <strong>Response Time:</strong> We usually respond within 1 hour during business hours.
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <FadeInWhenVisible>
                <Card className="shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
                    
                    <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <Input 
                            {...register('name', { required: true, minLength: 2 })} 
                            placeholder="Your name" 
                            className="h-12 text-base"
                          />
                          {errors.name && <p className="text-sm text-red-600 mt-1">Name is required</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <Input 
                            type="email" 
                            {...register('email', { required: true, pattern: /.+@.+\..+/ })} 
                            placeholder="your@email.com" 
                            className="h-12 text-base"
                          />
                          {errors.email && <p className="text-sm text-red-600 mt-1">Email is required</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <Select
                          value={selectedSubject}
                          onValueChange={(value) => {
                            setSelectedSubject(value);
                            setValue('subject', value);
                          }}
                        >
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                            <SelectItem value="Business Tier Inquiry">Business Tier / Enterprise</SelectItem>
                            <SelectItem value="Technical Support">Technical Support</SelectItem>
                            <SelectItem value="Sales Question">Sales Question</SelectItem>
                            <SelectItem value="Demo Request">Demo Request</SelectItem>
                            <SelectItem value="Partnership">Partnership Opportunity</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.subject && <p className="text-sm text-red-600 mt-1">Please select a subject</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <Textarea 
                          rows={6} 
                          {...register('message', { required: true, minLength: 10 })} 
                          placeholder="Write your message here..." 
                          className="text-base"
                        />
                        {errors.message && <p className="text-sm text-red-600 mt-1">Message is required (minimum 10 characters)</p>}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting} 
                          className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 text-base font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 border border-indigo-500/20"
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <img
                src="/logo.png"
                alt="stockflow"
                className="h-10 md:h-12 mb-6"
                loading="lazy"
                decoding="async"
              />
              <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed max-w-2xl">
                The best free inventory management software for SMEs. 
                Simple, secure and without hidden costs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} stockflow. All rights reserved. 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
