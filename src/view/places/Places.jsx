import React, { useRef, useState } from "react";
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
  updatePlace,
} from "../../hooks/slice/placesSlice";
import { Editor } from "@toast-ui/react-editor";
import Select from "react-select";
export default function Places() {
  const dispatch = useDispatch();
  const places = useSelector((store) => store.places.places);
  console.log(places, "places");
  const [editingPlaces, setEditingPlaces] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    coverImage: "",
    slideshowImages: [],
    about: "",
    stateIds: [],
    foodIds: [],
    placeIds: [],
    cusinoIds: [],
  });

  const editorRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlaces) {
      dispatch(updatePlace(formData));
      setEditingPlaces(null);
    } else {
      dispatch(
        addPlace({
          ...formData,
          id: formData.id || Date.now().toString(),
        })
      );
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      subtitle: "",
      coverImage: "",
      slideshowImages: [],
      about: "",
      stateIds: [],
      foodIds: [],
      placeIds: [],
      cusinoIds: [],
    });
    setShowForm(false);
    setEditingPlaces(null);
  };

  const handleEdit = (state) => {
    setFormData(state);
    setEditingPlaces(state.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      dispatch(deletePlace(id));
    }
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
                <Editor
                  initialValue={formData.about}
                  previewStyle="vertical"
                  height="300px"
                  initialEditType="textarea"
                  useCommandShortcut={true}
                  ref={editorRef}
                  onChange={() => {
                    const html = editorRef.current?.getInstance().getHTML();
                    setFormData((prev) => ({ ...prev, about: html }));
                  }}
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
        {places.map((city) => (
          <Card key={city.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{city.title}</span>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(city)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(city.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{city.subtitle}</p>
              <div className="text-xs text-gray-500">
                <p>ID: {city.id}</p>
                <p>Cover: {city.coverImage}</p>
                <p>Cities: {city?.stateIds?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
