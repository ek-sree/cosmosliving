import { formatDate } from '@/src/utils/formateDate';

interface SavedProperty {
  imageUri: string;
  title: string;
  address: string;
  city: string;
  price: string;
}

interface Booking {
  imageUri: string;
  title: string;
  status: string;
  location: string;
  address: string;
  startDate: string;
  endDate: string;
  guestName: string;
  price: string;
}

interface BookingHistory {
  imageUri: string;
  title: string;
  status: string; 
  location: string;
  address: string;
  startDate: string;
  endDate: string;
  guestName: string;
  price: string;
}

// Input types from Profile.js
interface WatchlistItem {
  photos?: { url: string }[];
  title?: string;
  address?: { address: string };
  city?: string;
  price?: number;
}

interface BookingItem {
  property?: {
    photos?: { url: string }[];
    title?: string;
    city?: string;
    country?: string;
    address?: { address: string };
  };
  status?: string;
  checkIn?: string;
  checkOut?: string;
  guest?: string;
  rent?: number;
}

interface Bookings {
  pending: BookingItem[];
  completed: BookingItem[];
  ConfirmedBookings: BookingItem[];
}

export const transformSavedProperties = (watchlist: WatchlistItem[] = []): SavedProperty[] => {
  return watchlist.map(item => ({
    imageUri: item.photos?.[0]?.url || 'https://via.placeholder.com/150',
    title: item.title || 'Untitled Property',
    address: item.address?.address || 'N/A',
    city: `${item.city || 'N/A'}`,
    price: `${item.price || 0} AED`,
  }));
};

export const transformBookings = (bookings: Bookings = { pending: [], ConfirmedBookings: [], completed: [] }): Booking[] => {
  const allBookings = [...(bookings.pending || []), ...(bookings.ConfirmedBookings || [])];
  return allBookings.map(item => ({
    imageUri: item.property?.photos?.[0]?.url || 'https://via.placeholder.com/150',
    title: item.property?.title || 'Untitled Property',
    status: item.status || 'Pending',
    location: `${item.property?.city || 'N/A'}, ${item.property?.country || 'N/A'}`,
    address: item.property?.address?.address || 'N/A',
    startDate: formatDate(item.checkIn),
    endDate: formatDate(item.checkOut),
    guestName: item.guest || 'N/A',
    price: `${item.rent || 0} AED`,
  }));
};

export const transformBookingHistory = (completedBookings: BookingItem[] = []): BookingHistory[] => {
  return completedBookings.map(item => ({
    imageUri: item.property?.photos?.[0]?.url || 'https://via.placeholder.com/150',
    title: item.property?.title || 'Untitled Property',
    status: item.status || 'Completed', 
    location: `${item.property?.city || 'N/A'}, ${item.property?.country || 'N/A'}`,
    address: item.property?.address?.address || 'N/A',
    startDate: formatDate(item.checkIn),
    endDate: formatDate(item.checkOut),
    guestName: item.guest || 'N/A',
    price: `${item.rent || 0} AED`,
  }));
};