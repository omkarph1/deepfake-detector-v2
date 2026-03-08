import React from 'react';
import Hero3D from '../components/Hero3D';

export default function HomePage({ isDarkMode }) {
  return (
    <div className="pt-20">
      <Hero3D isDarkMode={isDarkMode} />
    </div>
  );
}
