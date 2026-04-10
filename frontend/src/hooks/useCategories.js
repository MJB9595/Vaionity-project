import { useState, useEffect } from 'react'
import { getCategories } from '@/api/category.api'

// 카테고리 목록을 API에서 가져오는 공통 훅
// includeAll: true → 맨 앞에 { label: '전체', value: 'ALL' } 추가
export const useCategories = (includeAll = false) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(includeAll ? [{ id: null, value: 'ALL', label: '전체' }, ...data] : data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { categories, setCategories, loading }
}