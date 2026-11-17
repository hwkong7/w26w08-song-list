# 애창곡 UI 개선 가이드 (shadcn)

이 문서는 애창곡 앱의 화면을 shadcn으로 다듬은 과정을 **순서대로 따라 할 수 있게** 정리한 것입니다.
각 단계마다 "무엇을, 왜" 바꿨는지와 핵심 코드를 적었습니다. 전체 코드는 해당 파일을 열어 보세요.

## 바뀐 파일 한눈에 보기

| 파일 | 상태 | 내용 |
|---|---|---|
| `public/favicon.svg` | 새로 만듦 | 그라데이션 음표 파비콘 |
| `app/root.tsx` | 수정 | 파비콘 링크 추가 |
| `app/components/brand.tsx` | 새로 만듦 | 로고(`BrandMark`)와 브랜드 그라데이션 |
| `app/routes/layout.tsx` | 수정 | 상단 헤더 디자인, 로딩 화면 |
| `app/components/landing.tsx` | 새로 만듦 | 비로그인 첫 화면(히어로 + 기능 소개) |
| `app/components/auth-shell.tsx` | 새로 만듦 | 로그인·회원가입 공통 틀, 아이콘 입력창, GitHub 버튼 |
| `app/components/login-form.tsx` | 수정 | 로그인 카드 디자인 |
| `app/components/signup-form.tsx` | 수정 | 회원가입 카드 디자인, 성공 안내 |
| `app/routes/login.tsx` | 수정 | `AuthShell`로 감싸기 |
| `app/routes/signup.tsx` | 수정 | 가입 후 안내 문구 버그 수정 |
| `app/routes/list.tsx` | 수정 | 노래 카드, 추가 다이얼로그, 삭제 확인 다이얼로그, 빈 상태 |
| `app/components/ui/dialog.tsx` 외 3개 | shadcn CLI로 추가 | `dialog`, `alert-dialog`, `textarea`, `badge` |

---

## 1단계. 필요한 shadcn 컴포넌트 추가

```bash
pnpm exec shadcn add dialog alert-dialog textarea badge
```

- `dialog`: 노래 추가 창(모달)
- `alert-dialog`: 삭제 확인 창
- `textarea`: 가사 입력칸
- `badge`: "나만의 노래 아카이브", "42곡" 같은 작은 라벨

`app/components/ui/` 아래에 파일이 생깁니다. 이 프로젝트는 `base-mira` 스타일(Base UI 기반)이라
Radix 기반 예제와 사용법이 조금 다릅니다. 예를 들어 버튼을 트리거로 쓸 때 `asChild` 대신 **`render`** 속성을 씁니다.

```tsx
<DialogTrigger render={<Button>새 노래</Button>} />
```

---

## 2단계. 파비콘 바꾸기

1. `public/favicon.svg`를 만듭니다. 보라→핑크→노랑 그라데이션 원 안에 흰 음표가 있는 SVG입니다.
2. `app/root.tsx`의 `links`에 한 줄을 추가합니다.

```tsx
export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  // ...기존 폰트 링크
];
```

기존 `favicon.ico`는 SVG를 지원하지 않는 오래된 브라우저용으로 남겨 두었습니다.

---

## 3단계. 브랜드 로고 컴포넌트 만들기 (`app/components/brand.tsx`)

헤더, 로그인 화면, 빈 목록 화면 등 여러 곳에서 같은 로고를 쓰기 때문에 컴포넌트로 분리했습니다.

```tsx
export const brandGradient =
  "bg-linear-to-br from-fuchsia-500 via-pink-500 to-amber-400"

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex size-10 items-center justify-center rounded-full text-white shadow-lg shadow-pink-500/30", brandGradient, className)}>
      <HugeiconsIcon icon={MusicNote03Icon} className="size-1/2" />
    </span>
  )
}
```

> Tailwind v4에서는 그라데이션 클래스가 `bg-gradient-to-br`가 아니라 **`bg-linear-to-br`** 입니다.

---

## 4단계. 헤더 다듬기 (`app/routes/layout.tsx`)

| 전 | 후 |
|---|---|
| 파란 배경 + "애창곡" 글자 | 반투명 검정 배경 + 블러, 로고 + "애창곡 / MY REPERTOIRE" |
| 버튼 3개가 같은 모양 | 로그인(투명) · 회원가입(강조) · GitHub(동그란 아이콘 버튼) |
| 로그인 후 "로그아웃"만 | 내 이메일 + 로그아웃 버튼 |

핵심 포인트:

- `sticky top-0 backdrop-blur-xl bg-background/80` → 스크롤해도 헤더가 위에 붙어 있고 뒤가 살짝 비칩니다.
- `Link`에 버튼 모양을 입힐 때는 `buttonVariants()`를 씁니다.

```tsx
<Link to="/signup" className={buttonVariants({ className: "h-10 rounded-full px-5 text-sm font-semibold" })}>
  회원가입
</Link>
```

