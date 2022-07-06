import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { viewfile, deletefile, reset, setOldBook } from './fileSlice'

function ViewBooks() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isError, isSuccess, message, userBooks } = useSelector((state) => state.file)
  const { user } = useSelector((state) => state.auth)

  useEffect(()=>{
    dispatch(viewfile());
    dispatch(reset())
  },[ dispatch ])

  useEffect(()=>{
    if(!user)
      navigate('/login')
  },[ user, isError, message, navigate])

  useEffect(()=>{
    if(isSuccess && message !== ''){
      dispatch(viewfile());
    }
  },[ isSuccess, message, dispatch])

  const updateBook = (e) => {
    e.preventDefault()
    for (var i = 0; i < userBooks.length; i++) {
      if(userBooks[i].bookname === e.target.dataset.bookname){
        dispatch(setOldBook(userBooks[i]));
        navigate('/updateFile')
      }
    }
  }

  const deleteBook = (e) => {
    e.preventDefault()
    let dbook=[];
    for (var i = 0; i < userBooks.length; i++) {
      if(userBooks[i].bookname === e.target.dataset.bookname){
        dbook=userBooks[i]
      }
    }
    dispatch(deletefile(dbook));
  }

  const tableRow = userBooks.map((data) =>
    <tr key={data.bookname}>
      <td>{data.bookname}</td>
      <td><a href={data.location} target='_blank' rel="noreferrer">Download</a></td>
      <td onClick={updateBook} data-bookname={data.bookname}>update</td>
      <td onClick={deleteBook} data-bookname={data.bookname} >delete</td>
    </tr>
  );

  return (
    <>
      <section className='heading'>
        <h1>Your Uploaded Books</h1>
      </section>

      <section className='bookListTable'>
        <table>
          <thead>
            <tr>
                <th scope="col">Book name</th>
                <th scope="col">Download</th>
                <th scope="col">update</th>
                <th scope="col">delete</th>
            </tr>
          </thead>
          <tbody>
              {tableRow}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default ViewBooks