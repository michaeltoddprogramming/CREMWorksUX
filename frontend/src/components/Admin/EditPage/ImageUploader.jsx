import { useState } from "react";

function ImageUploader({ currentImage, onUpload }) 
{
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentImage || null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected)); // show preview
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUpload(data.url); // callback to parent with uploaded image URL
      alert("Image uploaded!");
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width="100" />}
      <button onClick={handleUpload} disabled={!file}>
        Upload Image
      </button>
    </div>
  );
}

export default ImageUploader;
