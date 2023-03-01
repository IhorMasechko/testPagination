import axios from 'axios';

async function fetchImages(inputValue, pageNr) {
  const baseURL = 'https://pixabay.com/api/';
  const key = '33424543-ad7f1dfa8b6f1d99895f0282d';

  const response = await axios.get(
    `${baseURL}?key=${key}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNr}&per_page=40`
  );
  return response.data;
}

export { fetchImages };
