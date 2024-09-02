import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export class Text2ImageAPI {
  constructor(url, apiKey, secretKey) {
    this.URL = url;
    this.AUTH_HEADERS = {
      "X-Key": `Key ${apiKey.trim()}`, // Убедитесь, что apiKey не содержит пробелов
      "X-Secret": `Secret ${secretKey.trim()}`, // Убедитесь, что secretKey не содержит пробелов
    };
  }

  async getModels() {
    const response = await axios.get(`${this.URL}key/api/v1/models`, {
      headers: this.AUTH_HEADERS,
    });
    return response.data[0].id;
  }

  async generate(
    prompt,
    model,
    images = 1,
    width = 1024,
    height = 1024,
    style = "UHD"
  ) {
    const styles = ["KANDINSKY", "UHD", "ANIME", "DEFAULT", "PIXEL_ART"];
    const params = {
      type: "GENERATE",
      numImages: images,
      width,
      height,
      style,
      generateParams: {
        query: prompt,
      },
    };

    const formData = new FormData();
    const modelIdData = { value: model, options: { contentType: null } };
    const paramsData = {
      value: JSON.stringify(params),
      options: { contentType: "application/json" },
    };
    formData.append("model_id", modelIdData.value, modelIdData.options);
    formData.append("params", paramsData.value, paramsData.options);

    const response = await axios.post(
      `${this.URL}key/api/v1/text2image/run`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          ...this.AUTH_HEADERS,
        },
        // Убедитесь, что 'Content-Type' указан в заголовках, а не в настройках Axios
      }
    );
    const data = response.data;
    return data.uuid;
  }

  async checkGeneration(requestId, attempts = 12, delay = 10) {
    while (attempts > 0) {
      try {
        const response = await axios.get(
          `${this.URL}key/api/v1/text2image/status/${requestId}`,
          { headers: this.AUTH_HEADERS }
        );
        const data = response.data;
        console.log(data);
        if (data.status === "DONE") {
          console.log(data.images);
          return data.images;
        }
      } catch (error) {
        // обрабатываем ошибку
        console.error(error);
      }
      attempts--;
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    }
  }
}
