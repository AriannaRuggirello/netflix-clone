import React, { useState, useEffect } from 'react'
import axios from '../axios';
import Youtube from "react-youtube"
import movieTrailer from 'movie-trailer';
const base_url = "https://image.tmdb.org/t/p/original/";
;
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // console.log(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };


  // Funzione per gestire il click su un poster del film
  const handleClick = (movie) => {
    // Se è già presente un URL del trailer, lo azzeriamo per chiudere il trailer
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      // Altrimenti, cerchiamo il trailer del film
      // Utilizziamo il titolo originale del film se disponibile, altrimenti utilizziamo il titolo
      const movieTitle = movie.original_title || movie.title || "";

      // Cerchiamo il trailer del film usando il titolo
      movieTrailer(movieTitle)
        .then((url) => {
          // Se troviamo un URL valido, estraiamo il parametro 'v' per l'ID del video e lo impostiamo come URL del trailer
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get('v'));
          } else {
            // Se non troviamo un trailer, stampiamo un messaggio di avviso nella console
            console.log("Nessun trailer trovato per questo film.");
          }
        })
        .catch((error) => console.log(error));
    }
  }



  return (
    <div className='row'>
      {/* title */}
      <h2>{title}</h2>
      <div className={'row_posters'}>
        {/* posters */}
        {movies.map(movie => (

          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}

    </div>
  )
}

export default Row
