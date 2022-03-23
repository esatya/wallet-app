import axios from 'axios';

let API_URL = 'https://agency-nft.rahat.io';

export const apiUploadDocument = data =>
  axios.post(`${API_URL}/api/v1/nft/upload`, data);
