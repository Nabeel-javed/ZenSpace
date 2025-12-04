import { useState, useCallback, lazy, Suspense } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisView } from './components/AnalysisView';
import { ImageState, AnalysisResult } from './types';
import { analyzeRoomImage } from './services/geminiService';
import { Sparkles, LayoutGrid } from './components/Icons';

const ChatInterface = lazy(() => import('./components/ChatInterface').then(m => ({ default: m.ChatInterface })));

const App = () => {
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleImageSelected = useCallback(async (newImageState: ImageState) => {
    setImageState(newImageState);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      if (newImageState.base64 && newImageState.file) {
        const text = await analyzeRoomImage(newImageState.base64, newImageState.file.type);
        setAnalysisResult({
          text,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error(error);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleReset = () => {
    setImageState(null);
    setAnalysisResult(null);
  };

  return (
    <div className="relative min-h-screen font-sans text-stone-800 selection:bg-teal-100 selection:text-teal-900">
      

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-stone-800 to-stone-950 p-2.5 rounded-xl text-white shadow-lg shadow-stone-900/10">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">ZenSpace</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#" className="hover:text-stone-900 transition-colors relative group">
              How it works
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-stone-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
            <a href="#" className="hover:text-stone-900 transition-colors relative group">
              Philosophy
               <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-stone-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        
        {!imageState ? (
          <div className="flex flex-col items-center justify-center space-y-16 animate-fade-in-up">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-stone-600 text-xs font-bold uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                AI-Powered Decluttering
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 leading-[1.1] tracking-tight drop-shadow-sm">
                Turn your chaos into <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 italic pr-2">calm sanctuary</span>
              </h1>
              <p className="text-xl md:text-2xl text-stone-600/90 max-w-2xl mx-auto leading-relaxed font-light">
                Upload a photo of any messy room. Our AI interior organizer will analyze your space and provide a personalized plan to declutter.
              </p>
            </div>
            
            <ImageUploader onImageSelected={handleImageSelected} />

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-24">
              {[
                { title: "Visual Analysis", desc: "Our AI sees your room like a professional organizer, identifying clutter hotspots instantly." },
                { title: "Actionable Steps", desc: "Get a step-by-step checklist tailored to your specific items and space layout." },
                { title: "Expert Chat", desc: "Have specific questions? Chat with our AI assistant for advice on storage and design." }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl glass-panel hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
                  <h3 className="font-serif font-bold text-xl mb-3 text-stone-800">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <AnalysisView 
            imageState={imageState} 
            analysis={analysisResult} 
            isLoading={isAnalyzing}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      {!imageState && (
        <footer className="relative z-10 border-t border-stone-200/50 py-10 bg-white/30 backdrop-blur-md mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-stone-500 text-sm font-medium">
            <p>© {new Date().getFullYear()} ZenSpace AI. Designed for peace of mind.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-stone-800 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-stone-800 cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </footer>
      )}

      {/* Chatbot Overlay */}
      <Suspense fallback={null}>
        <ChatInterface />
      </Suspense>
    </div>
  );
};

export default App;