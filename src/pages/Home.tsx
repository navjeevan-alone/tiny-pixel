import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, ArrowRight, Trash2, Moon, Sun, Heart, Package } from 'lucide-react';
import JSZip from 'jszip';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

interface ConvertedImage {
  originalName: string;
  webpBlob: Blob;
  originalSize: number;
  convertedSize: number;
}

function Home() {
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const convertToWebP = useCallback(async (file: File): Promise<ConvertedImage> => {
    const img = document.createElement('img');
    const imageUrl = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        const attemptConversion = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              if(file.size > blob.size){
                resolve({
                  originalName: file.name.replace(/\.[^/.]+$/, ''),
                  webpBlob: blob,
                  originalSize: file.size,
                  convertedSize: blob.size,
                });
              }else{
                attemptConversion(quality - 0.1);
              }
              
            }
            URL.revokeObjectURL(imageUrl);
          },
          'image/webp',
          quality
        )};
        attemptConversion(0.8);
      };
      
      img.src = imageUrl;
    });
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    await processFiles(Array.from(files));
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(event.dataTransfer.files);
    await processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    setIsConverting(true);
    const imageFiles = files.filter(file => 
      ['image/webp', 'image/avif', 'image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/bmp'].includes(file.type)
    );

    const converted = await Promise.all(imageFiles.map(convertToWebP));
    setConvertedImages(prev => [...prev, ...converted]);
    setIsConverting(false);
  };

  const handleDownload = (image: ConvertedImage) => {
    const url = URL.createObjectURL(image.webpBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.originalName}.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    if (convertedImages.length === 0) return;
    
    setIsZipping(true);
    const zip = new JSZip();

    // Add all images to the zip
    convertedImages.forEach((image) => {
      zip.file(`${image.originalName}.webp`, image.webpBlob);
    });

    try {
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TinyPixel-converted-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip file:', error);
    } finally {
      setIsZipping(false);
    }
  };

  const handleRemove = (index: number) => {
    setConvertedImages(prev => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const calculateSavings = (original: number, converted: number): string => {
    const savings = ((original - converted) / original * 100).toFixed(1);
    return `${savings}%`;
  };

  const totalSavings = convertedImages.reduce((acc, img) => 
    acc + (img.originalSize - img.convertedSize), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header with Logo and Theme Switch */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="flex-1 max-w-5xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            WebP Image Converter
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300">
            Transform your images to WebP format for superior compression
          </p>
        </div>

        <div 
          className={`
            relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg 
            transition-all duration-200 ease-in-out mb-8
            ${isDragging ? 'border-2 border-purple-500 scale-[1.02]' : 'border border-gray-200 dark:border-gray-700'}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          
          <div className='absolute top-[175px] rotate-90 right-[-45.5px] text-center'>
            <Link to="https://buymeacoffee.com/navjeevanalone" target='_blank' className={`text-sm text-white px-2 py-1 rounded-tr-lg rounded-tl-lg ${isDragging ? 'bg-green-700' : 'bg-green-700 sm:bg-gray-300 sm:dark:bg-gray-600 hover:bg-green-700 dark:hover:bg-green-800'}`}>Support TinyPixel</Link>
          </div>
          <div className="p-8">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/tiff,image/bmp,image/webp,image/avif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`
                flex flex-col items-center justify-center p-12 cursor-pointer
                border-2 border-dashed rounded-xl transition-colors duration-200
                ${isDragging 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'}
              `}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                <Upload className="h-16 w-16 text-purple-500 relative" />
              </div>
              <h3 className="mt-6 text-xl text-center font-semibold text-gray-900 dark:text-white">
                Drop your images here
              </h3>
              <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                or click to browse
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 justify-center flex-wrap dark:text-gray-400">
                <span className="text-xs px-1 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded">JPG</span>
                <span className="text-xs px-1 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded">PNG</span>
                <span className="text-xs px-1 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded">GIF</span>
                <span className="text-xs px-1 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded">TIFF</span>
                <span className="text-xs px-1 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded">BMP</span>
                <span className="text-xs px-1 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded">WEBP</span>
                <span className="text-xs px-1 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded">AVIF *</span>
              </div>
              <small className='text-xs text-center mt-2 text-gray-400 dark:text-gray-500'>* We are still experimenting with AVIF to WebP compression.</small>
            </label>
            
          </div>
        </div>

        {isConverting && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Converting your images...</span>
            </div>
          </div>
        )}

        {convertedImages.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center sm:justify-between flex-wrap">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Converted Images
                  </h2>
                  <div className="flex items-center gap-4 flex-row justify-center sm:flex-col flex-wrap">
                    <div className="text-sm text-gray-800 dark:text-gray-400">
                      Total space saved: {formatSize(totalSavings)}
                    </div>
                    <button
                      onClick={handleDownloadAll}
                      disabled={isZipping}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isZipping ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating ZIP...</span>
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4" />
                          <span>Download All</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {convertedImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-center sm:justify-between flex-wrap">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <ImageIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="truncate-middle font-medium text-gray-900 dark:text-white">
                            {image.originalName}.webp
                          </p>
                          <div className="flex items-center mt-1 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              {formatSize(image.originalSize)}
                            </span>
                            <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
                            <span className="text-gray-500 dark:text-gray-400">
                              {formatSize(image.convertedSize)}
                            </span>
                            <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                              ({calculateSavings(image.originalSize, image.convertedSize)} saved)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemove(index)}
                          className="p-2 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(image)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} 
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;