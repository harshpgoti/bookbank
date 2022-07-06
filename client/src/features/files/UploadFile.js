import {useState,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { uploadfile, reset } from './fileSlice'
import Spinner from '../../component/spinner'

function UploadFile() {

  const [bookname, setBookName] = useState("")
  const [book, setBook] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.file)
  const { user } = useSelector((state) => state.auth)


  useEffect(()=>{
    if(isError)
      document.getElementById('error-msg').innerText = message
    if(!user)
      navigate('/login')
    if(isSuccess)
      document.getElementById('error-msg').innerText = message
    dispatch(reset())
  },[ user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setBookName(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if(!bookname || !book){
      document.getElementById('error-msg').innerText = 'please enter all data';
    } else {
      document.getElementById('error-msg').innerText = '';
      const userData = {
        bookname,
        book
      }
      dispatch(uploadfile(userData));
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>upload book here</h1>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='bookname'
              name='bookname'
              value={bookname}
              placeholder='Enter your name'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='file'
              className='form-control'
              id='book'
              name='book'
              placeholder='Enter your email'
              onChange= {(e) => setBook(e.target.files[0])}
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

export default UploadFile