import { CopyX, FilePenLine, HeartPlus, Pin, PinOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFetch } from "../context/FeatchContext";
import { api } from "../services/dbConfig";
import { toast } from "react-toastify";

const ViewNote = ({ onClick }) => {
  const { notes, fetchNotes } = useFetch();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchNotes();
  }, []);

  async function handleDelete(id) {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Data deleted successfully");
      // fetchNotes();
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  const filteredData = notes.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase()),
  );
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
                  <FilePenLine
                    onClick={() => onClick(d.id)}
                    className="w-4 hover:scale-105 cursor-pointer"
                  />
                  <CopyX
                    className="text-red-500 w-4 hover:scale-105 cursor-pointer"
                    onClick={() => handleDelete(d.id)}
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
    </div>
  );
};

export default ViewNote;
