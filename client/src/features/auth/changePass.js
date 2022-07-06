import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChangePassword, reset } from './authSlice'
import Spinner from '../../component/spinner'

function ChangePass() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  const [pass, setPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [repeatNewPass, setRepeatNewPass] = useState("")

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    dispatch(reset())
  }, [user, navigate])

  useEffect(() => {
    if (message || isError || isSuccess) {
      document.getElementById('error-msg').innerText = message
    }
    dispatch(reset())
  }, [message, isError, isSuccess])

  const onSubmit = (e) => {
    e.preventDefault()
    if(!pass || !newPass){
      console.log("data",pass);
      document.getElementById('error-msg').innerText = 'please enter all data';
    } else {
      if(newPass === repeatNewPass){
        document.getElementById('error-msg').innerText = 'ok';
        const userData = {
          pass,
          newPass,
        }
        dispatch(ChangePassword(userData))
      }else {
        document.getElementById('error-msg').innerText = 'new passwords are not same.';
      }
    }
  }

  if (isLoading) {
    return <Spinner />
  }

    return (
        <>
            <section className='heading'>
            <h1>Change Password</h1>
            </section>

            <section className='form'>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                <input
                    type='password'
                    className='form-control'
                    id='pass'
                    name='pass'
                    value={pass}
                    placeholder='Enter your password'
                    onChange={(e) => setPass(e.target.value)}
                />
                </div>
                <div className='form-group'>
                <input
                    type='password'
                    className='form-control'
                    id='newPass'
                    name='newPass'
                    value={newPass}
                    placeholder='Enter new password'
                    onChange={(e) => setNewPass(e.target.value)}
                />
                </div>
                <div className='form-group'>
                <input
                    type='password'
                    className='form-control'
                    id='repeatNewPass'
                    name='repeatNewPass'
                    value={repeatNewPass}
                    placeholder='re-enter new password'
                    onChange={(e) => setRepeatNewPass(e.target.value)}
                />
                </div>
                <p id='error-msg'></p>
                <div className='form-group'>
                <button type='submit' className='btn btn-block'>
                    Submit
                </button>
                </div>
            </form>
            </section>
        </>
    )
}

export default ChangePass