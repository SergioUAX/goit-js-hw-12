import axios from 'axios';
// import { renderGallery } from "./render-functions";
// import { renderLoader } from './render-functions';
// import { refresh } from './render-functions';

// import { showToaster } from '../main';
// import errorIcon from "/img/errorIcon.svg";

export async function axiosGetQuery(url, params) {    
    const response = await axios.get(url, { params })
         return response;               
}