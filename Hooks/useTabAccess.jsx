import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useTabAccess = () => {
  const { user } = useContext(AuthContext)

  const canAccessTab = (tabName) => {
    if (!user || !user.rol) return false


    console.log('TANAME',tabName);
    switch (tabName) {
      case 'index':
        return user.rol === 'Usuario'
         case 'profile':
        return user.rol === 'Usuario'
      case 'details':
        return user.rol === 'Usuario'
      case 'details_event':
        return user.rol === 'Usuario'
      case 'edit_profile':
        return user.rol === 'Usuario'
      case 'individual_chat':
        return user.rol === 'Usuario'
      case 'search':
        return user.rol === 'Usuario'
      case 'chat':
        return user.rol === 'Usuario'
     
      default:
        return true // default: allow
    }
  }

  return { canAccessTab }
}
