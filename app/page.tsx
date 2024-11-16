"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");

  // Handle image upload and convert to Base64
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submission to the API
  const handleSubmit = async () => {
    if (!imageBase64 || !width || !height) {
      alert("Please provide all required inputs.");
      return;
    }

    try {
      const response = await axios.post('https://resize.rwlecture.com:3000/resize', {
        imageBase64,
        width: Number(width),
        height: Number(height),
      }, {
        responseType: 'blob', // Expect a file in response
      });

      // Create a download link for the resized image
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resized-image.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error resizing image:', error);
      alert('Error resizing the image.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: '300px', height: '300px', border: '1px solid #ccc', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {imageBase64 ? <img src={imageBase64} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : 'Image Placeholder'}
      </div>

      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="number"
          placeholder="Width"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          style={{ padding: '5px', width: '80px' }}
        />
        <input
          type="number"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          style={{ padding: '5px', width: '80px' }}
        />
      </div>

      <button onClick={handleSubmit} style={{ padding: '10px 20px', cursor: 'pointer' }}>Resize and Download</button>
    </div>
  );
}
