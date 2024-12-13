export interface Business {
  id: string;
  title: string;
  logo: string;
  banner: string;
  description: string;
  price: number;
  industry?: string[];
  createdAt: Date;
  seller: {
    user_id: string;
  };
}

