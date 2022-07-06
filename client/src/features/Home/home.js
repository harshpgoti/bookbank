import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { viewAllBooks,reset } from './homeSlice'

function Home() {

  const dispatch = useDispatch()
  const { allBooksData } = useSelector((state) => state.home)
  
  useEffect(()=>{
    dispatch(viewAllBooks());
    dispatch(reset());
  },[ dispatch])
  
    const tableRow = allBooksData.map((data) =>
    <tr key={data.bookname}>
      <td>{data.bookname}</td>
      <td><a href={data.location} target='_blank' rel="noreferrer">Download</a></td>
    </tr>
  );
  return (
    <>
      <section className='heading'>
        <h1>BookBank</h1>
      </section>

      <section className='bookListTable'>
        <table>
          <thead>
            <tr>
                <th scope="col">Book name</th>
                <th scope="col">Download</th>
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

export default Home