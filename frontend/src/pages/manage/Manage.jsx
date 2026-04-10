import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyTags, createTags, deleteTags } from '@/api/tag.api'
import { getCategories, createCategory, deleteCategory } from '@/api/category.api'
import PagesHeader from '@/components/layouts/PagesHeader'
import './Manage.scss'

const Manage = () => {
  const navigate = useNavigate()

  // 태그 상태
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [tagLoading, setTagLoading] = useState(true)
  const [tagError, setTagError] = useState(null)
  const [isAddingTag, setIsAddingTag] = useState(false)

  // 카테고리 선택 상태 (정보 표시용)
  const [categories, setCategories] = useState([])
  const [catInput, setCatInput] = useState('')          // label
  const [catValueInput, setCatValueInput] = useState('') // value (영문 키)
  const [catLoading, setCatLoading] = useState(true)
  const [isAddingCat, setIsAddingCat] = useState(false)

  const loadCategories = async () => {
    try {
      setCatLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (e) {
      alert('카테고리를 불러오지 못했습니다.')
    } finally {
      setCatLoading(false)
    }
  }

  useEffect(() => { loadCategories() }, [])

  const handleAddCategory = async () => {
    const label = catInput.trim()
    const value = catValueInput.trim()
    if (!label || !value) return alert('카테고리 이름과 키(영문)를 모두 입력하세요.')
    try {
      setIsAddingCat(true)
      const created = await createCategory({ value, label })
      setCategories((prev) => [...prev, created])
      setCatInput('')
      setCatValueInput('')
    } catch (e) {
      alert(e?.response?.data?.message || '카테고리 추가 실패')
    } finally {
      setIsAddingCat(false)
    }
  }

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`"${cat.label}" 카테고리를 삭제하시겠습니까?`)) return
    try {
      await deleteCategory(cat.id)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
    } catch (e) {
      alert(e?.response?.data?.message || '카테고리 삭제 실패')
    }
  }

  const loadTags = async () => {
    try {
      setTagLoading(true)
      const res = await getMyTags()
      const list = Array.isArray(res) ? res : res?.data ?? []
      setTags(list.map((t) => ({ id: t.id, label: typeof t === 'string' ? t : t.label ?? t.name })))
      setTagError(null)
    } catch (e) {
      setTagError(e?.message || '태그를 불러오지 못했습니다.')
    } finally {
      setTagLoading(false)
    }
  }

  useEffect(() => { loadTags() }, [])

  const handleAddTag = async () => {
    const next = tagInput.trim()
    if (!next) return
    if (tags.some((t) => t.label === next)) {
      alert('이미 존재하는 태그입니다.')
      setTagInput('')
      return
    }
    try {
      setIsAddingTag(true)
      const created = await createTags(next)
      setTags((prev) => [...prev, { id: created.id, label: created.label ?? created.name ?? next }])
      setTagInput('')
    } catch (e) {
      alert(e?.response?.data?.message || '태그 추가 실패')
    } finally {
      setIsAddingTag(false)
    }
  }

  const handleDeleteTag = async (tag) => {
    if (!window.confirm(`"${tag.label}" 태그를 삭제하시겠습니까?`)) return
    try {
      await deleteTags(tag.id)
      setTags((prev) => prev.filter((t) => t.id !== tag.id))
    } catch (e) {
      alert(e?.response?.data?.message || '태그 삭제 실패')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddTag() }
  }

  return (
    <section className='page manage-section'>
      <div className="manage-inner">
        <PagesHeader
          title='카테고리 / 태그 관리'
          buttonText='뒤로가기'
          showButton
          buttonClass="back bl"
          backico="bh"
          onClick={() => navigate(-1)}
        />

        <div className="manage-grid">
          {/* ─── 카테고리 패널 ─── */}
          <div className="manage-card">
            <div className="manage-card-header">
              <h3>카테고리</h3>
              <span className="manage-badge">{categories.length}개</span>
            </div>
            <p className="manage-desc">카테고리를 추가하거나 삭제할 수 있습니다.</p>

            <div className="tag-add-row">
              <input
                type="text"
                className="tag-add-input"
                placeholder="카테고리 이름 (예: 플래그십 시리즈 Z)"
                value={catInput}
                onChange={(e) => setCatInput(e.target.value)}
                disabled={isAddingCat}
              />
              <input
                type="text"
                className="tag-add-input"
                placeholder="영문 키 (예: FLAGSHIP_Z)"
                value={catValueInput}
                onChange={(e) => setCatValueInput(e.target.value)}
                disabled={isAddingCat}
              />
              <button
                className="tag-add-btn"
                onClick={handleAddCategory}
                disabled={isAddingCat || !catInput.trim() || !catValueInput.trim()}
              >
                {isAddingCat ? '추가 중...' : '+ 추가'}
              </button>
            </div>

            {catLoading ? (
              <p className="manage-loading">카테고리를 불러오는 중...</p>
            ) : (
              <ul className="tag-manage-list">
                {categories.map((cat) => (
                  <li key={cat.id} className="tag-manage-item">
                    <span className="tag-chip">{cat.label}</span>
                    <span className="cat-value" style={{ fontSize: '11px', color: '#888', marginLeft: '6px' }}>
                      {cat.value}
                    </span>
                    <button
                      className="tag-delete-btn"
                      onClick={() => handleDeleteCategory(cat)}
                      title="카테고리 삭제"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ─── 태그 패널 ─── */}
          <div className="manage-card">
            <div className="manage-card-header">
              <h3>태그</h3>
              <span className="manage-badge">{tags.length}개</span>
            </div>
            <p className="manage-desc">태그를 추가하거나 삭제할 수 있습니다. 게시글에 태그를 달아 분류하세요.</p>

            <div className="tag-add-row">
              <input
                type="text"
                className="tag-add-input"
                placeholder="새 태그 이름 입력 후 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAddingTag}
              />
              <button
                className="tag-add-btn"
                onClick={handleAddTag}
                disabled={isAddingTag || !tagInput.trim()}
              >
                {isAddingTag ? '추가 중...' : '+ 추가'}
              </button>
            </div>

            {tagError && <p className="manage-error">{tagError}</p>}

            {tagLoading ? (
              <p className="manage-loading">태그를 불러오는 중...</p>
            ) : tags.length === 0 ? (
              <p className="manage-empty">등록된 태그가 없습니다. 태그를 추가해보세요!</p>
            ) : (
              <ul className="tag-manage-list">
                {tags.map((tag) => (
                  <li key={tag.id} className="tag-manage-item">
                    <span className="tag-chip">#{tag.label}</span>
                    <button
                      className="tag-delete-btn"
                      onClick={() => handleDeleteTag(tag)}
                      title="태그 삭제"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Manage
