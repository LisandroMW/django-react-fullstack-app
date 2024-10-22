import {Navigate, useViewTransitionState} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import {useState, useEffect} from "react"


function ProtectedRoute({children}){
    const [IsAuthorized, setIsAthorized] = useState(null)

    useEffect(()=>{
        auth().catch(()=> setIsAthorized(false))
    }, [])

    const refreshToken = async () =>{
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            const response = await api.post("api/token/refresh/", {
                refresh: refreshToken,
            });
            if (response.status === 200){
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                setIsAthorized(true)
            }else{
                setIsAthorized(false)
            }

        }catch(error){
            console.log(error)
            setIsAthorized(false)
        }
    }
    
    const auth = async () =>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token){
            setIsAthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000
    
        if (tokenExpiration < now){
            await refreshToken()
        } else {
            setIsAthorized(true)
        }
    }

    if(IsAuthorized === null){
        return <div>Loading...</div>
    }

    return IsAuthorized ? children : <Navigate to="/login" />
    
}
export default ProtectedRoute;
