import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth, generateId } from '../context/useAuth';

const LoginPage = () => {
  const { intent, setIntent, login, signup } = useAuth();
  const [mode, setMode] = useState(intent === 'signup' ? 'signup' : 'login');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(generateId());
  const inputRef = useRef(null);

  useEffect(() => {
    if (mode === 'login') inputRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (mode !== 'signup') return;
    const interval = setInterval(() => {
      setPreview(generateId());
    }, 90);
    const stop = setTimeout(() => clearInterval(interval), 1100);
    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [mode]);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      signup();
      return;
    }
    const err = login(value);
    if (err) setError(err);
  };

  const switchMode = (next) => {
    setMode(next);
    setValue('');
    setError('');
    if (next === 'signup') setPreview(generateId());
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f4f4f5] flex flex-col">
      <header className="flex justify-between items-center px-6 py-6 border-b border-[#2a2a2c]">
        <button
          onClick={() => setIntent(null)}
          className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors"
          style={{ pointerEvents: 'auto' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="text-xl font-display uppercase tracking-widest leading-none">Bixbee<span className="text-[#ff5c58]">.</span></div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md border border-[#2a2a2c] bg-[#121214]">
          <div className="grid grid-cols-2 border-b border-[#2a2a2c]">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`font-mono text-xs uppercase tracking-widest py-4 transition-colors ${mode === m ? 'bg-[#ff5c58] text-[#0a0a0c] font-bold' : 'text-[#a1a1aa] hover:text-[#f4f4f5]'}`}
                style={{ pointerEvents: 'auto' }}
              >
                {m === 'login' ? 'Enter ID' : 'New ID'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="p-8 flex flex-col gap-8">
            <div>
              <h1 className="font-display text-4xl lowercase leading-none mb-3">
                {mode === 'login' ? 'welcome back.' : 'no name needed.'}
              </h1>
              <p className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] leading-relaxed">
                {mode === 'login'
                  ? 'Type your 6-character identity to re-enter the void.'
                  : 'We forge an anonymous 6-character identity. No email. No trace.'}
              </p>
            </div>

            {mode === 'login' ? (
              <div>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="00AA00"
                  maxLength={6}
                  spellCheck={false}
                  className="w-full bg-[#0a0a0c] border border-[#2a2a2c] focus:border-[#ff5c58] outline-none px-4 py-5 font-mono text-3xl tracking-[0.4em] text-center uppercase placeholder:text-[#2a2a2c] transition-colors"
                  style={{ pointerEvents: 'auto' }}
                />
                {error && <p className="font-mono text-xs text-[#ff5c58] mt-3 uppercase tracking-widest">{error}</p>}
              </div>
            ) : (
              <div className="bg-[#0a0a0c] border border-dashed border-[#2a2a2c] px-4 py-5 text-center">
                <span className="font-mono text-3xl tracking-[0.4em] text-[#4ade80]">{preview}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#ff5c58] text-[#0a0a0c] font-mono text-sm uppercase tracking-widest font-bold py-5 border border-[#ff5c58] hover:bg-transparent hover:text-[#ff5c58] transition-colors"
              style={{ pointerEvents: 'auto' }}
            >
              {mode === 'login' ? 'Enter Platform' : 'Forge Identity'}
            </button>

            <p className="font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa] text-center leading-relaxed">
              Your voice. No trace. No judgment.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
