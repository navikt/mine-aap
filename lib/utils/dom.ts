export const setFocus = (id: string) => {
  const element = document && document.getElementById(id);
  if (element) element.focus();
};
