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
import {
  STUDENT_API,
  COUNTRY_API,
  COMPANY_API,
} from "@/constants/apiConstants";
import ApiErrorPage from "@/components/api-error/api-error";
import { useQueryClient } from "@tanstack/react-query";
import ImageCell from "@/components/common/ImageCell";

const initialState = {
  student_uid: "",
  student_sort: "",
  student_name: "",
  student_course: "",
  student_designation: "",
  student_country_id: "",
  student_company_id: "",
  student_have_testimonial: "No",
  student_have_certificate: "No",
  student_have_linkedin: "No",
  student_testimonial: "",
  student_linkedin_link: "",
  student_youtube_link: "",
  student_image: null,
  student_image_alt: "",
  student_office_image: null,
  student_office_image_alt: "",
  student_certificate_image: null,
  student_certificate_image_alt: "",
  student_youtube_image: null,
  student_youtube_image_alt: "",
  student_status: "Active",
};

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState({});

  const {
    trigger: fetchStudent,
    loading: fetchLoading,
    error: fetchError,
  } = useApiMutation();
  const { trigger: submitStudent, loading: submitLoading } = useApiMutation();

  const { data: countriesData, refetch: refetchCountries } = useGetApiMutation({
    url: COUNTRY_API.dropdown,
    queryKey: ["countries-dropdown"],
  });

  const { data: companiesData, refetch: refetchCompanies } = useGetApiMutation({
    url: COMPANY_API.dropdown,
    queryKey: ["companies-dropdown"],
  });

  const fetchData = async () => {
    try {
      const res = await fetchStudent({ url: STUDENT_API.byId(id) });
      setData({
        ...res.data,
        student_image: null,
        student_office_image: null,
        student_certificate_image: null,
        student_youtube_image: null,
      });

      setPreview({
        student_image: res.data.student_image_url || "",
        student_office_image: res.data.student_office_image_url || "",
        student_certificate_image: res.data.student_certificate_image_url || "",
        student_youtube_image: res.data.student_youtube_image_url || "",
      });
    } catch {
      toast.error("Failed to load student data");
    }
  };
  useEffect(() => {
    if (!isEditMode) return;
    fetchData();
  }, [id]);

  const validate = () => {
    const err = {};
    if (!data.student_uid) err.student_uid = "UID is required";
    if (!data.student_name) err.student_name = "Name is required";
    if (!data.student_course) err.student_course = "Course is required";
    if (!data.student_country_id)
      err.student_country_id = "Country is required";
    if (!data.student_company_id)
      err.student_company_id = "Company is required";
    if (!isEditMode && !data.student_image)
      err.student_image = "Student image is required";
    if (data.student_sort && isNaN(Number(data.student_sort)))
      err.student_sort = "Sort order must be a number";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const formData = new FormData();
    formData.append("student_uid", data.student_uid);
    formData.append("student_sort", data.student_sort);
    formData.append("student_name", data.student_name);
    formData.append("student_course", data.student_course);
    formData.append("student_designation", data.student_designation);
    formData.append("student_country_id", data.student_country_id);
    formData.append("student_company_id", data.student_company_id);
    formData.append("student_have_testimonial", data.student_have_testimonial);
    formData.append("student_have_certificate", data.student_have_certificate);
    formData.append("student_have_linkedin", data.student_have_linkedin);
    formData.append("student_testimonial", data.student_testimonial);
    formData.append("student_linkedin_link", data.student_linkedin_link);
    formData.append("student_youtube_link", data.student_youtube_link);
    formData.append("student_image_alt", data.student_image_alt);
    formData.append("student_office_image_alt", data.student_office_image_alt);
    formData.append(
      "student_certificate_image_alt",
      data.student_certificate_image_alt
    );
    formData.append(
      "student_youtube_image_alt",
      data.student_youtube_image_alt
    );
    formData.append("student_status", data.student_status);

    if (data.student_image instanceof File)
      formData.append("student_image", data.student_image);
    if (data.student_office_image instanceof File)
      formData.append("student_office_image", data.student_office_image);
    if (data.student_certificate_image instanceof File)
      formData.append(
        "student_certificate_image",
        data.student_certificate_image
      );
    if (data.student_youtube_image instanceof File)
      formData.append("student_youtube_image", data.student_youtube_image);

    try {
      const res = await submitStudent({
        url: isEditMode
          ? `${STUDENT_API.byId(id)}?_method=PUT`
          : `${STUDENT_API.list}?_method=POST`,
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
        queryClient.invalidateQueries({ queryKey: ["student-list"] });
        navigate("/student");
      } else {
        toast.error(res?.msg || "Failed to save student");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (fetchError)
    return (
      <ApiErrorPage
        onRetry={() => fetchStudent({ url: STUDENT_API.byId(id) })}
      />
    );

  return (
    <div className="mx-6 space-y-6">
      {fetchLoading && <LoadingBar />}
      <h2 className="text-xl font-semibold">
        {isEditMode ? "Edit Student" : "Create Student"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* UID */}
        <div>
          <label className="text-sm font-medium">UID *</label>
          <Input
            value={data.student_uid}
            onChange={(e) => setData({ ...data, student_uid: e.target.value })}
          />
          {errors.student_uid && (
            <p className="text-xs text-red-500">{errors.student_uid}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Sort Order</label>
          <Input
            value={data.student_sort}
            onChange={(e) => setData({ ...data, student_sort: e.target.value })}
          />
          {errors.student_sort && (
            <p className="text-xs text-red-500">{errors.student_sort}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Name *</label>
          <Input
            value={data.student_name}
            onChange={(e) => setData({ ...data, student_name: e.target.value })}
          />
          {errors.student_name && (
            <p className="text-xs text-red-500">{errors.student_name}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Course *</label>
          <Input
            value={data.student_course}
            onChange={(e) =>
              setData({ ...data, student_course: e.target.value })
            }
          />
          {errors.student_course && (
            <p className="text-xs text-red-500">{errors.student_course}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Designation</label>
          <Input
            value={data.student_designation}
            onChange={(e) =>
              setData({ ...data, student_designation: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Country *</label>
          <Select
            value={data.student_country_id}
            onValueChange={(v) => setData({ ...data, student_country_id: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countriesData?.data?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.country_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.student_country_id && (
            <p className="text-xs text-red-500">{errors.student_country_id}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="text-sm font-medium">Company *</label>
          <Select
            value={data.student_company_id}
            onValueChange={(v) => setData({ ...data, student_company_id: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              {companiesData?.data?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.student_company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.student_company_id && (
            <p className="text-xs text-red-500">{errors.student_company_id}</p>
          )}
        </div>

        {/* Yes / No Selects */}
        <div>
          <label className="text-sm font-medium">Have Testimonial</label>
          <Select
            value={data.student_have_testimonial}
            onValueChange={(v) =>
              setData({ ...data, student_have_testimonial: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Have Certificate</label>
          <Select
            value={data.student_have_certificate}
            onValueChange={(v) =>
              setData({ ...data, student_have_certificate: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Have LinkedIn</label>
          <Select
            value={data.student_have_linkedin}
            onValueChange={(v) =>
              setData({ ...data, student_have_linkedin: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Testimonial</label>

          <Input
            placeholder="Testimonial"
            value={data.student_testimonial}
            onChange={(e) =>
              setData({ ...data, student_testimonial: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">LinkedIn Link</label>

          <Input
            placeholder="LinkedIn Link"
            value={data.student_linkedin_link}
            onChange={(e) =>
              setData({ ...data, student_linkedin_link: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">YouTube Link</label>

          <Input
            placeholder="YouTube Link"
            value={data.student_youtube_link}
            onChange={(e) =>
              setData({ ...data, student_youtube_link: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Student Image</label>

          <Input
            type="file"
            onChange={(e) =>
              setData({ ...data, student_image: e.target.files?.[0] })
            }
          />
          {preview.student_image && (
            <ImageCell src={preview.student_image} alt="Student Image" />
          )}
        </div>
        <div>
          <label className="text-sm font-medium"> Student Image Alt</label>

          <Input
            placeholder="Image Alt"
            value={data.student_image_alt}
            onChange={(e) =>
              setData({ ...data, student_image_alt: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Student Office Image</label>

          <Input
            type="file"
            onChange={(e) =>
              setData({ ...data, student_office_image: e.target.files?.[0] })
            }
          />
          {preview.student_office_image && (
            <ImageCell
              src={preview.student_office_image}
              alt="Student Office Image"
            />
          )}
        </div>
        <div>
          <label className="text-sm font-medium"> Student Office Alt</label>

          <Input
            placeholder="Image Alt"
            value={data.student_office_image_alt}
            onChange={(e) =>
              setData({ ...data, student_office_image_alt: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            Student Certificate Image
          </label>

          <Input
            type="file"
            onChange={(e) =>
              setData({
                ...data,
                student_certificate_image: e.target.files?.[0],
              })
            }
          />
          {preview.student_certificate_image && (
            <ImageCell
              src={preview.student_certificate_image}
              alt="Student Certificate Image"
            />
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {" "}
            Student Certificate Alt
          </label>

          <Input
            placeholder="Image Alt"
            value={data.student_certificate_image_alt}
            onChange={(e) =>
              setData({
                ...data,
                student_certificate_image_alt: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Student Youtube Image</label>

          <Input
            type="file"
            onChange={(e) =>
              setData({
                ...data,
                student_youtube_image: e.target.files?.[0],
              })
            }
          />
          {preview.student_youtube_image && (
            <ImageCell
              src={preview.student_youtube_image}
              alt="Student Youtube Image"
            />
          )}
        </div>
        <div>
          <label className="text-sm font-medium"> Student Youtube Alt</label>

          <Input
            placeholder="Image Alt"
            value={data.student_youtube_image_alt}
            onChange={(e) =>
              setData({
                ...data,
                student_youtube_image_alt: e.target.value,
              })
            }
          />
        </div>
        {isEditMode && (
          <div>
            <label>Status</label>
            <Select
              value={data.student_status}
              onValueChange={(v) => setData({ ...data, student_status: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

export default StudentForm;
