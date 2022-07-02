import axios from 'axios';
import PropTypes from 'prop-types';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  per_page: 12,
  orientation: 'horizontal',
  safesearch: true,
  image_type: 'photo',
  key: '26864828-e18992272edb9570246020d60',
};

export async function getImages(q, page){

    try {
      const data = await axios.get(`/?q=${q}&page=${page}`);
      return data;

    } catch (e) {
      throw e;
    }
};

getImages.propTypes = {
  query: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
};