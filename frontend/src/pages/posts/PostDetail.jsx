import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPostById, deletePost } from '@/api/post.api'
import PostTag from '@/components/posts/PostTag' 
import './PostPagesAll.scss'

const CATEGORY_LIST = [
  '플래그십 시리즈 Z',
  '얇음과 가벼움의 극한',
  'UMPC',
  '비즈니스 프리미엄',
  'Multi-Media',
  'ETC'
]

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(Number(id))
        setPost(data)
      } catch (error) {
        console.error(error)
        // API 연동 전 테스트용 (추후 삭제)
        setPost({
          id,
          category: 'NOTE BOOK',
          title: 'VAIO-X505',
          content: '노트북 시장의 경량화를 선두한 최초의 모델 ...\n\n스펙표 : 당대의 맥북과 비교해보면?\n\n디스플레이',
          date: '2025-12-12 | 15:23',
          imageUrl: '/images/detail-placeholder.png',
          tags: ['VAIO', '맥북 에어의 선구자'] 
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  if (loading) return <div>로딩중...</div>
  if (!post) return <div>데이터 없음</div>

  const handlePostDelete = async () => {
    if (confirm('게시글을 정말 삭제하시겠습니까?')) {
      try {
        await deletePost(id)
        navigate('/app', { replace: true })
      } catch (error) {
        console.error('게시글 삭제 오류', error)
      }
    }
  }

  return (
    <section className='page post-detail'>
      <div className="layout-container">
        
        <div className="hero-section">
          <div className="title-area">
            {/* 상단에 있던 태그 표시를 아래 본문 영역으로 이동했습니다 */}
            <h2 className="hero-title">{post.title}</h2>
            <p className="hero-subtitle">The Footprint of VAIO</p>
          </div>
          
          <div className="action-area detail-actions">
            <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>
            <span className="post-date">{post.date || '2025-12-12 | 15:23'}</span>
          </div>
        </div>

        <div className="content-grid">
          <aside className="sidebar">
            <h3 className="sidebar-title">Category</h3>
            <ul className="category-list">
              {CATEGORY_LIST.map((cat, idx) => (
                <li key={idx} className="category-item">{cat}</li>
              ))}
            </ul>
          </aside>

          <main className="main-content">
            
            {/* 요청하신 포스트 태그 섹션 (Dashboard와 동일한 스타일 적용) */}
            <div className="tag-section" style={{ marginBottom: '40px' }}>
              <h4 className="section-title">포스트 태그</h4>
              <div className="tags" style={{ marginBottom: 0 }}>
                <span>#tag:</span>
                {(post.tags || []).map((tag, i) => (
                  <PostTag key={i} tag={tag} />
                ))}
              </div>
            </div>

            <div className="detail-hero-image">
              <img src={post.imageUrl || "/images/placeholder.png"} alt={post.title} />
            </div>
            <div className="detail-body">
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '2' }}>
                {post.content}
              </p>
            </div>
            
            <div className="detail-admin-actions">
              <button className="text-btn" onClick={() => navigate(`/app/posts/${id}/edit`)}>수정</button>
              <button className="text-btn text-danger" onClick={handlePostDelete}>삭제</button>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}

export default PostDetail