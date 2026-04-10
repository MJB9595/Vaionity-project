// 백엔드 PostCategory enum과 일치하는 카테고리 목록
export const CATEGORY_OPTIONS = [
  { label: '일상', value: 'DAILY' },
  { label: '취미', value: 'HOBBY' },
  { label: '여행', value: 'TRAVEL' },
  { label: '업무', value: 'WORK' },
  { label: '공부', value: 'STUDY' },
  { label: '기타', value: 'ETC' },
]

// 전체 포함 (필터용)
export const CATEGORY_FILTER_OPTIONS = [
  { label: '전체', value: 'ALL' },
  ...CATEGORY_OPTIONS,
]

// value -> label 변환용 맵
export const CATEGORY_LABEL_MAP = CATEGORY_OPTIONS.reduce((acc, opt) => {
  acc[opt.value] = opt.label
  return acc
}, {})