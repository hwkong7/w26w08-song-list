import { Outlet, Link, useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "~/lib/auth-store"
import { supabase } from '../lib/supabase'
import { Button, buttonVariants } from "@/components/ui/button"
import { BrandMark } from "@/components/brand"

import { HugeiconsIcon } from "@hugeicons/react"
import { Github01Icon, Logout01Icon } from "@hugeicons/core-free-icons"


export async function clientLoader() {
  if (useAuthStore.getState().status === "loading") {
    // 로그인 상태가 아직 로딩 중이면, 세션을 확인하고 상태를 업데이트
    const { data: { session } } = await supabase.auth.getSession()
    useAuthStore.getState().setSession(session)
  }
}

// 로딩 화면. HydrateFallback 이름 정해져 있음
export function HydrateFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center gap-3 text-sm text-muted-foreground">
      <BrandMark className="size-8 animate-pulse" />
      로그인 세션 연결 중...
    </div>
  )
}

// 오류 화면. ErrorBoundary 이름 정해져 있음
export function ErrorBoundary() {
  return <div className="p-8 text-center text-destructive">오류 발생</div>
}

export default function Layout() {
  const user = useAuthStore(s => s.user)
  const githubSignIn = useAuthStore(s => s.githubSignIn)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const UserMenu = () => (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {user?.email}
      </span>
      <Button
        variant="outline"
        className="h-10 rounded-full px-4 text-sm"
        onClick={async () => {
          await useAuthStore.getState().signOut()
          queryClient.clear()
          navigate('/')
        }}>
        <HugeiconsIcon icon={Logout01Icon} />
        로그아웃
      </Button>
    </div>
  )

  const GuestMenu = () => (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className={buttonVariants({ variant: "ghost", className: "h-10 rounded-full px-4 text-sm font-semibold" })}>
        로그인
      </Link>
      <Link
        to="/signup"
        className={buttonVariants({ className: "h-10 rounded-full px-5 text-sm font-semibold" })}>
        회원가입
      </Link>
      <Button
        variant="outline"
        aria-label="GitHub로 로그인"
        title="GitHub로 로그인"
        className="size-10 rounded-full border-white/20 bg-secondary hover:bg-white/15 dark:bg-secondary"
        onClick={async () => {
          try {
            await githubSignIn()
          } catch (err: any) {
            alert(`GitHub 인증 실패: ${err.message}`)
          }
        }}>
        <HugeiconsIcon icon={Github01Icon} className="size-4" />
      </Button>
    </div>
  )

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold">애창곡</span>
              <span className="text-[10px] tracking-[0.25em] text-muted-foreground">
                MY REPERTOIRE
              </span>
            </span>
          </Link>
          {user ? UserMenu() : GuestMenu()}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
