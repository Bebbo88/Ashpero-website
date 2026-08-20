export const tipQueryKeys = {
  all: ["tips"],
  list: (locale = "en") => [...tipQueryKeys.all, "list", locale],
};
