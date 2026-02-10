import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponseVO } from '@/types/api'
import type { UserInfoDTO } from '@/types/userInfo';

interface UserState {
  user: LoginResponseVO | null; // 修改：替换为LoginResponseVO
  isLogin: boolean;
  isAdmin: boolean; // 新增：快捷判断是否为管理员（后续拓展可用）
  userInfo: UserInfoDTO | null;
  // 登录：接收LoginResponseVO
  login: (userInfo: LoginResponseVO) => void;
  // 退出登录
  logout: () => void;
  // 更新用户详细信息缓存
  updateUserInfo: (info: UserInfoDTO | null) => void;
  // 清空用户详细信息缓存
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLogin: false,
      isAdmin: false,
      userInfo: null,

      // ========== 登录逻辑 - 存储角色+判断管理员 ==========
      login: (userInfo) => set({ 
        user: userInfo, 
        isLogin: true,
        isAdmin: userInfo.roles.includes('ROLE_ADMIN') // 单角色场景始终为false
      }),

      // 退出登录：重置所有状态
      logout: () => set({ user: null, isLogin: false, isAdmin: false }),
      
      // 更新用户详细信息缓存
      updateUserInfo: (info) => set({ userInfo: info }),

      // 清空用户详细信息缓存
      clearUserInfo: () => set({ userInfo: null })
    }),
    {
      name: 'user-storage', // 本地存储key
      partialize: (state) => ({ user: state.user, userInfo: state.userInfo }) // 只持久化user和userInfo
    }
  )
)