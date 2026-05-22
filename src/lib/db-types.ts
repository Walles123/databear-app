export type Customer = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  user_id: string;
};

export type Offer = {
  id: string;
  created_at: string;
  customer_id: string;
  title: string;
  description: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  user_id: string;
};

export type Order = {
  id: string;
  created_at: string;
  customer_id: string;
  offer_id?: string;
  title: string;
  description: string;
  amount: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  user_id: string;
};
