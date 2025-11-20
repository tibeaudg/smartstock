import { Link } from 'react-router-dom';
import HeaderPublic from '../components/HeaderPublic';
import Footer from '@/components/Footer';

export default function DemoPage() {
  return (

    <>  
    <HeaderPublic />

    <section id="video-demo" className="py-16 px-4 bg-gray-50 pt-36">
    <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
        See StockFlow in Action
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Watch how the best inventory management software and inventory management systems help businesses automate stock control, prevent stockouts, and reduce costs. See how modern inventory management solutions streamline operations.
        </p>
    </div>
    <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
        <div className="text-center text-white z-10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
            <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
            </svg>
            </div>
            <p className="text-lg font-semibold mb-2">Product Demo Video</p>
            <p className="text-sm text-gray-300">Click to watch 3-minute overview</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-20"></div>
        <div className="absolute inset-0" style={{backgroundImage: 'url(/Inventory-Management.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3}}></div>
        </div>
    </div>
    </div>
    </section>
    
    <Footer />
    </>
  );
}