import { useCallback, useEffect, useState } from 'react'

/**
 * 夜间模式状态管理 hook。
 * 规则：
 * - 首次访问自动跟随系统主题（prefers-color-scheme）。
 * - 用户手动切换后仅当前会话生效，不持久化到 localStorage。
 * - 刷新页面后重新检测系统主题。
 * - 浏览器不支持 matchMedia 时默认回退到浅色模式。
 */
export function useDarkMode() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const initial = getInitialDarkMode()
    applyDarkMode(initial)
    return initial
  })

  useEffect(() => {
    applyDarkMode(enabled)
  }, [enabled])

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev)
  }, [])

  return { enabled, toggle }
}

function getInitialDarkMode(): boolean {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  } catch {
    // matchMedia 不可用时降级为浅色模式
  }
  return false
}

function applyDarkMode(enabled: boolean) {
  const root = document.documentElement
  if (enabled) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
