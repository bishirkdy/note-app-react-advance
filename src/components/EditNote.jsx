import React, { useState } from "react";
import ColorPicker from "./ColorPicker";
import { useFetch } from "../context/FeatchContext";
import { api } from "../services/dbConfig";
import { toast } from "react-toastify";

const EditNote = ({ data, setData, onClose }) => {
  const [tagInput, setTagInput] = useState("");
  const { notes } = useFetch();
  function handleChange(e) {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleTagChange(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !data.tags.includes(value)) {
        setData((prev) => ({
          ...prev,
          tags: [...prev.tags, value],
        }));
        setTagInput("");
      }
    }
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!data.content.trim()) {
      toast.error("Content must contain at least one character");
      return;
    }

    if (data.title.trim().length > 100) {
      toast.error("Maximum allowed characters is 100");
      return;
    }
    const isDuplicate = notes.some(
      (d) =>
        d.id !== data.id &&
        (d.title || "").trim().toLowerCase() ===
          data.title.trim().toLowerCase() &&
        (d.content || "").trim().toLowerCase() ===
          data.content.trim().toLowerCase(),
    );
    if (isDuplicate) {
      toast.error("Data already exists with same title and content");
      return;
    }
    try {
      await api.patch(`/notes/${data.id}`, data);
      toast.success("Data updated successfully");
      onClose();
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="absolute inset-0 bg-black/80" onClick={onClose}></div>

      <form
        onSubmit={handleSave}
        className="relative bg-(--color-tertiary) w-[90%] max-w-md p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 text-(--color-primary)">
          Edit Note
        </h2>

        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded-md border outline-none"
        />

        <textarea
          name="content"
          value={data.content}
          onChange={handleChange}
          rows="4"
          className="w-full mb-4 p-2 rounded-md border outline-none"
        />

        <input
          type="text"
          name="category"
          value={data.category}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded-md border outline-none"
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm text-(--color-forth)">Tags</label>

          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, i) => (
              <div
                key={i}
                className="bg-gray-800 text-white px-3 py-1 rounded-full flex items-center gap-2"
              >
                {tag}
                <span
                  // onClick={() => removeTag(i)}
                  className="cursor-pointer text-red-400"
                >
                  ✕
                </span>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagChange}
            placeholder="Type tag and press Enter"
            className="border-2 border-gray-200 rounded-lg p-3  mb-4 focus:outline-none focus:border-(--color-secondary)"
          />
        </div>
        <ColorPicker
          selectedColor={data.color}
          onChange={(color) =>
            setData((prev) => ({
              ...prev,
              color,
            }))
          }
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-(--color-secondary) text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
