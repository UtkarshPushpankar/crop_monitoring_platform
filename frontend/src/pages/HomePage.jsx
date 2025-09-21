import React from 'react'
import Hero from '../components/LandingPage/Hero';
import ProblemSolution from '../components/LandingPage/ProblemSolution';
import Features from '../components/LandingPage/Features';
import TargetUsers from '../components/LandingPage/TargetUsers';
import CTA from '../components/LandingPage/CTA';


const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ProblemSolution />
      <Features />
      <TargetUsers />
      <CTA />
    </div>
  );
}

export default HomePage
