export interface Business {
  listing_id: number; // Unique identifier for the business listing
  title: string; // Title of the business
  description: string; // Description of the business
  price: number; // Price of the business listing
  industry?: string[]; // Optional array of industries
  created_at: Date; // Date when the business was created
  seller_id: number; // ID of the user who is the seller
  logo?: string; // Optional URL for the business logo
  banner?: string; // Optional URL for the business banner
}