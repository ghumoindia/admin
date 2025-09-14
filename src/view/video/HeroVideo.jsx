import React, { useState, useEffect } from "react";
import { Film, Trash2, Upload, Video } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVideoById,
  fetchHeroVideo,
  uploadHeroVideo,
} from "../../hooks/slice/videoSlice";
import toast from "react-hot-toast";

const HeroVideo = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const { video, loading } = useSelector((state) => state.video);
  const state = useSelector((state) => state);

  console.log("video data", state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHeroVideo());
  }, [dispatch]);

  const getData = async () => {
    dispatch(fetchHeroVideo());
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Please provide title and video file");

    const formData = {
      title,
      file,
      hasFiles: true,
    };
    // formData.append("title", title);
    // formData.append("video", file);

    console.log("form data", formData, file, title);

    try {
      const result = await dispatch(uploadHeroVideo(formData));
      console.log(result, "upload result");
      if (result.payload.success) {
        toast.success("video upload successfully");
        getData();
      }
    } catch (error) {
      toast.error("Failed to upload video");
    }
    setFile(null);
    setTitle("");
  };

  const handleDelete = async (id) => {
    console.log("video data", id);
    try {
      const result = await dispatch(deleteVideoById({ id }));
      console.log(result, "result");
      if (result.payload.success) {
        toast.success("video delete successfully");
        getData();
      } else {
        toast.error(result.payload.message);
      }
    } catch (error) {
      toast.error("failed", error);
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 flex items-center gap-3">
        <Film className="text-yellow-500" size={28} /> Hero Video Manager
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left: Video List */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Video className="text-yellow-500" size={18} /> Uploaded Videos
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading videos...</p>
          ) : video && video.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {video.map((item) => (
                <div
                  key={item._id}
                  className="relative p-3 sm:p-4 border rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition"
                >
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-3 right-3 p-1.5 sm:p-2 bg-white rounded-full shadow hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  </button>

                  <h4 className="font-semibold mb-2 text-gray-800 line-clamp-1 pr-8 mt-1">
                    {item.title}
                  </h4>
                  <video
                    src={`${import.meta.env.VITE_BACKEND_URL}${item.videoUrl}`}
                    controls
                    className="w-full h-44 sm:h-48 object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-52 sm:h-60 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-500">
              <Video size={32} className="mb-2" />
              <p>No videos uploaded yet</p>
            </div>
          )}
        </div>

        {/* Right: Upload Form */}
        <form
          onSubmit={handleUpload}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 space-y-5 sm:space-y-6"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
            Upload New Video
          </h3>

          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 sm:p-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
          />

          {/* File Upload */}
          <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:border-yellow-400 hover:bg-yellow-50 transition">
            <div className="flex flex-col items-center justify-center">
              <Upload size={32} className="text-yellow-500 mb-2" />
              <p className="text-gray-600 text-sm sm:text-base font-medium text-center">
                {file ? file.name : "Click or drag & drop video"}
              </p>
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-semibold py-2.5 sm:py-3 rounded-xl shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
          >
            🚀 Upload Video
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroVideo;
