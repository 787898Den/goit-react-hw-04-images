import { useState,useEffect } from 'react';
import { Watch } from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { getImages} from '../../service/API';
import { ImageGallery } from '../ImageGallery';
import s from '../ImageGallery/ImageGallery.module.css';
import { Searchbar } from '../Searchbar';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { createPortal } from 'react-dom';

const modalRoot = document.querySelector('#modal-root');

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isEmpty, setIsEmpty] = useState (null);

  const [showModal, setShowModal] = useState(false);
  const [imgId, setImgId] = useState(null);
  const [total, setTotal] = useState(0);


   useEffect(() => {
    setSearchQuery(searchQuery);
    setPage(1);
    setData([]);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    setIsLoading(true);

    async function getPicture(){
     

      try {
        const {hits,totalHits} = await getImages(searchQuery,page)

        if (hits.length > 0) {
          setIsEmpty(true);
        }

        setData(state => [...state, ...hits]);
        setTotal(totalHits);

        window.scrollBy({
        top: document.body.clientHeight,
        behavior: 'smooth',
        
    });
      } catch (e) {
        setError(e);
      } finally{
        setIsLoading(false);
      }
    }
    getPicture();
  },[error,page,searchQuery]);

  
  const handleSubmit = newSearchQuery => {
    if (searchQuery !== newSearchQuery) {
      setSearchQuery(newSearchQuery);
      setPage(1);
      setData([]);
      setError(null);
      setIsEmpty(null);
      setTotal(0);
    }
    return;
  };

  const handleLoadMore = () => {
    setPage(page => page + 1);
  };

  const toggleModal = () => {
    setImgId();
    setShowModal(false);
    };
        
        
  const clickOnImage = (largeImageURL) => {
    setImgId(largeImageURL);
    setShowModal(true);
  };

   return (
      <div className="App">
        <Searchbar onSubmit={handleSubmit} /> 
          <ImageGallery data={data} onClick={clickOnImage} />

        {data.length > 0 && data.length < total && (
          <>
            <Button onClick={handleLoadMore} />
          </>
        )}

        {isLoading && (
          <div className={s.Watch}>
            <Watch
              color="blue"
              height={300}
              width={300}
              ariaLabel="loading"
            />
          </div>
        )}

        {isEmpty  && (
            <p className= {s.text}>Sorry, but nothing was found for your request 🧐
            </p>
        )}

        {showModal && createPortal (
          <Modal onClose={toggleModal}>
            <img src={imgId} alt="" />
          </Modal>,
          modalRoot
        )}
      </div>
   );
  };