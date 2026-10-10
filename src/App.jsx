import { useEffect, useRef, useState } from 'react';
import { Camera, Check, ChevronRight, Heart, ImagePlus, RotateCcw, ShieldCheck, Sparkles, Upload, X } from 'lucide-react';

const quips = [
  'If you’re doubting, the vibes say… maybe focus on being a great dad.',
  'Does it matter who the father is? That little human needs love either way.',
  'The only thing we can confirm: this baby deserves all the snacks and cuddles.',
  'Plot twist: the real father was the friends we made along the way. (Kidding. Mostly.)',
  'Our very fake science says: paternity is a mystery. Kindness isn’t.',
  'Results are in: you have been assigned one (1) tiny roommate. Congratulations!',
  'MMMmm… the vibes are strong, but the science is weak. Maybe just ask the baby’s mom?',
  'The vibes are inconclusive. But the baby is cute, so that’s a win.',
  'We can’t tell you who the dad is, but we can tell you that this app was made with love and a lot of coffee.',
  'The vibes say: “Who cares? Just be a good human.”',
  "mmmmmmmm Amwene, utsi sufuka popanda moto...",
  "Siwanu, koma n'zabho.bho..."
];

function PhotoCard({ label, icon: Icon, photo, onPhoto, onRemove, id }) {
  const inputRef = useRef(null);
  const onChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onPhoto(URL.createObjectURL(file));
    event.target.value = '';
  };
  return (
    <div className={`photo-card ${photo ? 'has-photo' : ''}`}>
      {photo ? (
        <>
          <img src={photo} alt={`${label} preview`} className="photo-preview" />
          <button className="remove-photo" onClick={onRemove} aria-label={`Remove ${label} photo`}><X size={16} /></button>
          <div className="photo-caption"><Check size={14} /> Photo added</div>
        </>
      ) : (
        <>
          <div className="photo-icon"><Icon size={20} strokeWidth={1.7} /></div>
          <strong>{label}</strong>
          <span className="photo-help">Add a photo to begin</span>
          <div className="photo-actions">
            <button className="small-action" onClick={() => inputRef.current?.click()}><Upload size={15} /> Upload</button>
            <button className="small-action" onClick={() => { inputRef.current?.setAttribute('capture', 'user'); inputRef.current?.click(); }}><Camera size={15} /> Camera</button>
          </div>
          <input id={id} ref={inputRef} className="file-input" type="file" accept="image/*" onChange={onChange} aria-label={`Choose ${label} image`} />
        </>
      )}
    </div>
  );
}

function App() {
  const [photos, setPhotos] = useState([null, null]);
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(false);
  const [quip, setQuip] = useState(quips[0]);
  const timers = useRef([]);
  const ready = photos.every(Boolean);
  useEffect(() => () => { timers.current.forEach(clearTimeout); photos.forEach((p) => p && URL.revokeObjectURL(p)); }, []);

  const runTest = () => {
    if (!ready || testing) return;
    setTesting(true); setProgress(0); setResult(false);
    [500, 1100, 1800, 2550, 3250].forEach((delay, i) => timers.current.push(setTimeout(() => setProgress((i + 1) * 20), delay)));
    timers.current.push(setTimeout(() => { setTesting(false); setResult(true); setQuip(quips[Math.floor(Math.random() * quips.length)]); }, 3900));
  };
  const reset = () => { timers.current.forEach(clearTimeout); setPhotos([null, null]); setTesting(false); setProgress(0); setResult(false); };

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Dad? home"><span className="brand-mark"><Heart size={17} fill="currentColor" /></span><span>dad<span className="brand-question">?</span></span></a>
        <div className="top-note"><span className="live-dot" /> 100% unserious science</div>
      </header>
      <div className="content" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> THE PATERNITY VIBE CHECK <span className="eyebrow-line" /></div>
        <h1>Is he the <em>dad?</em></h1>
        <p className="intro">Two photos. One very questionable algorithm.<br className="desktop-break" /> Get the answer nobody asked for.</p>
        <div className="disclaimer"><Sparkles size={16} /><span><strong>Just for laughs.</strong> This app cannot determine paternity. It’s a joke, not a DNA test.</span></div>

        <section className="test-panel" aria-label="Paternity vibe check">
          <div className="step-label"><span>01</span><span className="step-rule" /> ADD YOUR PHOTOS</div>
          <div className="photo-grid">
            <PhotoCard id="parent-photo" label="The alleged dad" icon={Camera} photo={photos[0]} onPhoto={(p) => setPhotos(([_, b]) => [p, b])} onRemove={() => setPhotos(([_, b]) => [null, b])} />
            <div className="plus-badge">+</div>
            <PhotoCard id="baby-photo" label="The tiny human" icon={ImagePlus} photo={photos[1]} onPhoto={(p) => setPhotos(([a]) => [a, p])} onRemove={() => setPhotos(([a]) => [a, null])} />
          </div>
          <div className="privacy-note"><ShieldCheck size={15} /><span>Your photos stay in your browser. They’re never uploaded anywhere.</span></div>
          <button className="test-button" disabled={!ready || testing} onClick={runTest}>
            {testing ? <><span className="button-spinner" /> Running highly advanced vibes…</> : <>Run the vibe check <ChevronRight size={18} /></>}
          </button>
          {!ready && <p className="button-hint">Add both photos to unlock the very official button</p>}
          {testing && <div className="progress-wrap"><div className="progress-label"><span>{['Warming up the vibes…', 'Comparing eyebrows…', 'Consulting the stars…', 'Asking a very small expert…', 'Making up a result…'][Math.min(Math.floor(progress / 20), 4)]}</span><span>{progress}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div></div>}
          {result && <div className="result-card" role="status" aria-live="polite"><div className="result-sparkle"><Sparkles size={19} /></div><div className="result-tag">THE DEFINITELY NOT SCIENTIFIC RESULT</div><h2>Probably not.<span> 🤷</span></h2><p>{quip}</p><div className="result-disclaimer">This result was randomly generated. It means absolutely nothing.</div><button className="again-button" onClick={reset}><RotateCcw size={15} /> Try again</button></div>}
        </section>
        <footer><span>Made with questionable confidence</span><span className="footer-heart">♥</span><span>For entertainment only</span></footer>
      </div>
    </main>
  );
}

export default App;
