import {useState,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updatefile, reset } from './fileSlice'
import Spinner from '../../component/spinner'

function UpdateFile() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message, wantUpdateBook } = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.auth);

  const [updatedBookName, setupdatedBookName] = useState(wantUpdateBook.bookname);
  const [updatedbook, setUpdatedbook] = useState("");

  useEffect(()=>{
    if(isError)
      document.getElementById('error-msg').innerText = message;
    if(!user)
      navigate('/login');
    if(isSuccess)
      document.getElementById('error-msg').innerText = message;
    dispatch(reset());
  },[ user, isError, isSuccess, message, navigate, dispatch])

  useEffect(()=>{
    if(Object.keys(wantUpdateBook).length === 0){
      navigate('/viewbooks');
    }
  },[ wantUpdateBook ])

  const onChange = (e) => {
    setupdatedBookName(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if(!updatedBookName || !updatedbook){
      document.getElementById('error-msg').innerText = 'please enter all data';
    } else {
      document.getElementById('error-msg').innerText = '';
      const userData = {
        updatedBookName,
        updatedbook,
        bookname:wantUpdateBook.bookname,
        key:wantUpdateBook.key
      }
      dispatch(updatefile(userData));
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>update book here</h1>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='bookname'
              name='bookname'
              value={updatedBookName}
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
              onChange= {(e) => setUpdatedbook(e.target.files[0])}
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

export default UpdateFile