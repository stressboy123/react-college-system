import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse } from '@/types/api'

interface UserState {
  user: LoginResponse | null
  isLogin: boolean
  // 登录
  login: (userInfo: LoginResponse) => void
  // 退出登录
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLogin: false,

      login: (userInfo) => set({ user: userInfo, isLogin: true }),

      logout: () => set({ user: null, isLogin: false })
    }),
    {
      name: 'user-storage', // 本地存储key
      partialize: (state) => ({ user: state.user }) // 只持久化user
    }
  )
)