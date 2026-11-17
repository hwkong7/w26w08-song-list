import { supabase } from '../lib/supabase'
import { useAuthStore } from "~/lib/auth-store"
import type { Route } from "./+types/list"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Landing } from "@/components/landing"
import { BrandMark } from "@/components/brand"
import { cn } from "@/lib/utils"

import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon, YoutubeIcon } from "@hugeicons/core-free-icons"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "애창곡" },
    { name: "description", content: "나의 애창곡 리스트" },
  ];
}

type Song = {
  id: string
  title: string
  artist: string | null
  rating: number
  lyrics: string | null
}

// ⭐ 별점 표시 (읽기 전용)
function Stars({ value }: { value: number }) {
  return (
    <span className="text-sm text-amber-400" aria-label={`평점 ${value}점`}>
      {"★".repeat(value)}
      <span className="text-muted-foreground/40">{"★".repeat(5 - value)}</span>
    </span>
  )
}

// ⭐ 별점 선택 (입력용)
function StarPicker({ value, onChange }: { value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="평점">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}점`}
          onClick={() => onChange(n)}
          className={cn(
            "text-2xl leading-none transition-transform hover:scale-110",
            n <= value ? "text-amber-400" : "text-muted-foreground/30"
          )}>
          ★
        </button>
      ))}
    </div>
  )
}

// ➕ 노래 추가 다이얼로그 (리스트 위에 폼을 두지 않고, 버튼 → 모달로 입력)
function AddSongDialog({ trigger }: { trigger: React.ReactElement }) {
  const user = useAuthStore(s => s.user)
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [rating, setRating] = useState(5)
  const [lyrics, setLyrics] = useState("")

  const addSongMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('songs')
        // user_id를 함께 저장해야 RLS(내 노래만 보기) 정책에서 내 노래로 인식됩니다.
        .insert([{ title, artist, rating, lyrics, user_id: user?.id }])
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      setTitle("")
      setArtist("")
      setRating(5)
      setLyrics("")
      setOpen(false)
    },
    onError: (err: any) => {
      alert(`노래 추가 실패: ${err.message}`)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">새 노래 추가</DialogTitle>
          <DialogDescription>애창곡 리스트에 노래를 기록하세요.</DialogDescription>
        </DialogHeader>

        <form
          id="add-song-form"
          onSubmit={e => {
            e.preventDefault()
            addSongMutation.mutate()
          }}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">노래 제목 *</FieldLabel>
              <Input id="title" className="h-10" value={title} onChange={e => setTitle(e.target.value)} placeholder="예) 밤편지" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="artist">가수 *</FieldLabel>
              <Input id="artist" className="h-10" value={artist} onChange={e => setArtist(e.target.value)} placeholder="예) 아이유" required />
            </Field>
            <Field>
              <FieldLabel>평점</FieldLabel>
              <StarPicker value={rating} onChange={setRating} />
            </Field>
            <Field>
              <FieldLabel htmlFor="lyrics">가사</FieldLabel>
              <Textarea id="lyrics" rows={4} value={lyrics} onChange={e => setLyrics(e.target.value)} placeholder="기억하고 싶은 가사 한 줄" />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="add-song-form" className="h-10 px-5 text-sm" disabled={addSongMutation.isPending}>
            {addSongMutation.isPending ? "추가 중..." : "추가하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 🗑️ 삭제 버튼 + 확인 다이얼로그 (브라우저 기본 confirm() 대신)
function DeleteSongButton({ song }: { song: Song }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const deleteSongMutation = useMutation({
    mutationFn: async (songId: string) => {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      setOpen(false)
    },
    onError: (err: any) => {
      alert(`노래 삭제 실패: ${err.message}`)
    }
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={`${song.title} 삭제`} className="text-muted-foreground hover:text-destructive" />
        }>
        <HugeiconsIcon icon={Delete02Icon} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>'{song.title}'을(를) 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제한 노래는 되돌릴 수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteSongMutation.isPending}
            onClick={() => deleteSongMutation.mutate(song.id)}>
            {deleteSongMutation.isPending ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SongCard({ song }: { song: Song }) {
  return (
    <Card className="break-inside-avoid border-border/60 bg-card/70 transition-colors hover:border-pink-500/40">
      <CardHeader>
        <CardTitle className="line-clamp-1 text-xl font-bold tracking-tight">
          {song.title}
        </CardTitle>
        <p className="text-sm font-medium text-muted-foreground">
          {song.artist || '가수 없음'}
        </p>
      </CardHeader>

      {song.lyrics && (
        <CardContent>
          <p className="rounded-lg border-l-2 border-pink-500/60 bg-muted/60 px-3 py-2 text-sm whitespace-pre-line text-muted-foreground italic">
            "{song.lyrics}"
          </p>
        </CardContent>
      )}

      <CardFooter className="justify-between">
        <Stars value={song.rating} />
        <div className="flex items-center gap-1">
          <a
            href={`https://www.youtube.com/results?search_query=노래방+${song.title}+${song.artist}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", className: "h-7 rounded-full px-3" })}>
            <HugeiconsIcon icon={YoutubeIcon} className="text-red-500" />
            노래방
          </a>
          <DeleteSongButton song={song} />
        </div>
      </CardFooter>
    </Card>
  )
}

