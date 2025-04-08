import { logout } from '@apis/logout'
import { CommonAppBarMenu } from '@components/common/CommonAppBarContainer'
import { useNavigate } from 'react-router-dom'

export default function useLogout() {
  const navigate = useNavigate()
  const logoutButton: CommonAppBarMenu = {
    title: 'LOGOUT',
    onClick: () => {
      logout().then(() => {
        localStorage.clear()
        sessionStorage.clear()
        navigate('/login')
      }).catch((error) => {
        alert('Failed to logout ' + JSON.stringify(error))
      })
    },
  }
  return { logoutButton }
}