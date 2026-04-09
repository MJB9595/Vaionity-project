import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { getPostById, deletePost } from '@/api/post.api'
import PostTag from '@/components/posts/PostTag'
import './PostPagesAll.scss'
import { useNavigate, useParams } from 'react-router-dom'
import PostHeader from '@/components/posts/PostHeader'
const PostDetail = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(Number(id))

        console.log(data)
        setPost({
          ...data
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  if (loading) return <div>로딩중</div>
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
    <section className='page post-section post-detail'>
      <div className="inner">
        <PostHeader
          title="게시글 보기"
          showButton
          onClick={handleGoBack}
          buttonText="뒤로가기"
          buttonClass="back bl"
        />
        <div className="post-main">
          <article className='post-card'>

            <div className="post-card-body">
              <p className="post-card-category">
                {post.category}
              </p>
              <h4 className="post-card-title">
                {post.title}
              </h4>
              <p className="post-card-content">
                {post.content}
              </p>

              <div className="tags">
                {(post.tags||[]).map((tag,i)=>(

                <PostTag tag={tag} key={i} />
                ))}
              </div>
            </div>
            <div className="img-wrap">
              <img src={post.imageUrl} alt="image" />
            </div>
          </article>

        </div>
        <div className="btn-wrap">
          <Button
            text="게시글 삭제하기"
            className="delete bl"
            onClick={handlePostDelete}
            icons />
          <Button
            text="게시글 수정하기"
            className="edit bl"
            onClick={() => { navigate(`/app/posts/${id}/edit`) }}
            icons />
        </div>
      </div>
    </section>
  )
}

export default PostDetail