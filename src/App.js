import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import Curriculum from './components/Curriculum';
import StudentSuccessSpotlight from './components/StudentSuccessSpotlight';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { LeadModalProvider } from './components/LeadModalContext';
import LeadModal from './components/LeadModal';
 

function App() {

  return (
    <LeadModalProvider>
      <div className="App">
        <Header />
        <Hero />
        <Story />
        <Curriculum />
        <StudentSuccessSpotlight />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Footer />
        <LeadModal />
      </div>
    </LeadModalProvider>
  );
}

export default App;
