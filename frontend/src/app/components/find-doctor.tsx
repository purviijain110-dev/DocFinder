import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, MapPin, Star, Phone, Clock, DollarSign, Calendar, X, Stethoscope, Home } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  specialtyHindi: string;
  location: string;
  rating: number;
  reviews: number;
  distance: string;
  contact: string;
  consultationFee: number;
  availability: string;
  availableSlots: string[];
  imageUrl: string;
  status: 'OPEN' | 'CLOSED' | 'DELAYED';
}

const specialties = [
  { name: 'Cardiologist', hindi: 'दिल के डॉक्टर' },
  { name: 'Pediatrician', hindi: 'बच्चों के डॉक्टर' },
  { name: 'Gastroenterologist', hindi: 'पेट के डॉक्टर' },
  { name: 'Gynecologist', hindi: 'महिला रोग विशेषज्ञ' },
  { name: 'Orthopedic', hindi: 'हड्डी रोग विशेषज्ञ' },
  { name: 'Dermatologist', hindi: 'त्वचा रोग विशेषज्ञ' },
  { name: 'ENT Specialist', hindi: 'कान, नाक, गला विशेषज्ञ' },
  { name: 'General Physician', hindi: 'सामान्य चिकित्सक' },
];

// Mock Doctors removed - data is now fetched from backend API

interface FindDoctorProps {
  language: string;
}

export default function FindDoctor({ language }: FindDoctorProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Needs 'react-router-dom' import update

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('specialty') || '');
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]); // Store all fetched doctors
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('India');

  // Initialize from URL and LocalStorage safely
  useEffect(() => {
    const storedLocation = localStorage.getItem('user_location');
    if (storedLocation) {
      setUserLocation(storedLocation);
    }

    // Initial fetch based on URL params or default
    const initialQuery = searchParams.get('search') || '';
    const initialSpecialty = searchParams.get('specialty') || '';

    // If we have URL params, use them immediately
    if (initialQuery || initialSpecialty) {
      // Update local state to match
      setSearchQuery(initialQuery || initialSpecialty);
      fetchDoctors(initialQuery, initialSpecialty, storedLocation || 'India');
    } else {
      fetchDoctors('', '', storedLocation || 'India');
    }
  }, [searchParams]); // Re-run if URL changes

  // Debouncing effect for manual typing (skip if it matches URL init to avoid double fetch, ideally)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only debounce if the query is different from what might have been fetched by URL params
      // For simplicity, we just check if query exists.
      // We need to pass the current userLocation state here
      if (searchQuery) {
        fetchDoctors(searchQuery, '', userLocation);
      } else if (searchQuery === '' && !loading) {
        fetchDoctors('', '', userLocation);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery, userLocation]);

  const fetchDoctors = async (query: string = '', specialty: string = '', locationOverride: string | null = null) => {
    setLoading(true);
    const loc = locationOverride || userLocation;
    const lat = localStorage.getItem('user_lat');
    const lng = localStorage.getItem('user_lng');

    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (specialty) params.append('specialty', specialty);
      if (loc) params.append('location', loc);
      if (lat) params.append('lat', lat);
      if (lng) params.append('lng', lng);

      console.log("Fetching doctors with params:", params.toString()); // Debug log

      const response = await fetch(`http://localhost:8000/api/doctors?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setAllDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    // Fetch is triggered by useEffect
  };

  const handleSpecialtyClick = (specialty: string) => {
    setSearchQuery(specialty);
    // fetchDoctors is triggered by useEffect change to searchQuery
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setShowBookingDialog(true);
  };

  const confirmBooking = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    toast.success(
      `Appointment confirmed with ${selectedDoctor?.name} at ${selectedSlot}`
    );
    setShowBookingDialog(false);
    setSelectedDoctor(null);
    setSelectedSlot(null);
  };

  const getStatusBadge = (status: Doctor['status']) => {
    const statusConfig = {
      OPEN: { color: 'bg-green-100 text-green-800', text: 'Open' },
      CLOSED: { color: 'bg-red-100 text-red-800', text: 'Closed' },
      DELAYED: { color: 'bg-yellow-100 text-yellow-800', text: 'Delayed' }
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.text}</Badge>;
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
              <Stethoscope className="size-7 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Find Doctor</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by specialty, doctor name, or location..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Specialties Bubbles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Specialties</h2>
          <div className="flex flex-wrap gap-3">
            {specialties.map((specialty, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSpecialtyClick(specialty.name)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                {specialty.name}
                <br />
                <span className="text-xs text-blue-100">{specialty.hindi}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredDoctors.length} Doctors Found
          </h2>
          <p className="text-gray-600 mt-1">Sorted by distance and rating</p>
        </div>

        <div className="space-y-4">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Doctor Image */}
                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Doctor Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">
                        {doctor.specialty}
                        <span className="text-gray-500 text-sm ml-2">({doctor.specialtyHindi})</span>
                      </p>
                    </div>
                    {getStatusBadge(doctor.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-gray-400 flex-shrink-0" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="size-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-900">{doctor.rating}</span>
                      <span>({doctor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-gray-400" />
                      <span>{doctor.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-green-600" />
                      <span className="text-green-600 font-medium">{doctor.distance} away</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-gray-400" />
                      <span>{doctor.availability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-gray-400" />
                      <span className="font-medium">₹{doctor.consultationFee} consultation</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleBookAppointment(doctor)}
                      className="flex-1 md:flex-none"
                    >
                      <Calendar className="size-4 mr-2" />
                      Book Appointment
                    </Button>
                    <Button variant="outline">
                      <Phone className="size-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Select a time slot for your appointment with {selectedDoctor?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="size-5 text-blue-600" />
                <span className="font-medium">Today, {new Date().toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="size-4" />
                <span>Consultation Fee: ₹{selectedDoctor?.consultationFee}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Available Time Slots:</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedDoctor?.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${selectedSlot === slot
                      ? 'border-blue-600 bg-blue-50 text-blue-600 font-medium'
                      : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {selectedSlot && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Selected:</strong> {selectedSlot}
                  <br />
                  <span className="text-xs">Expected wait time: 15-30 minutes</span>
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowBookingDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmBooking}
                className="flex-1"
                disabled={!selectedSlot}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
