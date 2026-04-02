import { useMemo } from "react"    

const useFilteredPosts =(posts, selectedTag,searchKeyword)=>{
    return useMemo(()=>{

        const keyword = searchKeyword.toLowerCase().trim()
        const filteredByTag =
            selectedTag === '전체'
                ? posts
                : posts.filter((post) =>
                    post.tags.includes(selectedTag)
                )
        
        
        const filtered = filteredByTag.filter((post) => {
         
        
            if (!keyword) return true
        
        
            return (
                post.title.toLowerCase().includes(keyword) ||
                post.content.toLowerCase().includes(keyword)
            )
        })

        return filtered

    },[posts,selectedTag,searchKeyword])
}

export default useFilteredPosts
    