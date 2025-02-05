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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.main 
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto py-20 grid md:grid-cols-2 gap-10 items-center"
      >
        <motion.div 
          variants={fadeIn('right', 'spring', 0.2, 1.5)}
          className="space-y-6"
        >
          <h1 className="text-5xl font-bold text-gray-900">
            Smart Irrigation <br />
            <span className="text-green-600">With AgriEdge</span>
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
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 text-lg"
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
        className="border-green-600 text-green-600 rounded-full px-8 py-6 text-lg"
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
          className="relative overflow-hidden rounded-2xl shadow-2xl"
        >
          <Image 
            src="/landingImage.jpg" 
            alt="Smart Farm Irrigation" 
            width={600} 
            height={400} 
            className="rounded-lg transform hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </motion.main>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <motion.div 
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="container mx-auto text-center mb-12"
        >
          <motion.h2 
            variants={fadeIn('up', 'spring', 0.2, 1)}
            className="text-4xl font-bold text-gray-900 mb-4"
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
                <motion.div whileHover={{ y: -10 }}>
                  <Card 
                    className="hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl h-full"
                  >
                    <CardHeader>
                      <CardTitle className="text-green-600 text-2xl">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-lg">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        variants={zoomIn(0.5, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto py-20 text-center"
      >
        <div className="grid md:grid-cols-3 gap-8 bg-green-50 rounded-3xl p-12">
          <div className="space-y-4">
            <div className="text-5xl font-bold text-green-600">50%</div>
            <div className="text-gray-600 text-lg">Water Savings</div>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-green-600">24/7</div>
            <div className="text-gray-600 text-lg">Real-Time Monitoring</div>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-green-600">30%</div>
            <div className="text-gray-600 text-lg">Yield Increase</div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}