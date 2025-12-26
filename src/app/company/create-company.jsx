import PageHeader from "@/components/common/page-header";
import ImageUpload from "@/components/image-upload/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateCompany = () => {
  const { trigger, loading: isSubmitting } = useApiMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    student_company_name: "",
    student_company_image_alt: "",
    student_company_image: null,
  });

  const [errors, setErrors] = useState({});

  const [preview, setPreview] = useState({
    student_company_image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleImageChange = (fieldName, file) => {
    if (file) {
      setFormData({ ...formData, [fieldName]: file });
      const url = URL.createObjectURL(file);
      setPreview({ ...preview, [fieldName]: url });
      setErrors({ ...errors, [fieldName]: "" });
    }
  };
  const handleRemoveImage = (fieldName) => {
    setFormData({ ...formData, [fieldName]: null });
    setPreview({ ...preview, [fieldName]: "" });
  };
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.student_company_name.trim()) {
      newErrors.student_company_name = "Company name is required";
      isValid = false;
    }

    if (!formData.student_company_image_alt.trim()) {
      newErrors.student_company_image_alt = "Image alt text is required";
      isValid = false;
    }

    if (!preview.student_company_image && !formData.student_company_image) {
      newErrors.student_company_image = "Company image is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formDataObj = new FormData();

    formDataObj.append("student_company_name", formData.student_company_name);
    formDataObj.append(
      "student_company_image_alt",
      formData.student_company_image_alt
    );
    if (formData.student_company_image instanceof File) {
      formDataObj.append(
        "student_company_image",
        formData.student_company_image
      );
    }
    try {
      const res = await trigger({
        url: COMPANY_API.create,
        method: "post",
        data: formDataObj,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.code === 201) {
        toast.success(res?.msg || "Company created successfully");
        setFormData({
          student_company_name: "",
          student_company_image_alt: "",
        });
        setErrors({});
        const fileInput = document.getElementById("student_company_image");
        if (fileInput) fileInput.value = "";
        queryClient.invalidateQueries(["company-list"]);
        navigate("/company-list");
      } else {
        toast.error(res?.msg || "Failed to create company");
      }
    } catch (error) {
      const errors = error?.response?.data?.msg;
      toast.error(errors);
    }
  };

  return (
    <div className="max-w-full mx-auto">
      <PageHeader
        icon={Building2}
        title="Add New Company"
        description="Fill in the details below to create a new company"
        rightContent={
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Button
              type="submit"
              form="create-company-form"
              className="px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Company"
              )}
            </Button>
          </div>
        }
      />
      <Card className="mt-2">
        <CardContent className="p-4">
          <form
            onSubmit={handleSubmit}
            id="create-company-form"
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <div className="space-y-2">
              <Label
                htmlFor="student_company_name"
                className="text-sm font-medium"
              >
                Company Name *
              </Label>
              <Input
                id="student_company_name"
                name="student_company_name"
                placeholder="Enter company name"
                value={formData.student_company_name}
                onChange={handleInputChange}
                className={errors.student_company_name ? "border-red-500" : ""}
              />
              <div className="flex justify-between">
                {errors.student_company_name && (
                  <p className="text-sm text-red-500">
                    {errors.student_company_name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="student_company_image_alt"
                className="text-sm font-medium"
              >
                Image Alt Text *
              </Label>
              <Textarea
                id="student_company_image_alt"
                name="student_company_image_alt"
                placeholder="Describe the company image for accessibility"
                value={formData.student_company_image_alt}
                onChange={handleInputChange}
                className={
                  errors.student_company_image_alt ? "border-red-500" : ""
                }
              />
              <div className="flex justify-between">
                {errors.student_company_image_alt && (
                  <p className="text-sm text-red-500">
                    {errors.student_company_image_alt}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <ImageUpload
                id="student_company_image"
                label="Company Image"
                required
                selectedFile={formData.student_company_image}
                previewImage={preview.student_company_image}
                onFileChange={(e) =>
                  handleImageChange(
                    "student_company_image",
                    e.target.files?.[0]
                  )
                }
                onRemove={() => handleRemoveImage("student_company_image")}
                error={errors.student_company_image}
                format="WEBP"
                allowedExtensions={["webp"]}
                dimensions="150x150"
                maxSize={5}
                requiredDimensions={[150, 150]}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCompany;
