import { HugeiconsIcon } from "@hugeicons/react"
import { MusicNote03Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

// 브랜드 그라데이션 (보라 → 핑크 → 노랑). 여러 곳에서 재사용합니다.
export const brandGradient =
  "bg-linear-to-br from-fuchsia-500 via-pink-500 to-amber-400"

// 원형 그라데이션 안에 음표 아이콘이 들어간 로고
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full text-white shadow-lg shadow-pink-500/30",
        brandGradient,
        className
      )}>
      <HugeiconsIcon icon={MusicNote03Icon} className="size-1/2" />
    </span>
  )
}
