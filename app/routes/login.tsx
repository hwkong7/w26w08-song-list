import { useState } from "react"
import { useAuthStore } from "../lib/auth-store"
import { useNavigate } from "react-router"
import { LoginForm as ShadcnLoginForm } from "@/components/login-form"
import { AuthShell } from "@/components/auth-shell"

export default function LoginForm() {
  const { signIn, status } = useAuthStore()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      // alert("로그인 성공!")
      navigate("/")
    } catch (err: any) {
      // alert(`로그인 실패: ${err.message}`)
      setError(err.message)
    }
  }

  // return (
    // <form onSubmit={handleLogin}>
    //   <h2>{status}</h2>
    //   <input 
    //     type="email" 
    //     value={email} 
    //     onChange={e => setEmail(e.target.value)} 
    //     placeholder="이메일" />
    //   <input 
    //     type="password" 
    //     value={password} 
    //     onChange={e => setPassword(e.target.value)} 
    //     placeholder="비밀번호" />
    //   <button 
    //     type="submit" 
    //     disabled={status === "loading"}>
    //     {status === "loading" ? "인증 중..." : "로그인"}
    //   </button>
    // </form>
  // )

  return (
    <AuthShell
      title="다시 만나서 반가워요"
      description="로그인하고 나의 애창곡 리스트를 이어서 채워 보세요.">
      <ShadcnLoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        loading={status === "loading"}
        error={error}
      />
    </AuthShell>
  )
}