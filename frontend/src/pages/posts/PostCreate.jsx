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
import { createTags,deleteTags, getMyTags } from '@/api/tag.api'
const PostCreate = () => {


  const navigate = useNavigate()

  const [category, setCategory] = useState('DAILY')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const fileInputRef = useRef(null)
  const [tagInput, setTagInput] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const loadMyTags = async()=>{
    const res = await getMyTags()
    const list = Array.isArray(res)? res :res?.data?? []

    setTags(
      list.map((t)=>({
        id:t.id,
        label:typeof t ==='string'? t: t.label?? t.name
      }))
    )


    // console.log(res)
  }

  useEffect(()=>{
    loadMyTags().catch((e)=>{
      console.error(e)
    })
  },[])

  const handleAddTag =async()=>{
    const next = tagInput.trim()

    if(!next) return

    if(tags.some((t)=>t.label ==next)){
      setTagInput('')
      return
    }
    try {
      setIsAddingTag(true)

      const created = await createTags(next)

      setTags((prev)=>{
        if(prev.some((t)=>t.id===created.id || t.label ===created.label)){
          return prev
        }
        return [...prev,{
          id:created.id,
          label:created.label
        }]
      })
      setTagInput('')
    } catch (error) {
      console.error(error)
      const message = error?.response?.data?.message || '태그 추가 실패'
      alert(message)
    }finally{
      setIsAddingTag(false)
    }

  }
  const handleKenEnter =(e)=>{
    if(e.key==='Enter'){
      e.preventDefault()
      handleAddTag()
    }
  }
  const handleRemoveTag = async(tag)=>{
    try {
      await deleteTags(tag.id)
      setTags((prev)=>prev.filter((t)=>t.id!==tag.id))
    } catch (error) {
       console.error(error)
      const message = error?.response?.data?.message || '태그 삭제 실패'
      alert(message)
    }
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0]

    if(!file) return

    try {
       const presigned = await uploadImage(file)
      setImageUrl(presigned.fileName)

    } catch (error) {
      console.error('이미지 업로드 실패',error)
    }finally{
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
        imageUrl,
        tags:tags.map((t)=>t.label)
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
                  {tags.map((t)=>(
                    <PostTag 
                    tag={t.label} 
                    onClick={()=>handleRemoveTag(t)}
                    key={t.id}/>

                  ))}
                <input
                value={tagInput}
                onKeyDown={handleKenEnter}
                onChange={(e)=>setTagInput(e.target.value)}
                type="text" className='post-tag-input' placeholder='tag를 자유롭게 입력하세요' />
                <Button 
                type="button" 
                text="+ 태그 추가" 
                onClick={handleAddTag}
                className="post-tag-add" />
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