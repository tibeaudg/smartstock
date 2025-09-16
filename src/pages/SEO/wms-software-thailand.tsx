import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import SeoPageLayout from '@/components/SeoPageLayout';
import SEO from '@/components/SEO';
import { generateHreflangUrls, generateInternationalStructuredData, getCountryKeywords, getWMSKeywords } from '@/utils/seoUtils';
import { Package, BarChart3, Users, Shield, Check, TrendingUp, Zap, Star, Clock, Euro, Target, Scan, Truck, ArrowRight, Play, Award, Globe, Smartphone, CheckCircle, MessageCircle, Rocket, Crown, Sparkles, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/OptimizedImage';

export default function WMSSoftwareThailand() {
  usePageRefresh();
  const { t } = useTranslation();
  
  const baseUrl = 'https://www.stockflow.be';
  const language = 'th';
  const hreflangUrls = generateHreflangUrls(baseUrl, '/wms-software-thailand');
  const structuredData = generateInternationalStructuredData(language, baseUrl);
  const countryKeywords = getCountryKeywords(language);
  const wmsKeywords = getWMSKeywords(language);

  const faqData = [
    {
      question: "ทำไมต้องเลือก StockFlow ในประเทศไทย?",
      answer: "StockFlow เป็นระบบจัดการคลังสินค้าที่ดีที่สุดในประเทศไทย พัฒนาเฉพาะสำหรับธุรกิจไทย ใช้งานฟรี ง่ายต่อการใช้งาน และรองรับภาษาไทยอย่างสมบูรณ์"
    },
    {
      question: "StockFlow ฟรีในประเทศไทยหรือไม่?",
      answer: "ใช่ StockFlow ฟรีสำหรับธุรกิจไทยโดยสมบูรณ์ ไม่มีค่าใช้จ่ายแอบแฝง ค่าสมัครสมาชิก หรือข้อจำกัด เริ่มใช้งานได้ทันที"
    },
    {
      question: "StockFlow มีฟีเจอร์อะไรบ้างในประเทศไทย?",
      answer: "StockFlow ในประเทศไทยให้บริการระบบจัดการคลังสินค้าครบครัน: สแกนบาร์โค้ด ติดตามสต็อกแบบเรียลไทม์ คำนวณใหม่อัตโนมัติ รายงานและวิเคราะห์ และการเข้าถึงผ่านมือถือ"
    },
    {
      question: "เริ่มใช้ StockFlow ในประเทศไทยอย่างไร?",
      answer: "เพียงลงทะเบียนบนเว็บไซต์ StockFlow สร้างบัญชีของคุณ และเริ่มใช้ระบบจัดการคลังสินค้าได้ทันที ไม่ต้องติดตั้งหรือตั้งค่าซับซ้อน"
    },
    {
      question: "StockFlow รองรับระบบภาษีไทยหรือไม่?",
      answer: "ใช่ StockFlow เข้ากันได้กับระบบภาษีไทยและข้อกำหนดบัญชีท้องถิ่น ง่ายต่อการเชื่อมต่อกับระบบบัญชีที่มีอยู่"
    }
  ];

  return (
    <SeoPageLayout>
      <SEO
        title="ซอฟต์แวร์ WMS ประเทศไทย | StockFlow ระบบจัดการคลังสินค้า"
        description="ซอฟต์แวร์ WMS ที่ดีที่สุดในประเทศไทย ระบบจัดการคลังสินค้าฟรีสำหรับธุรกิจไทย สแกนบาร์โค้ด ติดตามสต็อกแบบเรียลไทม์ และจัดการคลังสินค้าอัตโนมัติ"
        keywords={[...countryKeywords, ...wmsKeywords].join(', ')}
        url={`${baseUrl}/wms-software-thailand`}
        hreflang={hreflangUrls}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                ซอฟต์แวร์ WMS <span className="text-blue-600">ประเทศไทย</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                ซอฟต์แวร์ WMS ที่ดีที่สุดในประเทศไทย ระบบจัดการคลังสินค้าฟรีสำหรับธุรกิจไทย
                สแกนบาร์โค้ด ติดตามสต็อกแบบเรียลไทม์ และจัดการคลังสินค้าอัตโนมัติ
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                <Rocket className="h-5 w-5 mr-2" />
                เริ่มใช้งานฟรี
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 px-8 py-4">
                <Play className="h-5 w-5 mr-2" />
                ดูเดโม
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">4.8/5 จากรีวิว</span>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-gray-600">32+ ผู้ใช้งาน</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ทำไมต้องเลือก StockFlow ในประเทศไทย?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ระบบจัดการคลังสินค้าที่ทันสมัยที่สุดในประเทศไทย พัฒนาเฉพาะสำหรับธุรกิจไทย
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Scan className="h-8 w-8 text-blue-600" />,
                title: "สแกนบาร์โค้ด",
                description: "การระบุสินค้าอย่างรวดเร็วและแม่นยำด้วยการสแกนบาร์โค้ด กำลังการประมวลผลมากกว่า 1000 สินค้า/ชั่วโมง"
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                title: "วิเคราะห์แบบเรียลไทม์",
                description: "รายงานและวิเคราะห์ที่ละเอียดเกี่ยวกับประสิทธิภาพของคลังสินค้า แดชบอร์ดและรายงานภาษาไทย"
              },
              {
                icon: <Smartphone className="h-8 w-8 text-blue-600" />,
                title: "เข้าถึงผ่านมือถือ",
                description: "จัดการคลังสินค้าจากที่ไหนก็ได้ด้วยอุปกรณ์มือถือ ฟังก์ชันครบถ้วนบน iOS และ Android"
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "ระบบภาษีไทย",
                description: "เข้ากันได้กับระบบภาษีไทยและข้อกำหนดบัญชีท้องถิ่น การเชื่อมต่อกับกรมสรรพากร"
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "หลายผู้ใช้",
                description: "การเข้าถึงผู้ใช้ไม่จำกัด สิทธิ์ตามบทบาทและการติดตามการตรวจสอบ"
              },
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: "ระบบอัตโนมัติ",
                description: "การคำนวณสต็อกใหม่อัตโนมัติ จุดสั่งซื้อและการแจ้งเตือน การทำงานอัตโนมัติ"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              คำถามที่พบบ่อย
            </h2>
            <p className="text-xl text-gray-600">
              ทุกสิ่งที่คุณต้องรู้เกี่ยวกับระบบจัดการคลังสินค้า StockFlow ในประเทศไทย
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              พร้อมที่จะเปลี่ยนแปลงการจัดการคลังสินค้าของคุณในประเทศไทยแล้วหรือยัง?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              เข้าร่วมกับธุรกิจไทยหลายพันแห่งที่ใช้ StockFlow อยู่แล้ว
              ลงทะเบียนฟรี ใช้งานได้ทันที
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
              <Rocket className="h-5 w-5 mr-2" />
              เริ่มทดลองใช้ฟรี
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </SeoPageLayout>
  );
}
