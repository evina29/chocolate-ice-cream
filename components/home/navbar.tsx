"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-blue-500">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
        <div className="flex items-center justify-center">
          <Image
            src="/assets/logo.png"
            alt="Lumina logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <p className="ml-4 text-white text-3xl">Lumina</p>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-8">
        <button 
          onClick={() => scrollToSection('about')}
          className="text-white hover:text-gray-200 transition-colors font-medium text-lg"
        >
          About
        </button>
        <button 
          onClick={() => router.push('/therapists')}
          className="text-white hover:text-gray-200 transition-colors font-medium text-lg"
        >
          Therapists
        </button>
        <button 
          onClick={() => scrollToSection('reviews')}
          className="text-white hover:text-gray-200 transition-colors font-medium text-lg"
        >
          Reviews
        </button>
        <button 
          onClick={() => router.push('/resources')}
          className="text-white hover:text-gray-200 transition-colors font-medium text-lg"
        >
          Resources
        </button>
      </div>

      {/* Dashboard Button */}
      <div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-yellow-100 text-gray-800 px-6 py-2 rounded-full hover:bg-yellow-200 transition-colors font-medium cursor-pointer shadow-lg"
        >
          Dashboard
        </button>
      </div>
    </nav>
  );
};

export default Navbar;