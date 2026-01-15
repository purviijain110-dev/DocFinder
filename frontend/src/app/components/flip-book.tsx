import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, MapPin, Star, Phone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  contact: string;
  imageUrl: string;
}

interface FlipBookProps {
  doctors: Doctor[];
}

export default function FlipBook({ doctors }: FlipBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextPage = () => {
    if (currentPage < doctors.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
    }),
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg shadow-2xl p-8 min-h-[500px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(120, 53, 15, 0.9), rgba(92, 33, 4, 0.9)), url('data:image/svg+xml,<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/></pattern></defs><rect width="400" height="400" fill="url(%23grid)"/></svg>')`,
          backgroundSize: 'cover'
        }}
      >
        <div className="relative w-full max-w-2xl perspective-1000">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 text-center">
            
          </div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                rotateY: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="bg-white rounded-lg shadow-xl p-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left side - Image */}
                <div className="md:w-1/2">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                    <ImageWithFallback
                      src={doctors[currentPage].imageUrl}
                      alt={doctors[currentPage].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right side - Details */}
                <div className="md:w-1/2 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {doctors[currentPage].name}
                    </h2>
                    <p className="text-lg text-blue-600 font-medium mb-4">
                      {doctors[currentPage].specialty}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{doctors[currentPage].location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Star className="size-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">
                          {doctors[currentPage].rating}
                        </span>
                        <span className="text-gray-600">
                          ({doctors[currentPage].reviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="size-5 text-gray-400" />
                        <span className="text-gray-700">{doctors[currentPage].contact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full" size="lg">
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Page Number */}
              <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
                Page {currentPage + 1} of {doctors.length}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-white hover:bg-gray-100"
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="size-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-white hover:bg-gray-100"
            onClick={nextPage}
            disabled={currentPage === doctors.length - 1}
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {doctors.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentPage ? 1 : -1);
              setCurrentPage(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentPage
                ? 'w-8 bg-blue-600'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
