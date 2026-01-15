import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Stethoscope, Hospital, Activity, User, MapPin, Star, Phone, Clock, Award, Shield, HeartPulse } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import FlipBook from '@/app/components/flip-book';

const bestDoctors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist (दिल के डॉक्टर)",
    location: "Apollo Hospital, Delhi",
    rating: 4.8,
    reviews: 245,
    contact: "+91 98765 43210",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialty: "Pediatrician (बच्चों के डॉक्टर)",
    location: "Max Hospital, Mumbai",
    rating: 4.9,
    reviews: 312,
    contact: "+91 98765 43211",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400"
  },
  {
    id: 3,
    name: "Dr. Amit Patel",
    specialty: "Gastroenterologist (पेट के डॉक्टर)",
    location: "Fortis Hospital, Bangalore",
    rating: 4.7,
    reviews: 198,
    contact: "+91 98765 43212",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400"
  },
  {
    id: 4,
    name: "Dr. Sneha Reddy",
    specialty: "Gynecologist (महिला रोग विशेषज्ञ)",
    location: "AIIMS, New Delhi",
    rating: 4.9,
    reviews: 278,
    contact: "+91 98765 43213",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
  }
];

const medicalStores = [
  { name: "Apollo Pharmacy", location: "Sector 18, Noida", rating: 4.5, timing: "24 Hours", distance: "1.2 km" },
  { name: "MedPlus", location: "Connaught Place, Delhi", rating: 4.3, timing: "8 AM - 10 PM", distance: "2.5 km" },
  { name: "Jan Aushadhi Kendra", location: "Nehru Place, Delhi", rating: 4.6, timing: "9 AM - 9 PM", distance: "3.1 km" },
  { name: "Guardian Pharmacy", location: "Saket, Delhi", rating: 4.4, timing: "24 Hours", distance: "1.8 km" }
];

const features = [
  { icon: HeartPulse, title: "AI Symptom Assessment", description: "Smart symptom analysis" },
  { icon: MapPin, title: "Location-Based", description: "Find nearby doctors" },
  { icon: Star, title: "Patient Reviews", description: "Verified ratings" },
  { icon: Clock, title: "Real-Time Status", description: "Doctor availability" },
  { icon: Award, title: "Best Specialists", description: "Qualified doctors" },
  { icon: Shield, title: "Verified Information", description: "Accurate data" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');

  // Get user location from localStorage
  useEffect(() => {
    const loc = localStorage.getItem('user_location');
    if (loc) setUserLocation(loc);
  }, []);

  const handleNavigateToFeature = (path: string) => {
    // Navigate directly to all features
    navigate(path);
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Stethoscope className="size-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">DocFinder</span>
              {userLocation && (
                <div className="hidden lg:flex items-center gap-1 ml-4 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                  <MapPin className="size-3" />
                  <span>{userLocation}</span>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => handleNavigateToFeature('/find-doctor')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Find Doctor
              </button>
              <button
                onClick={() => handleNavigateToFeature('/medical-stores')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Find Medical Stores
              </button>
              <button
                onClick={() => handleNavigateToFeature('/assessment')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Start Assessment
              </button>
            </div>

            <div className="flex items-center gap-3">
              {userLocation && (
                <div className="lg:hidden flex items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full">
                  <MapPin className="size-3" />
                  <span className="max-w-[100px] truncate">{userLocation}</span>
                </div>
              )}
              <Button onClick={() => navigate('/location')}>
                <MapPin className="size-4 mr-2" />
                Change Location
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Doctors / Specialists / Emergency Help / Surgeons Near You
          </h1>
          <p className="text-xl text-gray-600">
            For any of your health issues
          </p>
        </motion.div>

        {/* Quick Actions - Mobile */}
        <div className="md:hidden grid grid-cols-1 gap-4 mb-12">
          <Button
            onClick={() => handleNavigateToFeature('/find-doctor')}
            size="lg"
            className="w-full"
          >
            <Hospital className="size-5 mr-2" />
            Find Doctor
          </Button>
          <Button
            onClick={() => handleNavigateToFeature('/medical-stores')}
            size="lg"
            variant="outline"
            className="w-full"
          >
            <MapPin className="size-5 mr-2" />
            Find Medical Stores
          </Button>
          <Button
            onClick={() => handleNavigateToFeature('/assessment')}
            size="lg"
            variant="secondary"
            className="w-full"
          >
            <Activity className="size-5 mr-2" />
            Start Assessment
          </Button>
        </div>

        {/* Flipbook Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Best Doctors</h2>
          <FlipBook doctors={bestDoctors} />
        </motion.div>

        {/* Medical Stores Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Find Medical Stores Near You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {medicalStores.map((store, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{store.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-blue-600" />
                    <span>{store.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    <span>{store.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-green-600" />
                    <span>{store.timing}</span>
                  </div>
                  <div className="text-blue-600 font-medium">{store.distance} away</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Features of DocFinder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedFeature(feature.title)}
                className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-full aspect-square flex flex-col items-center justify-center text-center cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                <feature.icon className="size-12 text-white mb-3" />
                <h3 className="font-bold text-white text-lg mb-1">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">Contact Us</h3>
              <p className="text-gray-400 text-sm">Email: support@docfinder.in</p>
              <p className="text-gray-400 text-sm">Phone: 1800-XXX-XXXX</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Help & Support</h3>
              <p className="text-gray-400 text-sm">FAQ</p>
              <p className="text-gray-400 text-sm">User Guide</p>
              <p className="text-gray-400 text-sm">Privacy Policy</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">About</h3>
              <p className="text-gray-400 text-sm">How It Works</p>
              <p className="text-gray-400 text-sm">For Doctors</p>
              <p className="text-gray-400 text-sm">For Hospitals</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">Made with ❤️ by Caffeinated Legends in India</p>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto">
              <span className="font-semibold text-yellow-500">⚠️ Disclaimer:</span> This system does not provide medical treatment or home remedies. It only helps users find the appropriate healthcare provider.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
