import { useState } from 'react';
import { useStore } from '../store';

export function useImageUpload() {
  const { setImage } = useStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  return { handleImageUpload, isUploading };
}