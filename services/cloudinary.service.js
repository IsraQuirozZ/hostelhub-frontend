const CLOUD_NAME = "doneod11w";
const UPLOAD_PRESET = "hostelhub";

export const cloudinaryService = {
  async uploadImage(uri) {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    if (!data.secure_url) throw new Error("Error al subir la imagen");
    return data.secure_url;
  },
};
