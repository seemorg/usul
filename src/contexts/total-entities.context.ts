import { createContext, useContext } from "react";

const TotalEntitiesContext = createContext<{
  books: number;
  authors: number;
  regions: number;
  genres: number;
}>({
  books: 0,
  authors: 0,
  regions: 0,
  genres: 0,
});

export const TotalEntitiesProvider = TotalEntitiesContext.Provider;

export const useTotalEntities = () => {
  return useContext(TotalEntitiesContext);
};
