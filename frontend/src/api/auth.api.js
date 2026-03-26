const BASE_URL =import.meta.env.VITE_API_URL


export const signup =async(signupData)=>{

    const response = await fetch(`${BASE_URL}/members`,{
        method:'POST',
        headers:{
             'Content-Type': 'application/json'
        },
        credentials:'include',
        body:JSON.stringify(signupData)
    })

    const data = await response.json().catch(()=>null)


    if(!response.ok){
        throw new Error(data?.message || '회원가입 실패')
    }

    return data
}
export const login =async(loginData)=>{
    const response = await fetch(`${BASE_URL}/auth/login`,{
        method:'POST',
        headers:{
             'Content-Type': 'application/json'
        },
        credentials:'include',
        body:JSON.stringify(loginData)
    })

    const data = await response.json().catch(()=>null)


    if(!response.ok){
        throw new Error(data?.message || '로그인 실패')
    }

    return data

}
export const getMe =async()=>{
        const response = await fetch(`${BASE_URL}/auth/me`,{
        method:'GET',

        credentials:'include'

    })

    const data = await response.json().catch(()=>null)


    if(!response.ok){
        throw new Error(data?.message || '회원 정보 가져오기 실패')
    }

    return data
}
export const logout =async()=>{
            const response = await fetch(`${BASE_URL}/auth/logout`,{
        method:'POST',
        credentials:'include'

    })

    const data = await response.json().catch(()=>null)


    if(!response.ok){
        throw new Error(data?.message || '로그아웃 실패')
    }

    return data
}