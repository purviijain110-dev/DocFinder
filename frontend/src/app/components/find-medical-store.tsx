import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Building2, Clock, MapPin, Star, Phone, Tag, Navigation } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface MedicalStore {
  id: number;
  name: string;
  category: 'government' | '24hrs' | 'normal';
  location: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  timing: string;
  contact: string;
  offers?: string[];
  imageUrl: string;
  isOpen: boolean;
}

// Mock data removed - fetching from backend

interface FindMedicalStoreProps {
  language: string;
}

export default function FindMedicalStore({ language }: FindMedicalStoreProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'government' | '24hrs' | 'normal'>('all');
  const [allStores, setAllStores] = useState<MedicalStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('India');

  // Safely get location on mount
  useEffect(() => {
    const loc = localStorage.getItem('user_location');
    if (loc) setUserLocation(loc);
  }, []);

  // Debouncing effect for category/location updates if needed, though category is instant click. 
  // But if we add search... for now let's just make sure fetchStores is robust.

  useEffect(() => {
    // Small delay to batch updates if multiple state changes happen
    const timer = setTimeout(() => {
      fetchStores();
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, userLocation]);

  const fetchStores = async () => {
    setLoading(true);
    const lat = localStorage.getItem('user_lat');
    const lng = localStorage.getItem('user_lng');

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (userLocation) params.append('location', userLocation);
      if (lat) params.append('lat', lat);
      if (lng) params.append('lng', lng);

      const response = await fetch(`http://localhost:8000/api/medical-stores?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medical stores');
      }
      const data = await response.json();
      setAllStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = allStores; // Backend already filtered it

  const getCategoryBadge = (category: MedicalStore['category']) => {
    const categoryConfig = {
      government: {
        color: 'bg-green-100 text-green-800 border-green-200',
        text: 'Government Affiliated',
        textHindi: 'सरकारी'
      },
      '24hrs': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        text: '24 Hours',
        textHindi: '24 घंटे'
      },
      normal: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        text: 'Regular',
        textHindi: 'नियमित'
      }
    };

    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border`}>
        {config.text}
        <span className="ml-1 text-xs">({config.textHindi})</span>
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <Home className="size-5" />
              </Button>
              <Building2 className="size-7 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Medical Stores</h1>
                <p className="text-sm text-gray-600">दवा की दुकान खोजें</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory('all')}
              className={`p-6 rounded-xl text-center transition-all ${selectedCategory === 'all'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              <Building2 className="size-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg">All Stores</h3>
              <p className="text-sm mt-1 opacity-80">सभी दुकानें</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory('government')}
              className={`p-6 rounded-xl text-center transition-all ${selectedCategory === 'government'
                ? 'bg-white text-green-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              <Building2 className="size-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Government</h3>
              <p className="text-sm mt-1 opacity-80">सरकारी दवाखाना</p>
              <Badge className="mt-2 bg-green-500 text-white">Low Cost</Badge>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory('24hrs')}
              className={`p-6 rounded-xl text-center transition-all ${selectedCategory === '24hrs'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              <Clock className="size-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg">24 Hours</h3>
              <p className="text-sm mt-1 opacity-80">24 घंटे खुला</p>
              <Badge className="mt-2 bg-blue-500 text-white">Always Open</Badge>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory('normal')}
              className={`p-6 rounded-xl text-center transition-all ${selectedCategory === 'normal'
                ? 'bg-white text-gray-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
              <Building2 className="size-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Regular</h3>
              <p className="text-sm mt-1 opacity-80">सामान्य दुकान</p>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Store Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredStores.length} Medical Stores Found
          </h2>
          <p className="text-gray-600 mt-1">Sorted by distance from your location</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Store Image */}
              <div className="h-48 overflow-hidden bg-gray-200">
                <img
                  src={store.imageUrl}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Store Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
                    {getCategoryBadge(store.category)}
                  </div>
                  {store.isOpen && (
                    <Badge className="bg-green-100 text-green-800">Open</Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{store.location}</p>
                      <p className="text-xs">{store.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Navigation className="size-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">{store.distance} away</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-gray-900">{store.rating}</span>
                    <span>({store.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-400" />
                    <span>{store.timing}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-gray-400" />
                    <span>{store.contact}</span>
                  </div>
                </div>

                {/* Offers */}
                {store.offers && store.offers.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <Tag className="size-4 text-green-600" />
                      Special Offers:
                    </h4>
                    <div className="space-y-1">
                      {store.offers.map((offer, idx) => (
                        <p key={idx} className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                          • {offer}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1" variant="outline">
                    <Phone className="size-4 mr-2" />
                    Call
                  </Button>
                  <Button className="flex-1">
                    <Navigation className="size-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-t border-yellow-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-700 text-center">
            <span className="font-semibold">⚠️ Note:</span> Please verify store timings before visiting. Call ahead for medicine availability.
            <br />
            <span className="text-xs">कृपया दवा की उपलब्धता के लिए पहले फोन करें।</span>
          </p>
        </div>
      </div>
    </div>
  );
}
