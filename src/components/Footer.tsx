import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <img
        src="/logo.png"
        alt="stockflow"
        className="h-10 md:h-12 mx-auto mb-6"
      />
      <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
        Het beste gratis voorraadbeheerprogramma voor Vlaamse KMO's. 
        Eenvoudig, veilig en zonder verborgen kosten.
      </p>

      <div className="flex justify-center space-x-10 mb-10">
        <Link
          to="/voorraadbeheer-tips"
          className="text-blue-400 hover:text-blue-300 text-sm md:text-base transition-colors duration-200"
        >
          Tips
        </Link>
        <Link
          to="/voorraadbeheer-software-vergelijken"
          className="text-blue-400 hover:text-blue-300 text-sm md:text-base transition-colors duration-200"
        >
          Vergelijking
        </Link>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <p className="text-gray-500 text-xs md:text-sm">
          &copy; {new Date().getFullYear()} stockflow. Alle rechten voorbehouden. 
          Gratis voorraadbeheer voor Vlaamse KMO's.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
