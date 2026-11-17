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
import { Login01Icon, Mail01Icon } from "@hugeicons/core-free-icons"

import { Link } from "react-router"

interface LoginFormProps {
  className?: string
  email: string
  password: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  loading: boolean
  error: string | null
}

export function LoginForm({
  className,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
  error,
}: LoginFormProps) {
  return (
    <Card className={cn("gap-6 rounded-2xl bg-card/70 py-7 backdrop-blur-xl", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">로그인</CardTitle>
        <CardDescription className="text-sm">
          이메일과 비밀번호를 입력해 주세요.
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
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="text-sm font-semibold">비밀번호</FieldLabel>
              <PasswordInput
                id="password"
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                required />
            </Field>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>로그인 실패</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Field>
              <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold" disabled={loading}>
                <HugeiconsIcon icon={Login01Icon} className="size-4" />
                {loading ? "로그인 중..." : "로그인"}
              </Button>
              <GithubButton />
              <FieldDescription className="text-center text-sm">
                계정이 없으신가요? <Link to="/signup" className="font-semibold text-foreground">회원가입</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
