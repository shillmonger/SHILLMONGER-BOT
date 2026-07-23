"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";


import Hero from "../components/LandingPage/Hero";
import HowWeWork from "../components/LandingPage/HowWeWork";
import CoreCapabilities from "@/components/LandingPage/CoreCapabilities";
import FQ from "@/components/LandingPage/F&Q";

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased selection:bg-neutral-800 selection:text-neutral-50 overflow-x-hidden">
      <Hero />
      <HowWeWork />
      <CoreCapabilities />
      <FQ />
    </div>
  );
}