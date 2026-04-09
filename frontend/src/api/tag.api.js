import client from './client'

export const getMyTags = async()=>{
    const response = await client.get('/tags')
    return response.data
}
export const createTags = async(label)=>{
    const response = await client.post('/tags',{label})

    return response.data
}
export const deleteTags = async(tagId)=>{
    await client.delete(`/tags/${tagId}`)
    return `${tagId} 삭제 완료`
}