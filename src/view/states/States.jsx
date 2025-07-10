import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/components/ui/input";
import { Textarea } from "@/components/components/ui/textarea";

import Select from "react-select";

import Quill from "quill";
import MyLexicalEditor from "../../utils/RichTextEditor";
import RichTextEditor from "../../utils/RichTextEditor";
import {
  createState,
  deleteStateById,
  fetchStates,
  updateStateById,
} from "../../hooks/slice/statesSlice";
import toast from "react-hot-toast";

const optionsCity = [
  { value: "60d5f4837d8e2e3b887e67d1", label: "Jaipur" },
  { value: "60d5f4837d8e2e3b887e67d2", label: "Udaipur" },
];

const optionsPlace = [
  { value: "60d5f4f37d8e2e3b887e67d3", label: "Hawa Mahal" },
  { value: "60d5f4f37d8e2e3b887e67d4", label: "Amber Fort" },
  { value: "60d5f4f37d8e2e3b887e67d5", label: "City Palace Udaipur" },
  { value: "60d5f4f37d8e2e3b887e67d6", label: "Lake Pichola" },
];

const optionsFood = [
  { value: "60d5f5037d8e2e3b887e67d7", label: "Dal Baati Churma" },
  { value: "60d5f5037d8e2e3b887e67d8", label: "Ghewar" },
  { value: "60d5f5037d8e2e3b887e67d9", label: "Malpua" },
];

export default function States() {
  const dispatch = useDispatch();
  const states = useSelector((state) => state.states.states);
  const loading = useSelector((state) => state.states.loading);
  const error = useSelector((state) => state.states.error);
  const [editingState, setEditingState] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    coverImage: null,
    slideshowImages: [],
    about: "",
    cityIds: [],
    foodIds: [],
    placeIds: [],
    cusinoIds: [],
    hasFiles: true,
  });

  useEffect(() => {
    dispatch(fetchStates());
  }, []);

  const getData = () => {
    try {
      dispatch(fetchStates());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data: " + error.message);
    }
  };

  const editorRef = useRef();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingState) {
      // Update existing state via API
      const result = await dispatch(
        updateStateById({
          id: editingState, // Ensure editingState has an `id`
          data: formData,
        })
      );

      if (result?.payload?.message) {
        toast.success("State updated successfully!");
        console.log("✅ State updated successfully");
        getData();
      } else {
        toast.error("Failed to update state: " + result.payload.error);
        console.error("❌ Failed to update state:", result.payload.error);
      }

      setEditingState(null);
    } else {
      const result = await dispatch(createState(formData));
      if (result?.payload?.success) {
        toast.success("State created successfully!");
        console.log("✅ State created successfully");
      } else {
        toast.error("Failed to create state: " + result?.error?.message);
        console.error("❌ Failed to create state:", result?.error?.message);
      }
    }

    resetForm();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      coverImage: file,
    }));
  };

  const handleMultiFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      slideshowImages: files,
    }));
  };

  const handleSelectChange = (selectedOptions, name) => {
    const values = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      subtitle: "",
      coverImage: null,
      slideshowImages: [],
      about: "",
      cityIds: [],
      foodIds: [],
      placeIds: [],
      cusinoIds: [],
      hasFiles: true,
    });
    setShowForm(false);
    setEditingState(null);
  };

  const handleEdit = (state) => {
    console.log("Editing state:", state, state._id);
    setFormData(state);
    setEditingState(state._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteStateById(id));
      console.log("Delete result:", result);
      if (result?.payload?.success) {
        toast.success("state delete  successfully");
        getData();
      } else {
        toast.error("Failed to delete state: " + result?.error?.message);
        console.error("❌ Failed to delete state:", result?.error?.message);
      }
    } catch (error) {
      toast.error("Error deleting state: " + error.message);
      console.error("❌ Error deleting state:");
    }
  };

  const handleImageUpload = (file, callback) => {
    // Simulate image upload
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (states && states.length > 0) {
      console.log("Fetched states:", states);
    }
  }, [states]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("showForm:", showForm, editingState);
  return (
    <div className="space-y-6">
      <div className="flex justify-end  items-center">
        {/* <h2 className="text-2xl font-bold text-gray-900">States Management</h2> */}
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add State
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingState ? "Edit State" : "Add New State"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Rajasthan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="The Land of Kings"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <Input
                    id="coverImage"
                    type="file"
                    name="coverImage"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div>
                  <Label htmlFor="slideshowImages">Slideshow Images</Label>
                  <Input
                    id="slideshowImages"
                    type="file"
                    name="slideshowImages"
                    onChange={handleMultiFileChange}
                    multiple
                    accept="image/*"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="about">About</Label>
                <RichTextEditor
                  value={formData.about}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, about: content }))
                  }
                  onImageUpload={handleImageUpload}
                  showPreview
                  label="Rich Content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <Select
                    isMulti
                    options={optionsCity}
                    value={formData.cityIds}
                    onChange={(selected) =>
                      handleSelectChange(selected, "cityIds")
                    }
                  />
                </div>
                <div>
                  <Label>Places</Label>
                  <Select
                    isMulti
                    options={optionsPlace}
                    value={formData.placeIds}
                    onChange={(selected) =>
                      handleSelectChange(selected, "placeIds")
                    }
                  />
                </div>
                <div>
                  <Label>Foods</Label>
                  <Select
                    isMulti
                    options={optionsFood}
                    value={formData.foodIds}
                    onChange={(selected) =>
                      handleSelectChange(selected, "foodIds")
                    }
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingState ? "Update" : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {states.map((state) => (
          <Card key={state._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{state.title}</h3>
                  <p className="text-sm text-gray-600">{state.subtitle}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(state)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(state._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {state.coverImage?.url ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    state.coverImage.url
                  }`}
                  alt={state.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                <p>ID: {state._id}</p>
                <p>Cities: {state.cityIds?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
