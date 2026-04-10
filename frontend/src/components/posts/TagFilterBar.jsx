import React from 'react'
import './PostComponentAll.scss'

const TagFilterBar = ({ tags, selectedTag, onChangeTag }) => {
  return (
    <div className='tag-filter-bar'>
      {tags.map((tag, i) => (
        <button
          key={`${tag}-${i}`}
          className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
          onClick={() => onChangeTag && onChangeTag(tag)}
        >
          {tag === '전체' ? '전체' : `#${tag}`}
        </button>
      ))}
    </div>
  )
}

export default TagFilterBar
