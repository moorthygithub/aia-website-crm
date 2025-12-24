import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, User, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useGetApiMutation } from '@/hooks/useGetApiMutation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { BLOG_API } from '@/constants/apiConstants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CreateBlog = () => {
  const { trigger, loading: isSubmitting } = useApiMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    blog_heading: '',
    blog_short_description: '',
    blog_course: '',
    blog_created: '',
    blog_images_alt: '',
  });
  
  const [blogSubs, setBlogSubs] = useState([
    {
      blog_sub_heading: '',
      blog_sub_description: '',
    }
  ]);
  
  const [errors, setErrors] = useState({});
  const [subErrors, setSubErrors] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from heading
    if (name === 'blog_heading') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, blog_slug: slug }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubInputChange = (index, field, value) => {
    const updatedSubs = [...blogSubs];
    updatedSubs[index][field] = value;
    setBlogSubs(updatedSubs);
    
    if (subErrors[index] && subErrors[index][field]) {
      const updatedErrors = [...subErrors];
      updatedErrors[index][field] = '';
      setSubErrors(updatedErrors);
    }
  };

  const addNewSub = () => {
    setBlogSubs([
      ...blogSubs,
      {
        blog_sub_heading: '',
        blog_sub_description: '',
      }
    ]);
    setSubErrors([...subErrors, {}]);
  };

  const removeSub = (index) => {
    if (blogSubs.length === 1) {
      toast.error('At least one sub-section is required');
      return;
    }
    
    const updatedSubs = blogSubs.filter((_, i) => i !== index);
    setBlogSubs(updatedSubs);
    
    const updatedErrors = subErrors.filter((_, i) => i !== index);
    setSubErrors(updatedErrors);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const newErrors = [];
  
    if (!file.type.startsWith('image/')) {
      newErrors.push('The file must be an image.');
    }
  
    if (file.size > 5 * 1024 * 1024) {
      newErrors.push('Image must be less than 5MB.');
    }
  
    if (newErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        blog_images: newErrors.join(' \n ')
      }));
      setSelectedFile(null);
      setPreviewImage(null);
    } else {
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, blog_images: '' }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate main form fields
    if (!formData.blog_heading.trim()) {
      newErrors.blog_heading = 'Blog heading is required';
      isValid = false;
    } else if (formData.blog_heading.length > 200) {
      newErrors.blog_heading = 'Heading must be less than 200 characters';
      isValid = false;
    }

    if (!formData.blog_short_description.trim()) {
      newErrors.blog_short_description = 'Short description is required';
      isValid = false;
    } else if (formData.blog_short_description.length > 500) {
      newErrors.blog_short_description = 'Short description must be less than 500 characters';
      isValid = false;
    }

    if (!formData.blog_course.trim()) {
      newErrors.blog_course = 'Course is required';
      isValid = false;
    }

    if (!formData.blog_created.trim()) {
      newErrors.blog_created = 'Blog date is required';
      isValid = false;
    }

    if (!formData.blog_images_alt.trim()) {
      newErrors.blog_images_alt = 'Image alt text is required';
      isValid = false;
    } else if (formData.blog_images_alt.length > 200) {
      newErrors.blog_images_alt = 'Alt text must be less than 200 characters';
      isValid = false;
    }

    if (!selectedFile) {
      newErrors.blog_images = 'Blog image is required';
      isValid = false;
    }

    // Validate sub-sections
    const newSubErrors = [];
    blogSubs.forEach((sub, index) => {
      const subError = {};
      
      if (!sub.blog_sub_heading.trim()) {
        subError.blog_sub_heading = 'Sub-heading is required';
        isValid = false;
      } else if (sub.blog_sub_heading.length > 200) {
        subError.blog_sub_heading = 'Sub-heading must be less than 200 characters';
        isValid = false;
      }

      if (!sub.blog_sub_description.trim()) {
        subError.blog_sub_description = 'Sub-description is required';
        isValid = false;
      } else if (sub.blog_sub_description.length > 2000) {
        subError.blog_sub_description = 'Sub-description must be less than 2000 characters';
        isValid = false;
      }

      newSubErrors.push(subError);
    });

    setErrors(newErrors);
    setSubErrors(newSubErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formDataObj = new FormData();
    
    // Append main form data
    formDataObj.append('blog_slug', formData.blog_slug || '');
    formDataObj.append('blog_heading', formData.blog_heading);
    formDataObj.append('blog_short_description', formData.blog_short_description);
    formDataObj.append('blog_course', formData.blog_course);
    formDataObj.append('blog_created', formData.blog_created);
    formDataObj.append('blog_images_alt', formData.blog_images_alt);
    formDataObj.append('blog_images', selectedFile);
    
    // Append sub-sections
    blogSubs.forEach((sub, index) => {
      formDataObj.append(`sub[${index}][blog_sub_heading]`, sub.blog_sub_heading);
      formDataObj.append(`sub[${index}][blog_sub_description]`, sub.blog_sub_description);
    });

    const loadingToast = toast.loading('Creating blog...');
    try {
      const res = await trigger({
        url: BLOG_API.create,
        method: 'post',
        data: formDataObj,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.code === 201) {
        toast.dismiss(loadingToast);
        toast.success(res?.msg || 'Blog created successfully');
        
        // Reset form
        setFormData({
          blog_heading: '',
          blog_short_description: '',
          blog_course: '',
          blog_created: '',
          blog_images_alt: '',
          blog_slug: '',
        });
        setBlogSubs([{
          blog_sub_heading: '',
          blog_sub_description: '',
        }]);
        setSelectedFile(null);
        setPreviewImage(null);
        setErrors({});
        setSubErrors([]);
        
        const fileInput = document.getElementById('blog_images');
        if (fileInput) fileInput.value = '';
        queryClient.invalidateQueries(["blog-list"]);
        navigate('/blog-list');
        
      } else {
        toast.dismiss(loadingToast);
        toast.error(res?.msg || 'Failed to create blog');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      const errors = error?.response?.data?.msg;
      toast.error(errors || 'Something went wrong');
      
      console.error('Blog creation error:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      blog_heading: '',
      blog_short_description: '',
      blog_course: '',
      blog_created: '',
      blog_images_alt: '',
      blog_slug: '',
    });
    setBlogSubs([{
      blog_sub_heading: '',
      blog_sub_description: '',
    }]);
    setSelectedFile(null);
    setPreviewImage(null);
    setErrors({});
    setSubErrors([]);
    const fileInput = document.getElementById('blog_images');
    if (fileInput) fileInput.value = '';
  };

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
                    Add New Blog
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in the details below to create a new blog
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/blog-list")}
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
        <CardContent className="p-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              {/* Main Blog Section */}
              <div className="border rounded-lg px-4 py-1 bg-white">
                <h3 className="text-sm font-medium mb-2">Blog Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="">
                    <Label htmlFor="blog_heading" className="text-sm font-medium">
                      <span>Blog Heading *</span>
                      <span className="text-sm text-gray-500">
                        {formData.blog_heading.length}/200 characters
                      </span>
                    </Label>
                    <Input
                      id="blog_heading"
                      name="blog_heading"
                      placeholder="Enter blog heading"
                      value={formData.blog_heading}
                      onChange={handleInputChange}
                      className={errors.blog_heading ? 'border-red-500' : ''}
                    />
                    {errors.blog_heading && (
                      <p className="text-sm text-red-500">{errors.blog_heading}</p>
                    )}
                    {formData.blog_slug && (
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-generated slug: <span className="font-medium">{formData.blog_slug}</span>
                      </p>
                    )}
                  </div>

                  <div className="">
                    <Label htmlFor="blog_short_description" className="text-sm font-medium">
                      <span>Short Description *</span>
                      <span className="text-sm text-gray-500">
                        {formData.blog_short_description.length}/500 characters
                      </span>
                    </Label>
                    <textarea
                      id="blog_short_description"
                      name="blog_short_description"
                      placeholder="Enter short description"
                      value={formData.blog_short_description}
                      onChange={handleInputChange}
                      className={`w-full min-h-[80px] p-2 border rounded-md ${errors.blog_short_description ? 'border-red-500' : 'border-gray-300'}`}
                      rows="3"
                    />
                    {errors.blog_short_description && (
                      <p className="text-sm text-red-500">{errors.blog_short_description}</p>
                    )}
                  </div>

                  <div className="">
                    <Label htmlFor="blog_course" className="text-sm font-medium">
                      Course *
                    </Label>
                    <Input
                      id="blog_course"
                      name="blog_course"
                      placeholder="Enter course name"
                      value={formData.blog_course}
                      onChange={handleInputChange}
                      className={errors.blog_course ? 'border-red-500' : ''}
                    />
                    {errors.blog_course && (
                      <p className="text-sm text-red-500">{errors.blog_course}</p>
                    )}
                  </div>

                  <div className="">
                    <Label htmlFor="blog_created" className="text-sm font-medium">
                      Blog Date *
                    </Label>
                    <Input
                      id="blog_created"
                      name="blog_created"
                      type="date"
                      value={formData.blog_created}
                      onChange={handleInputChange}
                      className={errors.blog_created ? 'border-red-500' : ''}
                    />
                    {errors.blog_created && (
                      <p className="text-sm text-red-500">{errors.blog_created}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="blog_images_alt" className="text-sm font-medium">
                      <span>Image Alt Text *</span>
                      <span className="text-sm text-gray-500">
                        {formData.blog_images_alt.length}/200 characters
                      </span>
                    </Label>
                    <Input
                      id="blog_images_alt"
                      name="blog_images_alt"
                      placeholder="Describe the blog image for accessibility"
                      value={formData.blog_images_alt}
                      onChange={handleInputChange}
                      className={errors.blog_images_alt ? 'border-red-500' : ''}
                    />
                    {errors.blog_images_alt && (
                      <p className="text-sm text-red-500">{errors.blog_images_alt}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="blog_images" className="text-sm font-medium">
                      Blog Image *
                    </Label>
                    
                    {selectedFile ? (
                      <div className="border-2 border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                              {previewImage && (
                                <img 
                                  src={previewImage} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs">
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
                            onClick={handleRemoveImage}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Input
                          id="blog_images"
                          name="blog_images"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Label htmlFor="blog_images" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <Plus className="h-8 w-8 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">
                                Click to upload blog image
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    )}
                    
                    {errors.blog_images && (
                      <p className="text-sm text-red-500 whitespace-pre-line">{errors.blog_images}</p>
                    )}
                  </div>
                </div>
              </div>

        
              {/* Submit Buttons */}
              <div className="pt-4 flex gap-3">
                <Button
                  type="submit"
                  className="px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Blog'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset Form
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/blog-list')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBlog;