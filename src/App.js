import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import Curriculum from './components/Curriculum';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ClayToggle from './components/ui/ClayToggle';

function App() {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // do not persist yet; ephemeral testing
    if (theme === 'clay') {
      document.body.classList.add('clay');
    } else {
      document.body.classList.remove('clay');
    }
  }, [theme]);

  return (
    <div className="App">
      <Header />
      <Hero />
      <Story />
      <Curriculum />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />

      <ClayToggle
        theme={theme}
        onToggle={() => setTheme((t) => (t === 'clay' ? 'default' : 'clay'))}
      />
    </div>
  );
}

export default App;
