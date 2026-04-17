import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ThreePlant from './components/ThreePlant';
import DiagnosticAgent from './components/DiagnosticAgent';
import PlantList from './components/PlantList';
import AmbientAudio from './components/AmbientAudio';
import { Leaf, CloudRain, Sun, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-sage to-nature-sage/50 relative">
      {/* Navbar overlay */}
      <nav className="fixed top-0 w-full p-6 z-50 flex justify-between items-center glass-card rounded-none border-t-0 border-x-0 bg-white/20">
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="bg-nature-dark text-white p-2 rounded-xl shadow-lg"
          >
            <Leaf size={24} />
          </motion.div>
          <h1 className="text-2xl font-bold text-nature-dark tracking-tight">Plantify<span className="font-light">Pro</span></h1>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-white/50 text-nature-dark hover:bg-white shadow-sm transition-all">Dashboard</button>
          <button className="px-4 py-2 rounded-full text-sm font-medium bg-nature-primary text-white hover:bg-nature-dark shadow-md transition-all">Profile</button>
        </div>
      </nav>

      {/* Ambient Audio Toggle */}
      <AmbientAudio />

      {/* Main Layout Grid */}
      <div className="pt-28 px-6 pb-6 w-full max-w-[1400px] mx-auto h-screen flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: 3D Visualization & Widgets */}
        <div className="flex flex-col flex-[1.2] gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-[2] rounded-[2.5rem] overflow-hidden glass-card relative h-[400px] lg:h-full flex flex-col justify-end shadow-2xl group border-white/40"
          >
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl font-light text-nature-dark/80"
              >
                Interactive
              </motion.h2>
              <motion.h3 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-5xl font-bold text-nature-dark tracking-tight"
              >
                Greenhouse
              </motion.h3>
            </div>
            
            <div className="absolute inset-0 cursor-move">
              <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight 
                  castShadow 
                  position={[5, 10, 5]} 
                  intensity={1.5} 
                  shadow-mapSize={[1024, 1024]}
                  shadow-camera-far={20}
                  shadow-camera-left={-10}
                  shadow-camera-right={10}
                  shadow-camera-top={10}
                  shadow-camera-bottom={-10}
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a7f3d0" />
                <Suspense fallback={null}>
                  <ThreePlant />
                  <Environment preset="forest" />
                  <OrbitControls 
                    enableZoom={true} 
                    minDistance={3}
                    maxDistance={10}
                    enablePan={false} 
                    autoRotate 
                    autoRotateSpeed={0.8} 
                    maxPolarAngle={Math.PI / 2 + 0.1}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* Floating Action Buttons over Canvas */}
            <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-3">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-blue-500 hover:text-blue-600">
                <CloudRain size={20} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-yellow-500 hover:text-yellow-600">
                <Sun size={20} />
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 glass-card p-8 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl text-nature-dark font-bold">Indoor Climate</h3>
                <p className="text-sm text-nature-dark/70 mt-1">Optimal conditions active</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Complete
              </div>
            </div>
            <div className="flex flex-col gap-5 w-full mt-4">
              <div className="relative">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2"><Sun className="text-yellow-500" size={18} /><span className="text-sm font-semibold text-nature-dark">Light Intensity</span></div>
                  <span className="text-sm font-bold">75%</span>
                </div>
                <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-yellow-400 rounded-full" />
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2"><CloudRain className="text-blue-500" size={18} /><span className="text-sm font-semibold text-nature-dark">Soil Moisture</span></div>
                  <span className="text-sm font-bold">55%</span>
                </div>
                <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '55%' }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-blue-500 rounded-full" />
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2"><Wind className="text-gray-500" size={18} /><span className="text-sm font-semibold text-nature-dark">Air Quality</span></div>
                  <span className="text-sm font-bold tracking-tight">Excellent</span>
                </div>
                <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, delay: 0.9 }} className="h-full bg-nature-primary rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Widgets */}
        <div className="w-full lg:w-[450px] flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10 lg:pb-0 h-full">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DiagnosticAgent />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PlantList />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
