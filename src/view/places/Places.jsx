import React, { useEffect, useRef, useState } from "react";
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

import {
  addPlace,
  deletePlace,
  fetchPlaces,
  updatePlace,
} from "../../hooks/slice/placesSlice";

import Select from "react-select";
import Quill from "quill";
import MyLexicalEditor from "../../utils/RichTextEditor";
import RichTextEditor from "../../utils/RichTextEditor";
import toast from "react-hot-toast";
export default function Places() {
  const dispatch = useDispatch();
  const places = useSelector((places) => places.places.places || []);

  console.log(places, "places");
  const [editingPlaces, setEditingPlaces] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    coverImage: null,
    slideshowImages: [],
    about: "",
    stateIds: [],
    foodIds: [],
    placeIds: [],
    cusinoIds: [],
    hasFiles: true,
  });

  const loading = useSelector((state) => state.places.loading);
  const error = useSelector((state) => state.places.error);
  const getData = () => {
    try {
      dispatch(fetchPlaces());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data: " + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchPlaces());
  }, []);

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
    if (editingPlaces) {
      console.log("Editing Places:=>", editingPlaces, formData);
      const result = await dispatch(
        updatePlace({ id: editingPlaces, data: formData })
      );
      console.log("Update result:", result);
      if (result?.payload?.success) {
        toast.success("Places updated successfully!");
        getData();
      } else {
        toast.error("Failed to update Places: " + result.payload.error);
        console.error("❌ Failed to update Places:", result.payload.error);
      }
      setEditingPlaces(null);
    } else {
      const result = await dispatch(addPlace(formData));
      if (result?.payload?.success) {
        toast.success("Places created successfully!");
        setShowForm(false);
        resetForm();
        getData();
      } else {
        toast.error("Failed to create Places: " + result?.error?.message);
        console.error("❌ Failed to create Places:", result?.error?.message);
      }
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      subtitle: "",
      coverImage: null,
      slideshowImages: [],
      about: "",
      stateIds: [],
      foodIds: [],
      placeIds: [],
      cusinoIds: [],
      hasFiles: true,
    });
    setShowForm(false);
    setEditingPlaces(null);
  };

  const handleEdit = (places) => {
    console.log("Editing Places:", places);
    setFormData(places);
    setEditingPlaces(places._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    try {
      dispatch(deletePlace({ id }))
        .then((result) => {
          if (result?.payload?.success) {
            toast.success("Places deleted successfully!");
            getData();
          } else {
            toast.error("Failed to delete Places: " + result.payload.error);
            console.error("❌ Failed to delete Places:", result.payload.error);
          }
        })
        .catch((error) => {
          toast.error("Error deleting Places: " + error.message);
          console.error("❌ Error deleting Places:", error);
        });
    } catch (error) {}
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

  const handleImageUpload = (file, callback) => {
    // Simulate image upload
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Places
        </Button>
      </div>
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPlaces ? "Edit Places" : "Add New Places"}
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

              <div className="flex space-x-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingPlaces ? "Update" : "Save"}
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
        {places.map((placesData) => (
          <Card key={placesData._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{placesData.title}</h3>
                  <p className="text-sm text-gray-600">{placesData.subtitle}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(placesData)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(placesData._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {placesData.coverImage?.url ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    placesData.coverImage.url
                  }`}
                  alt={placesData.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                <p>ID: {placesData._id}</p>
                <p>Cities: {placesData.cityIds?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
