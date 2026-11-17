import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  HeadphonesIcon,
  MusicNote03Icon,
  QuoteDownIcon,
  Shield01Icon,
  SparklesIcon,
  StarIcon,
} from "@hugeicons/core-free-icons"

import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { brandGradient } from "@/components/brand"
import { cn } from "@/lib/utils"

const features = [
  { icon: MusicNote03Icon, title: "한 곳에 모으는 애창곡", desc: "기억하고 싶은 노래와 가수를 놓치지 않게 기록하세요." },
  { icon: StarIcon, title: "나만의 평점", desc: "오늘의 기분에 맞춰 1점부터 5점까지 남길 수 있어요." },
  { icon: QuoteDownIcon, title: "가사까지 함께", desc: "잊고 싶지 않은 문장을 노래와 함께 보관해 두세요." },
]

// 로그인하지 않은 사용자에게 보여주는 첫 화면
export function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* 배경 빛 번짐 효과 */}
      <div className="pointer-events-none absolute -top-40 right-0 size-[36rem] rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-[28rem] left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-fuchsia-600/15 blur-3xl" />

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-12 sm:px-6 lg:grid-cols-2 lg:pt-24">
        <div>
          <Badge variant="outline" className="h-7 gap-1.5 rounded-full px-3 text-xs text-muted-foreground">
            <HugeiconsIcon icon={SparklesIcon} className="text-amber-400" />
            나만의 노래 아카이브
          </Badge>

          <h1 className="mt-6 text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl">
            좋아하는 노래를,
            <br />
            <span className="bg-linear-to-r from-fuchsia-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              좋아하는 만큼.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            애창곡과 가사, 평점을 한 곳에 기록하세요. 언제든 다시 꺼내 보고,
            나만의 무대를 만들어 갈 수 있어요.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className={buttonVariants({ className: "h-12 rounded-xl px-6 text-base font-semibold shadow-lg shadow-pink-500/20" })}>
              로그인하고 시작하기
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
            <Link
              to="/signup"
              className={buttonVariants({ variant: "outline", className: "h-12 rounded-xl px-6 text-base font-semibold" })}>
              무료로 가입하기
            </Link>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={Shield01Icon} className="size-4 text-emerald-400" />
            Supabase 계정으로 안전하게 동기화됩니다.
          </p>
        </div>

        {/* 오른쪽: LP 레코드 일러스트 */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 animate-[spin_24s_linear_infinite] rounded-full bg-[repeating-radial-gradient(circle,#18181b_0px,#18181b_6px,#27272a_7px)] shadow-[0_0_80px_-10px] shadow-fuchsia-600/40" />
          <div className={cn("absolute inset-[31%] flex items-center justify-center rounded-full", brandGradient)}>
            <span className="flex size-1/2 items-center justify-center rounded-full bg-black/20 text-white">
              <HugeiconsIcon icon={MusicNote03Icon} className="size-7" />
            </span>
          </div>

          <Badge variant="outline" className="absolute top-[-4%] right-0 h-8 gap-1.5 rounded-full bg-background/80 px-3 text-xs backdrop-blur">
            <HugeiconsIcon icon={HeadphonesIcon} />
            나만의 플레이리스트
          </Badge>
          <Badge variant="outline" className="absolute top-[11%] right-[4%] h-7 rounded-full bg-background/80 px-3 text-xs font-bold tracking-widest backdrop-blur">
            SIDE A · 33⅓
          </Badge>

          <Card className="absolute bottom-[-4%] left-[-4%] w-56 bg-background/80 backdrop-blur-xl">
            <CardContent className="space-y-1">
              <p className="text-xs tracking-widest text-muted-foreground">오늘의 애창곡</p>
              <p className="text-lg font-bold">밤편지</p>
              <p className="text-sm text-muted-foreground">아이유</p>
              <p className="pt-1 text-sm text-amber-400">★★★★★ <span className="text-muted-foreground">5.0</span></p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-4 px-4 pt-8 pb-20 sm:px-6 md:grid-cols-3">
        {features.map(f => (
          <Card key={f.title} className="bg-card/60">
            <CardContent className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                <HugeiconsIcon icon={f.icon} className="size-5" />
              </span>
              <div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
