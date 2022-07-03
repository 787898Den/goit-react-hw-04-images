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
  const [status, setStatus] = useState('idle');
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

    async function getPicture(){
     

      try {
        setStatus('pending');
        const {hits,totalHits} = await getImages(searchQuery,page)

        if (hits.length > 0) {
          setData(state => [...state, ...hits]);
          setTotal(totalHits)
          setStatus('resolved');
        }
        else{
          setError('Sorry, but nothing was found for your request 🧐')
          setStatus('rejected');
        }
        window.scrollBy({
        top: document.body.clientHeight,
        behavior: 'smooth',
        
    });
      } catch (e) {
        setError((error));
        setStatus('rejected');
      }
    }
    getPicture();
  },[error,page,searchQuery]);

  
  const handleSubmit = newSearchQuery => {
    if (searchQuery !== newSearchQuery) {
      setSearchQuery(newSearchQuery);
      setPage(1);
      setData([]);
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

        {status === 'resolved' && data.length > 0 && data.length < total && (
          <>
            <Button onClick={handleLoadMore} />
          </>
        )}

        {status === 'pending' && (
          <div className={s.Watch}>
            <Watch
              color="blue"
              height={300}
              width={300}
              ariaLabel="loading"
            />
          </div>
        )}

        {status === 'rejected' && (
          <div className={s.ImageGallery}>
            <p>{`Something went wrong! ${error}`}</p>
          </div>
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