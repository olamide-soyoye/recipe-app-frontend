import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const options = {
  baseURL: `${apiUrl}`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
const axiosInstance = axios.create(options);

export default axiosInstance;
