import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetchImages';
import { renderImageList } from './js/renderImageList';

const refs = {
  input: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

refs.loadMoreBtn.style.display = 'none';

let pageNumber = 1;

refs.searchBtn.addEventListener('click', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onSearchLoadMoreBtn);

function onSearchBtnClick(evt) {
  evt.preventDefault();
  clearData();

  const inputTrimmedValue = refs.input.value.trim();

  if (inputTrimmedValue !== '') {
    fetchImages(inputTrimmedValue, pageNumber).then(images => {
      if (images.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(images.hits);
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);

        pageNumber >= Math.round(images.totalHits / 40)
          ? (refs.loadMoreBtn.style.display = 'none')
          : (refs.loadMoreBtn.style.display = 'block');

        gallerySimpleLightbox.refresh();

        const { height: cardHeight } =
          refs.gallery.firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
    });
  }
}

function onSearchLoadMoreBtn() {
  pageNumber += 1;
  const inputTrimmedValue = refs.input.value.trim();
  refs.loadMoreBtn.style.display = 'none';

  fetchImages(inputTrimmedValue, pageNumber).then(images => {
    renderImageList(images.hits);
    refs.loadMoreBtn.style.display = 'block';
    gallerySimpleLightbox.refresh();

    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (pageNumber >= Math.round(images.totalHits / 40)) {
      refs.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function clearData() {
  refs.gallery.innerHTML = '';
  pageNumber = 1;
  refs.loadMoreBtn.style.display = 'none';
}
