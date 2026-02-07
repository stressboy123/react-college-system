import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  user: User | null;
  isLogin: boolean;
  // 登录
  login: (userInfo: User) => void;
  // 退出登录
  logout: () => void;
  // 注册
  register: (newUser: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLogin: false,

  // 登录方法
  login: (userInfo) => set({ user: userInfo, isLogin: true }),

  // 退出登录
  logout: () => set({ user: null, isLogin: false }),

  // 注册方法（模拟，实际需调后端）
  register: (newUser) => set((state) => ({
    // 注：实际注册需后端入库，这里仅前端临时存储
    user: newUser,
    isLogin: false, // 注册后需重新登录
  })),
}));