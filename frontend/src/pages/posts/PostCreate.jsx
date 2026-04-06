import React, { useEffect, useRef, useState } from 'react'
import './PostCreateEdit.scss'
import './PostPagesAll.scss'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CATEGORY_OPTIONS } from '@/constants/category'
import PostTag from '@/components/posts/PostTag'
import { createPost } from '@/api/post.api'
import { uploadImage } from '@/api/file.api'
const PostCreate = () => {


  const navigate = useNavigate()

  const [category, setCategory] = useState('DAILY')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([
    { label: '기본값' },
    { label: '추가 태그' }
  ])
  const fileInputRef = useRef(null)
  const [tagInput, setTagInput] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)


  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0]
    if(!file) return

    try {
      const presigned = await uploadImage(file)
      // 👇 fileName 대신 fileUrl로 변경! (이게 DB의 imageUrl로 들어가게 됩니다)
      setImageUrl(presigned.fileUrl)

    } catch (error) {
      console.error('이미지 업로드 실패',error)
    } finally {
      e.target.value=''
    }
  }


  const handleSave = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('제목을 입력하세요')
      return
    }
    if (!content.trim()) {
      alert('내용을 입력하세요')
      return
    }

    try {
      setIsSaving(true)

      const payload = {
        category,
        title,
        content,
        imageUrl
      }

      const res = await createPost(payload)
      console.log(res)

      navigate('/app')

    } catch (error) {

      console.error('메세지 저장 실패', error)
    } finally {
      setIsSaving(false)
    }

  }

  const handleGoBack = (e) => {
    e.preventDefault()

    navigate(-1)
  }

  return (
    <section className='page post-section post-create'>
      <div className="inner">
        <form onSubmit={handleSave} className='post-form'>
          <div className="post-card">
            <div className="post-field">
              <label className='post-label'>카테고리</label>
              <div className="post-input-wrap">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((opt) => (

                    <option value={opt.value} key={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="제목"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
            <div className="post-tag-box">

              <div className="tags">
                <PostTag tag="tag1" />
                <PostTag tag="tag1" />
                <PostTag tag="tag1" />
                <PostTag tag="tag1" />
                <PostTag tag="tag1" />
                <PostTag tag="tag1" />
                <PostTag tag="tag1" />
                <PostTag tag="tag1" />
                <input type="text" className='post-tag-input' placeholder='tag를 자유롭게 입력하세요' />
                <Button type="button" text="+ 태그 추가" className="post-tag-add" />
              </div>
            </div>
            <div className="post-field">
              <label className='post-label'>내용</label>
              <div className="post-input-wrap">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}

                  className='post-textarea' placeholder='내용을 자유롭게 입력하세요' />
              </div>
            </div>
            <div className="post-upload-card">
              <div 
              onClick={()=>fileInputRef.current?.click()}
              className="post-upload-placeholder">

                <input 
                type="file" 
                ref={fileInputRef}
                accept='image/*' 
                onChange={handleUploadImage}
                className='post-uppload-input' />
                {imageUrl?(

                  <img src={imageUrl} alt="preview" className='post-upload-preview' />
                ):(
                  <img src="/images/add.svg" alt="img" className='post-upload-icon'/>

                )}

                <p className='post-upload-title'>이미지를 업로드 하세요</p>
                <span className="post-upload-desc">
                  클릭하거나 파일을 드래그 하여 업로드
                </span>
              </div>
            </div>

            <div className="post-actions">
              <Button
                type="button"
                text="취소하기"
                className="cancel"
                onClick={handleGoBack}
              />
              <Button
                type="submit"
                text="저장하기"
                className="save"
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default PostCreate