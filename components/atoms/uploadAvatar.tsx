"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";

const UploadComponent = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data: session } = useSession();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !session?.user?.email) {
      console.error("No file selected or user is not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the selected file to FormData
    formData.append("user_email", session.user.email);

    try {
      const response = await axios.post("/api/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type
        },
      });

      if (response.status === 201) {
        console.log("File uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <form onSubmit={onUpload}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <input type="file" onChange={onFileChange} accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadComponent;
