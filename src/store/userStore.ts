import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserInfo } from '@/types/api'

interface UserState {
  user: UserInfo | null;
  isLogin: boolean;
  // 登录（存储token和用户名）
  login: (token: string, username: string, nickname?: string) => void;
  // 退出登录
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLogin: false,

      login: (token, username, nickname) => set({ 
        user: { token, username, nickname }, 
        isLogin: true 
      }),

      logout: () => set({ user: null, isLogin: false })
    }),
    {
      name: 'user-storage', // 本地存储key
      partialize: (state) => ({ user: state.user }) // 只持久化user
    }
  )
)