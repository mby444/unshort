import axiosInstance from "../config/axios.js";

export async function unshortenUrl(url) {
  const history = [url];
  let currentUrl = url;

  for (let i = 0; i < 10; i++) {
    const response = await axiosInstance.get(currentUrl, {
      maxRedirects: 0,
      validateStatus: (status) => status < 400,
    });

    const location = response.headers.location;

    if (!location) {
      return { finalUrl: currentUrl, history };
    }

    currentUrl = new URL(location, currentUrl).toString();
    history.push(currentUrl);
  }

  return { finalUrl: currentUrl, history };
}
