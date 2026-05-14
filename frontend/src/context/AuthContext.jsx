import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext(null)

const decodeToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch {
        return null
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (token) {
            const decoded = decodeToken(token)
            if (decoded) {
                setUser(decoded)
            } else {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (username, password) => {
        const res = await api.post('/api/token/', { username, password })
        localStorage.setItem('access_token', res.data.access)
        localStorage.setItem('refresh_token', res.data.refresh)
        const decoded = decodeToken(res.data.access)
        setUser(decoded)
        return decoded
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)