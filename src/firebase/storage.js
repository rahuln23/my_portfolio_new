import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "./config";

export const uploadFile = async (file, folder = "uploads") => {
  if (!file) {
    throw new Error("No file selected");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  const fileRef = storageRef(
    storage,
    `${folder}/${Date.now()}_${safeName}`
  );

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
};

export const deleteFile = async (url) => {
  if (!url) return;

  try {
    const fileRef = storageRef(storage, url);
    await deleteObject(fileRef);
  } catch {
    // Ignore if file doesn't exist.
  }
};