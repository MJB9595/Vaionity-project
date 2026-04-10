import React, { useState } from 'react'
import './Header.scss'
import { Link, useNavigate } from 'react-router-dom'
import { logout as logoutApi } from '@/api/auth.api'
import { useAuth } from '@/store/auth.store'

const Header = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menus = [
    { name: '내 작성글 ↗', link: '/app/posts/all' },
    { name: '내 프로필 ↗', link: '/app/profile' },
    { name: '카테고리 / 태그 관리 ↗', link: '/app/manage' },
  ]

  const handleLogout = async () => {
    try {
      await logoutApi()
      logout()
      navigate('/')
    } catch (error) {
      alert(error.message || '로그아웃 오류')
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="global-header">
      <div className="inner">
        <h1>
          <Link to="/app">
            <img src="/images/Logo_index.png" alt="VAIONITY" />
          </Link>
        </h1>

        <div className="right">
          <ul className="desktop-menu">
            {menus.map((menu, i) => (
              <li key={i}>
                <Link to={menu.link} className="nav-link">{menu.name}</Link>
              </li>
            ))}
          </ul>
          <button className="logout-btn desktop-menu" onClick={handleLogout}>로그아웃</button>

          <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div className={`mobile-dropdown ${isMenuOpen ? 'show' : ''}`}>
        <ul>
          {menus.map((menu, i) => (
            <li key={i}>
              <Link to={menu.link} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {menu.name}
              </Link>
            </li>
          ))}
          <li>
            <button className="mobile-logout-btn" onClick={handleLogout}>로그아웃</button>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
