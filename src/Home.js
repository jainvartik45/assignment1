
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [obj , setObj] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numbers , setNumbers] = useState([1 , 2 , 3]);

  const API_KEY = 'jCTIVwOIgt5tMxCRtaWm_CJEhvdQlFem3jy3REPOHCY';

  //  whenever the search term changes photos are rendered again

  useEffect(() => {
    // Fetch photos when the component mounts
    fetchPhotos();

  }, [searchTerm , numbers]);


  // Feching the photos

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos?client_id=${API_KEY}`
      );
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos: ', error);
    }
  };


  // Searching for a query

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = e.target.value;
    setSearchTerm(query);
    console.log(query)
    if (query) {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${API_KEY}`
        );
        
        setPhotos(response.data.results);
      } catch (error) {
        console.error('Error searching photos: ', error);
      }
    } else {
      // If the search query is empty, fetch all photos
      fetchPhotos();
    }
  };


  // defining the outer UI of the Modal

  function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={onClose}>
              &times;
            </button>
            {children}
          </div>
        </div>
      </div>
    );
  }
  
  
  // function for fetching deatails of an image which has been clicked

  const openModal = async (e) => {
    const useId = e.currentTarget.id
    
    const response = await axios.get(
        `https://api.unsplash.com/photos/${useId}?client_id=${API_KEY}`
      );
      
    setObj(response.data);
    setIsModalOpen(true);
  };


  // function for closing the modal 

  const closeModal = () => {
    setIsModalOpen(false);
    setObj({});
  };

  // For pagination
  // Onclicking a pageNumber

  const onClickNums = async(e) => {
    const page = e.currentTarget.id;
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos?page=${page}&client_id=${API_KEY}`
      );
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos: ', error);
    }
  }

   // Onclicking a Prev

  const onClickPrev = () => {
    if(numbers[0] > 1){
      let num1 = numbers[0]
      let num2 = numbers[1];
      let num3 = numbers[2]
      setNumbers([num1 - 3 , num2 - 3 , num3 - 3])
    }
    else alert("You Cannot Go previous")
  }

   // Onclicking a Next

  const onClickNext = () => {
    if(numbers[2] <= 997){
      let num1 = numbers[0]
      let num2 = numbers[1];
      let num3 = numbers[2]
      setNumbers([num1 + 3 , num2 + 3 , num3 + 3])
    }
    else alert("You Cannot Go next")
  }

  return (
    <div>
        {/* Search Bar */}
        <div className='search'>
            <label> Search Anything : </label>
            <input type="text" name="name" placeholder='Search for a query' onChange={handleSearch} value={searchTerm}/>
        </div>
        
        {/* Fetching the photots */}
        <div className='div_gallery'>
            {photos.map((photo) => (
            <div key={photo.id} id={photo.id} onClick={openModal} className='div_inner'>
                
                <img src = {photo.urls.thumb} alt=''></img>
                <div className='profile_section'>
                    <img src={photo.user.profile_image.small} className='p_image' alt=''></img>
                    <div className='names'>
                        <h5 className='name'>{photo.user.name}</h5>
                        <p className='user_name'>{photo.user.username}</p>
                    </div>
                    
                </div>
                <p className='likes'>Likes : {photo.likes}</p>
            </div>
            ))}
        </div>

        {/* UI of Pop-up Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="modal-content">
          <h2>Modal Content</h2>
          <div>
          <img src = {obj?.urls?.regular} alt=''></img>
          <div className='main_profile_section'>
                    <img src={obj?.user?.profile_image?.medium} className='mainp_image' alt=''></img>
                    <div className='main_names'>
                        <h5 className='main_name'>{obj?.user?.name}</h5>
                        <p className='main_username'>@{obj?.user?.username}</p>
                    </div>
                    <p className='twitter'>X//{obj?.user?.social?.twitter_username}</p>
                    <p className='instagram'>ig//{obj?.user?.social?.instagram_username}</p>
                </div>

          </div>
          <p className='desc'>{obj?.description}</p>
          <button className="modal-button" onClick={closeModal}>
            Close
          </button>
        </div>
      </Modal>

      {/* Pagination */}
      <div className='pagi-container'>
        <button id='prev' onClick={onClickPrev}>
          prev
        </button>
        {numbers.map((number) => (
            <div className='pagi-number' key={number} id={number} onClick={onClickNums}>
              {number}
            </div>
        ))}
        <button id='next' onClick={onClickNext}>
          Next
        </button>
    </div>
    </div>
  )
}

export default Home