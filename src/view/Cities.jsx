import React, { useState } from "react";
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
import { addCity, deleteCity, updateCity } from "../hooks/slice/citiesSlice";

export default function Cities() {
  const dispatch = useDispatch();
  const cities = useSelector((cities) => cities.cities.cities);
  console.log(cities, "cities");
  const [editingCities, setEditingCities] = useState(null);
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
      coverImage: "",
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
              {editingCities ? "Edit State" : "Add New State"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="id">State ID</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="rajasthan"
                    required
                  />
                </div>
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
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    placeholder="rajasthan.jpg"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Describe the state..."
                  rows={4}
                />
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
