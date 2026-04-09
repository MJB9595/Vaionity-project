import React from 'react'
import { getTagColor } from '@/hooks/useTagColor'
const PostTag = ({ tag ,onClick}) => {
  return (
    <span className='post-tag'
    style={{backgroundColor:getTagColor(tag)}}
    >
      <span>

        {tag}
      </span>
      <button 
      className='post-tag-delete' 
      onClick={(e)=>{
        e.preventDefault()
        e.stopPropagation()
        onClick?.()
        }}>X</button>
    </span>
  )
}

export default PostTag