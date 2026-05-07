import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import './Auth.scss'
import Input from '@/components/ui/Input'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { login as loginApi } from '@/api/auth.api'
import { useAuth } from '@/store/auth.store'

// ✅ 카카오 로그인 — 백엔드 /auth/kakao 엔드포인트 주소
const KAKAO_LOGIN_URL = `${import.meta.env.VITE_API_URL}/auth/kakao`

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { login, isReady, isAuthed } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ✅ 카카오 콜백 실패 시 URL 파라미터로 넘어오는 에러 처리
  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      if (urlError === 'kakao_cancelled') {
        setError('카카오 로그인이 취소되었습니다.')
      } else {
        setError(decodeURIComponent(urlError))
      }
    }
  }, [searchParams])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim()) {
      setError('이메일을 입력해주세요')
      return
    }
    if (!form.password.trim()) {
      setError('비밀번호를 입력해주세요')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const data = await loginApi({
        email: form.email.trim(),
        password: form.password
      })
      login(data)
      navigate('/app')
    } catch (error) {
      setError(error.message || '로그인을 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ 카카오 로그인 버튼 클릭 — 백엔드 /auth/kakao 로 리디렉션
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_LOGIN_URL
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (isReady && isAuthed) {
    return <Navigate to="/app" replace />
  }

  return (
    <section className='auth'>
      <div className="inner">
        <div className="auth-box">

          <nav>
            <h2>로그인</h2>
            <Button
              text="뒤로가기"
              backico='wh'
              className="back"
              onClick={handleBack}
            />
          </nav>

          <form className='auth-form' onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
              />
              <Input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div className="auth-btn-wrap">
              <div>
                <Link to="/signup">
                  <Button text="계정이 없으신가요?" />
                </Link>
              </div>
              <Button
                text={isLoading ? '로그인 중...' : '로그인'}
                type="submit"
                className="primary"
                disabled={isLoading}
              />
            </div>
          </form>

          {error && <p className='error-text'>{error}</p>}

          {/* ✅ 소셜 로그인 구분선 */}
          <div className="social-divider">
            <span>또는</span>
          </div>

          {/* ✅ 카카오 로그인 버튼 */}
          <button
            type="button"
            className="kakao-login-btn"
            onClick={handleKakaoLogin}
          >
            <img
              src="/images/kakao-logo.svg"
              alt="카카오"
              className="kakao-icon"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            카카오 로그인
          </button>

        </div>
      </div>
    </section>
  )
}

export default Login