import axios from 'axios';

// base url to mske requests to the movie db
const instance = axios.create({
    baseURL:"https://api.themoviedb.org/3",
});



export default instance;