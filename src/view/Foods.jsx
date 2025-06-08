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
import { addFood, deleteFood, updateFood } from "../hooks/slice/foodSlice";

export default function Foods() {
  const dispatch = useDispatch();
  const foods = useSelector((store) => store.foods.foods);
  console.log(foods, "foods");
  const [editingFoods, setEditingFoods] = useState(null);
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
    if (editingFoods) {
      dispatch(updateFood(formData));
      setEditingFoods(null);
    } else {
      dispatch(
        addFood({
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
    setEditingFoods(null);
  };

  const handleEdit = (state) => {
    setFormData(state);
    setEditingFoods(state.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      dispatch(deleteFood(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Food
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingFoods ? "Edit State" : "Add New State"}
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
                  {editingFoods ? "Update" : "Save"}
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
        {foods.map((foods) => (
          <Card key={foods.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{foods.title}</span>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(foods)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(foods.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{foods.subtitle}</p>
              <div className="text-xs text-gray-500">
                <p>ID: {foods.id}</p>
                <p>Cover: {foods.coverImage}</p>
                <p>Cities: {foods?.stateIds?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
