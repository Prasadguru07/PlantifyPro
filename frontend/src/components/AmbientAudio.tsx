import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      // Create a gentle nature noise synthesizer via Web Audio API 
      // or just an empty dummy reference for now that logs
      const audio = new Audio("https://cdn.freesound.org/previews/515/515823_10388062-lq.mp3");
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio block", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={togglePlay}
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl glass-card flex items-center justify-center transition-colors z-50 ${isPlaying ? 'bg-nature-light text-white' : 'bg-white/80 text-nature-dark'}`}
      title="Toggle Nature Ambience"
    >
      {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
    </motion.button>
  );
}
