import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, Scissors, Sparkles, X } from 'lucide-react';
import './style.css';

const looks = [
  { name: 'The occasion edit', type: 'Celebration, made unforgettable', image: 'photo-1539109136881-3be0616acf4b', alt: 'Model in a sculptural evening dress' },
  { name: 'Modern heritage', type: 'Our roots, reimagined', image: 'photo-1534528741775-53994a69daeb', alt: 'Portrait in vibrant, elegant style' },
  { name: 'Everyday, elevated', type: 'Quiet confidence in every stitch', image: 'photo-1483985988355-763728e1935b', alt: 'Woman wearing a tailored modern outfit' },
];

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', service: 'Bespoke occasionwear', message: '' });
  const [status, setStatus] = React.useState('');
  const [sending, setSending] = React.useState(false);

  async function submitBooking(event) {
    event.preventDefault();
    setSending(true);
    setStatus('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong.');
      setStatus('Thank you — your consultation request is on its way. We’ll be in touch soon.');
      setForm({ name: '', email: '', service: 'Bespoke occasionwear', message: '' });
    } catch (error) {
      setStatus(error.message === 'Failed to fetch' ? 'We couldn’t reach the studio just now. Please try again shortly.' : error.message);
    } finally { setSending(false); }
  }

  return <>
    <div className="announcement">A little more you, in every detail <span>✳</span> Booking for the new season is open</div>
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Maria Stitches home"><span className="wordmark-icon"><Scissors size={17} strokeWidth={1.5} /></span><span>MARIA <i>STITCHES</i><small>THE ATELIER · LAGOS</small></span></a>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
        <a href="#atelier" onClick={() => setMenuOpen(false)}>The atelier</a><a href="#services" onClick={() => setMenuOpen(false)}>What we make</a><a href="#collection" onClick={() => setMenuOpen(false)}>The edit</a>
        <a className="mobile-book" href="#book" onClick={() => setMenuOpen(false)}>Book a consultation <ArrowUpRight size={15} /></a>
      </nav>
      <a className="header-cta" href="#book">Book a consultation <ArrowUpRight size={15} /></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> MADE FOR YOUR MOMENT</span>
          <h1>Wear the feeling<br />of <em>being you.</em></h1>
          <p>Thoughtful tailoring for the woman who knows that the best-dressed version of herself is simply herself.</p>
          <div className="hero-actions"><a className="button button-dark" href="#book">Let’s make something <ArrowRight size={16} /></a><a className="text-link" href="#collection">Explore the atelier <ArrowDown size={14} /></a></div>
          <div className="hero-note"><span className="note-stars">✳ ✳ ✳ ✳ ✳</span><span>Hand-finished in Lagos<br /><b>Made with intention, always.</b></span></div>
        </div>
        <div className="hero-image-wrap">
          <img className="hero-image" src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=88" alt="Woman in an elegant, flowing designer dress" />
          <div className="image-caption"><span>01 / 03</span><span>Made to feel like you</span><span className="caption-rule" /></div>
          <div className="hero-stamp"><span>MADE<br />WITH</span><b>♡</b><span>INTENTION</span></div>
        </div>
        <div className="hero-bottom"><span>01 — BESPOKE WITH A POINT OF VIEW</span><span>SCROLL TO DISCOVER <ArrowDown size={13} /></span></div>
      </section>

      <section className="intro" id="atelier">
        <div className="intro-label"><span>OUR POINT OF VIEW</span><span className="thin-rule" /></div>
        <div className="intro-main"><h2>Good clothes change<br />how you <em>carry yourself.</em></h2><div className="intro-text"><p>At Maria Stitches, getting dressed is an act of self-expression. Every silhouette begins with a conversation, every detail has a reason, and every piece is made to belong to you.</p><a href="#services" className="underlined">Get to know the atelier <ArrowRight size={14} /></a></div></div>
        <div className="intro-stats"><div><b>01</b><span>One-of-one<br />by design</span></div><div><b>100%</b><span>Made around<br />your story</span></div><div><b>∞</b><span>Made to wear<br />on repeat</span></div></div>
      </section>

      <section className="services" id="services">
        <div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> THE ATELIER MENU</span><h2>A good fit.<br /><em>In every sense.</em></h2></div><p>From the first sketch to the final fitting, we make getting dressed feel like the best part.</p></div>
        <div className="service-grid">
          <article className="service-card"><span className="service-no">01 /</span><div className="service-symbol"><Scissors size={20} strokeWidth={1.3} /></div><h3>Bespoke<br />occasionwear</h3><p>For the big days, the long nights and every entrance you want to remember.</p><a href="#book" aria-label="Enquire about bespoke occasionwear"><ArrowUpRight size={17} /></a></article>
          <article className="service-card"><span className="service-no">02 /</span><div className="service-symbol"><Sparkles size={20} strokeWidth={1.3} /></div><h3>Made-to-measure<br />essentials</h3><p>Beautifully considered pieces, cut for your life and made for the long run.</p><a href="#book" aria-label="Enquire about made-to-measure essentials"><ArrowUpRight size={17} /></a></article>
          <article className="service-card"><span className="service-no">03 /</span><div className="service-symbol"><span className="thread-icon">〰</span></div><h3>Wardrobe<br />refresh</h3><p>A thoughtful alteration or a fresh perspective. Your favourites, feeling new again.</p><a href="#book" aria-label="Enquire about a wardrobe refresh"><ArrowUpRight size={17} /></a></article>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="collection-top"><div><span className="eyebrow"><span className="eyebrow-line" /> THE MARIA STITCHES WORLD</span><h2>Pieces with <em>presence.</em></h2></div><a className="underlined" href="#book">Start your own story <ArrowRight size={14} /></a></div>
        <div className="looks-grid">{looks.map((look, index) => <article className={`look look-${index + 1}`} key={look.name}><div className="look-image"><img src={`https://images.unsplash.com/${look.image}?auto=format&fit=crop&w=900&q=85`} alt={look.alt} loading="lazy" /><span className="look-index">0{index + 1}</span></div><div className="look-caption"><div><span>{look.type}</span><h3>{look.name}</h3></div><a href="#book" aria-label={`Enquire about ${look.name}`}><ArrowUpRight size={17} /></a></div></article>)}</div>
      </section>

      <section className="quote-block"><div className="quote-mark">“</div><blockquote>It’s not just about what you wear.<br />It’s about <em>how you arrive.</em></blockquote><span>MARIA STITCHES · LAGOS, NIGERIA</span><div className="quote-decoration">MS</div></section>

      <section className="booking" id="book"><div className="booking-info"><span className="eyebrow"><span className="eyebrow-line" /> THE FIRST FITTING</span><h2>Let’s make<br />it <em>personal.</em></h2><p>Tell us what you have in mind. We’ll find a time to talk through the details, the fabric, and all the little things that make it yours.</p><div className="booking-contact"><span>Prefer to say hello directly?</span><a href="mailto:hello@mariastitches.com">hello@mariastitches.com <ArrowUpRight size={14} /></a></div></div>
        <form className="booking-form" onSubmit={submitBooking}><div className="form-heading"><span>01 — YOUR CONSULTATION</span><span>Usually takes 2 minutes</span></div><label>Your name<input required autoComplete="name" placeholder="What should we call you?" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Email address<input required type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label>What are you looking for?<select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}><option>Bespoke occasionwear</option><option>Made-to-measure essentials</option><option>Wardrobe refresh</option><option>Something else</option></select></label><label>A little more about it<textarea rows="2" placeholder="The occasion, the idea, anything you know so far…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></label><button className="button button-dark form-submit" disabled={sending}>{sending ? 'Sending your note…' : 'Request a consultation'} <ArrowRight size={16} /></button>{status && <p className="form-status" role="status">{status}</p>}<p className="form-footnote">No pressure, no commitment. Just a good conversation.</p></form>
      </section>
    </main>
    <footer className="footer"><a className="wordmark footer-mark" href="#home"><span className="wordmark-icon"><Scissors size={17} strokeWidth={1.5} /></span><span>MARIA <i>STITCHES</i><small>THE ATELIER · LAGOS</small></span></a><span className="footer-note">Made with intention, in Lagos.</span><div className="footer-links"><a href="#atelier">Our story</a><a href="#services">Services</a><a href="#book">Get in touch</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={12} /></a></div><span className="copyright">© {new Date().getFullYear()} MARIA STITCHES</span></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
