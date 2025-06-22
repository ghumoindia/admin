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
import { addCity, deleteCity, updateCity } from "../../hooks/slice/citiesSlice";
import { Editor } from "@toast-ui/react-editor";
import Select from "react-select";

const optionsState = [
  { value: "andhra-pradesh", label: "Andhra Pradesh" },
  { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal-pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya-pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west-bengal", label: "West Bengal" },
  { value: "delhi", label: "Delhi" },
  { value: "jammu-kashmir", label: "Jammu & Kashmir" },
  { value: "ladakh", label: "Ladakh" },
];

const optionsPlace = [
  { value: "hawa-mahal", label: "Hawa Mahal" },
  { value: "amber-fort", label: "Amber Fort" },
  { value: "city-palace-udaipur", label: "City Palace Udaipur" },
  { value: "lake-pichola", label: "Lake Pichola" },
];
const optionsFood = [
  { value: "dal-baati", label: "Dal Baati Churma" },
  { value: "ghewar", label: "Ghewar" },
  { value: "malpua", label: "Malpua" },
];

export default function Cities() {
  const dispatch = useDispatch();
  const cities = useSelector((cities) => cities.cities.cities);

  const [editingCities, setEditingCities] = useState(null);
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
  });

  console.log(formData, "formData in Cities");
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
    if (editingCities) {
      dispatch(updateCity(formData));
      setEditingCities(null);
    } else {
      dispatch(
        addCity({
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
      coverImage: null,
      slideshowImages: [],
      about: "",
      stateIds: [],
      foodIds: [],
      placeIds: [],
      cusinoIds: [],
    });
    setShowForm(false);
    setEditingCities(null);
  };

  const handleEdit = (state) => {
    setFormData(state);
    setEditingCities(state.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      dispatch(deleteCity(id));
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

  const handleSelectChange = (selectedOptions, name) => {
    const values = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Cities
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCities ? "Edit Cities" : "Add New Cities"}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>State</Label>
                  <Select
                    isMulti
                    options={optionsState}
                    value={formData.stateIds}
                    onChange={(selected) =>
                      handleSelectChange(selected, "stateIds")
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
                  {editingCities ? "Update" : "Save"}
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
        {cities.map((city) => (
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
                <p>City Name : {city.title}</p>
                {/* <p>Cover: {city?.coverImage}</p> */}
                <p>Cities: {city?.stateIds?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
