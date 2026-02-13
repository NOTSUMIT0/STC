import { useState, useEffect, useRef } from 'react';
import { PhotoIcon, XMarkIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../config/api';
import { useAuth } from '../../hooks/queries/useAuth';

const TimeTableWidget = () => {
  const { data: user, refetch } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.timetableImage) {
      setImage(user.timetableImage);
    } else {
      setImage(null);
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await api.put('/api/auth/timetable', formData);
        setImage(res.data.timetableImage);
        refetch(); // Update global user state
        setIsModalOpen(false);
      } catch (err) {
        console.error('Failed to upload timetable', err);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = async () => {
    if (!confirm('Are you sure you want to delete your timetable?')) return;
    try {
      setUploading(true);
      await api.delete('/api/auth/timetable');
      setImage(null);
      refetch();
      setIsModalOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to delete timetable', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl h-full flex flex-col relative group overflow-hidden">
        <div className="card-body p-4 h-full flex flex-col items-center justify-center">
          {uploading ? (
            <span className="loading loading-spinner loading-lg text-primary"></span>
          ) : !image ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full border-2 border-dashed border-base-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-base-200/50 transition-all gap-3"
            >
              <div className="p-4 rounded-full bg-base-200 text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all">
                <PhotoIcon className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="font-bold text-base-content/70">Upload Time Table</p>
                <p className="text-xs text-base-content/40 mt-1">Click to browse</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer" onClick={() => setIsModalOpen(true)}>
              <img
                src={image}
                alt="Time Table"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-circle btn-primary text-white shadow-lg"
                title="Change Image"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={removeImage}
                className="btn btn-circle btn-error text-white shadow-lg"
                title="Remove Image"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-circle btn-ghost bg-black/50 text-white hover:bg-black/70"
                title="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <img
              src={image}
              alt="Time Table Full View"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TimeTableWidget;
