import React, { useEffect, useRef, useState } from 'react'
import './PostCreateEdit.scss'
import './PostPagesAll.scss'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useCategories } from '@/hooks/useCategories'
import PostTag from '@/components/posts/PostTag'
import { createPost } from '@/api/post.api'
import { uploadImage } from '@/api/file.api'
import { createTags, deleteTags, getMyTags } from '@/api/tag.api'

const PostCreate = () => {
  const navigate = useNavigate()

  const { categories } = useCategories()   
  const [category, setCategory] = useState('') 
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const fileInputRef = useRef(null)
  const [tagInput, setTagInput] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const loadMyTags = async () => {
    const res = await getMyTags()
    const list = Array.isArray(res) ? res : res?.data ?? []
    setTags(list.map((t) => ({ id: t.id, label: typeof t === 'string' ? t : t.label ?? t.name })))
  }

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].value)
    }
  }, [categories])

  useEffect(() => {
    loadMyTags().catch((e) => console.error(e))
  }, [])

  const handleAddTag = async () => {
    const next = tagInput.trim()
    if (!next) return
    if (tags.some((t) => t.label == next)) {
      setTagInput('')
      return
    }
    try {
      setIsAddingTag(true)
      const created = await createTags(next)
      setTags((prev) => {
        if (prev.some((t) => t.id === created.id || t.label === created.label)) return prev
        return [...prev, { id: created.id, label: created.label }]
      })
      setTagInput('')
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.message || '태그 추가 실패')
    } finally {
      setIsAddingTag(false)
    }
  }

  const handleKenEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = async (tag) => {
    try {
      await deleteTags(tag.id)
      setTags((prev) => prev.filter((t) => t.id !== tag.id))
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.message || '태그 삭제 실패')
    }
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const presigned = await uploadImage(file)
      setImageUrl(presigned.fileUrl ?? presigned.fileKey ?? null) 
    } catch (error) {
      console.error('이미지 업로드 실패', error)
    } finally {
      e.target.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!title.trim()) return alert('제목을 입력하세요')
    if (!content.trim()) return alert('내용을 입력하세요')

    try {
      setIsSaving(true)
      const payload = { category, title, content, imageUrl, tags: tags.map((t) => t.label) }
      await createPost(payload)
      navigate('/app')
    } catch (error) {
      console.error('메세지 저장 실패', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className='page post-section'>
      {/* 590px 제약이던 .inner를 .layout-container로 변경하여 넓게 사용 */}
      <div className="layout-container post-create">
        <form onSubmit={handleSave} className='post-form'>
          <div className="post-card">
            <div className="post-field">
              <label className='post-label'>카테고리</label>
              <div className="post-input-wrap">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {Array.isArray(categories) && categories.map((opt) => (
                    <option value={opt.value} key={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 공통 Input 컴포넌트의 다크테마 충돌을 피하기 위해 직접 태그로 작성 */}
            <div className="post-field">
              <label className="post-label">제목</label>
              <div className="post-input-wrap">
                <input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                />
              </div>
            </div>

            <div className="post-tag-box">
              <div className="tags">
                {tags.map((t) => (
                  <PostTag tag={t.label} onClick={() => handleRemoveTag(t)} key={t.id} />
                ))}
                <input
                  value={tagInput}
                  onKeyDown={handleKenEnter}
                  onChange={(e) => setTagInput(e.target.value)}
                  type="text" className='post-tag-input' placeholder='tag를 자유롭게 입력하세요'
                />
                <button type="button" onClick={handleAddTag} className="post-tag-add-btn">
                  + 태그 추가
                </button>
              </div>
            </div>

            <div className="post-field">
              <label className='post-label'>내용</label>
              <div className="post-input-wrap">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className='post-textarea' placeholder='내용을 자유롭게 입력하세요'
                />
              </div>
            </div>

            <div className="post-upload-card">
              <div onClick={() => fileInputRef.current?.click()} className="post-upload-placeholder">
                <input type="file" ref={fileInputRef} accept='image/*' onChange={handleUploadImage} className='post-uppload-input' />
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" className='post-upload-preview' />
                ) : (
                  <img src="/images/add.svg" alt="img" className='post-upload-icon' />
                )}
                <p className='post-upload-title'>이미지를 업로드 하세요</p>
                <span className="post-upload-desc">클릭하거나 파일을 드래그 하여 업로드</span>
              </div>
            </div>

            <div className="post-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소하기</button>
              <button type="submit" className="btn-save">저장하기</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default PostCreate