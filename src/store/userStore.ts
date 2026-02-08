import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponseVO } from '@/types/api'

interface UserState {
  user: LoginResponseVO | null; // 修改：替换为LoginResponseVO
  isLogin: boolean;
  isAdmin: boolean; // 新增：快捷判断是否为管理员（后续拓展可用）
  // 登录：接收LoginResponseVO
  login: (userInfo: LoginResponseVO) => void;
  // 退出登录
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLogin: false,
      isAdmin: false,

      // ========== 登录逻辑 - 存储角色+判断管理员 ==========
      login: (userInfo) => set({ 
        user: userInfo, 
        isLogin: true,
        isAdmin: userInfo.roles.includes('ROLE_ADMIN') // 单角色场景始终为false
      }),

      // 退出登录：重置所有状态
      logout: () => set({ user: null, isLogin: false, isAdmin: false })
    }),
    {
      name: 'user-storage', // 本地存储key
      partialize: (state) => ({ user: state.user }) // 只持久化user
    }
  )
)