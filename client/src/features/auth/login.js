import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login, reset, loaduser } from './authSlice'
import Spinner from '../../component/spinner'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      document.getElementById('error-msg').innerText = message
    }
    if (isSuccess || user) {
      dispatch(loaduser());
      navigate('/')
    }
    if (user) {
      navigate('/')
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if(!email || !password){
      document.getElementById('error-msg').innerText = 'please enter all data';
    } else {
      document.getElementById('error-msg').innerText = '';
      const userData = {
        email,
        password,
      }
      dispatch(login(userData))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
      <>
    <section className='heading'>
      <h1>Login</h1>
    </section>

    <section className='form'>
      <form className='login' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={email}
            placeholder='Enter your email'
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            value={password}
            placeholder='Enter password'
            onChange={onChange}
          />
        </div>
        <p id='error-msg'></p>
        <div className='form-group'>
          <button type='submit' className='btn btn-block'>
            Submit
          </button>
        </div>
        <Link to="/forgotpass">Forgot Password</Link>
      </form>
    </section>
  </>
  )
}

export default Login