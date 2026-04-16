import React, { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import { api } from "../services/dbConfig";
import { toast } from "react-toastify";
import { useFetch } from "../context/FeatchContext";
const AddNote = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    color: "#003049",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const { notes, fetchNotes } = useFetch();

  function onChangeHandler(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleTagKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      const value = tagInput.trim();

      if (value && !form.tags.includes(value)) {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, value],
        }));
        setTagInput("");
      }
    }
  }

  function removeTag(index) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }
  async function submitHandler(e) {
    e.preventDefault();

    if (!form.content.trim()) {
      toast.error("Content must contain at least one character");
      return;
    }

    if (form.title.trim().length > 100) {
      toast.error("Maximum allowed characters is 100");
      return;
    }
    const isDuplicate = notes.some(
      (d) =>
        d.title.trim().toLowerCase() === form.title.trim().toLowerCase() &&
        d.content.trim().toLowerCase() === form.content.trim().toLowerCase(),
    );

    if (isDuplicate) {
      toast.error("Data already exists with same title and content");
      return;
    }

    const newItem = {
      ...form,
      createdAt: Date.now(),
      archived: false,
    };

    try {
      await api.post("/notes", newItem);
      // await fetchNotes();
      toast.success("Form updated successfully");
      setForm({
        title: "",
        content: "",
        category: "",
        color: "#003049",
        tags: [],
      });
    } catch (error) {
      toast.error("Failed to save the note");
    }
  }
  return (
    <div className="flex flex-col pb-8 items-center w-full px-6">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
      >
        <input
          value={form.title}
          type="text"
          placeholder="Title"
          name="title"
          onChange={onChangeHandler}
          className="border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-(--color-secondary) transition"
        />

        <textarea
          value={form.content}
          name="content"
          placeholder="Write your note..."
          onChange={onChangeHandler}
          required
          className="border-2 border-gray-200 rounded-lg p-3 h-32 focus:outline-none focus:border-(--color-secondary) transition"
        />

        <input
          value={form.category}
          type="text"
          name="category"
          placeholder="Category (Optional)"
          onChange={onChangeHandler}
          className="border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-(--color-secondary) transition"
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm text-(--color-forth)">Tags</label>

          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, i) => (
              <div
                key={i}
                className="bg-gray-800 text-white px-3 py-1 rounded-full flex items-center gap-2"
              >
                {tag}
                <span
                  onClick={() => removeTag(i)}
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
            onKeyDown={handleTagKeyDown}
            placeholder="Type tag and press Enter"
            className="border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-(--color-secondary)"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-(--color-forth)">Theme Color</label>
          <ColorPicker
            selectedColor={form.color}
            onChange={(color) =>
              setForm((prev) => ({
                ...prev,
                color,
              }))
            }
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-(--color-secondary) hover:bg-(--color-primary) text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          Save Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
