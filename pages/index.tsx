import { useRef, useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout, onAuthStateChanged, db } from '../firebase_auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageURL, setImageURL] = useState<string | null>(null);
  const [text, setText] = useState<string>('ziyech');
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [usedGuest, setUsedGuest] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const opacity = 0.6;

  useEffect(() => {
    const guestUsed = localStorage.getItem('guestUsed');
    if (guestUsed) setUsedGuest(true);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setCredits(data.credits);
          setIsPremium(data.premium === true);
        } else {
          await setDoc(userRef, { credits: 3, premium: false });
          setCredits(3);
          setIsPremium(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

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

  const drawWatermark = async () => {
    if (!user && usedGuest) {
      alert("1 defalık hakkınızı kullandınız. Devam etmek için giriş yapın.");
      return;
    }

    if (user && credits !== null && credits <= 0 && !isPremium) {
      alert("Kullanım hakkınız tükendi. Lütfen abone olun.");
      return;
    }

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

        gradientImage.onload = async () => {
          textCtx.font = `bold ${fontSize}px Arial`;
          textCtx.textAlign = 'center';
          textCtx.textBaseline = 'middle';
          textCtx.translate(textX, textY);
          textCtx.rotate(-Math.PI / 4);
          textCtx.translate(-textX, -textY);

          textCtx.drawImage(gradientImage, 0, 0, canvas.width, canvas.height);
          textCtx.globalCompositeOperation = 'destination-in';
          textCtx.fillStyle = 'white';
          textCtx.fillText(text, textX, textY);

          ctx.drawImage(textCanvas, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          setDownloadURL(dataURL);

          if (!user) {
            localStorage.setItem('guestUsed', 'true');
            setUsedGuest(true);
          } else if (credits !== null && !isPremium) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { credits: credits - 1 });
            setCredits(credits - 1);
          }
        };
      }
    }
  };

  const handlePremiumPurchase = () => {
    if (isPremium) return alert("Zaten premium üyeliğiniz aktif.");

    // eslint-disable-next-line no-undef
    // @ts-ignore

    Paddle.Checkout.open({
      seller: 222844,
      product: "pro_01jqsz3yf225k4k2svckag9fkv",
      successCallback: async () => {
        alert("Satın alma başarılı! Premium hesabınız tanımlanacak.");
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { premium: true, credits: 999 });
          setIsPremium(true);
          setCredits(999);
        }
      }
    });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#111', color: '#eee' }}>
      <Head>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Head>

      <h1>Unremovable Watermark Generator</h1>

      <div style={{ marginBottom: '1rem' }}>
        <Link href="/blog" legacyBehavior>
          <a style={{ color: '#0af', textDecoration: 'underline' }}>📚 Bloga Git</a>
        </Link>
      </div>

      {!user ? (
        <button onClick={loginWithGoogle}>Google ile Giriş Yap</button>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p>👤 {user.displayName} | Hak: {isPremium ? '∞' : credits}</p>
            <button onClick={logout}>Çıkış Yap</button>
          </div>

          {!isPremium && (
            <button
              onClick={handlePremiumPurchase}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0af', color: '#fff' }}>
              🚀 Premium Satın Al
            </button>
          )}
        </>
      )}

      <br /><br />

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
