import React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Edit, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { getAuthToken } from "@/utils/authToken";
import BASE_URL from "@/config/base-url";

const GalleryEdit = ({ galleryId, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const reduxToken = useSelector((state) => state.auth.token);
  const token = getAuthToken(reduxToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [formData, setFormData] = useState({
    gallery_status: "",
    gallery_image: "",
  });
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const cacheBuster = Date.now();
  const queryClient = useQueryClient();


  const fetchGalleryData = async () => {
    if (!galleryId) return;
    
    setIsFetchingData(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/link-gallery/${galleryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data;
      
      
      const galleryUrlObj = response.data.image_url?.find(
        (item) => item.image_for === "Link Gallery"
      );
      

      const fullImageUrl = galleryUrlObj
      ? `${galleryUrlObj.image_url}${data.gallery_image}?t=${cacheBuster}`
      : data.gallery_url
        ? `${data.gallery_url}${data.gallery_image}?t=${cacheBuster}`
        : `${data.gallery_image}?t=${cacheBuster}`;

      setFormData({
        gallery_status: data.gallery_status || "Active",
        gallery_image: data.gallery_image || "",
      });
      
      setOriginalImageUrl(fullImageUrl);
      setCurrentImage(fullImageUrl);

    } catch (error) {
      toast.error("Failed to fetch gallery data");
      console.error("Fetch error:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen && galleryId) {
      fetchGalleryData();
    } else {
  
      setSelectedFile(null);
      setCurrentImage(null);
      setOriginalImageUrl("");
      setFormData({
        gallery_status: "",
        gallery_image: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (WebP, JPEG, PNG)");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      
      setSelectedFile(file);

      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    setCurrentImage(originalImageUrl);
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      gallery_status: status,
    }));
  };

  const handleSubmit = async () => {
    if (!galleryId) {
      toast.error("Gallery ID is required");
      return;
    }

    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
   
      formDataToSend.append("gallery_status", formData.gallery_status);
      

      if (selectedFile) {
        formDataToSend.append("gallery_image", selectedFile);
      }

      const response = await axios.post(
        `${BASE_URL}/link-gallery/${galleryId}?_method=PUT`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": selectedFile ? "multipart/form-data" : "application/json",
          },
        }
      );

      if (response?.data.code === 200 || response?.status === 200) {
        toast.success(response.data.msg || "Gallery Updated Successfully");
        
     
        await queryClient.invalidateQueries(["gallery-list"]);
        
       
       
        
        setOpen(false);
      } else {
        toast.error(response.data.message || "Error while updating Gallery");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to update Gallery"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 hover:bg-gray-100"
          onClick={() => setOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Gallery</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isFetchingData ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
           
              <div className="grid gap-2">
                <label className="text-sm font-medium">Current Image</label>
                {currentImage && (
                  <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                    <img 
                      src={currentImage} 
                      alt="Current gallery" 
                      className="w-32 h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      {selectedFile ? "New Image Preview" : "Current Image"}
                    </p>
                  </div>
                )}
              </div>

          
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  {selectedFile ? "New Image Selected" : "Upload New Image"}
                </label>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <input
                      type="file"
                      id="gallery_image_edit"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="gallery_image_edit"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Click to upload new image
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      WebP, JPEG, PNG up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                          <img 
                            src={currentImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeSelectedFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                    >
                      {formData.gallery_status || "Select Status"}
                      <svg
                        className="ml-2 h-4 w-4 opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuCheckboxItem
                      checked={formData.gallery_status === "Active"}
                      onCheckedChange={() => handleStatusChange("Active")}
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={formData.gallery_status === "Inactive"}
                      onCheckedChange={() => handleStatusChange("Inactive")}
                    >
                      Inactive
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

           
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.gallery_status}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Gallery"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryEdit;