import React, { useState } from 'react';

const ListBusinesses = () => {
  // Dummy data - replace with actual API call later
  const [businesses] = useState([
    {
      id: 1,
      name: "Tech Solutions Inc",
      description: "Providing innovative tech solutions for small businesses. We specialize in cloud computing, web development, and IT consulting services.",
      category: "Technology",
      rating: 4.5,
      image: "https://picsum.photos/seed/1/400/250",
    },
    {
      id: 2,
      name: "Green Gardens",
      description: "Professional landscaping and garden maintenance.",
      category: "Home & Garden",
      rating: 4.8,
      image: "https://picsum.photos/seed/2/400/250",
    },
    {
      id: 3,
      name: "Culinary Delights",
      description: "Award-winning catering service with expertise in international cuisine. We cater for events of all sizes, from intimate gatherings to large corporate functions.",
      category: "Food & Beverage",
      rating: 4.2,
      image: "https://picsum.photos/seed/3/400/250",
    },
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-primary">Business Listings</h1>
        
        {/* Search and Filter Section */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search businesses..." 
            className="input input-bordered w-full max-w-xs" 
          />
          <select className="select select-bordered w-full max-w-xs">
            <option disabled selected>Category</option>
            <option>Technology</option>
            <option>Food & Beverage</option>
            <option>Home & Garden</option>
          </select>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div key={business.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
              <figure className="relative h-48">
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 badge badge-primary">{business.category}</div>
              </figure>
              
              <div className="card-body">
                <h2 className="card-title">
                  {business.name}
                  <div className="badge badge-secondary">
                    ★ {business.rating}
                  </div>
                </h2>
                
                <p className="line-clamp-3 text-base-content/70">
                  {business.description}
                </p>
                
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm">View Details</button>
                  <button className="btn btn-outline btn-sm">Contact</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="join">
            <button className="join-item btn">«</button>
            <button className="join-item btn btn-active">1</button>
            <button className="join-item btn">2</button>
            <button className="join-item btn">3</button>
            <button className="join-item btn">»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListBusinesses; 