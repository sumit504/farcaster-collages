import React, { useRef, useState } from 'react';

const CollageCreator: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
  };

  const createCollage = async () => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    const cols = 2;
    const rows = Math.ceil(images.length / cols);
    canvas.width = size * cols;
    canvas.height = size * rows;

    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.src = URL.createObjectURL(images[i]);

      await new Promise((resolve) => {
        img.onload = () => {
          const x = (i % cols) * size;
          const y = Math.floor(i / cols) * size;
          ctx.drawImage(img, x, y, size, size);
          resolve(true);
        };
      });
    }

    const url = canvas.toDataURL('image/jpeg');
    setCollageUrl(url);
  };

  const handleCast = () => {
    if (!collageUrl) return;
    alert('Ready to cast! Image URL:\n' + collageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="text-sm text-[#362e6f] bg-white px-4 py-2 rounded-xl shadow-sm"
      />

      <button
        onClick={createCollage}
        className="px-4 py-2 rounded-2xl bg-[#362e6f] text-white text-sm transition-all duration-300 hover:bg-[#241e50] hover:scale-105 shadow-md"
      >
        Generate Collage
      </button>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {collageUrl && (
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">Preview:</h3>
          <img
            src={collageUrl}
            alt="Collage"
            className="rounded-xl shadow-xl border border-[#362e6f] max-w-full w-[300px] sm:w-[500px]"
          />
          <button
            onClick={handleCast}
            className="px-4 py-2 rounded-2xl bg-[#362e6f] text-white text-sm transition-all duration-300 hover:bg-[#241e50] hover:scale-105 shadow-md"
          >
            Cast This Collage
          </button>
        </div>
      )}
    </div>
  );
};

export default CollageCreator;
