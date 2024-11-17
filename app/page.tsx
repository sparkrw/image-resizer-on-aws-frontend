"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [resizedImageBase64, setResizedImageBase64] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(300); // Default value set to 300
  const [height, setHeight] = useState<number>(100); // Default value set to 100
  const [comment, setComment] = useState<string>(""); // State to hold server comment

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
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL!, {
        imageBase64,
        width: Number(width),
        height: Number(height),
      });

      // Extract the resized image base64 and comment from JSON response
      const resizedImageBase64 = `data:image/png;base64,${response.data.resizedImageBase64}`;
      setResizedImageBase64(resizedImageBase64);
      setComment(response.data.comment || "No comment provided by server."); // Update comment


    } catch (error) {
      console.error('Error resizing image:', error);
      alert('Error resizing the image.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f7f9fc', color: '#333', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '36px', fontWeight: 'bold', color: '#0070f3' }}>AWS강의실 이미지 리사이즈 데모</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ width: '300px', height: '300px', border: '2px dashed #0070f3', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: '#fff' }}>
          {imageBase64 ? <img src={imageBase64} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <span style={{ color: '#999' }}>Original Image</span>}
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3' }}>→</div>
        <div style={{ width: '300px', height: '300px', border: '2px dashed #0070f3', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: '#fff' }}>
          {resizedImageBase64 ? <img src={resizedImageBase64} alt="Resized" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <span style={{ color: '#999' }}>Resized Image</span>}
        </div>
      </div>

      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: '20px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <input
          type="number"
          placeholder="Width"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          style={{ padding: '10px', width: '100px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="number"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          style={{ padding: '10px', width: '100px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '12px 24px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>이미지 리사이즈</button>

      {resizedImageBase64 && (
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = resizedImageBase64;
            link.setAttribute('download', 'resized-image.png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          style={{ marginTop: '20px', padding: '12px 24px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          편집된 이미지 다운로드
        </button>
      )}

      <input
        type="text"
        value={comment}
        readOnly
        style={{ marginTop: '20px', padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f7f9fc', color: '#333' }}
        placeholder="Server comment"
      />
    </div>
  );
}