export default function List() {
  const user = useAuthStore(s => s.user)

  const { data: songs = [], isPending, isError, error } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false }) // 최근에 추가한 노래가 먼저
      if (error) throw new Error(error.message)
      return data as Song[]
    },
    enabled: !!user, // user가 있을 때만 쿼리 실행 (!!는 not의 not)

    // 5분 동안 신선한 상태 유지 (절대 서버에 다시 요청하지 않음)
    // staleTime이 줄어들다가 0이 되어도 자동으로 refetch되지는 않음
    // 다시 페이지를 방문했을 때 stale (시듬) 상태면 refetch됨
    staleTime: 1000 * 60 * 5,
  })

  // 로그인하지 않았으면 소개(랜딩) 화면
  if (!user) return <Landing />

  const addButton = (
    <Button className="h-10 rounded-full px-5 text-sm font-semibold">
      <HugeiconsIcon icon={Add01Icon} />
      새 노래
    </Button>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* 페이지 헤더: 제목 + 노래 수 + 추가 버튼 */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">내 애창곡</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            언제든 다시 꺼내 부를 나만의 리스트
            {!isPending && !isError && (
              <Badge variant="secondary" className="rounded-full">{songs.length}곡</Badge>
            )}
          </p>
        </div>
        <AddSongDialog trigger={addButton} />
      </div>

      {/* 로딩 중: 로고 깜빡임 + 카드 모양 자리표시(스켈레톤) */}
      {isPending && (
        <div>
          <p className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
            <BrandMark className="size-7 animate-pulse" />
            노래 데이터를 불러오는 중...
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <Card key={i} className="animate-pulse border-border/60 bg-card/50">
                <CardContent className="space-y-3">
                  <div className="h-5 w-2/3 rounded-md bg-muted" />
                  <div className="h-4 w-1/3 rounded-md bg-muted" />
                  <div className="h-12 rounded-lg bg-muted/70" />
                  <div className="flex justify-between">
                    <div className="h-4 w-20 rounded-md bg-muted" />
                    <div className="h-6 w-16 rounded-full bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <p className="py-20 text-center text-destructive">에러 발생: {error.message}</p>
      )}

      {/* 빈 상태: 노래가 없어도 여기서 바로 추가할 수 있게 */}
      {!isPending && !isError && songs.length === 0 && (
        <Card className="items-center gap-4 border-dashed py-16 text-center">
          <BrandMark className="size-14" />
          <div>
            <p className="text-lg font-bold">아직 등록된 노래가 없어요</p>
            <p className="mt-1 text-sm text-muted-foreground">첫 번째 애창곡을 추가해 보세요.</p>
          </div>
          <AddSongDialog trigger={addButton} />
        </Card>
      )}

      {songs.length > 0 && (
        <div className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
          {songs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  )
}
