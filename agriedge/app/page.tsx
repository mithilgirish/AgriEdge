"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn, slideIn, zoomIn } from "@/utils/motion";
import {useUser} from "@clerk/clerk-react";
import Link from 'next/link';
export default function LandingPage() {

  const { isSignedIn } = useUser();

  const features = [
    {
      title: "Real-Time Monitoring",
      description: "Track soil moisture, weather conditions, and crop health instantly."
    },
    {
      title: "Smart Irrigation",
      description: "Optimize water usage with precision irrigation techniques."
    },
    {
      title: "Data Insights",
      description: "Receive actionable insights to improve farm productivity."
    }
  ];

  const teamMembers = [
    {
      name: "Mithil Girish",
      regNo: "23BDS1168",
      role: "Team Member",
      gradient: "from-emerald-400 to-green-500"
    },
    {
      name: "Vaibhav PK",
      regNo: "23BDS1148",
      role: "Team Member",
      gradient: "from-green-400 to-teal-500"
    },
    {
      name: "Sebabrat",
      regNo: "23BDS1127",
      role: "Team Member",
      gradient: "from-teal-400 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Team Info Banner - Glassmorphism */}
      <motion.div
        variants={fadeIn('down', 'spring', 0.1, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="backdrop-blur-md bg-white/70 border-b border-white/20 sticky top-0 z-50 py-4 px-6 shadow-sm"
      >
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
              Web Programming [BCSE203E]
            </span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index} 
                className="flex items-center px-4 py-1 rounded-full backdrop-blur-sm bg-white/40 border border-white/30 shadow-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
              >
                <span className="font-medium text-gray-800">{member.name}</span>
                <span className="mx-2 text-green-500">•</span>
                <span className="text-gray-600">{member.regNo}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Hero Section - Enhanced with Glassmorphism */}
      <motion.main 
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto py-20 grid md:grid-cols-2 gap-10 items-center relative"
      >
        {/* Decorative Blobs */}
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <motion.div 
          variants={fadeIn('right', 'spring', 0.2, 1.5)}
          className="space-y-6 z-10"
        >
          <h1 className="text-5xl font-bold text-gray-900">
            Smart Irrigation <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">With AgriEdge</span>
          </h1>
          <motion.p 
            variants={fadeIn('up', 'spring', 0.4, 1)}
            className="text-xl text-gray-600"
          >
            Transform your farm with AgriEdge – the smart solution for efficient irrigation and real-time monitoring.
          </motion.p>
          <motion.div 
            variants={fadeIn('up', 'spring', 0.6, 1)}
            className="flex space-x-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-full px-8 py-6 text-lg shadow-lg"
              >
                Dashboard
              </Button>
              </Link>
            </motion.div>

            {!isSignedIn && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/signin">
                  <Button 
                    variant="outline" 
                    className="backdrop-blur-sm bg-white/60 border-green-300 text-green-600 rounded-full px-8 py-6 text-lg shadow-md hover:bg-white/80"
                  >
                    Login
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          variants={slideIn('left', 'spring', 0.5, 1.5)}
        >
          <Image 
            src="/landingImage.jpg" 
            alt="Smart Farm Irrigation" 
            width={600} 
            height={400} 
            className="rounded-2xl transform hover:scale-105 transition-transform duration-300 z-0"
          />
          
        </motion.div>
      </motion.main>

      {/* Features Section - Enhanced with Glassmorphism */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute -left-32 top-1/2 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <motion.div 
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="container mx-auto text-center mb-12 relative z-10"
        >
          <motion.h2 
            variants={fadeIn('up', 'spring', 0.2, 1)}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 mb-4"
          >
            Key Features
          </motion.h2>
          <motion.p 
            variants={fadeIn('up', 'spring', 0.4, 1)}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            AgriEdge provides cutting-edge technology to revolutionize agricultural monitoring.
          </motion.p>

          <motion.div 
            variants={staggerContainer(0.1, 0.2)}
            className="container mx-auto grid md:grid-cols-3 gap-8 mt-16"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn('up', 'spring', index * 0.2, 1)}
              >
                <motion.div whileHover={{ y: -10, scale: 1.02 }}>
                  <Card 
                    className="backdrop-blur-lg bg-white/70 border border-white/30 shadow-xl rounded-2xl h-full overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent rounded-2xl z-0"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-green-600 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-gray-600 text-lg">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section - Enhanced with Glassmorphism */}
      <motion.section 
        variants={zoomIn(0.5, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto py-20 text-center relative z-10"
      >
        <div className="grid md:grid-cols-3 gap-8 backdrop-blur-xl bg-green-50/70 rounded-3xl p-12 border border-green-100/80 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-emerald-50/30 z-0"></div>
          
          {[
            { value: "50%", label: "Water Savings" },
            { value: "24/7", label: "Real-Time Monitoring" },
            { value: "30%", label: "Yield Increase" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-sm bg-white/40 rounded-xl p-6 border border-white/50 shadow-md relative z-10"
            >
              <div className="space-y-4">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">{stat.value}</div>
                <div className="text-gray-700 text-lg font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section - Enhanced with Glassmorphism */}
      <section className="py-16 relative">
        <div className="absolute -right-32 top-1/2 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="container mx-auto relative z-10"
        >
          <motion.div 
            variants={fadeIn('up', 'spring', 0.2, 1)}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              CSE (Data Science) • 2023-2027
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            className="grid md:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn('up', 'spring', index * 0.2, 1)}
                className="flex justify-center"
              >
                <motion.div 
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="w-full max-w-sm backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/30 shadow-xl relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-10 z-0`}></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.gradient} p-1 mb-6`}>
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${member.gradient}`}>
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                    <p className={`text-lg font-medium bg-clip-text text-transparent bg-gradient-to-br ${member.gradient} mb-3`}>
                      {member.role}
                    </p>
                    
                    <div className="backdrop-blur-sm bg-white/40 rounded-lg px-4 py-2 border border-white/50 shadow-sm">
                      <p className="text-gray-700">{member.regNo}</p>
                    </div>
                    
                    <p className="text-gray-600 mt-4 text-center">Smart Irrigation with AgriEdge</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Project Credit Footer - Glassmorphism */}
      <footer className="py-8 relative z-10">
        <div className="container mx-auto">
          <div className="backdrop-blur-md bg-white/50 rounded-2xl p-6 border border-white/20 shadow-md text-center">
            <p className="text-gray-700">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 font-semibold">
                AgriEdge
              </span> • Smart Irrigation System
            </p>
            <p className="text-gray-600 mt-2">
              A project by CSE (Data Science) Students • 2023-2027
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}