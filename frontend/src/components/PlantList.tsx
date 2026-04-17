import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Clock, FileText, ChevronDown, ChevronUp, Plus, X, Loader2, Trash2 } from 'lucide-react';

interface Plant {
  id: number;
  name: string;
  species: string;
  last_watered: string;
}

export default function PlantList() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [animatingPlantInfo, setAnimatingPlantInfo] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantSpecies, setNewPlantSpecies] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Setup WebSocket and initial fetch
  useEffect(() => {
    fetch('http://localhost:8000/api/plants')
      .then(res => res.json())
      .then(data => setPlants(data))
      .catch(err => console.error("Could not fetch plants", err));

    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'plant_watered') {
          setAnimatingPlantInfo(data.plant_id);
          setTimeout(() => setAnimatingPlantInfo(null), 600);

          setPlants(current => 
            current.map(p => 
              p.id === data.plant_id 
                ? { ...p, last_watered: data.last_watered }
                : p
            )
          );
        } else if (data.event === 'plant_deleted') {
          setPlants(current => current.filter(p => p.id !== data.plant_id));
        }
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };

    return () => ws.close();
  }, []);

  const handleWater = async (e: React.MouseEvent<HTMLButtonElement>, plantId: number) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const ripple = document.createElement('div');
    ripple.className = 'absolute bg-blue-400 inset-0 rounded-full opacity-50 water-drop-anim pointer-events-none';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    try {
      await fetch(`http://localhost:8000/api/plants/${plantId}/water`, {
        method: 'POST'
      });
    } catch(err) {
      console.error(err);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, plantId: number) => {
    e.stopPropagation();
    setIsDeleting(plantId);
    try {
      await fetch(`http://localhost:8000/api/plants/${plantId}`, {
        method: 'DELETE'
      });
    } catch(err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlantName || !newPlantSpecies) return;
    
    setIsAdding(true);
    try {
      const res = await fetch('http://localhost:8000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newPlantName,
          species: newPlantSpecies,
          water_frequency_days: 7
        })
      });
      
      const newPlant = await res.json();
      setPlants(prev => [...prev, newPlant]);
      setShowAddForm(false);
      setNewPlantName('');
      setNewPlantSpecies('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="glass-card p-8 w-full max-w-lg mx-auto border-white/50 shadow-xl overflow-hidden relative">
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-nature-primary/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-nature-dark tracking-tight">My Jungle</h2>
          <p className="text-xs text-nature-dark/60 font-medium">Manage your collection</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-nature-primary to-nature-dark text-white p-3 rounded-xl shadow-lg shadow-nature-dark/30 transition-all flex items-center justify-center"
          title={showAddForm ? "Cancel" : "Add Plant"}
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form 
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="mb-6 overflow-hidden"
            onSubmit={handleAddPlant}
          >
            <div className="bg-white/60 backdrop-blur p-5 rounded-2xl border border-white/60 shadow-sm space-y-4">
              <div className="group">
                <input 
                  type="text" 
                  placeholder="Plant Name (e.g. Fernie)" 
                  className="w-full bg-white/50 border border-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nature-primary/50 transition-all shadow-inner"
                  value={newPlantName}
                  onChange={e => setNewPlantName(e.target.value)}
                  required
                />
              </div>
              <div className="group">
                <input 
                  type="text" 
                  placeholder="Species (e.g. Boston Fern)" 
                  className="w-full bg-white/50 border border-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nature-primary/50 transition-all shadow-inner"
                  value={newPlantSpecies}
                  onChange={e => setNewPlantSpecies(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isAdding || !newPlantName || !newPlantSpecies}
                className="w-full bg-nature-dark text-white py-3 rounded-xl hover:bg-black transition-colors font-semibold shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                Add to Jungle
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      {plants.length === 0 && !showAddForm ? (
        <div className="text-center py-10 bg-white/30 rounded-2xl border border-white/40 shadow-inner">
          <p className="text-sm font-medium text-nature-dark/70">No plants added yet.</p>
          <p className="text-xs text-nature-dark/50 mt-1">Click the + button to add one!</p>
        </div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          {plants.map(plant => {
            const isExpanded = expandedId === plant.id;
            return (
              <motion.div 
                layout
                key={plant.id} 
                variants={itemVars}
                onClick={() => setExpandedId(isExpanded ? null : plant.id)}
                className={`bg-white/80 backdrop-blur-md rounded-2xl border transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md ${isExpanded ? 'border-nature-primary/50 ring-1 ring-nature-primary/20' : 'border-white/60'}`}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-nature-dark text-lg">{plant.name}</h3>
                    <p className="text-xs text-nature-dark/60 font-medium mb-3">{plant.species}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-blue-600/80 font-semibold bg-blue-50 w-max px-2 py-1 rounded-md">
                      <Clock size={12} />
                      <span>
                        Watered: {new Date(plant.last_watered).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => handleWater(e, plant.id)}
                      className="relative overflow-hidden w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 hover:from-blue-400 hover:to-blue-500 hover:text-white text-blue-500 rounded-full flex items-center justify-center transition-all shadow-sm group"
                    >
                      <Droplets size={24} className={`${animatingPlantInfo === plant.id ? 'animate-bounce text-white' : 'group-hover:scale-110 transition-transform'}`} />
                    </button>
                    <div className={`text-nature-light transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      layout
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-2"
                    >
                      <div className="pt-4 border-t border-black/5 text-sm text-nature-dark">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold flex items-center gap-2 text-nature-dark/80"><FileText size={16}/> Hydration Status</span>
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Optimal</span>
                        </div>
                        {/* Fake Progress Bar */}
                        <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden shadow-inner border border-gray-200/50">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }} 
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full"
                          ></motion.div>
                        </div>
                        <p className="text-xs text-nature-dark/60 font-medium leading-relaxed bg-white/50 p-3 rounded-xl">Historical logs show consistent watering. Hydration levels are maintaining perfectly.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  );
}
