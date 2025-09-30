export const isLoggedIn = () => {
  return !!localStorage.getItem("access");
};