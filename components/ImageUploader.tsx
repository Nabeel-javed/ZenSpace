import { useRef, useState } from 'react';
import type { FC, DragEvent, ChangeEvent } from 'react';
import { Upload, ImageIcon, Camera } from './Icons';
import { ImageState } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface ImageUploaderProps {
  onImageSelected: (imageState: ImageState) => void;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      onImageSelected({
        file,
        base64,
        previewUrl
      });
    } catch (error) {
      console.error("Error processing file:", error);
      alert('Failed to process image. Please try again.');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto z-10">
      <div 
        className={`
          relative rounded-3xl p-12 text-center transition-all duration-500 cursor-pointer
          glass-panel shadow-2xl overflow-hidden group
          ${isDragging ? 'ring-4 ring-teal-400/50 scale-[1.02]' : 'hover:shadow-3xl hover:-translate-y-1'}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={onInputChange}
        />
        
        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className={`
            p-6 rounded-2xl transition-all duration-300 shadow-sm
            ${isDragging ? 'bg-teal-500 text-white shadow-teal-500/30' : 'bg-white text-teal-600 shadow-stone-200 group-hover:scale-110 group-hover:rotate-3'}
          `}>
            <Upload className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">
              Visualize your calm
            </h3>
            <p className="text-stone-600 max-w-md mx-auto text-lg">
              Drag your photo here to begin your decluttering journey.
            </p>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-lg hover:shadow-stone-900/20 font-medium tracking-wide">
              <ImageIcon className="w-4 h-4" />
              Upload Photo
            </button>
            <button 
              onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 border border-white/60 text-stone-700 hover:bg-white transition-all shadow-sm font-medium"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-xs text-stone-500 mt-6 font-medium tracking-wide opacity-60">
        SUPPORTED FORMATS: JPG, PNG, WEBP — MAX SIZE 10MB
      </p>
    </div>
  );
};