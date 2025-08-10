import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  MapPin,
  Star,
  Thermometer,
  Eye,
  Database,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  addCalendar,
  getMonthCalendar,
  addSavedMonth,
} from "../../hooks/slice/calenderSlice";
import toast from "react-hot-toast";
import { fetchStates } from "../../hooks/slice/statesSlice";

const TravelCalendarAdmin = () => {
  const [states, setStates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [isAddingState, setIsAddingState] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableStates, setAvailableStates] = useState([]);
  const [savedMonths, setSavedMonths] = useState([]); // Track which months are saved
  const [currentYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();

  useEffect(() => {
    statesData();
    loadMonthData(selectedMonth);
  }, [selectedMonth]);

  const statesData = async () => {
    try {
      const fetchStateData = await dispatch(fetchStates());
      const allState = fetchStateData.payload.states || [];

      const filterState = allState.map((item) => {
        return {
          _id: item._id,
          title: item.title,
          subtitle: item.subtitle,
          about: item.about,
          coverImage: item.coverImage,
          cityIds: item.cityIds,
        };
      });

      setAvailableStates(filterState);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching states:", error);
      setLoading(false);
    }
  };

  const loadMonthData = async (monthNumber) => {
    try {
      const result = await dispatch(
        getMonthCalendar({
          year: currentYear,
          monthNumber,
        })
      );

      if (result.payload?.success && result.payload.calendar) {
        setCurrentMonth(result.payload.calendar);
        setSavedMonths((prev) =>
          [...prev, monthNumber].filter((v, i, a) => a.indexOf(v) === i)
        );
        dispatch(addSavedMonth(monthNumber));
      } else {
        const emptyMonth = {
          year: currentYear,
          monthNumber: monthNumber,
          month: getMonthName(monthNumber),
          season: getSeasonForMonth(monthNumber),
          weather: "",
          description: "",
          states: [],
        };
        setCurrentMonth(emptyMonth);
      }
    } catch (error) {
      console.error("Error loading month data:", error);
      // Initialize empty month on error
      const emptyMonth = {
        year: currentYear,
        monthNumber: monthNumber,
        month: getMonthName(monthNumber),
        season: getSeasonForMonth(monthNumber),
        weather: "",
        description: "",
        states: [],
      };
      setCurrentMonth(emptyMonth);
    }
  };

  const getMonthName = (monthNum) => {
    const names = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return names[monthNum - 1];
  };

  const getSeasonForMonth = (monthNum) => {
    const seasons = {
      1: "Winter",
      2: "Winter",
      3: "Spring",
      4: "Spring",
      5: "Summer",
      6: "Summer",
      7: "Monsoon",
      8: "Monsoon",
      9: "Post-Monsoon",
      10: "Post-Monsoon",
      11: "Winter",
      12: "Winter",
    };
    return seasons[monthNum];
  };

  const [newStateData, setNewStateData] = useState({
    stateId: "",
    reason: "",
    temp: "",
    rating: 4.5,
    bestFor: [""],
    cities: [""],
  });

  const handleAddState = () => {
    setIsAddingState(true);
    setNewStateData({
      stateId: "",
      reason: "",
      temp: "",
      rating: 4.5,
      bestFor: [""],
      cities: [""],
    });
  };

  const handleSaveState = () => {
    const selectedState = availableStates.find(
      (state) => state._id === newStateData.stateId
    );
    if (!selectedState) return;

    const stateData = {
      stateId: selectedState._id,
      name: selectedState.title,
      subtitle: selectedState.subtitle,
      image: selectedState.coverImage?.url || "",
      cities: newStateData.cities.filter((city) => city.trim() !== ""),
      reason: newStateData.reason,
      temp: newStateData.temp,
      rating: parseFloat(newStateData.rating),
      bestFor: newStateData.bestFor.filter((item) => item.trim() !== ""),
      famousFor: selectedState.subtitle,
    };

    setCurrentMonth((prev) => ({
      ...prev,
      states: [...(prev.states || []), stateData],
    }));

    setIsAddingState(false);
    setNewStateData({
      stateId: "",
      reason: "",
      temp: "",
      rating: 4.5,
      bestFor: [""],
      cities: [""],
    });
  };

  const handleEditState = (stateIndex) => {
    const state = currentMonth.states[stateIndex];
    setEditingState(stateIndex);
    setNewStateData({
      stateId:
        state.stateId ||
        availableStates.find((s) => s.title === state.name)?._id ||
        "",
      reason: state.reason,
      temp: state.temp,
      rating: state.rating,
      bestFor: state.bestFor || [""],
      cities: state.cities || [""],
    });
  };

  const handleUpdateState = () => {
    const selectedState = availableStates.find(
      (state) => state._id === newStateData.stateId
    );
    if (!selectedState) return;

    const updatedStateData = {
      stateId: selectedState._id,
      name: selectedState.title,
      subtitle: selectedState.subtitle,
      image: selectedState.coverImage?.url || "",
      cities: newStateData.cities.filter((city) => city.trim() !== ""),
      reason: newStateData.reason,
      temp: newStateData.temp,
      rating: parseFloat(newStateData.rating),
      bestFor: newStateData.bestFor.filter((item) => item.trim() !== ""),
      famousFor: selectedState.subtitle,
    };

    setCurrentMonth((prev) => ({
      ...prev,
      states: prev.states.map((state, index) =>
        index === editingState ? updatedStateData : state
      ),
    }));

    setEditingState(null);
  };

  const handleDeleteState = (stateIndex) => {
    setCurrentMonth((prev) => ({
      ...prev,
      states: prev.states.filter((_, index) => index !== stateIndex),
    }));
  };

  const addArrayItem = (field) => {
    setNewStateData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setNewStateData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setNewStateData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const saveCurrentMonth = async () => {
    try {
      const monthData = {
        year: currentYear,
        monthNumber: selectedMonth,
        month: currentMonth.month,
        season: currentMonth.season,
        weather: currentMonth.weather,
        description: currentMonth.description,
        states: currentMonth.states || [],
      };

      const result = await dispatch(addCalendar(monthData));

      if (result.payload?.success) {
        toast.success(`${currentMonth.month} data saved successfully!`);
        setSavedMonths((prev) =>
          [...prev, selectedMonth].filter((v, i, a) => a.indexOf(v) === i)
        );
        dispatch(addSavedMonth(selectedMonth));
      } else {
        throw new Error(result.payload?.message || "Failed to save month data");
      }
    } catch (error) {
      console.error("Error saving month data:", error);
      toast.error("Error saving month data");
    }
  };

  const updateMonthInfo = (field, value) => {
    setCurrentMonth((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading states from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-gray-600 fs-2">
                  Manage seasonal travel destinations - {currentYear}
                </p>
              </div>
            </div>
            <button
              onClick={saveCurrentMonth}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold"
            >
              <Save className="w-5 h-5" />
              Save {currentMonth.month}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Month Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">
                Select Month
              </h3>
              <div className="space-y-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedMonth === month
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{getMonthName(month)}</div>
                        <div className="text-sm opacity-75">
                          {getSeasonForMonth(month)}
                        </div>
                        {/* <div className="text-xs mt-1">
                          {month === selectedMonth
                            ? currentMonth.states?.length || 0
                            : 0}{" "}
                          states
                        </div> */}
                      </div>
                      {savedMonths.includes(month) && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Month Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentMonth.month} - {currentMonth.season}
                </h2>
                <button
                  onClick={handleAddState}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add State
                </button>
              </div>

              {/* Month Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Month Description
                </label>
                <textarea
                  value={currentMonth.description || ""}
                  onChange={(e) =>
                    updateMonthInfo("description", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe what makes this month special for travel..."
                />
              </div>

              {/* Weather Info */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  General Weather
                </label>
                <input
                  type="text"
                  value={currentMonth.weather || ""}
                  onChange={(e) => updateMonthInfo("weather", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Cool and Pleasant, Hot and Humid, etc."
                />
              </div>
            </div>

            {/* Add/Edit State Form */}
            {(isAddingState || editingState !== null) && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingState !== null ? "Edit State" : "Add New State"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingState(false);
                      setEditingState(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* State Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select State from Database
                    </label>
                    <select
                      value={newStateData.stateId}
                      onChange={(e) =>
                        setNewStateData((prev) => ({
                          ...prev,
                          stateId: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose a state...</option>
                      {availableStates.map((state) => (
                        <option key={state._id} value={state._id}>
                          {state.title} - {state.subtitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Temperature Range
                    </label>
                    <input
                      type="text"
                      value={newStateData.temp}
                      onChange={(e) =>
                        setNewStateData((prev) => ({
                          ...prev,
                          temp: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 15-25°C"
                      required
                    />
                  </div>

                  {/* Reason */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Why visit in this month?
                    </label>
                    <textarea
                      value={newStateData.reason}
                      onChange={(e) =>
                        setNewStateData((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Explain why this is the best time to visit..."
                      required
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newStateData.rating}
                      onChange={(e) =>
                        setNewStateData((prev) => ({
                          ...prev,
                          rating: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Cities */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Popular Cities
                    </label>
                    <div className="space-y-2">
                      {newStateData.cities.map((city, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={city}
                            onChange={(e) =>
                              updateArrayItem("cities", index, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="City name"
                          />
                          {newStateData.cities.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("cities", index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("cities")}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add City
                      </button>
                    </div>
                  </div>

                  {/* Best For Activities */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Best Activities/Experiences
                    </label>
                    <div className="space-y-2">
                      {newStateData.bestFor.map((activity, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={activity}
                            onChange={(e) =>
                              updateArrayItem("bestFor", index, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Activity or experience"
                          />
                          {newStateData.bestFor.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("bestFor", index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("bestFor")}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Activity
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={
                      editingState !== null
                        ? handleUpdateState
                        : handleSaveState
                    }
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    disabled={
                      !newStateData.stateId ||
                      !newStateData.reason ||
                      !newStateData.temp
                    }
                  >
                    <Save className="w-4 h-4" />
                    {editingState !== null ? "Update State" : "Add State"}
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingState(false);
                      setEditingState(null);
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* States List */}
            <div className="space-y-4">
              {currentMonth.states?.map((state, index) => (
                <div
                  key={state.id || index}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${
                          state?.image
                        }`}
                        alt={state.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-800">
                            {state.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {state.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Thermometer className="w-4 h-4" />
                            <span className="text-sm">{state.temp}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{state.reason}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {state.cities?.map((city, cityIndex) => (
                            <span
                              key={cityIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                            >
                              {city}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {state.bestFor?.map((activity, actIndex) => (
                            <span
                              key={actIndex}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditState(index)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteState(index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {(!currentMonth.states || currentMonth.states.length === 0) && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No states added for {currentMonth.month}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding states that are perfect to visit in this
                    month
                  </p>
                  <button
                    onClick={handleAddState}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Add First State
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelCalendarAdmin;
