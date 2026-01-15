import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Languages } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const languages = [
  { code: 'english', name: 'English', nativeName: 'English' },
  { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

interface LanguageSelectionProps {
  onLanguageSelect: (language: string) => void;
}

export default function LanguageSelection({ onLanguageSelect }: LanguageSelectionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || '/find-doctor';

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageSelect(languageCode);
    navigate('/auth', { state: { redirectTo } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-blue-100 rounded-full mb-4">
            <Languages className="size-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Choose Your Language
          </h1>
          <p className="text-gray-600">
            अपनी भाषा चुनें / Select your preferred language
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {languages.map((language, index) => (
            <motion.div
              key={language.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                onClick={() => handleLanguageSelect(language.code)}
                className="w-full h-auto py-6 px-4 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                <div className="text-center">
                  <p className="text-lg font-semibold">{language.name}</p>
                  <p className="text-xl">{language.nativeName}</p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600"
          >
            ← Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
