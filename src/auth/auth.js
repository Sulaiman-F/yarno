export const isAuthenticated = () => {
  const userId = localStorage.getItem("id");
  const email = localStorage.getItem("email");
  return userId && email;
};

export const logout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
};

export const getCurrentUser = () => {
  if (!isAuthenticated()) return null;
  return {
    id: localStorage.getItem("id"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    assignedTeacherId: localStorage.getItem("assignedTeacherId"),
  };
};
