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

      ctx.shadowColor = 'rgba(120, 80, 255, 0.4)';
      ctx.shadowBlur = 20;
      ctx.drawImage(logo, x, y, logoSize, logoSize);

      const dataURL = canvas.toDataURL('image/png');
      setDownloadURL(dataURL);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Custom Watermark Generator</h1>

      <label>1. Upload your image:</label><br />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br /><br />

      <label>2. Upload your logo (will be used as watermark):</label><br />
      <input type="file" accept="image/*" onChange={handleLogoUpload} />
      <br /><br />

      {imageURL && logoURL && (
        <>
          <img ref={imageRef} src={imageURL} alt="uploaded" onLoad={drawWatermark} style={{ display: 'none' }} />
          <img ref={logoRef} src={logoURL} alt="logo" onLoad={drawWatermark} style={{ display: 'none' }} />
          <canvas ref={canvasRef} style={{ border: '1px solid #000', marginTop: '1rem' }} />
          <br />
          {downloadURL && (
            <a href={downloadURL} download="watermarked.png">Download Watermarked Image</a>
          )}
        </>
      )}
    </div>
  );
}
