import { createContext, useContext, useState } from "react";
import { api } from "../services/dbConfig";

const FetchContext = createContext();

export const useFetch = () => useContext(FetchContext);

export const FetchProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchNotes() {
    try {
      setLoading(true);
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <FetchContext.Provider value={{ notes, loading, fetchNotes }}>
      {children}
    </FetchContext.Provider>
  );
};
