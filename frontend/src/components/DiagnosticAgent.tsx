import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Loader2 } from 'lucide-react';

export default function DiagnosticAgent() {
  const [symptoms, setSymptoms] = useState('');
  const [plantName, setPlantName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms || !plantName) return;
    
    setLoading(true);
    setDiagnosis('');
    
    try {
      const res = await fetch('http://localhost:8000/api/diagnose/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_name: plantName, symptoms })
      });
      const data = await res.json();
      const cleanDiagnosis = data.diagnosis.replace(/[*#]/g, '');
      setDiagnosis(cleanDiagnosis);
    } catch (error) {
      console.error(error);
      setDiagnosis('Failed to connect to diagnostic specialist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 w-full max-w-lg mx-auto border-white/50 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-nature-primary/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-nature-primary to-nature-dark p-3 rounded-2xl text-white shadow-lg shadow-nature-primary/30">
          <Bot size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-nature-dark tracking-tight">AI Specialist</h2>
          <p className="text-xs text-nature-dark/60 font-medium">Plant Health Diagnostic Tool</p>
        </div>
      </div>

      <form onSubmit={handleDiagnose} className="space-y-6">
        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-nature-dark/80 group-focus-within:text-nature-primary transition-colors">Plant Species</label>
          <input 
            type="text" 
            placeholder="e.g. Monstera Deliciosa, Fiddle Leaf Fig" 
            className="w-full bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-nature-primary/50 focus:bg-white transition-all shadow-sm"
            value={plantName}
            onChange={e => setPlantName(e.target.value)}
          />
        </div>
        
        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-nature-dark/80 group-focus-within:text-nature-primary transition-colors">Observed Symptoms</label>
          <textarea 
            placeholder="Describe the issue... (e.g. brown crispy edges, drooping leaves)" 
            className="w-full bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-nature-primary/50 focus:bg-white transition-all shadow-sm h-28 resize-none"
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading || !symptoms || !plantName}
          className="w-full bg-nature-dark text-white font-medium py-3 px-6 rounded-xl hover:bg-black duration-300 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          {loading ? 'Analyzing Plant...' : 'Diagnose Issue'}
        </motion.button>
      </form>

      {diagnosis && (
        <motion.div 
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
          className="bg-gradient-to-br from-nature-dark to-black text-white p-6 rounded-2xl shadow-inner relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-white/10">
            <Bot size={100} />
          </div>
          <h3 className="font-bold mb-3 flex items-center gap-2 text-nature-light relative z-10 text-lg">
            Diagnosis Result
          </h3>
          <div className="whitespace-pre-wrap leading-relaxed text-slate-200 text-sm relative z-10 font-medium">
            {diagnosis}
          </div>
        </motion.div>
      )}
    </div>
  );
}
