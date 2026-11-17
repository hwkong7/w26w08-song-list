import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Github01Icon,
  Shield01Icon,
  SquareLock02Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrandMark } from "@/components/brand"
import { useAuthStore } from "~/lib/auth-store"

// 로그인/회원가입 페이지 공통 틀: 상단 뱃지 + 큰 제목 + 설명 + 카드 + 하단 안내
export function AuthShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-fuchsia-700/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-[-10rem] size-[30rem] rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-md flex-col items-center px-4 py-14">
        <Badge variant="outline" className="h-9 gap-2 rounded-full bg-background/60 pr-4 pl-1.5 text-sm text-muted-foreground">
          <BrandMark className="size-6 shadow-none" />
          애창곡
        </Badge>
        <h1 className="mt-6 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-center text-muted-foreground">{description}</p>

        <div className="mt-8 w-full">{children}</div>

        <p className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground">
          <HugeiconsIcon icon={Shield01Icon} className="size-3.5" />
          Supabase로 안전하게 보호되는 나만의 기록
        </p>
      </div>
    </div>
  )
}

// 왼쪽 아이콘이 들어간 입력창
export function IconInput({
  icon,
  className,
  ...props
}: React.ComponentProps<"input"> & { icon: any }) {
  return (
    <div className="relative">
      <HugeiconsIcon icon={icon} className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="h-11 rounded-xl pl-10 text-sm md:text-sm" {...props} />
    </div>
  )
}

// 비밀번호 보기/숨기기 토글이 있는 입력창
export function PasswordInput(props: React.ComponentProps<"input">) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <HugeiconsIcon icon={SquareLock02Icon} className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input type={show ? "text" : "password"} className="h-11 rounded-xl pr-10 pl-10 text-sm md:text-sm" {...props} />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        <HugeiconsIcon icon={show ? ViewOffIcon : ViewIcon} className="size-4" />
      </button>
    </div>
  )
}

// "또는" 구분선 + GitHub 로그인 버튼
export function GithubButton() {
  const githubSignIn = useAuthStore(s => s.githubSignIn)
  return (
    <>
      <div className="relative my-1 text-center text-xs text-muted-foreground">
        <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <span className="relative bg-card px-3">또는</span>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl text-sm font-semibold"
        onClick={async () => {
          try {
            await githubSignIn()
          } catch (err: any) {
            alert(`GitHub 인증 실패: ${err.message}`)
          }
        }}>
        <HugeiconsIcon icon={Github01Icon} className="size-4" />
        GitHub로 계속하기
      </Button>
    </>
  )
}
