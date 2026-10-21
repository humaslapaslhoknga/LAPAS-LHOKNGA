export type TabType = 'beranda' | 'pendaftaran' | 'tiket-antrean' | 'layanan';

export type ServiceType = 'tatap_muka' | 'video_call' | 'titipan_barang';

export interface Visitor {
  name: string;
  nik: string;
  relation: string;
  phone: string;
  address: string;
  isVerified: boolean;
}

export interface WBP {
  id: string;
  name: string;
  alias?: string;
  regNumber: string;
  room: string;
  block: string;
  caseType: string;
  sentenceLength: string;
  expiryDate: string;
  photoUrl?: string;
}

export interface VisitTicket {
  id: string;
  bookingCode: string;
  serviceType: ServiceType;
  wbp: WBP;
  visitor: Visitor;
  additionalVisitors?: Array<{
    name: string;
    nik: string;
    relation: string;
    ageGroup: 'dewasa' | 'anak';
  }>;
  visitDate: string; // e.g., '2024-10-24'
  formattedDate: string; // 'Kamis, 24 Okt 2024'
  session: 'pagi' | 'siang';
  sessionTime: string; // '08.30 - 11.30 WIB'
  exactTime: string; // '09.00 WIB'
  loket: string; // 'LOKET 02'
  lockerNumber: string; // 'Loker Mandiri #18'
  tableNumber: string; // 'Meja 08'
  status: 'active' | 'completed' | 'cancelled';
  goodsNote?: string;
  foodItems?: string[];
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  date: string;
  excerpt: string;
  fullContent: string[];
  imageUrl: string;
}

export interface QueueItem {
  number: string;
  serviceType: string;
  loket: string;
  status: 'calling' | 'serving' | 'completed' | 'waiting';
  time: string;
}
