import { AppData, Debt, Account, Note, Folder, Bookmark, SellerContact, PromptFolder, SavedPrompt } from '../types';

const STORAGE_KEY = 'LIFEOS_DATA_V1';
const AUTH_KEY = 'LIFEOS_AUTH_V1';

// Initial Seed Data
const INITIAL_DATA: AppData = {
  debts: [],
  accounts: [],
  notes: [
    { id: 'n1', title: 'Chào mừng đến với LifeOS', content: 'Đây là ghi chú mẫu để bạn bắt đầu làm quen với ứng dụng.', folderId: 'f1', isPinned: false, imageUrls: [], createdAt: new Date().toISOString() }
  ],
  folders: [
    { id: 'f1', name: 'Chung', createdAt: new Date().toISOString() },
    { id: 'f2', name: 'Công Việc', createdAt: new Date().toISOString() }
  ],
  bookmarks: [],
  userProfile: {
    displayName: 'Trinh Nữ',
    nickname: 'Vợ Yêu AI',
    avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mem'
  },
  sellerContacts: [
    { id: 'sc1', name: 'Shop Dunk' },
    { id: 'sc2', name: 'Hoàng Hà Mobile' },
    { id: 'sc3', name: 'Divine Shop' },
    { id: 'sc4', name: 'Netflix Share Group' }
  ],
  // New Prompt Data
  promptFolders: [
    { id: 'pf1', name: 'Viết Lách (Copywriting)', color: '#F472B6', icon: '✍️', createdAt: new Date().toISOString(), isPinned: true },
    { id: 'pf2', name: 'Code & Dev', color: '#60A5FA', icon: '💻', createdAt: new Date().toISOString(), isPinned: true },
    { id: 'pf3', name: 'Midjourney Art', color: '#A78BFA', icon: '🎨', createdAt: new Date().toISOString(), isPinned: false },
  ],
  prompts: [
    { 
      id: 'p1', 
      title: 'Chuyên gia viết SEO', 
      content: 'Hãy đóng vai một chuyên gia SEO với 10 năm kinh nghiệm. Viết một bài blog chuẩn SEO dài 1500 từ về chủ đề "Quản lý tài chính cá nhân cho Gen Z". Sử dụng từ khóa: tiết kiệm, đầu tư, quản lý nợ. Giọng văn thân thiện, dễ hiểu.', 
      folderId: 'pf1', 
      purpose: 'Viết content cho blog cá nhân', 
      aiModel: 'GPT-4o', 
      tags: ['SEO', 'Blog', 'Finance'], 
      rating: 5, 
      createdAt: new Date().toISOString(),
      isPinned: true
    },
    { 
      id: 'p2', 
      title: 'Tạo React Component', 
      content: 'Viết code cho một React Component sử dụng Tailwind CSS. Yêu cầu: Card hiển thị thông tin sản phẩm, có hiệu ứng hover, shadow, và responsive mobile-first.', 
      folderId: 'pf2', 
      purpose: 'Code giao diện nhanh', 
      aiModel: 'Claude 3.5 Sonnet', 
      tags: ['React', 'Tailwind', 'Frontend'], 
      rating: 4, 
      createdAt: new Date().toISOString(),
      isPinned: false
    }
  ]
};

// Simple client-side obfuscation (Not military grade, prevents shoulder surfing)
export const simpleEncrypt = (text: string): string => {
  if (!text) return '';
  try {
    return btoa(text.split('').map((char, index) => 
      String.fromCharCode(char.charCodeAt(0) ^ (index % 255))
    ).join(''));
  } catch (e) {
    return text;
  }
};

export const simpleDecrypt = (cypher: string): string => {
  if (!cypher) return '';
  try {
    return atob(cypher).split('').map((char, index) => 
      String.fromCharCode(char.charCodeAt(0) ^ (index % 255))
    ).join('');
  } catch (e) {
    return cypher;
  }
};

// Auth Helpers
export const getStoredPassword = (): string | null => {
  return localStorage.getItem(AUTH_KEY);
};

export const setStoredPassword = (password: string): void => {
  // Simple hash for storage (better than plain text)
  localStorage.setItem(AUTH_KEY, simpleEncrypt(password));
};

export const verifyPassword = (input: string): boolean => {
  const stored = getStoredPassword();
  if (!stored) return false;
  return stored === simpleEncrypt(input);
};

export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Save initial data if empty
      saveData(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(raw);
    
    // Migration: ensure userProfile exists for older data
    if (!parsed.userProfile) parsed.userProfile = INITIAL_DATA.userProfile;
    // Migration: ensure sellerContacts exists
    if (!parsed.sellerContacts) parsed.sellerContacts = INITIAL_DATA.sellerContacts;
    // Migration: ensure prompt system exists
    if (!parsed.promptFolders) parsed.promptFolders = INITIAL_DATA.promptFolders;
    if (!parsed.prompts) parsed.prompts = INITIAL_DATA.prompts;
    
    saveData(parsed); // Save any migration changes immediately
    return parsed;
  } catch (error) {
    console.error("Failed to load data", error);
    return INITIAL_DATA;
  }
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data", error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};