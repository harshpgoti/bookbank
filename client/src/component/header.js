import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='header'>
        <div className='logo'><Link to='/'>BookBank</Link></div>
        <ul className='menu'>
        {user ? (
          <>
            <li><Link to='/upload'>Upload book</Link></li>
            <li><Link to='/viewbooks'>View book</Link></li>
            <li className='dropdown'>more
              <ul className="dropdown-content">
                <li><Link to='/changepass'>change password</Link></li>
                <li onClick={onLogout}>Logout</li>
              </ul>
            </li>
          </>
        ) : (
          <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/register'>Register</Link></li>
            </>
        )}
        </ul>
    </header>
  )
}

export default Header