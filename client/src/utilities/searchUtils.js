
export const normalize = (str) => str?.toLowerCase().trim();

export const matchExact = (input, value) =>
  input ? value === input : true;

export const matchPrice = (input, value) =>
  input ? String(value) === String(input) : true;

export const clearedFields = {
  title: "",
  isbn: "",
  publisher: "",
  price: "",
};