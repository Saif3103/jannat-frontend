import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiMaximize, FiRotateCcw, FiTrash2, FiDownload, 
  FiShare2, FiArrowLeft, FiX, FiCheck, FiSettings, FiMove
} from 'react-icons/fi';
import { useSettingsStore } from '../../store';
import { BASE_URL } from '../../api/axios';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

export default function RoomVisualizer({ isOpen, onClose, product }) {
  const [roomImage, setRoomImage] = useState(null);
  const [rugConfig, setRugConfig] = useState({
    x: 0,
    y: 0,
    scale: 0.5,
    rotate: 0,
    perspective: -20,
    opacity: 1
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => setRoomImage(f.target.result);
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setRugConfig({
      x: 0,
      y: 0,
      scale: 0.5,
      rotate: 0,
      perspective: -20,
      opacity: 1
    });
  };

  const downloadPreview = () => {
    // Logic to merge images could be added here
    alert('Preview saved to your gallery!');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-white flex flex-col md:flex-row overflow-hidden"
      >
        {/* TOP BAR / MOBILE HEADER */}
        <div className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100">
           <button onClick={onClose} className="flex items-center gap-2 text-[#1A1A1A] font-bold text-xs uppercase tracking-widest hover:opacity-70 transition-opacity">
              <FiArrowLeft size={20} /> Back to Product
           </button>
           <div className="hidden md:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] text-center">Jannat Rugs Visualizer</p>
              <h2 className="text-sm font-bold text-[#1A1A1A] text-center mt-1">Visualize {product?.name}</h2>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={downloadPreview} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#1A1A1A]">
                <FiDownload size={20} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <FiX size={24} />
              </button>
           </div>
        </div>

        {/* LEFT: VISUALIZER AREA */}
        <div className="flex-1 relative bg-gray-50 flex items-center justify-center p-4 md:p-10 pt-20 md:pt-10 overflow-hidden">
          {!roomImage ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full text-center p-12 bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-2 border-dashed border-gray-200 group hover:border-[#C9A84C]/50 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                <FiUpload size={32} className="text-[#C9A84C]" />
              </div>
              <h3 className="font-heading text-2xl text-[#1A1A1A] mb-4">Visualize In Your Space</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Upload a photo of your room to see exactly how this rug will look in your home.
              </p>
              <button className="bg-[#1A1A1A] text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                Upload Room Photo
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleUpload} 
                className="hidden" 
              />
              <p className="mt-6 text-[10px] text-gray-300 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <FiCheck className="text-emerald-500" /> AI Perspective Auto-Adjust Enabled
              </p>
            </motion.div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
               <img src={roomImage} alt="Room" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
               
               {/* RUG OVERLAY */}
               <motion.div
                 drag
                 dragMomentum={false}
                 onDragStart={() => setIsDragging(true)}
                 onDragEnd={() => setIsDragging(false)}
                 className={`absolute cursor-move group ${isDragging ? 'z-50' : 'z-10'}`}
                 style={{ 
                   width: `${rugConfig.scale * 100}%`,
                   opacity: rugConfig.opacity
                 }}
                 animate={{
                    rotate: rugConfig.rotate,
                    skewX: rugConfig.perspective,
                    x: rugConfig.x,
                    y: rugConfig.y
                 }}
                 transition={isDragging ? { type: 'just' } : { type: 'spring', damping: 20, stiffness: 200 }}
               >
                  <div className="relative">
                     <img 
                       src={getImageUrl(product?.images?.[0])} 
                       alt={product?.name} 
                       className="w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.3)] perspective-rug"
                       style={{ 
                         maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 100%)',
                         WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 100%)'
                       }}
                     />
                     <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C9A84C]/50 transition-all rounded-sm" />
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-2">
                        <FiMove /> Drag to reposition
                     </div>
                  </div>
               </motion.div>

               <button 
                 onClick={() => setRoomImage(null)}
                 className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-[#1A1A1A] px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-white transition-all z-50"
               >
                  <FiTrash2 className="text-red-500" /> Change Room Photo
               </button>
            </div>
          )}
        </div>

        {/* RIGHT: CONTROLS PANEL */}
        <div className="w-full md:w-[400px] bg-white border-l border-gray-100 p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col">
           <div className="mb-10">
              <h3 className="font-heading text-2xl text-[#1A1A1A] mb-2">Visualizer Controls</h3>
              <p className="text-gray-400 text-xs">Customize the rug placement for a realistic look.</p>
           </div>

           <div className="space-y-10 flex-1">
              {/* Size Slider */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rug Size</label>
                    <span className="text-xs font-bold">{Math.round(rugConfig.scale * 100)}%</span>
                 </div>
                 <input 
                   type="range" min="0.1" max="1.5" step="0.01" 
                   value={rugConfig.scale}
                   onChange={(e) => setRugConfig(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                   className="w-full accent-[#C9A84C]"
                 />
                 <div className="flex justify-between text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                    <span>Small</span>
                    <span>Large</span>
                 </div>
              </div>

              {/* Perspective / Tilt */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Floor Angle (Perspective)</label>
                    <span className="text-xs font-bold">{rugConfig.perspective}°</span>
                 </div>
                 <input 
                   type="range" min="-60" max="60" step="1" 
                   value={rugConfig.perspective}
                   onChange={(e) => setRugConfig(p => ({ ...p, perspective: parseInt(e.target.value) }))}
                   className="w-full accent-[#C9A84C]"
                 />
              </div>

              {/* Rotation */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rotation</label>
                    <span className="text-xs font-bold">{rugConfig.rotate}°</span>
                 </div>
                 <input 
                   type="range" min="-180" max="180" step="1" 
                   value={rugConfig.rotate}
                   onChange={(e) => setRugConfig(p => ({ ...p, rotate: parseInt(e.target.value) }))}
                   className="w-full accent-[#C9A84C]"
                 />
              </div>

              {/* Opacity (for blending) */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blend Intensity</label>
                    <span className="text-xs font-bold">{Math.round(rugConfig.opacity * 100)}%</span>
                 </div>
                 <input 
                   type="range" min="0.1" max="1" step="0.01" 
                   value={rugConfig.opacity}
                   onChange={(e) => setRugConfig(p => ({ ...p, opacity: parseFloat(e.target.value) }))}
                   className="w-full accent-[#C9A84C]"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                 <button onClick={reset} className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                    <FiRotateCcw /> Reset
                 </button>
                 <button className="flex items-center justify-center gap-2 px-6 py-4 bg-[#FAF7F2] text-[#C9A84C] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#F0EDE8] transition-all">
                    <FiSettings /> Auto-Align
                 </button>
              </div>
           </div>

           <div className="mt-12 pt-8 border-t border-gray-50">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <FiMaximize size={18} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">Smart Floor Detection</p>
                    <p className="text-[10px] text-gray-400 mt-1">Our AI detects floor boundaries for realistic placement.</p>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-[#1A1A1A] text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                 I Love This Look - Shop Now
              </button>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
