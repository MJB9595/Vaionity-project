import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostTag from './PostTag'
import { CATEGORY_LABEL_MAP } from '@/constants/category'
import './PostComponentAll.scss'

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const categoryLabel = CATEGORY_LABEL_MAP[post.category] || post.category || ''

  const handleCategoryClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // 현재 경로에 따라 dashboard 또는 all 페이지 유지하며 카테고리 쿼리 전달
    const currentPath = window.location.pathname
    const base = currentPath.includes('posts/all') ? '/app/posts/all' : '/app'
    navigate(`${base}?category=${post.category}`)
  }

  return (
    <Link to={`/app/posts/${post.id}`} className='post-card'>
      <article>
        <div className="post-card-body">
          <p className='post-category' onClick={handleCategoryClick}>
            {categoryLabel}
          </p>
          <h3 className='post-title'>{post.title}</h3>
          <div className="tags">
            {(post.tags || []).map((tag, i) => {
              const label = typeof tag === 'string' ? tag : tag.label ?? tag.name ?? ''
              return <PostTag key={i} tag={label} />
            })}
          </div>
        </div>
        <div className="img-wrap">
          <img
            src={post.thumbnail || '/images/Logo.png'}
            alt={post.title}
            onError={(e) => { e.target.src = '/images/Logo.png' }}
          />
        </div>
      </article>
    </Link>
  )
}

export default PostCard
