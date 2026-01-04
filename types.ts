export type ViewState = 'dashboard' | 'debts' | 'accounts' | 'notes' | 'bookmarks' | 'prompts';

export interface BaseEntity {
  id: string;
  createdAt: string;
}

export interface Debt extends BaseEntity {
  name: string;
  totalAmount: number;
  monthlyPayment: number;
  dueDate: number;
  paymentCycleMonths: number;
  startDate: string;
  type: string;
  notes?: string;
  creditLimit?: number;
  minPayment?: number;
  interestRate?: number;
  installmentTerm?: number;
  installmentType?: 'flat' | 'reducing' | 'manual';
  lender?: string;
  borrower?: string;
  productName?: string;
}

export interface Account extends BaseEntity {
  serviceName: string;
  package?: string;
  email: string;
  source?: string;
  purchaseDate?: string;
  expirationDate?: string;
  sellerContact?: string;
  loginId?: string;
  password?: string;
  licenseKey?: string;
  notes?: string;
}

export interface Note extends BaseEntity {
  title: string;
  content: string;
  folderId: string;
  isPinned: boolean;
  imageUrls: string[];
}

export interface Folder extends BaseEntity {
  name: string;
}

export interface Bookmark extends BaseEntity {
  title: string;
  url: string;
  category: string;
  notes?: string;
  isPinned: boolean;
}

export interface UserProfile {
  displayName: string;
  nickname: string;
  avatarUrl: string;
}

export interface SellerContact {
  id: string;
  name: string;
}

// --- New Prompt Vault Types ---
export interface PromptFolder extends BaseEntity {
  name: string;
  color: string; // Hex code or tailwind class reference
  icon: string; // Emoji or Icon name
  isPinned: boolean;
}

export interface SavedPrompt extends BaseEntity {
  title: string;
  content: string; // The actual prompt text
  folderId: string;
  purpose: string; // What is this for?
  aiModel: string; // GPT-4, Midjourney, Claude...
  expectedOutput?: string;
  tags: string[];
  rating: number; // 1-5 stars
  imageUrl?: string; // Illustrative image
  isPinned: boolean;
}

// Global App State Interface
export interface AppData {
  debts: Debt[];
  accounts: Account[];
  notes: Note[];
  folders: Folder[];
  bookmarks: Bookmark[];
  userProfile: UserProfile;
  sellerContacts: SellerContact[];
  // New Fields
  promptFolders: PromptFolder[];
  prompts: SavedPrompt[];
}