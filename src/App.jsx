import React, { useEffect, useState } from "react";
import LeftHome from "./pages/LeftHome";
import RightHome from "./pages/RightHome";
import EditNote from "./components/EditNote";
import { useFetch } from "./context/FeatchContext";

const App = () => {
  const [editTab, setEditTab] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const { notes, fetchNotes } = useFetch();



  function handleEditBtn(id) {
    const found = notes.find((d) => d.id === id);

    if (found) {
      setEditingNote(found);
      setEditTab(true);
    }
  }

  function closeEdit() {
    setEditTab(false);
    setEditingNote(null);
  }

  return (
    <div className="flex flex-col lg:flex-row w-screen lg:h-screen min-h-screen bg-(--color-tertiary)">
      {editTab && editingNote && (
        <EditNote
          data={editingNote}
          setData={setEditingNote}
          onClose={closeEdit}
        />
      )}

      <LeftHome />
      <RightHome onClick={handleEditBtn} />
    </div>
  );
};

export default App;
