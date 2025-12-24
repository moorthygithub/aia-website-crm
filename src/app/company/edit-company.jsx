import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, X, User, ArrowLeft } from 'lucide-react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useGetApiMutation } from '@/hooks/useGetApiMutation';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { COMPANY_API } from '@/constants/apiConstants';
import { Switch } from '@/components/ui/switch';

const EditCompany = () => {
  const { id } = useParams();
  const { trigger, loading: isSubmitting } = useApiMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    student_company_name: '',
    student_company_image_alt: '',
    student_company_status: 'Active',
  });
  
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const {
    data: companyData,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: COMPANY_API.byId(id),
    queryKey: ["company-edit", id],
  });

  useEffect(() => {
    if (companyData?.data) {
      const data = companyData.data;
      setFormData({
        student_company_name: data.student_company_name || '',
        student_company_image_alt: data.student_company_image_alt || '',
        student_company_status: data.student_company_status || 'Active',
      });
      
      if (data.student_company_image) {
        const IMAGE_FOR = "Student Company";
        const companyBaseUrl = getImageBaseUrl(companyData?.image_url, IMAGE_FOR);
        const imageUrl = `${companyBaseUrl}${data.student_company_image}`;
        setExistingImage(imageUrl);
        setPreviewImage(imageUrl);
      }
    }
  }, [companyData]);

  const getImageBaseUrl = (imageUrlArray, imageFor) => {
    const imageObj = imageUrlArray?.find(img => img.image_for === imageFor);
    return imageObj?.image_url || '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStatusChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      student_company_status: checked ? 'Active' : 'Inactive'
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.student_company_name.trim()) {
      newErrors.student_company_name = 'Company name is required';
      isValid = false;
    } else if (formData.student_company_name.length > 100) {
      newErrors.student_company_name = 'Company name must be less than 100 characters';
      isValid = false;
    }

    if (!formData.student_company_image_alt.trim()) {
      newErrors.student_company_image_alt = 'Image alt text is required';
      isValid = false;
    } else if (formData.student_company_image_alt.length > 100) {
      newErrors.student_company_image_alt = 'Alt text must be less than 100 characters';
      isValid = false;
    }

    if (!previewImage && !selectedFile) {
      newErrors.student_company_image = 'Company image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const newErrors = [];

    if (file.type !== 'image/webp') {
      newErrors.push('The image must be in WEBP format only.');
    }

    if (file.size > 5 * 1024 * 1024) {
      newErrors.push('Image must be less than 5MB.');
    }
  
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== 150 || img.height !== 150) {
          newErrors.push('The image size must be exactly 150x150 pixels.');
        }
  
        if (newErrors.length > 0) {
          setErrors(prev => ({
            ...prev,
            student_company_image: newErrors.join(' \n ')
          }));
          setSelectedFile(null);
          setPreviewImage(null);
        } else {
          setSelectedFile(file);
          setPreviewImage(reader.result);
          setExistingImage(null);
          setErrors(prev => ({ ...prev, student_company_image: '' }));
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formDataObj = new FormData();
    
    formDataObj.append('student_company_name', formData.student_company_name);
    formDataObj.append('student_company_image_alt', formData.student_company_image_alt);
    formDataObj.append('student_company_status', formData.student_company_status);
    
    if (selectedFile) {
      formDataObj.append('student_company_image', selectedFile);
    }

    const loadingToast = toast.loading('Updating company...');
    try {
      const res = await trigger({
        url: COMPANY_API.updateById(id),
        method: 'post',
        data: formDataObj,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.code === 200) {
        toast.dismiss(loadingToast);
        toast.success(res?.msg || 'Company updated successfully');
        
        queryClient.invalidateQueries(["company-list"]);
        queryClient.invalidateQueries(["company-edit", id]);
        navigate('/company-list');
        
      } else {
        toast.dismiss(loadingToast);
        toast.error(res?.msg || 'Failed to update company');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      const errors = error?.response?.data?.msg;
      toast.error(errors || 'Something went wrong');
      
      console.error('Company update error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading company data</p>
        <Button onClick={refetch} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <User className="text-muted-foreground w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-md font-semibold text-gray-900">
                    Edit Company - ID: {id}
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Update the details below to edit the company
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/company-list")}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 flex-shrink-0 mt-2 sm:mt-0"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </Button>
        </div>
      </Card>
      
      <Card className="mt-2">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="student_company_name" className="text-sm font-medium">
                Company Name *
              </Label>
              <Input
                id="student_company_name"
                name="student_company_name"
                placeholder="Enter company name"
                value={formData.student_company_name}
                onChange={handleInputChange}
                className={errors.student_company_name ? 'border-red-500' : ''}
              />
              <div className="flex justify-between">
                {errors.student_company_name ? (
                  <p className="text-sm text-red-500">{errors.student_company_name}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.student_company_name.length}/100 characters
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_company_image_alt" className="text-sm font-medium">
                Image Alt Text *
              </Label>
              <Input
                id="student_company_image_alt"
                name="student_company_image_alt"
                placeholder="Describe the company image for accessibility"
                value={formData.student_company_image_alt}
                onChange={handleInputChange}
                className={errors.student_company_image_alt ? 'border-red-500' : ''}
              />
              <div className="flex justify-between">
                {errors.student_company_image_alt ? (
                  <p className="text-sm text-red-500">{errors.student_company_image_alt}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.student_company_image_alt.length}/100 characters
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="student_company_status" className="text-sm font-medium">
                  Status
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formData.student_company_status === 'Active' ? 'Active' : 'Inactive'}
                  </span>
                  <Switch
                    checked={formData.student_company_status === 'Active'}
                    onCheckedChange={handleStatusChange}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Toggle to change company status between Active and Inactive
              </p>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="student_company_image" className="text-sm font-medium">
                Company Image *
                <span className="text-xs text-gray-500 ml-2">
                  {existingImage && !selectedFile ? '(Current image will be kept)' : ''}
                </span>
              </Label>
              
              {previewImage ? (
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-xs">
                          {selectedFile ? selectedFile.name : 'Current Image'}
                        </p>
                        {selectedFile && (
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                        {existingImage && !selectedFile && (
                          <p className="text-xs text-blue-500">
                            Click upload to change this image
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Input
                    id="student_company_image"
                    name="student_company_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="student_company_image" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {existingImage ? 'Click to change company image' : 'Click to upload company image'}
                        </p>
                        <p className="text-xs text-gray-500">
                          WEBP format only, must be 150x150 pixels, up to 5MB
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              )}
              
              {errors.student_company_image && (
                <p className="text-sm text-red-500 whitespace-pre-line">{errors.student_company_image}</p>
              )}
            </div>

            <div className="pt-4 flex gap-3 col-span-2">
              <Button
                type="submit"
                className="px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Company'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const data = companyData?.data;
                  setFormData({
                    student_company_name: data?.student_company_name || '',
                    student_company_image_alt: data?.student_company_image_alt || '',
                    student_company_status: data?.student_company_status || 'Active',
                  });
                  setSelectedFile(null);
                  setPreviewImage(existingImage);
                  setErrors({});
                  const fileInput = document.getElementById('student_company_image');
                  if (fileInput) fileInput.value = '';
                }}
              >
                Reset Changes
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/company-list')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCompany;