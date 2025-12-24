import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import LoadingBar from "@/components/loader/loading-bar";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { LETUREYOUTUBE_API, YOUTUBEFOR_API } from "@/constants/apiConstants";
import { getImageBaseUrl, getNoImageUrl } from "@/utils/imageUtils";
import ImageCell from "@/components/common/ImageCell";
import { useQueryClient } from "@tanstack/react-query";
import ApiErrorPage from "@/components/api-error/api-error";

const initialState = {
  youtube_for: "",
  youtube_sort: "",
  youtube_course: "",
  youtube_language: "",
  youtube_link: "",
  youtube_image: null,
  youtube_image_alt: "",
  youtube_status: "Active",
};

const LectureYoutubeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const IMAGE_FOR = "Lecture Youtube";
  const [data, setData] = useState(initialState);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();
  const { trigger: fetchVideo, loading, error: videoError } = useApiMutation();
  const { trigger: submitVideo, loading: submitLoading } = useApiMutation();

  const {
    data: youtubeForData,
    loading: youtubeForLoading,
    youtubeForError,
    refetch,
  } = useGetApiMutation({
    url: YOUTUBEFOR_API.list,
    queryKey: ["youtubeFor"],
  });

  const fetchData = async () => {
    try {
      const res = await fetchVideo({
        url: LETUREYOUTUBE_API.byId(id),
      });

      setData({
        ...res.data,
        youtube_image: null,
      });
      console.log(res?.dat, "res?.data?.image_url");
      const imageBaseUrl = getImageBaseUrl(res?.image_url, IMAGE_FOR);
      const noImageUrl = getNoImageUrl(res?.image_url);
      console.log(imageBaseUrl, "imageBaseUrl");
      const imagepath = res?.data?.youtube_image
        ? `${imageBaseUrl}${res?.data?.youtube_image}`
        : noImageUrl;

      setPreview(imagepath || "");
    } catch {
      refetch();
      toast.error("Failed to load data");
    }
  };
  useEffect(() => {
    if (!isEditMode) return;
    fetchData();
  }, [id, isEditMode]);

  const validate = () => {
    const err = {};

    if (!data.youtube_for) err.youtube_for = "YouTube For is required";
    if (!data.youtube_course) err.youtube_course = "Course is required";
    if (!data.youtube_link) err.youtube_link = "YouTube link is required";
    if (!data.youtube_image_alt)
      err.youtube_image_alt = "Image Alt is required";
    if (!isEditMode && !data.youtube_image)
      err.youtube_image = "Image is required";
    if (data.youtube_sort && isNaN(Number(data.youtube_sort))) {
      err.youtube_sort = "Sort order must be a number";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("youtube_for", data.youtube_for);
    formData.append("youtube_sort", data.youtube_sort);
    formData.append("youtube_course", data.youtube_course);
    formData.append("youtube_language", data.youtube_language);
    formData.append("youtube_link", data.youtube_link);
    formData.append("youtube_image_alt", data.youtube_image_alt);
    formData.append("youtube_status", data.youtube_status);

    if (data.youtube_image instanceof File) {
      formData.append("youtube_image", data.youtube_image);
    }
    try {
      const res = await submitVideo({
        url: isEditMode
          ? `${LETUREYOUTUBE_API.byId(id)}?_method=PUT`
          : `${LETUREYOUTUBE_API.list}?_method=POST`,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (
        (isEditMode && res?.code === 200) ||
        (!isEditMode && res?.code === 201)
      ) {
        toast.success(res?.msg || "Saved successfully");
        navigate("/lecture-youtube");
        queryClient.invalidateQueries({ queryKey: ["lecture-youtube-list"] });
      } else {
        toast.error(res?.msg || "Failed to update leture");
      }
    } catch {
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };
  if (videoError || youtubeForError) {
    return <ApiErrorPage onRetry={() => fetchData()} />;
  }
  return (
    <div className="mx-6 space-y-6">
      {(loading || youtubeForLoading) && <LoadingBar />}

      <h2 className="text-xl font-semibold">
        {isEditMode ? "Edit YouTube Video" : "Create YouTube Video"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium">
            YouTube For <span className="text-red-500">*</span>
          </label>
          <Select
            value={data.youtube_for}
            onValueChange={(v) => setData({ ...data, youtube_for: v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select YouTube For" />
            </SelectTrigger>
            <SelectContent>
              {youtubeForData?.data?.map((item, key) => (
                <SelectItem key={key} value={item.page_one_url}>
                  {item.page_one_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.youtube_for && (
            <p className="text-xs text-red-500 mt-1">{errors.youtube_for}</p>
          )}
        </div>

        {/* Sort */}
        <div>
          <label className="text-sm font-medium">Sort Order</label>
          <Input
            className="mt-1"
            value={data.youtube_sort}
            onChange={(e) => setData({ ...data, youtube_sort: e.target.value })}
          />
          {errors.youtube_sort && (
            <p className="text-xs text-red-500 mt-1">{errors.youtube_sort}</p>
          )}
        </div>

        {/* Course */}
        <div>
          <label className="text-sm font-medium">
            Course <span className="text-red-500">*</span>
          </label>
          <Input
            className="mt-1"
            value={data.youtube_course}
            onChange={(e) =>
              setData({ ...data, youtube_course: e.target.value })
            }
          />
          {errors.youtube_course && (
            <p className="text-xs text-red-500 mt-1">{errors.youtube_course}</p>
          )}
        </div>

        {/* Language */}
        <div>
          <label className="text-sm font-medium">Language</label>
          <Input
            className="mt-1"
            value={data.youtube_language}
            onChange={(e) =>
              setData({ ...data, youtube_language: e.target.value })
            }
          />
        </div>

        {/* Link */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">
            YouTube Link <span className="text-red-500">*</span>
          </label>
          <Input
            className="mt-1"
            value={data.youtube_link}
            onChange={(e) => setData({ ...data, youtube_link: e.target.value })}
          />
          {errors.youtube_link && (
            <p className="text-xs text-red-500 mt-1">{errors.youtube_link}</p>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="text-sm font-medium">
            Image {!isEditMode && <span className="text-red-500">*</span>}
          </label>
          <Input
            type="file"
            accept="image/*"
            className="mt-1"
            onChange={(e) =>
              setData({ ...data, youtube_image: e.target.files?.[0] })
            }
          />
          {errors.youtube_image && (
            <p className="text-xs text-red-500 mt-1">{errors.youtube_image}</p>
          )}
        </div>

        {/* Image Alt */}
        <div>
          <label className="text-sm font-medium">Image Alt</label>
          <Input
            className="mt-1"
            value={data.youtube_image_alt}
            onChange={(e) =>
              setData({ ...data, youtube_image_alt: e.target.value })
            }
          />
          {errors.youtube_image_alt && (
            <p className="text-xs text-red-500 mt-1">
              {errors.youtube_image_alt}
            </p>
          )}
        </div>

        {/* Status */}
        {isEditMode && (
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select
              value={data.youtube_status}
              onValueChange={(v) => setData({ ...data, youtube_status: v })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {preview && (
          <ImageCell src={preview} width="full" alt="Lecture Youtube Image" />
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={submitLoading}>
          {isEditMode ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default LectureYoutubeForm;
