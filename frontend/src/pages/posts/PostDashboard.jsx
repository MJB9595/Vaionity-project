import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts } from '@/api/post.api'
import PostList from '@/components/posts/PostList'
import TagFilterBar from '@/components/posts/TagFilterBar'
import Input from '@/components/ui/Input'
import './PostPagesAll.scss'

const CATEGORY_LIST = [
  '플래그십 시리즈 Z',
  '얇음과 가벼움의 극한',
  'UMPC',
  '비즈니스 프리미엄',
  'Multi-Media',
  'ETC'
]

const PostDashboard = () => {
  const [selectedTag, setSelectedTag] = useState('전체')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [tags, setTags] = useState(['전체'])
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    setFetchError('')
    const fetchPosts = async () => {
      try {
        const response = await getPosts()
        const rawPosts = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : []
        
        const mappedPosts = rawPosts.map((post) => ({
          id: post.id,
          category: post.category || 'DAILY',
          title: post.title,
          content: post.content,
          tags: post.tags || [],
          // 👇 핵심 포인트: 백엔드에서 받아온 imageUrl을 thumbnail 속성에 연결합니다.
          // imageUrl이 없을 경우를 대비해 null 처리합니다.
          thumbnail: post.imageUrl || null
        }))
        setPosts(mappedPosts)
        
      } catch (error) {
        setFetchError(error?.response?.data?.message || error.message || '게시글 조회 실패')
        setPosts([])
      }
    }
    fetchPosts()
  }, [])

  const filteredByTag = selectedTag === '전체'
    ? posts
    : posts.filter((post) => post.tags.includes(selectedTag))

  const filteredPosts = filteredByTag.filter((post) => {
    const keyword = searchKeyword.toLowerCase().trim()
    if (!keyword) return true
    return (
      (post.title && post.title.toLowerCase().includes(keyword)) ||
      (post.content && post.content.toLowerCase().includes(keyword))
    )
  })

  const handleCreatePost = () => {
    navigate('/app/posts/new')
  }

  return (
    <section className='page post-dashboard'>
      <div className="layout-container">
        
        <div className="hero-section">
          <div className="title-area">
            <h2 className="hero-title">VAIO의 역사에 대해서</h2>
            <p className="hero-subtitle">The Footprint of VAIO</p>
          </div>
          <div className="action-area">
            <div className="btn-group" style={{ display: 'flex', gap: '16px' }}>
              <button className="back-btn" onClick={handleCreatePost}>+ 새 글 작성</button>
              <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>
            </div>
            
            <div className="search-wrap">
              <Input
                placeholder="search..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
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
            <div className="tag-section">
              <h4 className="section-title">포스트 태그</h4>
              <TagFilterBar tags={tags} selectedTag={selectedTag} onChangeTag={setSelectedTag} />
            </div>
            
            <PostList posts={filteredPosts} />
          </main>
        </div>
      </div>
    </section>
  )
}

export default PostDashboard