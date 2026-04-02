import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts } from '@/api/post.api'
import PostList from '@/components/posts/PostList'
import TagFilterBar from '@/components/posts/TagFilterBar'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import useFilteredPosts from '../../hooks/useFilterdPosts'
import './PostPagesAll.scss'

const CATEGORY_LIST = [
  '플래그십 시리즈 Z',
  '얇음과 가벼움의 극한',
  'UMPC',
  '비즈니스 프리미엄',
  'Multi-Media',
  'ETC'
]

const PostAll = () => {
  const [selectedTag, setSelectedTag] = useState('전체')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [tags, setTags] = useState(['전체'])
  const [posts, setPosts] = useState([])
  const [fetchError, setFetchError] = useState('')
  const navigate = useNavigate()

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    setFetchError('')
    const fetchPosts = async () => {
      try {
        const response = await getPosts()
        const rawPosts = Array.isArray(response)
          ? response
          : Array.isArray(response?.data) ? response.data : []

        const mappedPosts = (rawPosts || []).map((post) => ({
          id: post.id,
          category: post.category || 'NOTE BOOK',
          title: post.title,
          content: post.content,
          tags: post.tags || [],
          thumbnail: post.imageUrl || ''
        }))
        setPosts(mappedPosts)
      } catch (error) {
        setFetchError(error?.response?.data?.message || error.message || '게시글 조회 실패')
        setPosts([])
      }
    }
    fetchPosts()
  }, [])

  // 커스텀 훅을 통한 필터링
  const filteredPosts = useFilteredPosts(posts, selectedTag, searchKeyword)

  // 검색어나 태그가 변경되면 무조건 1페이지로 돌아가도록 초기화
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTag, searchKeyword])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  // 버그 수정: 다음 페이지로 갈 때는 Math.min을 사용해야 최대 페이지를 넘지 않습니다.
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const handlePageClick = (page) => setCurrentPage(page)

  const handleCreatePost = () => {
    navigate('/app/posts/new')
  }

  return (
    <section className='page post-all'>
      <div className="layout-container">
        
        {/* 상단 타이틀 및 액션 영역 */}
        <div className="hero-section">
          <div className="title-area">
            <h2 className="hero-title">전체 게시글 보기</h2>
            <p className="hero-subtitle">All Posts Directory</p>
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

        {/* 2단 그리드 영역 */}
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
            
            <PostList posts={currentPosts} />

            {/* 페이지네이션 UI */}
            {totalPages > 0 && (
              <div className="pagination-wrap">
                <Button 
                  onClick={handlePrevPage} 
                  text="<" 
                  disabled={currentPage === 1} 
                  className="page-nav-btn" 
                />
                <ul className="page-numbers">
                  {pageNumbers.map((page) => (
                    <li 
                      key={page} 
                      onClick={() => handlePageClick(page)}
                      className={currentPage === page ? 'active' : ''}
                    >
                      {page}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={handleNextPage} 
                  text=">" 
                  disabled={currentPage === totalPages} 
                  className="page-nav-btn" 
                />
              </div>
            )}
          </main>
        </div>
        
      </div>
    </section>
  )
}

export default PostAll