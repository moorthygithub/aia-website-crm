import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { useApiMutation } from "@/hooks/use-mutation";
import { POPUP_API } from "@/constants/apiConstants";
import LoadingBar from "@/components/loader/loading-bar";
import { toast } from "sonner";

const PopupEdit = ({ isOpen, onClose, popupId, refetch }) => {
  const [data, setData] = useState({
    heading: "",
    alt: "",
    required: "Yes",
    image: "",
    file: null,
  });
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});

  const { trigger: fetchPopup, loading } = useApiMutation();
  const { trigger: SubmitPopup, loading: submitloading } = useApiMutation();

  useEffect(() => {
    if (!isOpen || !popupId) return;

    const fetchData = async () => {
      try {
        const res = await fetchPopup({ url: POPUP_API.byId(popupId) });

        const popup = res.data;
        const popupBaseUrl = res.image_url?.find(
          (i) => i.image_for === "Popup"
        )?.image_url;
        const noImageUrl = res.image_url?.find(
          (i) => i.image_for === "No Image"
        )?.image_url;

        setData({
          heading: popup?.popup_heading || "",
          alt: popup?.popup_image_alt || "",
          required: popup?.popup_required || "Yes",
          image: popup?.popup_image
            ? `${popupBaseUrl}${popup.popup_image}`
            : noImageUrl,
          file: null,
        });
        setPreview(
          popup?.popup_image
            ? `${popupBaseUrl}${popup.popup_image}`
            : noImageUrl
        );
      } catch (err) {
        console.error("Failed to fetch popup data:", err);
        setData({
          heading: "",
          alt: "",
          required: "Yes",
          image: noImageUrl,
          file: null,
        });
        setPreview(noImageUrl);
      }
    };

    fetchData();
  }, [isOpen, popupId]);

  useEffect(() => {
    if (data.file) {
      const url = URL.createObjectURL(data.file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(data.image);
  }, [data.file, data.image]);

  const handleFileSelect = (file) => {
    if (file?.type.startsWith("image/")) {
      setData({ ...data, file });
      setErrors({ ...errors, image: "" });
    }
  };

  const handleRemove = () => {
    setData({ ...data, image: "", file: null });
    setPreview("");
  };

  const validate = () => {
    const newErrors = {};
    if (!data.heading.trim()) newErrors.heading = "Required";
    if (!data.alt.trim()) newErrors.alt = "Required";
    if (!preview) newErrors.image = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("popup_heading", data.heading);
      formData.append("popup_image_alt", data.alt);
      formData.append("popup_required", data.required);

      if (data.file instanceof File) {
        formData.append("popup_image", data.file);
      }

      const res = await SubmitPopup({
        url: `${POPUP_API.byId(popupId)}?_method=PUT`,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.code == 200) {
        toast.success(res?.msg || "Popup updated successfully ");
        onClose();
        refetch();
      } else {
        toast.error(res?.msg || "Failed to update popup");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Popup</DialogTitle>
        </DialogHeader>

        {loading && <LoadingBar />}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Image</label>
            {preview ? (
              <div className="relative mt-2 rounded border overflow-hidden bg-gray-50">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-40 object-cover"
                  object-fit="cover"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block mt-2 p-6 border-2 border-dashed border-gray-300 rounded text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-600">Drag or click to upload</p>
              </label>
            )}
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Alt Text *</label>
            <Textarea
              value={data.alt}
              onChange={(e) => setData({ ...data, alt: e.target.value })}
              className="mt-1 text-sm h-16"
              placeholder="Image description"
            />
            {errors.alt && (
              <p className="text-red-500 text-xs mt-1">{errors.alt}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Heading *</label>
            <Textarea
              value={data.heading}
              onChange={(e) => setData({ ...data, heading: e.target.value })}
              className="mt-1 text-sm h-16"
              placeholder="Popup heading"
            />
            {errors.heading && (
              <p className="text-red-500 text-xs mt-1">{errors.heading}</p>
            )}
          </div>

          {/* Required */}
          <div>
            <label className="text-sm font-medium">Required *</label>
            <Select
              value={data.required}
              onValueChange={(value) => setData({ ...data, required: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={submitloading}
            loading={submitloading}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopupEdit;
