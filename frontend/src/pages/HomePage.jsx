import React from 'react'
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import Features from '../components/Features';
import TargetUsers from '../components/TargetUsers';
import CTA from '../components/CTA';


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