- 아이콘만 있는 버튼에는 꼭 `aria-label`을 붙여 주세요(스크린리더용).
- GitHub 버튼은 처음에 `outline`만 줬더니 배경이 헤더와 거의 같아서 버튼처럼 보이지 않았습니다.
  `bg-secondary border-white/20`으로 배경과 테두리를 밝혀서 동그란 버튼이 또렷하게 보이게 했습니다.
- `HydrateFallback`(로딩 화면)도 로고가 깜빡이는 모양으로 바꿨습니다.

---

## 5단계. 비로그인 첫 화면 (`app/components/landing.tsx`)

전에는 로그인하지 않으면 `list.tsx`가 `return null`이라 **헤더만 있는 빈 화면**이었습니다.
이제는 소개 화면을 보여 줍니다.

```tsx
// list.tsx
if (!user) return <Landing />
```

구성:

1. **배지** "나만의 노래 아카이브"
2. **큰 제목** — 두 번째 줄은 글자에 그라데이션을 입혔습니다.
   ```tsx
   <span className="bg-linear-to-r from-fuchsia-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
     좋아하는 만큼.
   </span>
   ```
3. **버튼 2개** — "로그인하고 시작하기"(강조), "무료로 가입하기"(외곽선)
4. **LP 레코드 일러스트** — 이미지 파일 없이 CSS만으로 그렸습니다.
   - `repeating-radial-gradient`로 레코드 홈(줄무늬)을 만들고
   - `animate-[spin_24s_linear_infinite]`로 천천히 돌립니다.
   - 가운데 라벨은 `brandGradient`, 위에 떠 있는 "오늘의 애창곡" 카드는 `Card` + `backdrop-blur`
5. **기능 소개 카드 3개** — 배열을 `map`으로 돌려서 같은 모양을 반복합니다.

---

## 6단계. 로그인 · 회원가입 화면 (`auth-shell.tsx`, `login-form.tsx`, `signup-form.tsx`)

두 화면의 틀(배지 → 큰 제목 → 설명 → 카드 → 하단 안내)이 같아서 `AuthShell` 하나로 묶었습니다.

```tsx
// routes/login.tsx
<AuthShell title="다시 만나서 반가워요" description="로그인하고 나의 애창곡 리스트를 이어서 채워 보세요.">
  <ShadcnLoginForm ... />
</AuthShell>
```

같은 파일에 재사용 부품 3개를 만들었습니다.

- **`IconInput`**: 왼쪽에 아이콘이 들어간 입력창. 바깥을 `relative`, 아이콘을 `absolute left-3.5`로 두고 입력창에 `pl-10`을 줘서 글자가 아이콘과 겹치지 않게 합니다.
- **`PasswordInput`**: 눈 모양 버튼으로 비밀번호 보기/숨기기. `useState`로 `type`을 `"password"` ↔ `"text"`로 바꿉니다.
  - Edge 브라우저는 비밀번호 칸에 자기 '보기' 버튼을 자동으로 넣어서 눈 아이콘이 2개가 됩니다.
    `app/app.css`에 아래를 추가해 Edge 버튼을 숨겼습니다.
    ```css
    input::-ms-reveal,
    input::-ms-clear { display: none; }
    ```
- **`GithubButton`**: "또는" 구분선 + "GitHub로 계속하기" 버튼. 이제 헤더뿐 아니라 로그인/회원가입 카드 안에서도 GitHub 로그인을 할 수 있습니다.

함께 고친 것:

- 영어 문구(Login to your account 등)를 한국어로 바꿨습니다.
- 회원가입 카드의 오류 제목이 "로그인 실패"였던 것을 **"회원가입 실패"**로 고쳤습니다.
- `loading` 값이 전달만 되고 쓰이지 않던 것을 버튼에 연결했습니다(로그인 중에는 버튼 비활성화 + "로그인 중...").

### 회원가입 안내 문구 버그 수정 (`routes/signup.tsx`)

전에는 이렇게 되어 있었습니다.

```tsx
setError("Email 확인하여 인증하시기 바랍니다.")
navigate("/login")   // ← 바로 이동해서 위 문구가 화면에 거의 안 보임
```

이제는 가입 결과에 따라 나눕니다.

```tsx
await signUp(email, password)
if (useAuthStore.getState().status === "authenticated") {
  navigate("/")            // 이메일 인증이 꺼져 있어 바로 로그인된 경우
} else {
  setNotice("가입한 이메일로 인증 메일을 보냈어요. ...")  // 이 화면에 안내 표시
}
```

안내는 빨간 오류 상자가 아니라 일반 `Alert`(`notice`)로 보여 줍니다.

---

## 7단계. 노래 목록 화면 (`app/routes/list.tsx`)

### 7-1. 노래 추가는 "버튼 → 다이얼로그"로

리스트 위에 입력 폼이 항상 펼쳐져 있으면 목록이 아래로 밀려서 보기 불편합니다.
그래서 많이 쓰는 방식대로 **페이지 제목 오른쪽의 "새 노래" 버튼 → 모달 창**으로 바꿨습니다.

```
┌──────────────────────────────────────────────┐
│ 내 애창곡  [42곡]                  [+ 새 노래] │ ← 버튼만 차지
├──────────────────────────────────────────────┤
│ 카드  카드  카드                               │ ← 목록이 바로 보임
```

