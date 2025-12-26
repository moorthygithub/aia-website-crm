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
  COURSE_API,
} from "@/constants/apiConstants";
import ApiErrorPage from "@/components/api-error/api-error";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/image-upload/image-upload";
import { getImageBaseUrl, getNoImageUrl } from "@/utils/imageUtils";
import PageHeader from "@/components/common/page-header";
import { User } from "lucide-react";
import { GroupButton } from "@/components/group-button";
import { Card } from "@/components/ui/card";
import CompanyDialog from "../company/create-company";
import CountryForm from "../country/country-form";

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
  student_have_youtube: "No",
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
  student_status: "Active",
  student_youtube_image_alt: "",
};

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();
  const [openCompany, setCompanyOpen] = useState(false);
  const [openCountry, setCountryOpen] = useState(false);

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState({});

  const {
    trigger: fetchStudent,
    loading: fetchLoading,
    error: fetchError,
  } = useApiMutation();
  const { trigger: submitStudent, loading: submitLoading } = useApiMutation();

  const { data: countriesData } = useGetApiMutation({
    url: COUNTRY_API.dropdown,
    queryKey: ["countries-dropdown"],
  });

  const { data: companiesData } = useGetApiMutation({
    url: COMPANY_API.dropdown,
    queryKey: ["companies-dropdown"],
  });
  const { data: coursesData } = useGetApiMutation({
    url: COURSE_API.courses,
    queryKey: ["courses-dropdown"],
  });

  const fetchData = async () => {
    try {
      const res = await fetchStudent({ url: STUDENT_API.byId(id) });

      const IMAGE_FOR = "Student";
      const baseUrl = getImageBaseUrl(res?.image_url, IMAGE_FOR);
      const noImageUrl = getNoImageUrl(res?.image_url);

      setData({
        ...res.data,
        student_image: null,
        student_office_image: null,
        student_certificate_image: null,
        student_youtube_image: null,
      });

      setPreview({
        student_image: res?.data?.student_image
          ? `${baseUrl}${res.data.student_image}`
          : noImageUrl,

        student_office_image: res?.data?.student_office_image
          ? `${baseUrl}${res.data.student_office_image}`
          : noImageUrl,

        student_certificate_image: res?.data?.student_certificate_image
          ? `${baseUrl}${res.data.student_certificate_image}`
          : noImageUrl,

        student_youtube_image: res?.data?.student_youtube_image
          ? `${baseUrl}${res.data.student_youtube_image}`
          : noImageUrl,
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
    if (!data.student_sort) err.student_sort = "Sort Order is required";
    if (!data.student_course) err.student_course = "Course is required";
    if (!data.student_have_testimonial)
      err.student_have_testimonial = "Testimonial is required";
    if (!data.student_have_certificate)
      err.student_have_certificate = "Certificate is required";
    if (!data.student_have_youtube)
      err.student_have_youtube = "Youtube is required";
    if (!preview.student_image && !data.student_image)
      err.student_image = "Student image is required";
    if (!data.student_image_alt)
      err.student_image_alt = "Image alt is required";

    if (data.student_sort && isNaN(Number(data.student_sort)))
      err.student_sort = "Sort order must be a number";

    if (data.student_have_testimonial === "Yes") {
      if (!data.student_testimonial)
        err.student_testimonial = "Testimonial is required";
    }

    if (data.student_have_certificate === "Yes") {
      if (!data.student_linkedin_link)
        err.student_linkedin_link = "LinkedIn link is required";
      if (!preview.student_certificate_image && !data.student_certificate_image)
        err.student_certificate_image = "Certificate image is required";
      if (!data.student_certificate_image_alt)
        err.student_certificate_image_alt = "Certificate image alt is required";
    }

    if (data.student_have_youtube === "Yes") {
      if (!data.student_youtube_link)
        err.student_youtube_link = "YouTube link is required";
      if (!preview.student_youtube_image && !data.student_youtube_image)
        err.student_youtube_image = "YouTube image is required";
      if (!data.student_youtube_image_alt)
        err.student_youtube_image_alt = "YouTube image alt is required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageChange = (fieldName, file) => {
    if (file) {
      setData({ ...data, [fieldName]: file });
      const url = URL.createObjectURL(file);
      setPreview({ ...preview, [fieldName]: url });
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const handleRemoveImage = (fieldName) => {
    setData({ ...data, [fieldName]: null });
    setPreview({ ...preview, [fieldName]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    formData.append("student_uid", data.student_uid || "");
    formData.append("student_sort", data.student_sort || "");
    formData.append("student_name", data.student_name || "");
    formData.append("student_course", data.student_course || "");
    formData.append("student_designation", data.student_designation || "");
    formData.append("student_country_id", data.student_country_id || "");
    formData.append("student_company_id", data.student_company_id || "");
    formData.append(
      "student_have_testimonial",
      data.student_have_testimonial || ""
    );
    formData.append(
      "student_have_certificate",
      data.student_have_certificate || ""
    );
    formData.append("student_have_youtube", data.student_have_youtube || "");
    formData.append("student_testimonial", data.student_testimonial || "");
    formData.append("student_linkedin_link", data.student_linkedin_link || "");
    formData.append("student_youtube_link", data.student_youtube_link || "");
    formData.append("student_image_alt", data.student_image_alt || "");
    formData.append("student_status", data.student_status || "");
    formData.append(
      "student_office_image_alt",
      data.student_office_image_alt || ""
    );
    formData.append(
      "student_certificate_image_alt",
      data.student_certificate_image_alt
    );
    formData.append(
      "student_youtube_image_alt",
      data.student_youtube_image_alt
    );

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
          ? `${STUDENT_API.updateById(id)}`
          : `${STUDENT_API.list}`,
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
        navigate("/student-list");
      } else {
        toast.error(res?.msg || "Failed to save student");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (fetchError) return <ApiErrorPage onRetry={() => fetchData()} />;

  return (
    <div className="mx-6 space-y-6">
      {fetchLoading && <LoadingBar />}
      <form onSubmit={handleSubmit}>
        <PageHeader
          icon={User}
          title={isEditMode ? "Edit Student" : "Create Student"}
          description="Fill in the student details below to register them"
          rightContent={
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {isEditMode ? "Update Student" : "Create Student"}
              </Button>
            </div>
          }
        />
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4  gap-7">
            <div>
              <label className="text-sm font-medium">UID *</label>
              <Input
                type="number"
                min={0}
                value={data.student_uid}
                onChange={(e) =>
                  setData({ ...data, student_uid: e.target.value })
                }
              />
              {errors.student_uid && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.student_uid}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Sort Order *</label>
              <Input
                type="number"
                min={0}
                value={data.student_sort}
                onChange={(e) =>
                  setData({ ...data, student_sort: e.target.value })
                }
              />
              {errors.student_sort && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.student_sort}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={data.student_name}
                onChange={(e) =>
                  setData({ ...data, student_name: e.target.value })
                }
              />
              {errors.student_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.student_name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Course *</label>

              <Select
                value={data.student_course}
                onValueChange={(v) => setData({ ...data, student_course: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Courses" />
                </SelectTrigger>
                <SelectContent>
                  {coursesData?.data?.map((c, key) => (
                    <SelectItem key={key} value={c.courses_name}>
                      {c.courses_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.student_course && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.student_course}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Country
                </label>

                <button
                  type="button"
                  onClick={() => setCountryOpen(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  + Country
                </button>
              </div>
              <Select
                value={data.student_country_id?.toString() || ""}
                onValueChange={(v) =>
                  setData({ ...data, student_country_id: Number(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countriesData?.data?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.country_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.student_country_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.student_country_id}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Company
                </label>

                <button
                  type="button"
                  onClick={() => setCompanyOpen(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  + Company
                </button>
              </div>

              <Select
                value={data.student_company_id?.toString() || ""}
                onValueChange={(v) =>
                  setData({ ...data, student_company_id: Number(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companiesData?.data?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.student_company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.student_company_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.student_company_id}
                </p>
              )}
            </div>

            {/* Conditional Toggles */}
            <div className="flex items-center h-full ml-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Have Testimonial *
                </label>

                <GroupButton
                  className="w-fit"
                  value={data.student_have_testimonial}
                  onChange={(value) =>
                    setData({ ...data, student_have_testimonial: value })
                  }
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                />
              </div>
            </div>
            <div className="flex items-center h-full ml-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Have Certificate *
                </label>

                <GroupButton
                  className="w-fit"
                  value={data.student_have_certificate}
                  onChange={(value) =>
                    setData({ ...data, student_have_certificate: value })
                  }
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                />
              </div>
            </div>
            <div className="flex items-center h-full ml-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Have Youtube *</label>

                <GroupButton
                  className="w-fit"
                  value={data.student_have_youtube}
                  onChange={(value) =>
                    setData({ ...data, student_have_youtube: value })
                  }
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                />
              </div>
            </div>

            {isEditMode && (
              <div className="flex items-center h-full ml-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Status *</label>

                  <GroupButton
                    className="w-fit"
                    value={data.student_status}
                    onChange={(value) =>
                      setData({ ...data, student_status: value })
                    }
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4   gap-4">
            <div className="col-span-2">
              <ImageUpload
                id="student_image"
                label="Student Image"
                required
                selectedFile={data.student_image}
                previewImage={preview.student_image}
                onFileChange={(e) =>
                  handleImageChange("student_image", e.target.files?.[0])
                }
                onRemove={() => handleRemoveImage("student_image")}
                error={errors.student_image}
                format="WEBP"
                allowedExtensions={["webp"]}
                dimensions="1080x1080"
                maxSize={5}
                requiredDimensions={[1080, 1080]}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Student Image Alt *</label>
              <Textarea
                placeholder="Describe the student image"
                value={data.student_image_alt}
                onChange={(e) =>
                  setData({ ...data, student_image_alt: e.target.value })
                }
                rows={4}
              />
              {errors.student_image_alt && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.student_image_alt}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <ImageUpload
                id="student_office_image"
                label="Office Image"
                selectedFile={data.student_office_image}
                previewImage={preview.student_office_image}
                onFileChange={(e) =>
                  handleImageChange("student_office_image", e.target.files?.[0])
                }
                onRemove={() => handleRemoveImage("student_office_image")}
                error={errors.student_office_image}
                format="WEBP"
                allowedExtensions={["webp"]}
                dimensions="1080x1080"
                maxSize={5}
                requiredDimensions={[1080, 1080]}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Office Image Alt</label>
              <Textarea
                placeholder="Describe the office image"
                value={data.student_office_image_alt}
                onChange={(e) =>
                  setData({ ...data, student_office_image_alt: e.target.value })
                }
                rows={4}
              />
            </div>

            {data?.student_have_testimonial === "Yes" && (
              <div className="col-span-2">
                <div className="py-2">
                  <label className="text-sm font-medium block mb-2">
                    Testimonial *
                  </label>
                  <Textarea
                    placeholder="Enter testimonial"
                    value={data.student_testimonial}
                    onChange={(e) =>
                      setData({ ...data, student_testimonial: e.target.value })
                    }
                    rows={4}
                  />
                  {errors.student_testimonial && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.student_testimonial}
                    </p>
                  )}
                </div>
              </div>
            )}

            {data?.student_have_certificate === "Yes" && (
              <>
                <div className="col-span-2">
                  <label className="text-sm font-medium">LinkedIn Link *</label>
                  <Textarea
                    placeholder="Enter LinkedIn link"
                    value={data.student_linkedin_link}
                    onChange={(e) =>
                      setData({
                        ...data,
                        student_linkedin_link: e.target.value,
                      })
                    }
                    // className="h-16"
                    rows={4}
                  />
                  {errors.student_linkedin_link && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.student_linkedin_link}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <ImageUpload
                    id="student_certificate_image"
                    label="Certificate Image"
                    required
                    selectedFile={data.student_certificate_image}
                    previewImage={preview.student_certificate_image}
                    onFileChange={(e) =>
                      handleImageChange(
                        "student_certificate_image",
                        e.target.files?.[0]
                      )
                    }
                    onRemove={() =>
                      handleRemoveImage("student_certificate_image")
                    }
                    error={errors.student_certificate_image}
                    format="WEBP"
                    allowedExtensions={["webp"]}
                    dimensions="350*220"
                    maxSize={5}
                    requiredDimensions={[350, 220]}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">
                    Certificate Image Alt *
                  </label>
                  <Textarea
                    placeholder="Describe the certificate image"
                    value={data.student_certificate_image_alt}
                    onChange={(e) =>
                      setData({
                        ...data,
                        student_certificate_image_alt: e.target.value,
                      })
                    }
                    rows={4}
                  />
                  {errors.student_certificate_image_alt && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.student_certificate_image_alt}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* YouTube Section */}
            {data?.student_have_youtube === "Yes" && (
              <>
                <div className="col-span-2">
                  <ImageUpload
                    id="student_youtube_image"
                    label="YouTube Image"
                    required
                    selectedFile={data.student_youtube_image}
                    previewImage={preview.student_youtube_image}
                    onFileChange={(e) =>
                      handleImageChange(
                        "student_youtube_image",
                        e.target.files?.[0]
                      )
                    }
                    onRemove={() => handleRemoveImage("student_youtube_image")}
                    error={errors.student_youtube_image}
                    format="WEBP"
                    dimensions="350*220"
                    allowedExtensions={["webp"]}
                    maxSize={5}
                    requiredDimensions={[350, 220]}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">
                    YouTube Image Alt *
                  </label>
                  <Textarea
                    placeholder="Describe the YouTube image"
                    value={data.student_youtube_image_alt}
                    onChange={(e) =>
                      setData({
                        ...data,
                        student_youtube_image_alt: e.target.value,
                      })
                    }
                    rows={4}
                  />
                  {errors.student_youtube_image_alt && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.student_youtube_image_alt}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">YouTube Link *</label>
                  <Textarea
                    placeholder="Enter YouTube link"
                    value={data.student_youtube_link}
                    onChange={(e) =>
                      setData({ ...data, student_youtube_link: e.target.value })
                    }
                    rows={4}
                  />
                  {errors.student_youtube_link && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.student_youtube_link}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      </form>
      <CompanyDialog
        open={openCompany}
        onClose={() => setCompanyOpen(false)}
        companyId={null}
      />
      <CountryForm
        isOpen={openCountry}
        onClose={() => setCountryOpen(false)}
        countryId={null}
      />
    </div>
  );
};

export default StudentForm;
