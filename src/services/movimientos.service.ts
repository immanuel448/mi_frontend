import { API_BASE_URL } from "../config/api";

export const getMovimientos = async () => {
  const response = await fetch(`${API_BASE_URL}/movimientos`);
  
  if (!response.ok) {
    throw new Error("Error al obtener movimientos");
  }

  return response.json();
};