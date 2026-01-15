"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const HeroSection = () => {
  const router = useRouter();
  const { settings } = useAccessibility();
  const [animationsTriggered, setAnimationsTriggered] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      initial: 'S',
      text: "I was hesitant at first, but talking to the AI at 3am when I couldn't sleep changed everything. No judgment, just someone who listened. The next day, I booked my first therapy session.",
      name: "Sarah",
      role: "College Student"
    },
    {
      initial: 'M',
      text: "As a working parent, finding time for therapy felt impossible. Lumina's AI helped me process my anxiety during lunch breaks. Now I have a regular therapist too.",
      name: "Marcus",
      role: "Software Engineer"
    },
    {
      initial: 'J',
      text: "The AI chat helped me realize I wasn't overreacting about my stress. Having 24/7 support before I found my therapist was life-changing.",
      name: "Jessica",
      role: "Medical Student"
    },
    {
      initial: 'A',
      text: "I never thought I'd open up to an AI, but it helped me find the words I needed. When I finally talked to a real therapist, I was ready.",
      name: "Alex",
      role: "High School Teacher"
    }
  ];

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Rotate testimonials every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const quotes = [
    'Mental Health Support\nRight Now',
    'You\'re Not Alone\nEven at 2 A.M.',
    'Real Help\nWhen You Need It',
    'Support That\nNever Sleeps',
    'Someone to Talk To\nAlways'
  ];

  useEffect(() => {
    setAnimationsTriggered(true);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentQuote = quotes[currentQuoteIndex];
    const typingSpeed = isDeleting ? 30 : 80;
    const pauseAfterTyping = 3000;
    const pauseAfterDeleting = 500;

    if (!isDeleting && displayedText === currentQuote) {
      setTimeout(() => setIsDeleting(true), pauseAfterTyping);
      return;
    }

    if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      setTimeout(() => {}, pauseAfterDeleting);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(
        isDeleting
          ? currentQuote.substring(0, displayedText.length - 1)
          : currentQuote.substring(0, displayedText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentQuoteIndex]);

  const getHeadline = () => {
    const text = displayedText || 'Mental Health Support\nRight Now';
    const lines = text.split('\n');
    
    if (settings.language === 'es') {
      return lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    
    return lines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getDescription = () => {
    if (settings.language === 'es') return 'IA clínicamente informada + terapeutas licenciados. Sin salas de espera. Sin juicios. Solo apoyo diseñado por profesionales.';
    if (settings.language === 'fr') return 'IA cliniquement informée + thérapeutes agréés. Pas d\'attente. Pas de jugement. Soutien conçu par des professionnels.';
    if (settings.language === 'de') return 'Klinisch informierte KI + lizenzierte Therapeuten. Kein Warteraum. Kein Urteil. Von Fachleuten entwickelte Unterstützung.';
    if (settings.language === 'zh') return '临床验证AI+持证治疗师。无需等待。无需评判。专业设计的支持。';
    return 'Clinically-informed AI designed with licensed therapists. No waiting rooms. No judgment. Just support.';
  };

  const getButtonPrimary = () => {
    if (settings.language === 'es') return 'Habla con IA Ahora (Gratis)';
    if (settings.language === 'fr') return 'Parler à l\'IA Maintenant (Gratuit)';
    if (settings.language === 'de') return 'Jetzt mit KI sprechen (Kostenlos)';
    if (settings.language === 'zh') return '立即与AI交谈（免费）';
    return 'Talk to AI Now (Free)';
  };

  const getButtonSecondary = () => {
    if (settings.language === 'es') return 'Ver Terapeutas Disponibles';
    if (settings.language === 'fr') return 'Voir Thérapeutes Disponibles';
    if (settings.language === 'de') return 'Verfügbare Therapeuten';
    if (settings.language === 'zh') return '查看可预约治疗师';
    return 'Browse Therapists';
  };
  
  return (
    <section 
      className="relative overflow-hidden bg-[#F9FAFB]"
      role="banner"
      style={{ marginTop: '40px', minHeight: '90vh' }}
    >
      {/* BOLD VISUAL ELEMENT - Abstract gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orb - top right */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float-slow"
          style={{ 
            background: 'radial-gradient(circle, rgba(255, 122, 89, 0.4) 0%, rgba(110, 193, 228, 0.2) 100%)',
            animationDelay: '0s'
          }}
        ></div>
        
        {/* Medium gradient orb - bottom left */}
        <div 
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 blur-3xl animate-float-slow"
          style={{ 
            background: 'radial-gradient(circle, rgba(110, 193, 228, 0.4) 0%, rgba(255, 122, 89, 0.2) 100%)',
            animationDelay: '2s'
          }}
        ></div>
        
        {/* Small accent orb - center */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl animate-pulse-gentle"
          style={{ 
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)'
          }}
        ></div>
      </div>

      {/* Custom animations for orbs */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }
        
        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.15;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 8s ease-in-out infinite;
        }
      `}</style>
      {/* Main container - DISCIPLINED GRID */}
      <div className="relative flex items-center justify-center px-8 md:px-16 lg:px-24 py-16 min-h-[90vh] max-w-7xl mx-auto">
        
        {/* SINGLE LOCKED CONTAINER - All elements share max-width */}
        <div className="w-full max-w-4xl mx-auto text-center z-10">
          
          {/* Headline - NO CARET */}
          <h1 
            className={`text-[#111827] text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 mt-8 transition-all duration-700 ease-in-out ${
              animationsTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            {getHeadline()}
          </h1>

          {/* Description - locked to same container */}
          <p 
            className={`text-[#6B7280] text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-5 transition-all duration-1000 ${
              animationsTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            {getDescription()}
          </p>

          {/* AI Credibility Badges - REDUCED to 2, calmer visual weight */}
          <div 
            className={`flex flex-wrap items-center justify-center gap-3 mb-8 transition-all duration-1000 ${
              animationsTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '1600ms' }}
          >
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-blue-100/80">
              <svg className="w-4 h-4 text-[#2563EB]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-xs font-semibold text-gray-700">Therapist-Designed</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-purple-100/80">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-gray-700">100% Private</span>
            </div>
          </div>

          {/* CTAs - MICRO-ALIGNED perfectly */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            {/* Primary CTA - Warm Coral */}
            <button 
              onClick={() => router.push('/aitherapist')}
              className={`bg-[#FF6B6B] hover:bg-[#FF8A8A] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 h-14 ${
                animationsTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '2000ms' }}
            >
              {getButtonPrimary()}
            </button>
            
            {/* Secondary CTA - EXACTLY matched styling */}
            <button 
              onClick={() => router.push('/therapists')}
              className={`bg-transparent border-2 border-[#2563EB] text-[#2563EB] px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-[#2563EB] hover:text-white hover:scale-105 h-14 ${
                animationsTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '2500ms' }}
            >
              {getButtonSecondary()}
            </button>
          </div>

          {/* Rotating Testimonials - SAME max-width, locked to grid */}
          <div 
            className={`relative transition-all duration-1000 ${
              animationsTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '3000ms' }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute w-full transition-all duration-700 ${
                  index === currentTestimonial 
                    ? 'opacity-100 translate-x-0 pointer-events-auto' 
                    : index < currentTestimonial 
                      ? 'opacity-0 -translate-x-full pointer-events-none'
                      : 'opacity-0 translate-x-full pointer-events-none'
                }`}
              >
                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-gray-100 relative overflow-hidden">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#2563EB] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {testimonial.initial}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[#111827] text-lg italic leading-relaxed mb-3 font-medium">
                        "{testimonial.text}"
                      </p>
                      <p className="text-[#6B7280] text-base font-semibold">
                        — {testimonial.name}, {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Spacer to maintain height */}
            <div className="opacity-0 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-gray-100">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-full"></div>
                  <div className="flex-1 pt-1">
                    <p className="text-lg mb-3">
                      {testimonials[0].text}
                    </p>
                    <p className="text-base">
                      — {testimonials[0].name}, {testimonials[0].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial indicator dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-[#FF7A59] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Trust Indicators - Who This Is For - LOCKED to grid */}
          <div 
            ref={sectionRef}
            className={`mt-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center transform transition-all duration-700 delay-100 hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B6B]/20 flex items-center justify-center mb-3">
                  <span className="text-3xl">🎓</span>
                </div>
                <p className="text-sm font-semibold text-[#111827]">Students</p>
                <p className="text-xs text-[#6B7280] mt-1">Stress, anxiety, academic pressure</p>
              </div>
              <div className="flex flex-col items-center transform transition-all duration-700 delay-200 hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB]/10 to-[#2563EB]/20 flex items-center justify-center mb-3">
                  <span className="text-3xl">💼</span>
                </div>
                <p className="text-sm font-semibold text-[#111827]">Professionals</p>
                <p className="text-xs text-[#6B7280] mt-1">Burnout, work-life balance</p>
              </div>
              <div className="flex flex-col items-center transform transition-all duration-700 delay-300 hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400/10 to-purple-400/20 flex items-center justify-center mb-3">
                  <span className="text-3xl">🌙</span>
                </div>
                <p className="text-sm font-semibold text-[#111827]">Late-Night Support</p>
                <p className="text-xs text-[#6B7280] mt-1">When you need someone, anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
