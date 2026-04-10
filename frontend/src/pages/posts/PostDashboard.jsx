import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPosts } from '@/api/post.api'
import { getMyTags } from '@/api/tag.api'
import PostList from '@/components/posts/PostList'
import TagFilterBar from '@/components/posts/TagFilterBar'
import Input from '@/components/ui/Input'
import { useCategories } from '@/hooks/useCategories'
import './PostPagesAll.scss'

const PostDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL')
  const [selectedTag, setSelectedTag] = useState('전체')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [tags, setTags] = useState(['전체'])
  const { categories: categoryOptions } = useCategories(true)
  const [posts, setPosts] = useState([])
  const [fetchError, setFetchError] = useState('')
  const navigate = useNavigate()

  // URL 쿼리 파라미터 변경 반영
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  useEffect(() => {
    setFetchError('')
    const fetchData = async () => {
      try {
        const [response, tagRes] = await Promise.all([getPosts(), getMyTags()])
        const rawPosts = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : []
        const mappedPosts = rawPosts.map((post) => ({
          id: post.id,
          category: post.category || 'DAILY',
          title: post.title,
          content: post.content,
          tags: post.tags || [],
          thumbnail: post.imageUrl || null,
        }))
        setPosts(mappedPosts)

        const tagList = Array.isArray(tagRes) ? tagRes : tagRes?.data ?? []
        const tagLabels = tagList.map((t) => (typeof t === 'string' ? t : t.label ?? t.name)).filter(Boolean)
        setTags(['전체', ...tagLabels])
      } catch (error) {
        setFetchError(error?.response?.data?.message || error.message || '게시글 조회 실패')
        setPosts([])
      }
    }
    fetchData()
  }, [])

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
    setSelectedTag('전체')
    if (value === 'ALL') {
      setSearchParams({})
    } else {
      setSearchParams({ category: value })
    }
  }

  const filteredPosts = posts
    .filter((post) => selectedCategory === 'ALL' || post.category === selectedCategory)
    .filter((post) => selectedTag === '전체' || (post.tags || []).some((t) => {
      const label = typeof t === 'string' ? t : t.label ?? t.name
      return label === selectedTag
    }))
    .filter((post) => {
      const keyword = searchKeyword.toLowerCase().trim()
      if (!keyword) return true
      return (
        (post.title && post.title.toLowerCase().includes(keyword)) ||
        (post.content && post.content.toLowerCase().includes(keyword))
      )
    })

  const currentCategoryLabel = categoryOptions.find(c => c.value === selectedCategory)?.label || '전체'


  return (
    <section className='page post-dashboard'>
      <div className="layout-container">
        <div className="hero-section">
          <div className="title-area">
            <h2 className="hero-title">VAIO의 역사에 대해서</h2>
            <p className="hero-subtitle">
              {selectedCategory === 'ALL' ? 'The Footprint of VAIO' : `카테고리: ${currentCategoryLabel}`}
            </p>
          </div>
          <div className="action-area">
            <div className="btn-group">
              <button className="back-btn" onClick={() => navigate('/app/posts/new')}>+ 새 글 작성</button>
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
              {categoryOptions.map((cat) => (
                <li
                  key={cat.value}
                  className={`category-item ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.value)}
                >
                  {cat.label}
                </li>
              ))}
            </ul>
          </aside>

          <main className="main-content">
            {fetchError && <p className="fetch-error">{fetchError}</p>}
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
