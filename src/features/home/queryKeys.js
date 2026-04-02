export const homeQueryKeys = {
  all: ["home"],
  content: () => [...homeQueryKeys.all, "content"],
  bestSellers: (limit) => [...homeQueryKeys.all, "best-sellers", limit],
};
