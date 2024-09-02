import { axiosInstance } from "../../server.js";

export const getImage = async (token, imgId) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://gigachat.devices.sberbank.ru/api/v1/files/${imgId}/content`,
    headers: {
      Accept: "image/jpg",
      Authorization: `Bearer ${token}`,
    },
    responseType: "arraybuffer",
  };
  return await axiosInstance(config)
    .then((response) => {
      // const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data); // Преобразование данных в Buffer

      // Преобразование бинарных данных в строку Base64
      const base64Image = buffer.toString("base64");
      // Определение MIME-типа изображения (в данном примере - png)
      const mimeType = "image/jpeg";

      return `data:${mimeType};base64,${base64Image}`;
    })
    .catch((error) => {
      console.log(error);
    });
};
