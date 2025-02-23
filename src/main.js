import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import errorIcon from "/img/errorIcon.svg";
import cautionIcon from "/img/cautionIcon.svg";

import { axiosGetQuery } from "./js/pixabay-api";

import {
    renderGallery,
    renderLoader,
    renderNextButton,
    refresh,
    removeLoader,
    removeNextButton,
    scrollScreen,
} from "./js/render-functions";

export let lightbox = new SimpleLightbox('.gallery-item a', {
    captionsData: 'alt',
    captionDelay: 250
});

let axiosCurrentPage = 1;
const axiosPerPage = 40;
const axiosUrl = "https://pixabay.com/api/";
const axiosApiKey = "48935576-d8f228bedc4e06321fc81a092";
const axiosParams = {
    key: axiosApiKey,        
    q: "",
    page: axiosCurrentPage,
    per_page: axiosPerPage,
};

const toastParams = {
    title: '',
    titleColor: '#fff',
    message: '',
    position: 'topRight',
    backgroundColor: '',
    messageColor: '#fff',
    iconUrl: errorIcon,
    iconColor: '#fff',
    theme: 'dark',
};

const form = document.querySelector('.input-form');
form.addEventListener("submit", handleSubmit);
document.addEventListener("click", event => {
    if (event.target.classList.contains("button-next")) {
        handleClickNextButton(event);
    }
});

async function handleSubmit(event) {
    try {
        event.preventDefault();
        refresh();
        removeNextButton();
        const keywordString = form.querySelector('.user-input').value.trim();
           
        if (!keywordString) {
            toastParams.title = 'Warning: ',            
            toastParams.message = 'please, enter keywords for search.',            
            toastParams.backgroundColor = '#ffa000',
            showToaster( toastParams );
            return;
        }        
        renderLoader();
        axiosParams.page = 1;
        axiosCurrentPage = 1;
        axiosParams.q = keywordString;
        const response = await axiosGetQuery(axiosUrl, axiosParams);

        if (!response.data.total) {
            toastParams.title = 'Error: ',                
            toastParams.message = 'Sorry, there are no images matching your search query. Please, try again!',                
            toastParams.backgroundColor = '#ef4040',
            removeLoader();
            showToaster(toastParams);                            
            return;
        }
        removeLoader();        
        renderGallery(response.data.hits);        
        axiosCurrentPage += 1;
        if (axiosCurrentPage > Math.ceil(response.data.totalHits / axiosPerPage)) {
            toastParams.title = '';
            toastParams.message = `We're sorry, but you've reached the end of search results.`;
            toastParams.backgroundColor = '#09f';
            toastParams.iconUrl = cautionIcon;
            showToaster( toastParams );
        }
        else {
            renderNextButton();
        }

    } catch (error) { console.log(error) }
};

async function handleClickNextButton(event) {
    try {                
        event.preventDefault();
        removeNextButton();
        renderLoader();
        axiosParams.page = axiosCurrentPage;
        const response = await axiosGetQuery(axiosUrl, axiosParams);
        removeLoader();
        renderGallery(response.data.hits);        
        axiosCurrentPage += 1;        
        if (axiosCurrentPage > Math.ceil(response.data.totalHits / axiosPerPage)) {            
            toastParams.title = '';
            toastParams.message = `We're sorry, but you've reached the end of search results.`;
            toastParams.backgroundColor = '#09f';
            toastParams.iconUrl = cautionIcon;
            showToaster( toastParams );
        }
        else {
            renderNextButton();
        }        
        scrollScreen();
    } catch (error) { console.log(error) }
};

export const showToaster = options => {
    iziToast.show(options)
};
