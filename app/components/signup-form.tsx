import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GithubButton, IconInput, PasswordInput } from "@/components/auth-shell"

import { HugeiconsIcon } from "@hugeicons/react"
import { Mail01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons"

import { Link } from "react-router"

interface SignupFormProps {
  email: string
  password: string
  passwordConfirm: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onPasswordConfirmChange: (value: string) => void
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  loading: boolean
  error: string | null
  notice?: string | null // 성공 안내 (예: 이메일 인증 안내)
  className?: string
}

export function SignupForm({
  className,
  email,
  password,
  passwordConfirm,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmChange,
  onSubmit,
  loading,
  error,
  notice,
}: SignupFormProps) {
  return (
    <Card className={cn("gap-6 rounded-2xl bg-card/70 py-7 backdrop-blur-xl", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">새 계정 만들기</CardTitle>
        <CardDescription className="text-sm">
          나만의 애창곡 보관함을 시작해 보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email" className="text-sm font-semibold">이메일</FieldLabel>
              <IconInput
                id="email"
                type="email"
                icon={Mail01Icon}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
              />
              <FieldDescription>로그인과 계정 확인에 사용됩니다.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="text-sm font-semibold">비밀번호</FieldLabel>
              <PasswordInput
                id="password"
                placeholder="8자 이상 입력해 주세요"
                minLength={8}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                required />
              <FieldDescription>8자 이상 입력해 주세요.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password" className="text-sm font-semibold">
                비밀번호 확인
              </FieldLabel>
              <PasswordInput
                id="confirm-password"
                placeholder="비밀번호를 한 번 더 입력해 주세요"
                value={passwordConfirm}
                onChange={(e) => onPasswordConfirmChange(e.target.value)}
                required />
            </Field>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>회원가입 실패</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {notice && (
              <Alert>
                <AlertTitle>거의 다 됐어요!</AlertTitle>
                <AlertDescription>{notice}</AlertDescription>
              </Alert>
            )}

            <Field>
              <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold" disabled={loading}>
                <HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
                {loading ? "가입 중..." : "회원가입"}
              </Button>
              <GithubButton />
              <FieldDescription className="text-center text-sm">
                이미 계정이 있으신가요? <Link to="/login" className="font-semibold text-foreground">로그인</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
