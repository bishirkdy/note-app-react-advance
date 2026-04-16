import { ArchiveRestore, ArchiveX, CopyX, FilePenLineIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFetch } from "../context/FeatchContext";
import { api } from "../services/dbConfig";
import { toast } from "react-toastify";

const ViewNote = ({ onClick }) => {
  const { notes, fetchNotes } = useFetch();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isAchieve, setIsAchieve] = useState(false);
  const [showArchivePopup, setShowArchivePopup] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);
  useEffect(() => {
    const anyArchive = notes.some((d) => d.archived);
    setIsAchieve(anyArchive);
  }, [notes]);
  async function handleDelete(e, id) {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Data deleted successfully");
    } catch (error) {
      toast.error("Failed to delete");
    }
  }
  const archivedData = notes.filter((d) => d.archived);
  async function unarchiveHandler(id) {
    try {
      await api.patch(`/notes/${id}`, { archived: false });
      toast.success("Unarchived note");
    } catch (error) {
      toast.error("Failed to unarchive");
    }
  }
  async function archiveHandler(id) {
    try {
      await api.patch(`/notes/${id}`, { archived: true });
      toast.success("Archived note");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const searchText = search.toLowerCase();
  const filteredData = notes.filter((d) => {
    if (d.archived) return false;
    return (
      d.title.toLowerCase().includes(searchText) ||
      d.category.toLowerCase().includes(searchText) ||
      d.content.toLowerCase().includes(searchText)
    );
  });
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "color") return a.color > b.color ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="flex-1 bg-(--color-tertiary) rounded-2xl p-5 overflow-y-auto shadow-inner scrollbar-hide">
      <h1 className="text-2xl font-bold mb-4 text-(--color-primary)">
        Memories
      </h1>

      <div className="flex flex-row items-center justify-between gap-2">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <select
          className="p-2 mb-4 border"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
          <option value="color">Color</option>
        </select>
      </div>
      {isAchieve && (
        <button
          onClick={() => setShowArchivePopup(true)}
          className="w-full bg-black/90 cursor-pointer rounded-lg mb-2 p-2 text-white"
        >
          Archive items
        </button>
      )}
      {sortedData.length > 0 ? (
        <div className="grid gap-4">
          {sortedData.map((d, i) => (
            <div
              key={i}
              className="rounded-xl p-4 shadow-md flex flex-col gap-2 transition hover:scale-[1.01]"
              style={{ backgroundColor: d.color }}
            >
              <div className="flex flex-row items-start justify-between w-full">
                <h2 className="text-lg font-semibold text-white">
                  {d.title.split(0, 20)}
                </h2>
                <div className="flex flex-row items-center gap-2 bg-white p-1 rounded-lg">
                  <ArchiveRestore
                    onClick={() => archiveHandler(d.id)}
                    className="w-4 hover:scale-105 cursor-pointer"
                  />
                  <FilePenLineIcon
                    onClick={() => onClick(d.id)}
                    className="w-4 hover:scale-105 cursor-pointer"
                  />
                  <CopyX
                    className="text-red-500 w-4 hover:scale-105 cursor-pointer"
                    onClick={(e) => handleDelete(e, d.id)}
                  />
                </div>
              </div>
              <p className="text-sm text-white opacity-90">{d.content}</p>

              {d.category && (
                <span className="text-xs bg-white text-black px-2 py-1 rounded w-fit">
                  Category : {d.category}
                </span>
              )}

              <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto">
                {d.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/80 text-black px-2 py-1 rounded whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 w-full p-1 rounded-lg text-[10px]">
                <p className="bg-white p-1 rounded-lg">
                  Created :{" "}
                  {new Date(d.createdAt).toLocaleString("en-IN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>{" "}
                {d.updatedAt && (
                  <p className="bg-white p-1 rounded-lg">
                    Edited :{" "}
                    {new Date(d.updatedAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-(--color-forth) mt-10">
          No notes available
        </p>
      )}
      {showArchivePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-xl p-5 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Archived Notes</h2>
              <button
                onClick={() => setShowArchivePopup(false)}
                className="text-red-500 cursor-pointer"
              >
                Close
              </button>
            </div>

            {archivedData.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-100 overflow-y-auto">
                {archivedData.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-lg border flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{d.title}</h3>
                      <p className="text-sm text-gray-600">{d.content}</p>
                    </div>

                    <button
                      onClick={() => unarchiveHandler(d.id)}
                      className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded"
                    >
                      <ArchiveX />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No archived notes</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNote;
