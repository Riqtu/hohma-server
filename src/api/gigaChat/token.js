import axios from "axios";
import { randomUUID } from "crypto";
import https from "https";
// Создаем экземпляр axios с игнорированием проверки сертификатов
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});
const id = randomUUID();
let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    RqUID: id,
    Authorization:
      "Basic NzJjNGRiODYtNTYxYy00ZjFhLThjOTAtYzlmZTgwNjYxZTNkOjlkZGYzYjcyLWQwYTEtNGIyNi1hNzQ0LTc2YjM2OTRhODQyNw==",
  },
  data: "scope=GIGACHAT_API_PERS",
};

export const getToken = async () => {
  let token = "";
  await axiosInstance(config)
    .then((response) => {
      console.log(response.data);
      token = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return token;
};
