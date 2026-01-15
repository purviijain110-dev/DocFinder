import { motion } from 'motion/react';
import { Stethoscope } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 to-blue-400 grid grid-rows-[1fr_auto]">

      {/* CENTER CONTENT */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white rounded-full p-8 shadow-2xl"
          >
            <Stethoscope className="size-24 text-blue-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-white mb-2">DocFinder</h1>
            <p className="text-xl text-blue-100">सही डॉक्टर, सही समय पर</p>
            <p className="text-lg text-blue-100">Right Doctor, Right Time</p>
          </motion.div>

        </div>
      </div>

      {/* DISCLAIMER — TRUE BOTTOM */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="text-center text-black text-sm px-4 pb-8"
      >
        <p className="font-semibold mb-1">⚠️ Disclaimer</p>
        <p className="text-xs text-gray-700 max-w-md mx-auto">
          This system does not provide medical treatment or home remedies. It only helps users find the appropriate healthcare provider.
        </p>
      </motion.div>

    </div>
  );
}
