import React ,{createContext, useContext,useMemo,useState} from 'react'


const AuthCtx =createContext(null)

export function AuthProvider({children}){
  const [token, setToken]=useState(localStorage.getItem('accessToken'))


  const login =(accessToken)=>{
    localStorage.setItem('accessToken',accessToken)
  
    setToken(accessToken)
  }

  const logout=()=>{
    localStorage.removeItem("accessToken")

    setToken(null)
  }

  const value =useMemo(()=>({
    token,
    isAuthed:!!token,
    login,
    logout

  }),[token])

  return <AuthCtx.Provider value={value}>
    {children}
  </AuthCtx.Provider>

}


export const useAuth = ()=>useContext(AuthCtx)