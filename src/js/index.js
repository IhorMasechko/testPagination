import { fetchImages } from '../js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { scrollBy } from './scrollFunction';
import paginationjs from 'paginationjs';

const input = document.querySelector('input[name="searchQuery"]');
const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

btnLoadMore.style.display = 'none';

let pageNumber = 1;
let currentHits = 0;

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(e) {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = input.value.trim();
  if (trimmedValue !== '') {
    const response = await fetchImages(trimmedValue, pageNumber);
    currentHits = response.hits.length;

    try {
      if (response.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (response.hits.length > 0 && response.hits.length < 40) {
        renderImageList(response.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${response.totalHits} images.`
        );
        btnLoadMore.style.display = 'none';
        gallerySimpleLightbox.refresh();
      } else {
        renderImageList(response.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${response.totalHits} images.`
        );
        btnLoadMore.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

btnLoadMore.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
  pageNumber++;
  const trimmedValue = input.value.trim();
  btnLoadMore.style.display = 'none';
  const response = await fetchImages(trimmedValue, pageNumber);

  try {
    if (response.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (response.hits.length < 40) {
      renderImageList(response.hits);
      btnLoadMore.style.display = 'none';
      gallerySimpleLightbox.refresh();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      renderImageList(response.hits);
      btnLoadMore.style.display = 'block';
      gallerySimpleLightbox.refresh();
      scrollBy();
    }
  } catch (error) {
    console.log(error);
  }
}

function renderImageList(images) {
  console.log(images, 'images');
  const markup = images
    .map(image => {
      console.log('img', image);
      return `<div class="photo-card">
       <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnLoadMore.style.display = 'none';
}
