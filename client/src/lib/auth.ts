export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};
