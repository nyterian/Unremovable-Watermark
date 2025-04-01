import { useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageURL, setImageURL] = useState<string | null>(null);
  const [text, setText] = useState<string>('ziyech');
  const [opacity, setOpacity] = useState<number>(0.6); // Opaklık ayarı burada
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

  const drawWatermark = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;

    if (canvas && ctx && image) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(image, 0, 0);

      const fontSize = Math.floor(canvas.width / 6);
      const textX = canvas.width / 2;
      const textY = canvas.height / 2;

      const textCanvas = document.createElement('canvas');
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      const textCtx = textCanvas.getContext('2d');

      if (textCtx) {
        const gradientImage = new Image();
        gradientImage.src = '/Rectangle 108.png';

        gradientImage.onload = () => {
          textCtx.save();
          textCtx.translate(textX, textY);
          textCtx.rotate((-45 * Math.PI) / 180);
          textCtx.translate(-textX, -textY);

          textCtx.drawImage(gradientImage, 0, 0, canvas.width, canvas.height);
          textCtx.globalCompositeOperation = 'destination-in';
          textCtx.globalAlpha = opacity; // Opaklık burada uygulanıyor
          textCtx.font = `bold ${fontSize}px Arial`;
          textCtx.textAlign = 'center';
          textCtx.textBaseline = 'middle';
          textCtx.fillText(text, textX, textY);

          textCtx.restore();

          ctx.drawImage(textCanvas, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          setDownloadURL(dataURL);
        };
      }
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#111', color: '#eee' }}>
      <h1>Unremovable Watermark Generator</h1>

      <label>1. Upload your image:</label><br />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br /><br />

      <label>2. Enter watermark text:</label><br />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem', width: '200px' }}
      />
      <br /><br />

      <label>3. Set watermark opacity:</label><br />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={opacity}
        onChange={(e) => setOpacity(parseFloat(e.target.value))}
        style={{ width: '200px' }}
      />
      <span> {opacity}</span>
      <br /><br />

      {imageURL && (
        <>
          <img ref={imageRef} src={imageURL} alt="uploaded" onLoad={drawWatermark} style={{ display: 'none' }} />
          <canvas ref={canvasRef} style={{ border: '1px solid #333', marginTop: '1rem', maxWidth: '100%' }} />
          <br />
          {downloadURL && (
            <a href={downloadURL} download="watermarked.png" style={{ color: '#ccc' }}>
              Download Watermarked Image
            </a>
          )}
        </>
      )}
    </div>
  );
}