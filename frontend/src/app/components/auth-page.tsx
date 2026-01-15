import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Phone, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/app/components/ui/input-otp';
import { toast } from 'sonner';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || '/find-doctor';

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8000/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneNumber,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to send OTP");
      return;
    }

    toast.success("OTP sent successfully");
    setStep("otp");
  } catch (err) {
    toast.error("Server error");
  }
};



    

  const handleVerifyOTP = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneNumber,
        otp: otp,
      }),
    });

    if (!res.ok) {
      toast.error("Invalid OTP");
      return;
    }

    const data = await res.json();

    localStorage.setItem("user_id", data.user_id);

    toast.success("Login successful");
    navigate("/location");
  } catch (err) {
    toast.error("Server error");
  }
};



  const handleResendOTP = () => {
    toast.success('OTP resent successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-blue-100 rounded-full mb-4">
            <Phone className="size-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'phone' ? 'Welcome to DocFinder' : 'Verify OTP'}
          </h1>
          <p className="text-gray-600">
            {step === 'phone'
              ? 'Enter your phone number to get started'
              : `We sent a code to +91 ${phoneNumber}`}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2 mt-2">
                <div className="flex items-center justify-center px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="text-gray-700 font-medium">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || phoneNumber.length !== 10}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
              {!isLoading && <ArrowRight className="ml-2 size-4" />}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/language')}
                className="text-gray-600"
              >
                ← Change Language
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex flex-col items-center">
              <Label htmlFor="otp" className="mb-4">Enter 6-digit OTP</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
              {!isLoading && <ArrowRight className="ml-2 size-4" />}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Resend OTP
              </button>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('phone')}
                  className="text-gray-600"
                >
                  ← Change Number
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-gray-700 text-center">
            <span className="font-semibold">Note:</span> For demo purposes, any 6-digit OTP will work
          </p>
        </div>
      </motion.div>
    </div>
  );
}
