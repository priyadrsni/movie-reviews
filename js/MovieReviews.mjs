class MovieReviews {
  constructor() {
    this.API_KEY = "fxoSB9iwMUkrdffhdEh84ZpJom09KYwI";
  }

  getCriticsByReviewer(reviewer = "all") {
    return fetch(
      `https://api.nytimes.com/svc/movies/v2/critics/${reviewer}.json?api-key=${this.API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => data.results);
  };

  getReviewsByQueryAndOpeningDate(query="", date="") {
    const queryString = query ? "&query=${query}" : "";
    const dateString = date ? "&opening-date${date}" : "";
    return fetch(
      `https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=${this.API_KEY}${queryString}${dateString}`
    )
      .then((res) => res.json())
      .then((data) => data.results);
  };

  getCriticPicksReviewsByType(type, offset) {
    const offsetString = offset ? "&offset=${offset}" : "";
    return fetch(
      `https://api.nytimes.com/svc/movies/v2/reviews/${type}.json?api-key=${this.API_KEY}${offsetString}`
    )
      .then((res) => res.json())
      .then((data) => data.results);
  };
}

export default MovieReviews;
