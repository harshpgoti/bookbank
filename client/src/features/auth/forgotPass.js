import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ForgotPassword, reset } from './authSlice'
import Spinner from '../../component/spinner'

function ForgotPass() {

  const dispatch = useDispatch()

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  const [email, setEmail] = useState("")

  useEffect(() => {
    if (message || isError || isSuccess) {
      document.getElementById('error-msg').innerText = message
    }
    dispatch(reset())
  }, [message, isError, isSuccess])

  const onSubmit = (e) => {
    e.preventDefault()
    if(!email){
      document.getElementById('error-msg').innerText = 'please enter all data';
    } else {
        document.getElementById('error-msg').innerText = '';
        const userData = {
            email,
        }
        dispatch(ForgotPassword(userData))
    }
  }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <>
            <section className='heading'>
            <h1>Forgot Password</h1>
            </section>

            <section className='form'>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <input
                        type='email'
                        className='form-control'
                        id='email'
                        name='email'
                        value={email}
                        placeholder='Enter Your email'
                        onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPass