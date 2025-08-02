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
  addCity,
  deleteCity,
  fetchCities,
  updateCity,
} from "../../hooks/slice/citiesSlice";

import Select from "react-select";
import Quill from "quill";
import MyLexicalEditor from "../../utils/RichTextEditor";
import RichTextEditor from "../../utils/RichTextEditor";
import toast from "react-hot-toast";
import { fetchStates } from "../../hooks/slice/statesSlice";
import { fetchPlaces } from "../../hooks/slice/placesSlice";
import { fetchFoods } from "../../hooks/slice/foodSlice";

export default function Cities() {
  const dispatch = useDispatch();
  const cities = useSelector((cities) => cities.cities.cities);
  const loading = useSelector((state) => state.cities.loading);
  const error = useSelector((state) => state.cities.error);
  const [content3, setContent3] = useState("");
  const [optionsState, setOptionsState] = useState([]);
  const [optionsPlace, setOptionsPlace] = useState([]);
  const [optionsFood, setOptionsFood] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedState, setSelectedState] = useState([]);

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
    hasFiles: true,
  });

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

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("subtitle", formData.subtitle);
    formDataToSend.append("about", formData.about);

    formDataToSend.append(
      "stateIds",
      JSON.stringify(selectedState.map((s) => s.value))
    );
    formDataToSend.append(
      "placeIds",
      JSON.stringify(selectedPlaces.map((p) => p.value))
    );
    formDataToSend.append(
      "foodIds",
      JSON.stringify(selectedFoods.map((f) => f.value))
    );

    if (formData.coverImage instanceof File) {
      formDataToSend.append("coverImage", formData.coverImage);
    }

    formData.slideshowImages.forEach((img) => {
      if (img instanceof File) {
        formDataToSend.append("slideshowImages", img);
      }
    });

    let result;
    if (editingCities) {
      result = await dispatch(
        updateCity({
          id: editingCities,
          data: formDataToSend,
        })
      );
    } else {
      result = await dispatch(addCity(formDataToSend));
    }

    if (result?.payload?.success) {
      toast.success(
        `City ${editingCities ? "updated" : "created"} successfully!`
      );
      getData();
      setShowForm(false);
      resetForm();
    } else {
      toast.error(
        `Failed to ${editingCities ? "update" : "create"} City: ${
          result?.error?.message
        }`
      );
      console.error(
        `❌ Failed to ${editingCities ? "update" : "create"} City:`,
        result?.error?.message
      );
    }
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

    setSelectedState([]);
    setSelectedPlaces([]);
    setSelectedFoods([]);
    setShowForm(false);
    setEditingCities(null);
  };

  const getAllData = async () => {
    try {
      const optionsStateData = (await dispatch(fetchStates())) || [];
      const optionsPlaceData = (await dispatch(fetchPlaces())) || [];
      const optionsFoodData = (await dispatch(fetchFoods())) || [];
      console.log(
        "Fetched options:",
        optionsStateData,
        optionsPlaceData,
        optionsFoodData
      );
      setOptionsState(
        optionsStateData?.payload?.states?.map((state) => ({
          value: state._id,
          label: state.title,
        })) || []
      );
      setOptionsPlace(
        optionsPlaceData?.payload?.map((place) => ({
          value: place._id,
          label: place.title,
        })) || []
      );
      setOptionsFood(
        optionsFoodData?.payload?.map((food) => ({
          value: food._id,
          label: food.title,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("Failed to fetch options: " + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchCities());
    getAllData();
  }, []);

  const getData = () => {
    try {
      dispatch(fetchCities());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data: " + error.message);
    }
  };

  // const handleEdit = (city) => {
  //   setFormData(city);
  //   setEditingCities(city._id);
  //   setShowForm(true);
  // };

  const handleEdit = (city) => {
    console.log("Editing city:====>", city);

    const stateIds = optionsState?.filter((s) =>
      city?.stateIds.some((idObj) => idObj === s.value)
    );

    const placeIds = optionsPlace?.filter((p) =>
      city.placeIds.some((idObj) => idObj === p.value)
    );

    const foodIds = optionsFood?.filter((f) =>
      city.foodIds.some((idObj) => idObj === f.value)
    );

    const payload = {
      ...city,
      stateIds,
      placeIds,
      foodIds,
    };

    console.log("Editing city:", payload, city);

    setFormData(payload);
    setEditingCities(city._id);
    setShowForm(true);

    // Reset selected states
    setSelectedState(stateIds);
    setSelectedPlaces(placeIds);
    setSelectedFoods(foodIds);
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteCity(id));

      if (result?.payload?.success) {
        toast.success("City delete  successfully");
        getData();
      } else {
        toast.error("Failed to delete City: " + result?.error?.message);
        console.error("❌ Failed to delete City:", result?.error?.message);
      }
    } catch (error) {
      toast.error("Error deleting City: " + error.message);
      console.error("❌ Error deleting City:");
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

  const handleImageUpload = (file, callback) => {
    // Simulate image upload
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
                  <Label>State</Label>
                  <Select
                    isMulti
                    options={optionsState}
                    value={selectedState}
                    onChange={(selected) => setSelectedState(selected)}
                  />
                </div>
                <div>
                  <Label>Places</Label>
                  <Select
                    isMulti
                    options={optionsPlace}
                    value={selectedPlaces}
                    onChange={(selected) => setSelectedPlaces(selected)}
                  />
                </div>
                <div>
                  <Label>Foods</Label>
                  <Select
                    isMulti
                    options={optionsFood}
                    value={selectedFoods}
                    onChange={(selected) => setSelectedFoods(selected)}
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
          <Card key={city._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{city.title}</h3>
                  <p className="text-sm text-gray-600">{city.subtitle}</p>
                </div>
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
                    onClick={() => handleDelete(city._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {city.coverImage?.url ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    city.coverImage.url
                  }`}
                  alt={city.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                <p>ID: {city._id}</p>
                <p>Cities: {city.cityIds?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
