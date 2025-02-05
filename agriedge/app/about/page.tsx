"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  const developers = [
    {
      name: "Mithil Girish",
      image: "/mithil.jpeg",
    },
    {
      name: "Vaibhav PK",
      image: "/vaibhav.jpeg",

    },
    {
      name: "Seba",
      image: "/seba.jpg",

    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto py-32 px-4"
      >
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
            The Future of Farming,<br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          <p className="text-2xl text-gray-600 font-light leading-relaxed">
            AgriEdge combines precision agriculture with cutting-edge IoT technology to transform traditional farming into data-driven ecosystem.
          </p>
        </div>
      </motion.main>

      {/* Mission Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-5xl font-semibold text-gray-900 mb-6">
              Our Philosophy
            </h2>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              We believe in creating technology that disappears into the background, letting farmers focus on what they do best - nurturing life from the earth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="container mx-auto py-28 px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-semibold text-gray-900">
              Precision Agriculture,<br />
              Perfected
            </h2>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Our ESP32-powered sensors create a mesh network across your fields, delivering real-time microclimate data with laboratory-grade accuracy.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
                Technical Specifications
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            <Image 
              src="/aboutImage1.jpg" 
              alt="IoT in Agriculture" 
              width={800} 
              height={600} 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="bg-gray-50 py-28">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-semibold text-gray-900 mb-6">
            Meet the Team
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Meet the team behind AgriEdge 💚
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {developers.map((developer, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full ">
                  <CardHeader >
                    <div className="flex justify-center relative group ">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                      <Image 
                        src={developer.image} 
                        alt={developer.name} 
                        width={200} 
                        height={200} 
                        className="rounded-full w-48 h-48 object-cover border-4 border-white shadow-xl"
                      />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-900 mt-8 text-center p-2">
                      {developer.name}
                    </CardTitle>
                    
                  </CardHeader>
     
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}