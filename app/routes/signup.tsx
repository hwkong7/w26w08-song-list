import { useState } from "react"
import { SignupForm as ShadcnSignupForm } from "@/components/signup-form"
import { useAuthStore } from "../lib/auth-store"
import { useNavigate } from "react-router"
import { AuthShell } from "@/components/auth-shell"

export default function SignupForm() {
  const { signUp, status } = useAuthStore()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const handleSignup = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      // return alert("비밀번호가 일치하지 않습니다.")
      return setError("비밀번호가 일치하지 않습니다.")
    }

    setError("")
    setNotice("")
    try {
      await signUp(email, password)
      if (useAuthStore.getState().status === "authenticated") {
        // 이메일 인증이 꺼져 있어 바로 로그인된 경우 → 메인으로
        navigate("/")
      } else {
        // 이메일 인증이 필요한 경우 → 안내를 이 화면에 보여줌 (바로 이동하면 안내가 사라짐)
        setNotice("가입한 이메일로 인증 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.")
      }
    } catch (err: any) {
      // alert(`회원가입 실패: ${err.message}`)
      setError(err.message)
    }
  }


  // return (
  //   <form onSubmit={handleSignup}>
  //     <h2>Email 회원가입 ({status})</h2>
  //     <input 
  //       type="email" 
  //       value={email} 
  //       onChange={e => setEmail(e.target.value)} 
  //       placeholder="이메일" 
  //       required
  //     />
  //     <input 
  //       type="password" 
  //       value={password} 
  //       onChange={e => setPassword(e.target.value)} 
  //       placeholder="비밀번호" 
  //       required
  //     />
  //     <input 
  //       type="password" 
  //       value={confirmPassword} 
  //       onChange={e => setConfirmPassword(e.target.value)} 
  //       placeholder="비밀번호 확인" 
  //       required
  //     />
  //     <button 
  //       type="submit" 
  //       disabled={status === "authenticated"}>
  //       회원가입
  //     </button>
  //   </form>
  // )


  return (
    <AuthShell
      title="나만의 무대를 시작하세요"
      description="이메일로 가입하고 애창곡과 가사를 한 곳에 모아 보세요.">
      <ShadcnSignupForm
        notice={notice}
        email={email}
        password={password}
        passwordConfirm={confirmPassword}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onPasswordConfirmChange={setConfirmPassword}
        onSubmit={handleSignup}
        loading={status === "loading"}
        error={error}
      />
    </AuthShell>
  )
}
