import React from 'react'
import Navbar from './components/navbar/Navbar';
import Home from './components/home/home';
import Footer from './components/footer/Footer';
// import About from './components/about/About';

const App = () => {
  return (
    <div>
      <Navbar />
      <Home/>
      {/* <About/> */}
      <Footer/>
    </div>
  );
};

export default App