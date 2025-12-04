import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ArrowLeft, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { ImageState, AnalysisResult } from '../types';

interface AnalysisViewProps {
  imageState: ImageState;
  analysis: AnalysisResult | null;
  isLoading: boolean;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ 
  imageState, 
  analysis, 
  isLoading, 
  onReset 
}) => {
  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20">
      <button 
        onClick={onReset}
        className="self-start group flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors font-medium text-sm backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full border border-white/50"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Analyze another room
      </button>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Image */}
        <div className="glass-panel p-3 rounded-3xl shadow-xl transition-all duration-300 sticky top-24">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100">
             {imageState.previewUrl && (
              <img 
                src={imageState.previewUrl} 
                alt="Room to organize" 
                className="w-full h-full object-cover"
              />
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-20"></div>
                  <RefreshCw className="relative w-12 h-12 animate-spin text-teal-300 drop-shadow-lg" />
                </div>
                <p className="mt-4 font-serif text-xl font-medium text-white drop-shadow-md tracking-wide">Finding clarity in chaos...</p>
              </div>
            )}
          </div>
          <div className="mt-4 px-2 flex items-center justify-between text-sm">
            <span className="text-stone-500 font-medium">Your Space</span>
            <span className="flex items-center gap-1.5 text-teal-700 font-semibold bg-teal-50/50 px-3 py-1 rounded-full border border-teal-100/50">
              <CheckCircle2 className="w-4 h-4" />
              Analyzed securely
            </span>
          </div>
        </div>

        {/* Right Column: Analysis */}
        <div className={`
            glass-panel p-8 md:p-10 rounded-3xl shadow-xl border-white/60 min-h-[400px] transition-all duration-700
            ${isLoading ? 'opacity-80 scale-[0.98]' : 'opacity-100 scale-100'}
        `}>
          {isLoading ? (
             <div className="space-y-6 animate-pulse">
               <div className="h-8 bg-stone-200/50 rounded-lg w-3/4"></div>
               <div className="space-y-3">
                 <div className="h-4 bg-stone-100/50 rounded w-full"></div>
                 <div className="h-4 bg-stone-100/50 rounded w-full"></div>
                 <div className="h-4 bg-stone-100/50 rounded w-5/6"></div>
               </div>
               <div className="h-40 bg-stone-50/50 rounded-2xl w-full mt-8 border border-white/50"></div>
               <div className="space-y-3 mt-8">
                 <div className="h-4 bg-stone-100/50 rounded w-full"></div>
                 <div className="h-4 bg-stone-100/50 rounded w-3/4"></div>
               </div>
             </div>
          ) : analysis ? (
            <div className="animate-slide-up">
               <div className="flex items-center gap-3 mb-8 pb-6 border-b border-stone-200/50">
                 <div className="bg-gradient-to-br from-teal-400 to-teal-600 p-2.5 rounded-xl text-white shadow-lg shadow-teal-500/20">
                   <Sparkles className="w-5 h-5" />
                 </div>
                 <h2 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Your Action Plan</h2>
               </div>
               <div className="prose-container">
                 <MarkdownRenderer content={analysis.text} />
               </div>
               
               <div className="mt-8 pt-6 border-t border-stone-200/50 text-center">
                  <p className="text-stone-500 italic text-sm">Ready for the next step? Ask the ZenSpace Assistant.</p>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <p>Something went wrong. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};