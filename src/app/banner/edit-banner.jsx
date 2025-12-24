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
import { BANNER_API } from '@/constants/apiConstants';
import { Switch } from '@/components/ui/switch';

const EditBanner = () => {
  const { id } = useParams();
  const { trigger, loading: isSubmitting } = useApiMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    banner_sort: '',
    banner_text: '',
    banner_link: '',
    banner_image_alt: '',
    banner_status: 'Active',
  });
  
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const {
    data: bannerData,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: BANNER_API.byId(id),
    queryKey: ["banner-edit", id],
  });

  useEffect(() => {
    if (bannerData?.data) {
      const data = bannerData.data;
      setFormData({
        banner_sort: data.banner_sort || '',
        banner_text: data.banner_text || '',
        banner_link: data.banner_link || '',
        banner_image_alt: data.banner_image_alt || '',
        banner_status: data.banner_status || 'Active',
      });
      
      if (data.banner_image) {
        const IMAGE_FOR = "Banner";
        const bannerBaseUrl = getImageBaseUrl(bannerData?.image_url, IMAGE_FOR);
        const imageUrl = `${bannerBaseUrl}${data.banner_image}`;
        setExistingImage(imageUrl);
        setPreviewImage(imageUrl);
      }
    }
  }, [bannerData]);

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
      banner_status: checked ? 'Active' : 'Inactive'
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.banner_sort.trim()) {
      newErrors.banner_sort = 'Sort order is required';
      isValid = false;
    } else if (!/^\d+$/.test(formData.banner_sort)) {
      newErrors.banner_sort = 'Sort order must be a number';
      isValid = false;
    }

    if (!formData.banner_text.trim()) {
      newErrors.banner_text = 'Banner text is required';
      isValid = false;
    } else if (formData.banner_text.length > 200) {
      newErrors.banner_text = 'Banner text must be less than 200 characters';
      isValid = false;
    }

    if (formData.banner_link.trim() && !isValidUrl(formData.banner_link)) {
      newErrors.banner_link = 'Please enter a valid URL';
      isValid = false;
    }

    if (!formData.banner_image_alt.trim()) {
      newErrors.banner_image_alt = 'Alt text is required';
      isValid = false;
    } else if (formData.banner_image_alt.length > 100) {
      newErrors.banner_image_alt = 'Alt text must be less than 100 characters';
      isValid = false;
    }

    if (!previewImage && !selectedFile) {
      newErrors.banner_image = 'Banner image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
        if (img.width !== 1920 || img.height !== 858) {
          newErrors.push('The image size must be exactly 1920x858 pixels.');
        }
  
        if (newErrors.length > 0) {
          setErrors(prev => ({
            ...prev,
            banner_image: newErrors.join(' \n ')
          }));
          setSelectedFile(null);
          setPreviewImage(null);
        } else {
          setSelectedFile(file);
          setPreviewImage(reader.result);
          setExistingImage(null);
          setErrors(prev => ({ ...prev, banner_image: '' }));
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
    
    formDataObj.append('banner_sort', formData.banner_sort);
    formDataObj.append('banner_text', formData.banner_text);
    formDataObj.append('banner_link', formData.banner_link || '');
    formDataObj.append('banner_image_alt', formData.banner_image_alt);
    formDataObj.append('banner_status', formData.banner_status);
    
    if (selectedFile) {
      formDataObj.append('banner_image', selectedFile);
    }

    const loadingToast = toast.loading('Updating banner...');
    try {
      const res = await trigger({
        url: BANNER_API.updateById(id),
        method: 'post',
        data: formDataObj,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.code === 200 ) {
        toast.dismiss(loadingToast);
        toast.success(res?.msg || 'Banner updated successfully');
        
        queryClient.invalidateQueries(["banner-list"]);
        queryClient.invalidateQueries(["banner-edit", id]);
        navigate('/banner-list');
        
      } else {
        toast.dismiss(loadingToast);
        toast.error(res?.msg || 'Failed to update banner');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      const errors = error?.response?.data?.msg;
      toast.error(errors || 'Something went wrong');
      
      console.error('Banner update error:', error);
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
        <p className="text-red-500">Error loading banner data</p>
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
                    Edit Banner - ID: {id}
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Update the details below to edit the banner
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/banner-list")}
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
              <Label htmlFor="banner_sort" className="text-sm font-medium">
                Sort Order *
              </Label>
              <Input
                id="banner_sort"
                name="banner_sort"
                type="number"
                min="1"
                placeholder="Enter sort order (e.g., 1, 2, 3)"
                value={formData.banner_sort}
                onChange={handleInputChange}
                className={errors.banner_sort ? 'border-red-500' : ''}
              />
              {errors.banner_sort && (
                <p className="text-sm text-red-500">{errors.banner_sort}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_text" className="text-sm font-medium">
                Banner Text *
              </Label>
              <Input
                id="banner_text"
                name="banner_text"
                placeholder="Enter banner text"
                value={formData.banner_text}
                onChange={handleInputChange}
                className={errors.banner_text ? 'border-red-500' : ''}
              />
              <div className="flex justify-between">
                {errors.banner_text ? (
                  <p className="text-sm text-red-500">{errors.banner_text}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.banner_text.length}/200 characters
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_link" className="text-sm font-medium">
                Banner Link
              </Label>
              <Input
                id="banner_link"
                name="banner_link"
                type="url"
                placeholder="https://example.com"
                value={formData.banner_link}
                onChange={handleInputChange}
                className={errors.banner_link ? 'border-red-500' : ''}
              />
              {errors.banner_link && (
                <p className="text-sm text-red-500">{errors.banner_link}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_image_alt" className="text-sm font-medium">
                Image Alt Text *
              </Label>
              <Input
                id="banner_image_alt"
                name="banner_image_alt"
                placeholder="Describe the image for accessibility"
                value={formData.banner_image_alt}
                onChange={handleInputChange}
                className={errors.banner_image_alt ? 'border-red-500' : ''}
              />
              <div className="flex justify-between">
                {errors.banner_image_alt ? (
                  <p className="text-sm text-red-500">{errors.banner_image_alt}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.banner_image_alt.length}/100 characters
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="banner_status" className="text-sm font-medium">
                  Status
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formData.banner_status === 'Active' ? 'Active' : 'Inactive'}
                  </span>
                  <Switch
                    checked={formData.banner_status === 'Active'}
                    onCheckedChange={handleStatusChange}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Toggle to change banner status between Active and Inactive
              </p>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="banner_image" className="text-sm font-medium">
                Banner Image *
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
                    id="banner_image"
                    name="banner_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="banner_image" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {existingImage ? 'Click to change banner image' : 'Click to upload banner image'}
                        </p>
                        <p className="text-xs text-gray-500">
                          WEBP format only, must be 1920x858 pixels, up to 5MB
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              )}
              
              {errors.banner_image && (
                <p className="text-sm text-red-500 whitespace-pre-line">{errors.banner_image}</p>
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
                  'Update Banner'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const data = bannerData?.data;
                  setFormData({
                    banner_sort: data?.banner_sort || '',
                    banner_text: data?.banner_text || '',
                    banner_link: data?.banner_link || '',
                    banner_image_alt: data?.banner_image_alt || '',
                    banner_status: data?.banner_status || 'Active',
                  });
                  setSelectedFile(null);
                  setPreviewImage(existingImage);
                  setErrors({});
                  const fileInput = document.getElementById('banner_image');
                  if (fileInput) fileInput.value = '';
                }}
              >
                Reset Changes
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/banner-list')}
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

export default EditBanner;