'use client'

import React from 'react';
import { Header } from '@/components/ui/Header'; // Adjust the import path as necessary
import Browse from "@/components/ui/Browse" // Import the Browse component

const Page = () => {
  return (
    <div>
      <Header />
      <Browse /> {/* Use the Browse component here */}
    </div>
  );
};

export default Page;