- `AddSongDialog` 컴포넌트로 분리했습니다. 상태(`title`, `artist`, `rating`, `lyrics`)와 추가 mutation이 이 안에 들어 있습니다.
- `open` 상태를 직접 관리해서, **추가에 성공하면 창이 자동으로 닫히고** 입력칸이 초기화됩니다.
- 평점은 숫자 입력 대신 **별 5개를 눌러서 고르는** `StarPicker`로 바꿨습니다.
- 제출 버튼이 폼 바깥(`DialogFooter`)에 있어서 `form="add-song-form"` 속성으로 폼과 연결했습니다.

### 7-2. 노래가 0곡일 때(빈 상태)

전에는 노래가 없으면 문구 한 줄만 보이고 끝나서 **첫 곡을 추가할 방법이 없었습니다.**
이제는 점선 카드에 "아직 등록된 노래가 없어요" + "새 노래" 버튼을 보여 줍니다.
그래서 `if (...) return` 대신 조건부 렌더링(`{조건 && (...)}`)으로 바꿨습니다.

### 7-3. 삭제 확인은 `confirm()` 대신 `AlertDialog`

브라우저 기본 `confirm()` 창은 디자인을 바꿀 수 없어서, shadcn `AlertDialog`로 바꿨습니다.

```tsx
<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger render={<Button variant="ghost" size="icon" aria-label={`${song.title} 삭제`} />}>
    <HugeiconsIcon icon={Delete02Icon} />
  </AlertDialogTrigger>
  <AlertDialogContent>
    ...
    <AlertDialogCancel>취소</AlertDialogCancel>
    <AlertDialogAction variant="destructive" onClick={() => deleteSongMutation.mutate(song.id)}>삭제</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

> 이 프로젝트의 `AlertDialogAction`은 눌러도 창이 자동으로 닫히지 않습니다.
> 그래서 `open` 상태를 두고, 삭제가 성공한 뒤(`onSuccess`)에 `setOpen(false)`로 닫습니다.

### 7-4. 카드 디자인

- 별점: `⭐️ 4 / 5` → 노란 별 4개 + 흐린 별 1개
- 가사: 왼쪽에 핑크 세로줄이 있는 인용 상자
- 노래방: 빨간 유튜브 아이콘이 있는 동그란 외곽선 버튼
- 삭제: 휴지통 아이콘 버튼(마우스를 올리면 빨간색)
- `break-inside-avoid`: 여러 열(`columns-3`) 배치에서 카드가 중간에 잘려 다음 열로 넘어가지 않게 합니다.

### 7-5. 노래 불러오는 중 화면 (스켈레톤)

전에는 "노래 데이터를 불러오는 중..." 한 줄만 보였습니다.
이제는 깜빡이는 로고와 함께, 카드가 나타날 자리에 **회색 카드 모양(스켈레톤)** 6개를 보여 줍니다.
`animate-pulse`를 카드에 주면 전체가 은은하게 깜빡입니다.

```tsx
{isPending && (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2, 3, 4, 5].map(i => (
      <Card key={i} className="animate-pulse">
        <CardContent className="space-y-3">
          <div className="h-5 w-2/3 rounded-md bg-muted" />   {/* 제목 자리 */}
          <div className="h-4 w-1/3 rounded-md bg-muted" />   {/* 가수 자리 */}
          <div className="h-12 rounded-lg bg-muted/70" />     {/* 가사 자리 */}
        </CardContent>
      </Card>
    ))}
  </div>
)}
```

### 7-6. 데이터 쪽 변경 2가지

```tsx
.select('*').order('created_at', { ascending: false })   // 최근 추가한 노래가 먼저
.insert([{ title, artist, rating, lyrics, user_id: user?.id }])  // 내 노래로 저장
```

`user_id`를 함께 저장하는 이유: Supabase RLS가 "내 노래만 보기"로 설정되어 있으면,
`user_id` 없이 저장한 노래는 내 목록에 안 보이거나 저장이 거부될 수 있습니다.
(GitHub 계정으로 로그인했을 때 노래가 0곡으로 보였던 것도 같은 RLS 때문입니다.)

---

## 8단계. 확인하기

```bash
pnpm typecheck   # 타입 오류가 없는지
pnpm dev         # http://localhost:5173
```

확인할 것:

- [ ] 브라우저 탭에 새 파비콘이 보인다 (안 바뀌면 강력 새로고침: `Ctrl+Shift+R`)
- [ ] 로그아웃 상태 메인에 소개 화면이 보인다
- [ ] 로그인/회원가입 화면에서 비밀번호 보기 버튼이 동작한다
- [ ] "새 노래" → 창에서 추가 → 창이 닫히고 맨 앞에 카드가 생긴다
- [ ] 휴지통 → 확인 창 → "취소"하면 아무 일도 없다

> 처음 `pnpm dev`를 켰을 때 `504 (Outdated Optimize Dep)` 오류가 나면, 새로 추가한 패키지를
> Vite가 다시 준비하는 중이라 생기는 일입니다. 새로고침하면 사라집니다.
