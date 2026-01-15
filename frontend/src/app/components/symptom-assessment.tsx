import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Home, Stethoscope, AlertCircle, Calendar, MapPin, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isFollowUp?: boolean;
  options?: string[];
  recommendation?: DoctorRecommendation;
}

interface DoctorRecommendation {
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendedType: string;
  recommendedTypeHindi: string;
  reason: string;
  doctors?: RecommendedDoctor[];
}

// Doctor type for the recommendation list which might come from backend
interface RecommendedDoctor {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  distance: string;
  imageUrl: string;
}

interface SymptomAssessmentProps {
  language: string;
}

const initialMessage: Message = {
  id: 1,
  type: 'bot',
  content: "Hello! I'm DocFinder AI. Tell me what you're feeling, and I'll find the right care for you.\n\nनमस्ते! मैं DocFinder AI हूं। मुझे बताएं कि आप कैसा महसूस कर रहे हैं, और मैं आपके लिए सही देखभाल ढूंढूंगा।\n\n⚠️ Remember: This is not a diagnosis. I help you find the right healthcare provider.",
  timestamp: new Date()
};

// Mock doctors to show if recommendation doesn't return specific doctors
// The backend logic provided in the implementation plan suggests mocking doctors
// But the current gemini service logic mainly returns recommendation TYPE/Urgency
// We can fetch doctors corresponding to that type or just show generic ones for now.



// ... (interfaces)

export default function SymptomAssessment({ language }: SymptomAssessmentProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New state for modal
  const [selectedDoctor, setSelectedDoctor] = useState<RecommendedDoctor | any | null>(null);

  const handleViewDoctorDetails = (doctor: any) => {
    setSelectedDoctor(doctor);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: messages.length + 1,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const currentInput = inputValue;
    addMessage({
      type: 'user',
      content: currentInput
    });

    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare message history for context (optional, depending on backend)
      const messageHistory = messages.map(msg => ({
        role: msg.type === 'bot' ? 'model' : 'user',
        parts: [msg.content]
      }));

      // Get location from auth
      const userLocation = localStorage.getItem('user_location') || 'India';
      const lat = localStorage.getItem('user_lat');
      const lng = localStorage.getItem('user_lng');

      const response = await fetch('http://localhost:8000/api/assessment/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messageHistory,
          current_input: currentInput,
          location: userLocation,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // The backend returns { text, recommendation: {...} }

      addMessage({
        type: 'bot',
        content: data.text,
        recommendation: data.recommendation ? {
          ...data.recommendation,
          doctors: data.doctors && data.doctors.length > 0 ? data.doctors : []
        } : undefined
      });

    } catch (error) {
      console.error("Error fetching assessment:", error);
      addMessage({
        type: 'bot',
        content: "I'm having trouble connecting to the server. Please try again later.\n\nसर्वर से कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800'
    };
    return colors[urgency] || colors['low'];
  };

  const getUrgencyText = (urgency: string) => {
    const texts: Record<string, string> = {
      low: 'Non-Urgent',
      medium: 'Semi-Urgent',
      high: 'Urgent',
      emergency: '🚨 Emergency - Go to Hospital Now!'
    };
    return texts[urgency] || urgency;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <Home className="size-5" />
              </Button>
              <Bot className="size-7 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Symptom Assessment</h1>
                <p className="text-xs text-gray-500">Not a diagnosis - For guidance only</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'bot' ? 'bg-blue-100' : 'bg-gray-200'
                    }`}>
                    {message.type === 'bot' ? (
                      <Bot className="size-6 text-blue-600" />
                    ) : (
                      <User className="size-6 text-gray-600" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div>
                    <div className={`rounded-2xl px-4 py-3 ${message.type === 'bot'
                      ? 'bg-white border border-gray-200'
                      : 'bg-blue-600 text-white'
                      }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Recommendation Card */}
                    {message.recommendation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              Recommendation
                            </h3>
                            <p className="text-sm text-gray-600">
                              {message.recommendation.recommendedType}
                              <span className="text-gray-400 ml-2">
                                ({message.recommendation.recommendedTypeHindi})
                              </span>
                            </p>
                          </div>
                          <Badge className={getUrgencyColor(message.recommendation.urgency)}>
                            {getUrgencyText(message.recommendation.urgency)}
                          </Badge>
                        </div>

                        {message.recommendation.urgency === 'emergency' && (
                          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800">
                              <AlertCircle className="size-5" />
                              <span className="font-semibold">Seek immediate medical attention!</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Recommended Doctors:</h4>
                          {message.recommendation.doctors && message.recommendation.doctors.length > 0 ? (
                            message.recommendation.doctors.map((doctor: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="size-12 rounded-lg overflow-hidden flex-shrink-0">
                                  <ImageWithFallback
                                    src={doctor.imageUrl}
                                    alt={doctor.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-900">{doctor.name}</h5>
                                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="size-3" />
                                      {doctor.distance}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Star className="size-3 text-yellow-500 fill-yellow-500" />
                                      {doctor.rating}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleViewDoctorDetails(doctor)}
                                >
                                  <Calendar className="size-4 mr-1" />
                                  Book
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded">
                              No specific doctors found nearby for this specialty.
                              <Button variant="link" className="p-0 h-auto ml-1" onClick={() => navigate('/find-doctor')}>
                                Search all doctors
                              </Button>
                            </div>
                          )}
                        </div>

                        <Button
                          className="w-full mt-4"
                          onClick={() => navigate(`/find-doctor?specialty=${encodeURIComponent(message.recommendation?.recommendedType || '')}`)}
                        >
                          <Stethoscope className="size-4 mr-2" />
                          View All {message.recommendation.recommendedType}s
                        </Button>
                      </motion.div>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      {message.timestamp.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            // ... existing typing indicator code ...
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="size-6 text-blue-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="size-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="size-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="size-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white">
        {/* ... existing input area ... */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Type your symptoms..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Doctor Details</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDoctor(null)}>
                  <AlertCircle className="size-5 rotate-45 transform" /> {/* X icon hack using AlertCircle if X not avail, or better yet just use text */}
                </Button>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="size-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <ImageWithFallback
                    src={selectedDoctor.imageUrl}
                    alt={selectedDoctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{selectedDoctor.name}</h4>
                  <p className="text-blue-600">{selectedDoctor.specialty}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="size-3" />
                    {selectedDoctor.location}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-semibold">₹{selectedDoctor.consultationFee || 500}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{selectedDoctor.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Contact</span>
                  <span className="font-medium">{selectedDoctor.contact}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={() => {
                toast.success(`Appointment request sent to ${selectedDoctor.name}`);
                setSelectedDoctor(null);
              }}>
                Confirm Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
