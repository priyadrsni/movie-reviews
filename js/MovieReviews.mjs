class MovieReviews {
  #API_KEY = "fxoSB9iwMUkrdffhdEh84ZpJom09KYwI";

  getCriticsByReviewer = (reviewer = "all") => {
    return fetch(
      `https://api.nytimes.com/svc/movies/v2/critics/${reviewer}.json?api-key=${this.#API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => data.results);
  }

  getReviewsByQueryAndOpeningDate = (query = "", startDate, endDate) => {
    const queryString = query ? `&query=${query}` : "";
    const dateString = (startDate && endDate) ? `&opening-date=${startDate}:${endDate}` : "";
    return fetch(
      `https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=${this.#API_KEY}${queryString}${dateString}`
    )
      .then((res) => res.json())
      .then((data) => {
        return data.results
      });
  }

  getCriticPicksReviewsByType = (type, offset) => {
    const offsetString = offset ? `&offset=${offset}` : "";
    return fetch(
      `https://api.nytimes.com/svc/movies/v2/reviews/${type}.json?api-key=${this.#API_KEY}${offsetString}`
    )
      .then((res) => res.json())
      .then((data) => data.results);
  }
}

export default MovieReviews;
