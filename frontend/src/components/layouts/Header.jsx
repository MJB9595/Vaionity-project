import React from 'react'
import './Header.scss'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import { logout } from '@/api/auth.api'
const Header = () => {
  const navigate = useNavigate()

  const menus = [
    {
      name: '내 메모',
      link: '/app/memos'
    },
    {
      name: '내 프로필',
      link: '/app/profile'
    },
    {
      name: '설정',
      link: '/app/setting'
    }
  ]


  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")

    } catch (error) {
      alert(error.message || '로그아웃 오류')
    }
  }
  return (
    <header>
      <div className="inner">
        <h1>
          <Link to="/app">
            <img src="/images/logo.svg" alt="logo" />
          </Link>
        </h1>
        <div className="right">

          <ul>
            {menus.map((menu, i) => (
              <li key={i}>
                <Button
                  icons
                  className="sq"
                  onClick={() => navigate(menu.link)}
                  text={menu.name} />
              </li>
            ))}
          </ul>
          <Button
            text="로그아웃"
            // backico='wh' 
            onClick={handleLogout} />
        </div>
      </div>
    </header>
  )
}

export default Header