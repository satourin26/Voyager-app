
export interface GroundingLink {
  title: string;
  uri: string;
}

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  isRange: boolean;
  activity: string;
  content?: string;
  location?: string;
  locationUrl?: string;
  transitDetail?: string;
  transitUrl?: string;
}

export interface DayPlan {
  id: string;
  date: string;
  items: ScheduleItem[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'Food and Drinks' | 'Luxury' | 'Clothing' | 'Electronics' | 'Cosmetics' | 'Other';
  completed: boolean;
  priceTWD?: string;
  priceLocal?: string;
  localCurrency?: string;
  couponUrl?: string;
  couponName?: string;
}

export interface TravelPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  shoppingList: ShoppingItem[];
}

export interface TripBasicInfo {
  destination: string;
  startDate: string;
  endDate: string;
}
