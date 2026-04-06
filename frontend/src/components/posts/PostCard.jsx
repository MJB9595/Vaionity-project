import React from 'react'
import { Link } from 'react-router-dom'
import PostTag from './PostTag'
import './PostComponentAll.scss'

const PostCard = ({ post }) => {
  return (
    <Link to={`/app/posts/${post.id}`} className='post-card'>
      <article>
        <div className="post-card-body">
          <p className='post-category'>{post.category}</p>
          <h3 className='post-title'>{post.title}</h3>
          
          <div className="tags">
            {(post.tags || []).map((tag, i) => (
              <PostTag key={i} tag={tag} />
            ))}
          </div>
          
        </div>
        
        {/* 👇 썸네일 이미지 출력 부분 */}
        <div className="img-wrap">
          <img 
            src={post.thumbnail || '/images/placeholder.png'} 
            alt={post.title} 
            onError={(e) => {
              // 만약 imageUrl 링크가 깨졌을 경우를 대비한 에러 처리 (기본 이미지로 교체)
              e.target.src = '/images/placeholder.png'
            }}
          />
        </div>
        
      </article>
    </Link>
  )
}

export default PostCard