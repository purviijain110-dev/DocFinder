import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';

export default function LocationPage() {
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                localStorage.setItem('user_lat', latitude.toString());
                localStorage.setItem('user_lng', longitude.toString());
                const coordsDisplay = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                setUserLocation(coordsDisplay);
                localStorage.setItem('user_location', coordsDisplay);
                toast.success('Location captured successfully!');
                setIsLoading(false);
            },
            (error) => {
                console.error(error);
                toast.error('Unable to retrieve your location. Please enter manually.');
                setIsLoading(false);
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userLocation.trim()) {
            toast.error('Please enter your location or use current location');
            return;
        }

        localStorage.setItem('user_location', userLocation);
        toast.success('Location saved! Redirecting...');

        // Small delay to ensure localStorage is written
        setTimeout(() => {
            window.location.href = '/';
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 bg-blue-100 rounded-full mb-4">
                        <MapPin className="size-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Set Your Location
                    </h1>
                    <p className="text-gray-600">
                        We'll use this to find doctors and stores near you
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="location">Your City / Location</Label>
                        <Input
                            id="location"
                            type="text"
                            placeholder="e.g. Mumbai, Bangalore, Delhi"
                            value={userLocation}
                            onChange={(e) => setUserLocation(e.target.value)}
                            className="mt-2"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex gap-2 items-center justify-center"
                        onClick={handleUseCurrentLocation}
                        disabled={isLoading}
                    >
                        <Navigation className="size-4" />
                        {isLoading ? 'Getting location...' : 'Use Current Location'}
                    </Button>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!userLocation.trim()}
                    >
                        Continue
                    </Button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-6">
                    You can change this later in settings
                </p>
            </motion.div>
        </div>
    );
}
