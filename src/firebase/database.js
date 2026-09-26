import {
  ref,
  get,
  set,
  update,
  push,
  remove,
} from "firebase/database";

import { database } from "./config";

const portfolioRef = ref(database, "portfolio");

export const getPortfolioData = async () => {
  const snapshot = await get(portfolioRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
};

export const savePortfolioData = async (data) => {
  await set(portfolioRef, data);
};

export const updatePortfolio = async (data) => {
  await update(portfolioRef, data);
};

export const saveSection = async (section, data) => {
  await set(ref(database, `portfolio/${section}`), data);
};

export const addItem = async (section, data) => {
  const collectionRef = ref(database, `portfolio/${section}`);
  const newItemRef = push(collectionRef);

  await set(newItemRef, data);

  return newItemRef.key;
};

export const updateItem = async (section, id, data) => {
  await update(
    ref(database, `portfolio/${section}/${id}`),
    data
  );
};

export const deleteItem = async (section, id) => {
  await remove(
    ref(database, `portfolio/${section}/${id}`)
  );
};