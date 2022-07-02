import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  per_page: 12,
  orientation: 'horizontal',
  safesearch: true,
  image_type: 'photo',
  key: '26864828-e18992272edb9570246020d60',
};

export async function getImages(q, page){
    const {data} = await axios.get(`/?q=${q}&page=${page}`);
    return data;
};