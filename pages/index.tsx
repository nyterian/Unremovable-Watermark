import { useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const [imageURL, setImageURL] = useState<string | null>(null);
  const [logoURL, setLogoURL] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageURL(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoURL(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const drawWatermark = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;
    const logo = logoRef.current;

    if (canvas && ctx && image && logo) {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      const logoSize = image.width / 4;
      const x = image.width - logoSize - 20;
      const y = image.height - logoSize - 20;

      // --- GÖLGE EFEKTİ ---
      ctx.shadowColor = 'rgba(10, 20, 90, 0.3)'; // soft lacivert
      ctx.shadowBlur = 15;
      ctx.drawImage(logo, x, y, logoSize, logoSize);

      // --- HAYALET LOGO (sol alt, yarı opak) ---
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.2;
      ctx.drawImage(logo, 20, image.height - logoSize / 2 - 20, logoSize / 2, logoSize / 2);
      ctx.globalAlpha = 1.0;

      // --- GÜRÜLTÜ (NOISE) EFEKTİ ---
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = canvas.width;
      noiseCanvas.height = canvas.height;
      const noiseCtx = noiseCanvas.getContext('2d');

      if (noiseCtx) {
        const noiseImageData = noiseCtx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < noiseImageData.data.length; i += 4) {
          const val = Math.floor(Math.random() * 30); // düşük değerli gürültü
          noiseImageData.data[i] = val;
          noiseImageData.data[i + 1] = val;
          noiseImageData.data[i + 2] = val;
          noiseImageData.data[i + 3] = 20; // transparanlık
        }
        noiseCtx.putImageData(noiseImageData, 0, 0);
        ctx.drawImage(noiseCanvas, 0, 0);
      }

      const dataURL = canvas.toDataURL('image/png');
      setDownloadURL(dataURL);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Unremovable Watermark Generator</h1>

      <label>1. Upload your image:</label><br />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br /><br />

      <label>2. Upload your logo:</label><br />
      <input type="file" accept="image/*" onChange={handleLogoUpload} />
      <br /><br />

      {imageURL && logoURL && (
        <>
          <img ref={imageRef} src={imageURL} alt="uploaded" onLoad={drawWatermark} style={{ display: 'none' }} />
          <img ref={logoRef} src={logoURL} alt="logo" onLoad={drawWatermark} style={{ display: 'none' }} />
          <canvas ref={canvasRef} style={{ border: '1px solid #000', marginTop: '1rem', maxWidth: '100%' }} />
          <br />
          {downloadURL && (
            <a href={downloadURL} download="watermarked.png">Download Watermarked Image</a>
          )}
        </>
      )}
    </div>
  );
}
