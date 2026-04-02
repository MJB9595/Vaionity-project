import React, { useEffect, useRef, useState } from 'react'
import './PostCreateEdit.scss'
import './PostPagesAll.scss'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CATEGORY_OPTIONS } from '@/constants/category'
import PostTag from '@/components/posts/PostTag'
import { updatePost } from '@/api/post.api'
import { getPostById } from '../../api/post.api'


const PostEdit = () => {

  const { id } = useParams()
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
  const [isLoading, setIsLoading] = useState(true)
  const handleGoBack = () => {
    navigate(-1)
  }

  const loadPostDetail = async()=> {
    try {
      setIsLoading(true)

      const res = await getPostById(id)
      // console.log(res)
      const post =res?.data?? res
      setCategory(post?.category??'DAILY')
      setTitle(post?.title??'')
      setContent(post?.content??'')


    } catch (error) {
      console.error('게시글을 불러오지 못했습니다')
      navigate('/app')
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    loadPostDetail()
  },[id])

  const handleUpdate=async(e)=>{
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
        content
      }

      if(confirm('수정하시겟습니까?')){
        await updatePost(id, payload)
        navigate('/app')
      }

    } catch (error) {

      console.error('메세지 수정 실패', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className='page post-section post-edit'>
      <div className="inner">
        <form className='post-form' action="" onSubmit={handleUpdate}>
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
                onChange={(e)=>setContent(e.target.value)}

                className='post-textarea' placeholder='내용을 자유롭게 입력하세요' />
              </div>
            </div>
            <div className="post-upload-card">
              <div className="post-upload-placeholder">

                <input type="file" accept='image/*' className='post-uppload-input' />
                <img src="/images.png" alt="img" />
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

export default PostEdit