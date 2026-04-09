import React from 'react'
import './ProfilePage.scss'
import Button from '@/components/ui/Button'
import ProfileBase from '@/components/profile/ProfileBase'
import ProfileName from '@/components/profile/ProfileName'
import ProfileSummary from '@/components/profile/ProfileSummary'
import PagesHeader from '../../components/layouts/PagesHeader'
import { useNavigate } from 'react-router-dom'
const Profile = () => {

  const navigate = useNavigate() 
  const handleGoBack = ()=> {
    navigate(-1)
  }
  return (
    <section className='page profile-section'>
      <div className="inner">
        <PagesHeader
          title='내 프로필'
          buttonText='뒤로가기'
          showButton
          buttonClass="back bl"
        />
        <main>
          <div className='left'>
            <ProfileName />
            <ProfileSummary />   
          </div>
            <ProfileBase />
        </main>
      </div>
    </section>
  )
}

export default Profile