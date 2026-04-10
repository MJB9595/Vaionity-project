import React, { useState, useEffect } from 'react'
import './ProfileComponentAll.scss'
import { useAuth } from '@/store/auth.store'
import { getMe, updateMe } from '@/api/auth.api'
import { PROFILE_ICONS } from '../../constants/profileIcon'
import { MEMBER_STATUS_LABEL } from '@/constants/memberStatus'

const Field = ({ label, icon, children, hint }) => (
  <div className="profile-info-field">
    <label>
      {icon && <img src={icon} alt="" />}
      {label}
    </label>
    {children}
    {hint && <p className="hint">{hint}</p>}
  </div>
)

const ProfileBase = () => {
  const { login: setAuthMember } = useAuth()

  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // 기본 정보 수정
  const [edit, setEdit] = useState(false)
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await getMe()
        if (mounted) { setMember(data); setLoadError(null) }
      } catch (e) {
        if (mounted) { setLoadError(e?.message || '프로필을 불러오지 못했습니다.'); setMember(null) }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const statusDisplay = member?.status
    ? MEMBER_STATUS_LABEL[member.status] ?? member.status
    : '-'

  const startEdit = () => {
    if (!member) return
    setFormName(member.name ?? '')
    setFormPhone(member.phone ?? '')
    setSaveError(null)
    setSaveSuccess(false)
    setEdit(true)
  }

  const cancelEdit = () => {
    setEdit(false)
    setSaveError(null)
    setSaveSuccess(false)
  }

  const saveProfile = async () => {
    if (!formName.trim()) { setSaveError('이름을 입력해주세요.'); return }

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      const updated = await updateMe({ name: formName.trim(), phone: formPhone.trim() })
      setMember(updated)
      setAuthMember(updated)
      setEdit(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      setSaveError(e?.message || '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='profile-card'>
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (loadError || !member) {
    return (
      <div className='profile-card'>
        <p className="hint error">{loadError || '프로필을 불러오지 못했습니다.'}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    )
  }

  return (
    <div className='profile-card profile-base-card'>
      <div className="profile-card-title">
        <h4>내 정보</h4>
        {saveSuccess && <span className="save-success-badge">✓ 저장되었습니다</span>}
      </div>

      {/* 이름 */}
      <Field label="이름" icon={PROFILE_ICONS.user}>
        {edit ? (
          <input
            className='profile-input-native'
            id="profile-name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="이름을 입력하세요"
            maxLength={20}
          />
        ) : (
          <div className="profile-value">{member.name || '-'}</div>
        )}
      </Field>

      {/* 전화번호 */}
      <Field label="전화번호" icon={PROFILE_ICONS.phone} hint="본인 인증에 사용됩니다.">
        {edit ? (
          <input
            className='profile-input-native'
            id="profile-phone"
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            placeholder="010-0000-0000"
            maxLength={15}
            type="tel"
          />
        ) : (
          <div className="profile-value">{member.phone || '-'}</div>
        )}
      </Field>

      {/* 이메일 (읽기 전용) */}
      <Field label="이메일" icon={PROFILE_ICONS.mail} hint="로그인 및 알림 수신에 사용됩니다.">
        <div className="profile-value readonly">
          {member.email || '-'}
          {member.emailVerified
            ? <span className="verify-badge verified">✓ 인증됨</span>
            : <span className="verify-badge unverified">미인증</span>
          }
        </div>
      </Field>

      {/* 회원 상태 (읽기 전용) */}
      <Field label="회원 상태" icon={PROFILE_ICONS.badge} hint="서비스 이용 가능 여부를 나타냅니다.">
        <div className="profile-value readonly">{statusDisplay}</div>
      </Field>

      {saveError && <p className="save-error-msg">{saveError}</p>}

      <div className="btn-wrap">
        {edit ? (
          <>
            <button
              className="profile-btn save"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
            <button
              className="profile-btn cancel"
              onClick={cancelEdit}
              disabled={saving}
            >
              취소
            </button>
          </>
        ) : (
          <button className="profile-btn edit" onClick={startEdit}>
            내 정보 수정하기
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfileBase
