import React, { useEffect, useRef, useState } from 'react'
import './PostCreateEdit.scss'
import './PostPagesAll.scss'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useCategories } from '@/hooks/useCategories'
import PostTag from '@/components/posts/PostTag'
import { getPostById, updatePost } from '@/api/post.api'
import { uploadImage } from '@/api/file.api'
import { createTags, deleteTags, getMyTags } from '@/api/tag.api'

const PostEdit = () => {
  const { id } = useParams()
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
  const [isLoading, setIsLoading] = useState(true)

  const loadMyTags = async () => {
    const res = await getMyTags()
    const list = Array.isArray(res) ? res : res?.data ?? []
    setTags(list.map((t) => ({ id: t.id, label: typeof t === 'string' ? t : t.label ?? t.name })))
  }

  const loadPostDetail = async () => {
    try {
      setIsLoading(true)
      const res = await getPostById(id)
      const post = res?.data ?? res
      setCategory(post?.category ?? 'DAILY')
      setTitle(post?.title ?? '')
      setContent(post?.content ?? '')
      setImageUrl(post?.imageUrl ?? null)

      const postTags = Array.isArray(post?.tags) ? post.tags : []
      setTags(
        postTags.map((t, index) => ({
          id: t.id ?? `${t.label ?? t.name ?? t}-${index}`,
          label: typeof t === 'string' ? t : t.label ?? t.name
        }))
      )
    } catch (error) {
      console.error('게시글을 불러오지 못했습니다.', error)
      navigate('/app')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPostDetail()
  }, [id])

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
      const newTag = created?.data ?? created
      setTags((prev) => {
        if (prev.some((t) => t.id === newTag.id || t.label === newTag.label || t.label === next)) return prev
        return [...prev, { id: newTag.id ?? next, label: newTag.label ?? next }]
      })
      setTagInput('')
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.message || '태그 추가 실패')
    } finally {
      setIsAddingTag(false)
    }
  }

  const handleRemoveTag = async (tag) => {
    try {
      if (tag?.id && typeof tag.id !== 'string') await deleteTags(tag.id)
      setTags((prev) => prev.filter((t) => t.id !== tag.id))
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.message || '태그 삭제 실패')
    }
  }

  const handleKenEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadImage(file)
      const uploaded = res?.data ?? res
      setImageUrl(uploaded.fileName ?? uploaded.fileUrl ?? uploaded.imageUrl ?? null)
    } catch (error) {
      console.error('이미지 업로드 실패', error)
    } finally {
      e.target.value = ''
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!title.trim()) return alert('제목을 입력하세요')
    if (!content.trim()) return alert('내용을 입력하세요')

    try {
      setIsSaving(true)
      const payload = { category, title, content, imageUrl, tags: tags.map((t) => t.label) }
      if (confirm('수정하시겠습니까?')) {
        await updatePost(id, payload)
        navigate('/app')
      }
    } catch (error) {
      console.error('메세지 수정 실패', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <section className='page post-section post-edit'>
        <div className="layout-container">불러오는 중....</div>
      </section>
    )
  }

  return (
    <section className='page post-section'>
      <div className="layout-container post-edit">
        <form className='post-form' onSubmit={handleUpdate}>
          <div className="post-card">
            <div className="post-field">
              <label className='post-label'>카테고리</label>
              <div className="post-input-wrap">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((opt) => (
                    <option value={opt.value} key={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
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
                  <PostTag tag={t.label} key={t.id} onClick={() => handleRemoveTag(t)} />
                ))}
                <input 
                  type="text" value={tagInput} onKeyDown={handleKenEnter} onChange={(e) => setTagInput(e.target.value)}
                  className='post-tag-input' placeholder='tag를 자유롭게 입력하세요'
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
                  value={content} onChange={(e) => setContent(e.target.value)}
                  className='post-textarea' placeholder='내용을 자유롭게 입력하세요'
                />
              </div>
            </div>

            <div className="post-upload-card">
              <div onClick={() => fileInputRef.current?.click()} className="post-upload-placeholder">
                <input type="file" ref={fileInputRef} onChange={handleUploadImage} accept='image/*' className='post-uppload-input' />
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
              <button type="submit" className="btn-save">수정하기</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default PostEdit