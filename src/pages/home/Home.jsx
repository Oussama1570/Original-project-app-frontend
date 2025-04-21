import React from "react";
import OurSellers from "./OurSellers";
import { Helmet } from "react-helmet";


const Home = () => {
  return (
    <div className="main-content">
      <div className="home-container px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto">
        <Helmet>
          <title>Home</title>
          <meta name="description" content />
        </Helmet>

        {/* 🏡 Hero Section */}
        
          <section className="text-center py-8">
            <h1 className="text-3xl  text-primary">Welcome</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum, 
              ligula vel commodo tempor, elit lacus ullamcorper augue, vitae fermentum justo sem a mauris.
            </p>
          </section>
       

        {/* ✨ Banner Section */}
       
          <section className="mb-12">
            <div className="text-center mt-6">
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet diam at nulla egestas malesuada.
              </p>
            </div>
          </section>
       

        {/* 🛍️ Our Sellers Section */}
       
          <section className="py-10 rounded-2xl shadow-md mt-10">
            <div className="text-center">
              <h2 className="text-2xl  text-secondary">Our Sellers</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non nibh eu turpis blandit porta.
              </p>
            </div>
            <OurSellers />
          </section>
       

       
      </div>
    </div>
  );
};

export default Home;
