export const setFocus = (id: string) => {
  const element = document && document.getElementById(id);
  if (element) element.focus();
};

export const scrollRefIntoView = (ref: React.RefObject<HTMLElement | null>) => {
  (ref?.current as HTMLElement | null)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};
