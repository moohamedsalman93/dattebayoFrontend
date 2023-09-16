import axios from "axios";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash"
import loading from './assets/loading.svg'

const Card = ({ hit, hanldeOnClick, index, isShow }) => {
  const profile = hit.regno.split(" ")[1]
  return (
    <div key={hit.id} className=" h-32 flex w-[11rem]  xl:w-[16rem] bg-white m-1 xl:m-3 items-center p-2 rounded-lg shadow-lg border " onClick={() => hanldeOnClick(index)}>

      {isShow ? <img src={`http://146.190.42.50/jmc/Photo/${profile}.jpg`} alt={''} className=" h-16 w-16 xl:h-24 xl:w-24 rounded object-fill" />
        : <div className=" h-16 w-16 xl:h-24 xl:w-24 rounded object-fill"></div>}
      <div className="p-2">
        <h1 className=" text-sm xl:text-base font-semibold h-12 text-ellipsis overflow-hidden ">{hit.name}</h1>
        <h1 className=" text-slate-400 text-sm">{hit.regno}</h1>
        <h1 className=" text-slate-400 text-sm">{hit.dob}</h1>
        <h1 className=" text-slate-400 text-sm">{hit.filterdep}</h1>
      </div>

    </div>
  )
}

function App() {
  const [isKey, setIsKey] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [dep, setDep] = useState('');
  const [year, setYear] = useState('');
  const [m, setM] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [depGet, setDepGet] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [isView, setisView] = useState(-1);
  const [isShow, setisShow] = useState(false);
  const[showImage,setShowImage] = useState(false);
  const toggleClass = "transform translate-x-4";


  const fetchSearchData = async (n, q) => {

    setisLoading(true);
    try {
      const res = await axios.get(`https://dattebayo-api-s7vp.onrender.com/user/user?page=${n}&maxResults=20&name=${q}&filterdep=${dep}&year=${year}&g=${m}`);
      setGetData(res.data.success.data);
      setTotalPage(res.data.success.maxPages)
      setisLoading(false);
      return res;
    } catch (err) {
      setisLoading(false)
      setGetData([]);
      setTotalPage(0)
    }
  };

  const handlePageChange = (n) => {
    setCurrentPage(n)
    fetchSearchData(n, searchValue)
  }

  const handleSearchInputChange = debounce(async (value) => {
    if (value.length % 2 !== 0) {
      fetchSearchData(1, value);
    }
    else if (value.length == 0) {
      fetchSearchData(1, '')
    }
  }, 500);

  const handleInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearchInputChange(value);
  };


  useEffect(() => {
    const getToken = localStorage.getItem('key')
    if (getToken === 'sa') {
      setIsKey(true);
    }

    const fetchData4 = async () => {
      setisLoading(true);
      try {
        const res = await axios.get(`https://dattebayo-api-s7vp.onrender.com/user/user?page=1&maxResults=20&name=&filterdep=CA&year=21&q=`);
        console.log(res.data.success.data);
        setGetData(res.data.success.data);
        setTotalPage(res.data.success.maxPages)
        setisLoading(false);
        return res;
      } catch (err) {
        console.error(err);
        setisLoading(false);
        setGetData([]);
        setTotalPage(0)
      }
      setisLoading(false);
    };

    const fetchData1 = async () => {
      setisLoading(true);
      try {
        const res = await axios.get(`https://dattebayo-api-s7vp.onrender.com/user/dep`);
        setDepGet(res.data.success.data);
        console.log(res.data.success.data)
        return res;
      } catch (err) {
        console.error(err);
        setDepGet([]);
      }
    };

    fetchData1();
    fetchData4();
  }, [])

  useEffect(() => {
    if (clickCount >= 5) {
      localStorage.setItem('key', 'sa');
      setIsKey(true);
    }
  }, [clickCount]);

  const handleCountClick = () => {
    setClickCount(prev => prev + 1)
  }

  const handleGet = () => {
    setCurrentPage(1);
    fetchSearchData(1, searchValue)
  }

  const hanldeOnClick = async (i) => {
    setisView(i)
  }

  const handleNext = () => {
    if (isView < getData.length - 1) {
      setisView(i => i + 1)
    }
  }

  const handlePrev = () => {
    if (isView > 0) {
      setisView(i => i - 1)
    }
  }

  return (
    <div className=" w-screen h-screen flex relative items-center justify-center">
      <img src="https://dashboard.algolia.com/client-assets/2534bd4e95b5dbe7bee3f002463da377/325b80f284f2d0f174a7.png" alt="" className="h-full w-full object-cover" />

      {isKey ? <div className=" absolute z-10  flex-col top-0  w-full h-full bg-white bg-opacity-50 flex justify-center items-start py-2 xl:py-10">

        <div className=' w-full  h-fit space-y-4 flex flex-col space-x-4 justify-center items-center'>

          <div className="space-y-4 flex flex-col items-start">

            

            <div className=" space-y-2 xl:space-y-0 xl:space-x-2  xl:flex-row flex-col flex items-center bg-black rounded-xl py-2 px-3">

              <div className="flex space-x-2">

                <div className="flex space-x-2 items-center">
                  <h1 className=" text-white font-medium">Image</h1>
                  <div className="w-10 h-5 flex items-center bg-blue-700 rounded-full p-1 cursor-pointer"
                    onClick={() => {
                      setisShow(!isShow);
                    }}
                  >
                    <div className={"bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out " + (isShow ? null : toggleClass)}></div>
                  </div>
                </div>

                <div className=" flex justify-between space-x-2 ">

                  <div className={`flex items-center w-full xl:w-[20rem] px-2 h-[40px] bg-white  dark:bg-[#2F383D]  rounded-md`}>
                    <input
                      type="text"
                      placeholder='Enter the name or reg no'
                      value={searchValue}
                      onChange={handleInput}
                      className={`w-full px-[10px] py-2 text-[14px]  focus:outline-none  text-[#8D8D8D] bg-transparent `}
                    />
                  </div>

                  
                </div>  

              </div>

              <div className=" flex space-x-2 items-center h-full ">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}

                  className={`shadow-sm border dark:shadow-none dark:border-none dark:bg-[#2F383D] h-10 w-[6rem] rounded px-2  placeholder-[#414956] dark:placeholder-[#768795] text-black dark:text-white`}
                >
                  <option value="">All Year</option>
                  <option value="21">3 year</option>
                  <option value="22">2 year</option>
                </select>

                <select
                  value={m}
                  onChange={(e) => setM(e.target.value)}

                  className={`shadow-sm border dark:shadow-none dark:border-none dark:bg-[#2F383D] h-10 w-[4rem] rounded px-2  placeholder-[#414956] dark:placeholder-[#768795] text-black dark:text-white`}
                >
                  <option value="">All</option>
                  <option value="male">m</option>
                  <option value="female">w</option>
                </select>

                <select
                  value={dep}
                  onChange={(e) => setDep(e.target.value)}
                  className={`shadow-sm border dark:shadow-none dark:border-none dark:bg-[#2F383D] h-10 w-[8rem] rounded px-2  placeholder-[#414956] dark:placeholder-[#768795] text-black dark:text-white`}
                >
                  <option value="" className=" text-center">All dep</option>
                  {
                    depGet?.map((item, index) =>
                      <option key={index} value={item?.dep} className=" text-center">{item.dep}</option>
                    )
                  }
                </select>

                <button onClick={handleGet} className=" w-10 h-10  flex items-center  justify-center rounded-full  hover:bg-black hover:bg-opacity-80 shadow-2xl hover:text-blue-500 bg-white text-black"> {"->"}</button>

              </div>

            </div>

          </div>

        </div>
        {isLoading ? <div className=" w-full h-full flex justify-center items-center">  <img src={loading} alt="" className=' w-12 h-12 animate-spin' /></div> :
          <div className=" h-full  w-full py-10 px-2 xl:px-14  grid grid-cols-2 xl:grid-cols-5 place-content-start overflow-y-scroll xl:overflow-y-hidden">
            {
              getData.map((item, index) => <Card hit={item} index={index} hanldeOnClick={hanldeOnClick} isShow={isShow} />)
            }
          </div>
        }

        <div className='w-full flex justify-center items-center'>
          {totalPage <= 1 ? (
            <div></div>
          ) : (
            <div className='flex justify-end px-10 mt-3 space-x-2'>
              {/* previous */}
              {currentPage !== 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='flex justify-center items-center dark:text-white'
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                  Prev
                </button>
              )}

              {/* number */}
              <button
                onClick={() => handlePageChange(1)}
                className={currentPage === 1 ? "bg-black text-white w-6 rounded-full" : "dark:text-white"}
              >
                1
              </button>
              {currentPage > 4 && <span className='dark:text-white'>...</span>}
              {Array.from({ length: totalPage }, (_, i) => {
                const pageNumber = i + 1;
                if (
                  (currentPage <= 4 && pageNumber > 1 && pageNumber <= 5) || // Show the first 5 pages when currentPage is small
                  (currentPage > 4 && pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2) || // Show 5 pages around the current page
                  (currentPage >= totalPage - 3 && pageNumber > totalPage - 5) // Show the last 5 pages when currentPage is close to the end
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNumber)}
                      className={currentPage === pageNumber ? "bg-black text-white w-6 rounded-full" : "dark:text-white"}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              {currentPage < totalPage - 3 && <span className='dark:text-white'>...</span>}
              {currentPage < totalPage - 2 && ( // Show the last page number only if not too close to the end
                <button
                  onClick={() => handlePageChange(totalPage)}
                  className={currentPage === totalPage ? "bg-black text-white w-6 rounded-full" : "dark:text-white"}
                >
                  {totalPage}
                </button>
              )}

              {/* next */}
              {currentPage !== totalPage ? (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPage}
                  className='flex justify-center items-center dark:text-white'
                >
                  Next <ion-icon name="chevron-forward-outline"></ion-icon>
                </button>
              ) : (
                <div className='w-10'></div>
              )}
            </div>
          )}
        </div>

        {
          isView != -1 ? (<div className=" absolute  flex-col top-0 z-50  w-full h-full bg-black bg-opacity-60 flex justify-center items-center ">
            <div className=" xl:w-[70rem] h-[40rem] flex bg-white rounded-lg relative items-center px-5">
              <button className=" bg-black opacity-60 w-14 h-14 rounded-full  text-white flex justify-center items-center cursor-pointer text-2xl" onClick={() => handlePrev()}>{'<'}</button>
              <div className=" bg-black w-8 h-8 rounded-full absolute top-[-10px] right-[-10px] text-white flex justify-center items-center cursor-pointer" onClick={() => setisView(-1)}>x</div>
              <div className=" xl:flex w-full h-full p-5">
                <div 
                  className="w-[20rem] h-[25rem]"
                  onMouseDown={() => setShowImage(true)}
                  onMouseUp={() => setShowImage(false)}
                >
                  <img 
                    src={`http://146.190.42.50/jmc/Photo/${getData[isView].regno.split(" ")[1]}.jpg`} 
                    alt="" 
                    className={`w-[20rem] h-[25rem] ${showImage || isShow ? '' : 'hidden'}`} 
                  />
                </div>
                <div className=" p-5 text-xl">
                  <h1 className="  font-semibold h-12 text-ellipsis overflow-hidden ">{getData[isView].name}</h1>
                  <h1 className=" text-slate-400">{getData[isView].regno}</h1>
                  <h1 className=" text-slate-400 ">{getData[isView].dob}</h1>
                  <h1 className=" text-slate-400 ">{getData[isView].filterdep}</h1>
                  <h1 className=" text-slate-400 ">{getData[isView].dep}</h1>
                </div>
              </div>
              <button className=" bg-black opacity-60 w-14 h-14 rounded-full  text-white flex justify-center items-center cursor-pointer text-2xl" onClick={() => handleNext()}>{'>'}</button>
            </div>
          </div>) : <div></div>

        }

      </div> :
        <div className=" absolute z-10  w-full h-full bg-white bg-opacity-50 flex justify-center items-center flex-col">
          <h1 className=" font-bold text-4xl">Anuthorized access</h1>
          <div className=" font-medium text-lg cursor-pointer flex space-x-2">
            <h1>Namikaze</h1>
            <h1 onClick={handleCountClick}>Minato</h1>
          </div>
        </div>}

    </div>
  )
}

export default App;

