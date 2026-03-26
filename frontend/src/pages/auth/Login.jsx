import React, { useState } from 'react'
import Button from '../../components/ui/Button'
import './Auth.scss'
import Input from '@/components/ui/Input'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '@/api/auth.api'
const Login = () => {

  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSumit = async (e) => {
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
      await login({
        email: form.email.trim(),
        password: form.password
      })
      navigate('/app')

    } catch (error) {
      setError(error.message || '로그인을 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }


  const handleBack = () => {
    navigate(-1)
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
              onClick={handleBack} />
          </nav>
          <form className='auth-form' onSubmit={handleSumit}>
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
              <Button text="로그인" type="submit" className="primary" />
            </div>
          </form>
          {error && <p className='error-text'> {error}</p>}
          <div className="auth-now">
            <span>계정이 없으신가요?</span>
            <Link to="/signup">
              <Button text="회원가입하기" icons />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login