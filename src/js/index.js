import { fetchImages } from '../js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { scrollBy } from './scrollFunction';

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
        btnLoadMore.style.display = 'none';
        gallerySimpleLightbox.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }
  function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
      return Array.from(Array(end - start + 1), (_, i) => i + start);
    }
    let sideWidth = maxLength < 9 ? 1 : 2;
    let leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    let rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if (totalPages <= maxLength) {
      return range(1, totalPages);
    }

    if (page <= maxLength - sideWidth - 1 - rightWidth) {
      return range(1, maxLength - sideWidth - 1).concat(
        0,
        range(totalPages - sideWidth + 1, totalPages)
      );
    }

    if (page >= totalPages - sideWidth - 1 - rightWidth) {
      return range(1, sideWidth).concat(
        0,
        range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
      );
    }
    return range(1, sideWidth).concat(
      0,
      range(page - leftWidth, page + rightWidth),
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  }

  $(function () {
    let numberOfItem = $('.gallery .photo-card').length;
    let limitPerPage = 3;
    let totalPages = Math.ceil(numberOfItem / limitPerPage);
    let paginationSize = 7;
    let currentPage;
    function showPage(whichPage) {
      if (whichPage < 1 || whichPage > totalPages) return false;
      currentPage = whichPage;

      $('.gallery .photo-card')
        .hide()
        .slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage)
        .show();
      $('.pagination li').slice(1, -1).remove();

      getPageList(totalPages, currentPage, paginationSize).forEach(item => {
        $('<li>')
          .addClass('page-item')
          .addClass(item ? 'current-page' : 'dots')
          .toggleClass('active', item === currentPage)
          .append(
            $('<a>')
              .addClass('page-link')
              .attr({ href: 'javascript:void(0)' })
              .text(item || '...')
          )
          .insertBefore('.next-page');
      });

      $('.previuos-page').toggleClass('disable', currentPage === 1);
      $('.next-page').toggleClass('disable', currentPage === totalPages);
      return true;
    }

    $('.pagination').append(
      $('<li>')
        .addClass('page-item')
        .addClass('previuos-page')
        .append(
          $('<a>')
            .addClass('page-link')
            .attr({ href: 'javascript:void(0)' })
            .text('Prev')
        ),

      $('<li>')
        .addClass('page-item')
        .addClass('next-page')
        .append(
          $('<a>')
            .addClass('page-link')
            .attr({ href: 'javascript:void(0)' })
            .text('Next')
        )
    );

    $('.gallery').show();
    showPage(1);

    $(document).on(
      'click',
      '.pagination li.current-page:not(.active)',
      function () {
        return showPage(+$(this).text());
      }
    );

    $('.next-page').on('click', function () {
      return showPage(currentPage + 1);
    });
    $('.previuos-page').on('click', function () {
      return showPage(currentPage - 1);
    });
  });
}

// btnLoadMore.addEventListener('click', onClickLoadMoreBtn);

// async function onClickLoadMoreBtn() {
//   pageNumber++;
//   const trimmedValue = input.value.trim();
//   btnLoadMore.style.display = 'none';
//   const response = await fetchImages(trimmedValue, pageNumber);

//   try {
//     if (response.hits.length === 0) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else if (response.hits.length < 40) {
//       renderImageList(response.hits);
//       btnLoadMore.style.display = 'none';
//       gallerySimpleLightbox.refresh();
//       Notiflix.Notify.info(
//         "We're sorry, but you've reached the end of search results."
//       );
//     } else {
//       renderImageList(response.hits);
//       btnLoadMore.style.display = 'none';
//       gallerySimpleLightbox.refresh();
//       scrollBy();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

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
