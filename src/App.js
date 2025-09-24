import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import Curriculum from './components/Curriculum';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
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
    </div>
  );
}

export default App;
