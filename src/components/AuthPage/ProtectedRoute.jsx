import {Navigate} from 'react-router-dom'
import {UserAuth} from './AuthContext'

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({children}) => {
    const {user} = UserAuth()

    if (!user) return <Navigate to='/login' />
    return children
}

export default ProtectedRoute
