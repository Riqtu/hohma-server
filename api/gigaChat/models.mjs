import axios from "axios";
import { axiosInstance } from "../../server.js";

export const getModels = async (token) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://gigachat.devices.sberbank.ru/api/v1/models",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axiosInstance(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log("error");
    });
};
