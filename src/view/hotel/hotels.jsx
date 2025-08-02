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
import Select from "react-select";
import RichTextEditor from "../../utils/RichTextEditor";
import toast from "react-hot-toast";
import {
  addHotel,
  deleteHotel,
  fetchHotels,
  updateHotel,
} from "../../hooks/slice/hotelsSlice";

export default function Hotels() {
  const dispatch = useDispatch();
  const hotels = useSelector((store) => store.hotels.hotels);

  console.log(hotels, "hotels");
  const [editActivity, setEditActivity] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    coverImage: "",
    slideshowImages: [],
    description: "",
    stateId: [],
    hasFiles: true,
  });
  useEffect(() => {
    dispatch(fetchHotels());
  }, []);

  const getData = () => {
    try {
      dispatch(fetchHotels());
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
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    // formDataToSend.append(
    //   "stateId",
    //   JSON.stringify(formData?.stateId?.map((s) => s.value))
    // );

    if (formData.coverImage instanceof File) {
      formDataToSend.append("coverImage", formData.coverImage);
    }

    // Add new slideshow images only
    formData.slideshowImages.forEach((img) => {
      if (img instanceof File) {
        formDataToSend.append("slideshowImages", img);
      }
    });

    let result;

    if (editActivity) {
      result = await dispatch(
        updateHotel({ id: editActivity, data: formDataToSend })
      );
      if (result?.payload?.success) {
        toast.success("Hotels updated successfully!");
        getData();
        setShowForm(false);
      } else {
        toast.error("Failed to update hotels: " + result?.payload?.error);
      }
      setEditActivity(null);
    } else {
      result = await dispatch(addHotel(formDataToSend));
      if (result?.payload?.success) {
        toast.success("Hotels added successfully!");
        setShowForm(false);
        getData();
      } else {
        toast.error("Failed to add hotels: " + result?.payload?.error);
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      coverImage: "",
      slideshowImages: [],
      description: "",
      stateId: [],
      hasFiles: true,
    });
    setShowForm(false);
    setEditActivity(null);
  };

  const handleEdit = (state) => {
    setFormData(state);
    setEditActivity(state._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting food with ID:", id);
      const result = await dispatch(deleteHotel({ id }));
      console.log("Delete result:", result);
      if (result?.payload?.success) {
        toast.success("Food deleted successfully!");
        getData();
      } else {
        toast.error("Failed to delete food: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting food:", error);
      toast.error("Failed to delete food: " + error.message);
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

  const handleImageUpload = (file, callback) => {
    // Simulate image upload
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editActivity ? "Edit Hotel" : "Add New Hotel"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Rajasthan"
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
                <Label htmlFor="description">description</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, description: content }))
                  }
                  onImageUpload={handleImageUpload}
                  showPreview
                  label="Rich Content"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editActivity ? "Update" : "Save"}
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
        {hotels.map((activities) => (
          <Card key={activities._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{activities?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {activities?.subtitle}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(activities)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(activities._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {activities.coverImage?.url ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    activities.coverImage.url
                  }`}
                  alt={activities.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              {/* <div className="text-xs text-gray-500">
                <p>ID: {activities._id}</p>
                <p>Cities: {activities.cityIds?.length || 0}</p>
              </div> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
