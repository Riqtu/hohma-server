import { axiosInstance } from "../../server";

export const genQuery = async (token, state, data) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    data:
      state === "image"
        ? JSON.stringify({
            model: "GigaChat",
            messages: [
              {
                role: "system",
                content: data.system,
              },
              {
                role: "user",
                content: data.user,
              },
            ],
            function_call: "auto",
          })
        : JSON.stringify({
            model: "GigaChat",
            messages: [
              {
                role: "system",
                content: data.system,
              },
              {
                role: "user",
                content: data.user,
              },
            ],
            n: 1,
            stream: false,
            update_interval: 0,
          }),
  };
  let result = "";
  await axiosInstance(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      if (state === "image") {
        const str = response.data.choices[0].message.content;
        const match = str.match(/src="([^"]*)"/);

        if (match) {
          result = match[1];
        } else {
          console.log("Атрибут src не найден");
        }
      } else {
        result = response.data.choices[0].message.content;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
};
