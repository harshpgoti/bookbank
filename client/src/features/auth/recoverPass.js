import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { checkRecoverToken, RecoverPassword, reset } from './authSlice'
import Spinner from '../../component/spinner'

function RecoverPass() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { token } = useParams();
  const { isLoading, isError, isSuccess, message, verifyToken } = useSelector((state) => state.auth)

  const [newPass, setNewPass] = useState("")
  const [repeatNewPass, setRepeatNewPass] = useState("")

  useEffect(()=>{
    dispatch(checkRecoverToken(token));
    dispatch(reset());
  },[ dispatch ])

  useEffect(() => {
    if (!verifyToken) {
      navigate('/forgotpass')
    }
  }, [verifyToken,navigate])

  useEffect(() => {
    if (message || isError) {
      document.getElementById('error-msg').innerText = message
    }
    dispatch(reset())
  }, [message, isError])

  const onSubmit = (e) => {
    e.preventDefault()
    if(!newPass || !repeatNewPass){
      document.getElementById('error-msg').innerText = 'please enter all field';
    } else {
      if(newPass === repeatNewPass){
        document.getElementById('error-msg').innerText = '';
        const userData = {
          newPass,
          token
        }
        dispatch(RecoverPassword(userData))
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
            <h1>Recover your Password</h1>
            </section>

            <section className='form'>
            <form onSubmit={onSubmit}>
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

export default RecoverPass