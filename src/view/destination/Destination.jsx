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
import { fetchCities } from "../../hooks/slice/citiesSlice";

import Select from "react-select";
import RichTextEditor from "../../utils/RichTextEditor";
import toast from "react-hot-toast";
import { fetchStates } from "../../hooks/slice/statesSlice";
import {
  addDestination,
  deleteDestination,
  fetchDestinations,
  updateDestination,
} from "../../hooks/slice/destinationSlice";

export default function Destination() {
  const dispatch = useDispatch();
  const destination = useSelector((store) => store.destination.destinations);
  const loading = useSelector((state) => state?.destination?.loading);
  const error = useSelector((state) => state?.destination?.error);

  console.log("destinationData", destination);
  const [optionsState, setOptionsState] = useState([]);
  const [optionsPlace, setOptionsPlace] = useState([]);
  const [optionsCities, setOptionsCities] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [editingCities, setEditingCities] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    stateName: "",
    subtitle: "",
    coverImage: null,
    slideshowImages: [],
    about: "",
    stateIds: [],
    cityIds: [],
    cusinoIds: [],
    hasFiles: true,
  });

  useEffect(() => {
    dispatch(fetchDestinations());
    getAllData();
  }, []);

  const getData = () => {
    try {
      dispatch(fetchDestinations());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data: " + error.message);
    }
  };

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
    formDataToSend.append("stateName", formData.stateName);

    formDataToSend.append(
      "stateIds",
      JSON.stringify(selectedState.map((s) => s.value))
    );
    formDataToSend.append(
      "cityIds",
      JSON.stringify(selectedCities.map((c) => c.value))
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
        updateDestination({
          id: editingCities,
          data: formDataToSend,
        })
      );
    } else {
      result = await dispatch(addDestination(formDataToSend));
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
      stateName: "",
      stateIds: [],
      cityIds: [],
      cusinoIds: [],
      hasFiles: true,
    });

    setSelectedState([]);
    setSelectedCities([]);
    setShowForm(false);
    setEditingCities(null);
  };

  const getAllData = async () => {
    try {
      const optionsStateData = (await dispatch(fetchStates())) || [];
      const optionsCities = (await dispatch(fetchCities())) || [];

      setOptionsState(
        optionsStateData?.payload?.states?.map((state) => ({
          value: state._id,
          label: state.title,
        })) || []
      );
      setOptionsCities(
        optionsCities?.payload?.map((destination) => ({
          value: destination._id,
          label: destination.title,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("Failed to fetch options: " + error.message);
    }
  };

  const handleEdit = (destination) => {
    console.log(
      "Editing destination:====>",
      destination,
      optionsState,
      optionsCities
    );

    const stateIds = optionsState?.filter((s) =>
      destination?.stateIds?.some((idObj) => idObj._id === s.value)
    );

    const cityIds = optionsCities?.filter((c) =>
      destination?.cityIds?.some((idObj) => idObj._id === c.value)
    );

    const payload = {
      ...destination,
      stateIds,
      cityIds,
    };

    console.log(
      "Editing destination:",
      payload,
      destination,
      stateIds,
      cityIds
    );

    setFormData(payload);
    setEditingCities(destination._id);
    setShowForm(true);

    // Reset selected states
    setSelectedState(stateIds);
    setSelectedCities(cityIds);
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteDestination({ id }));

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
          Add Destination
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCities ? "Edit Destination" : "Add New Destination"}
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
                <div>
                  <Label htmlFor="subtitle">State Name</Label>
                  <Input
                    id="stateName "
                    name="stateName"
                    value={formData.stateName}
                    onChange={handleInputChange}
                    placeholder="enter state name.."
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
                  <Label>City</Label>
                  <Select
                    isMulti
                    options={optionsCities}
                    value={selectedCities}
                    onChange={(selected) => setSelectedCities(selected)}
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
        {destination.map((destination) => (
          <Card key={destination._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{destination.title}</h3>
                  <p className="text-sm text-gray-600">
                    {destination.subtitle}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(destination)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(destination._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {destination.coverImage?.url ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    destination.coverImage.url
                  }`}
                  alt={destination.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              {/* <div className="text-xs text-gray-500">
                <p>ID: {destination._id}</p>
                <p>Citis: {destination.cityIds?.length || 0}</p>
              </div> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
