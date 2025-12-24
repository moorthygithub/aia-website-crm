import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, User, ArrowLeft } from 'lucide-react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useGetApiMutation } from '@/hooks/useGetApiMutation';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FAQ_API, PAGE_TWO_API } from '@/constants/apiConstants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const EditFaq = () => {
  const { id } = useParams();
  const { trigger, loading: isSubmitting } = useApiMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    faq_sort: '',
    faq_for: '',
    faq_heading: '',
    faq_que: '',
    faq_ans: '',
    faq_status: 'Active',
  });
  
  const [errors, setErrors] = useState({});
  const [pageTwoOptions, setPageTwoOptions] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const {
    data: faqData,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: FAQ_API.byId(id),
    queryKey: ["faq-edit", id],
  });

  const {
    data: pageData,
    isLoading: isPageLoadingApi,
    isError: isPageError,
    refetch: refetchPage,
  } = useGetApiMutation({
    url: PAGE_TWO_API.dropdown,
    queryKey: ["page-two-drop"],
  });

  useEffect(() => {
    if (pageData?.data) {
      setPageTwoOptions(pageData.data);
      setIsPageLoading(false);
    }
  }, [pageData]);

  useEffect(() => {
    if (faqData?.data) {
      const data = faqData.data;
      setFormData({
        faq_sort: data.faq_sort || '',
        faq_for: data.faq_for || '',
        faq_heading: data.faq_heading || '',
        faq_que: data.faq_que || '',
        faq_ans: data.faq_ans || '',
        faq_status: data.faq_status || 'Active',
      });
    }
  }, [faqData]);

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
      faq_status: checked ? 'Active' : 'Inactive'
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.faq_sort.trim()) {
      newErrors.faq_sort = 'Sort order is required';
      isValid = false;
    } else if (!/^\d+$/.test(formData.faq_sort)) {
      newErrors.faq_sort = 'Sort order must be a number';
      isValid = false;
    }

    if (!formData.faq_for.trim()) {
      newErrors.faq_for = 'Page is required';
      isValid = false;
    }

    if (!formData.faq_heading.trim()) {
      newErrors.faq_heading = 'Heading is required';
      isValid = false;
    } else if (formData.faq_heading.length > 200) {
      newErrors.faq_heading = 'Heading must be less than 200 characters';
      isValid = false;
    }

    if (!formData.faq_que.trim()) {
      newErrors.faq_que = 'Question is required';
      isValid = false;
    } else if (formData.faq_que.length > 500) {
      newErrors.faq_que = 'Question must be less than 500 characters';
      isValid = false;
    }

    if (!formData.faq_ans.trim()) {
      newErrors.faq_ans = 'Answer is required';
      isValid = false;
    } else if (formData.faq_ans.length > 1000) {
      newErrors.faq_ans = 'Answer must be less than 1000 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formDataObj = new FormData();
    
    formDataObj.append('faq_sort', formData.faq_sort);
    formDataObj.append('faq_for', formData.faq_for);
    formDataObj.append('faq_heading', formData.faq_heading);
    formDataObj.append('faq_que', formData.faq_que);
    formDataObj.append('faq_ans', formData.faq_ans);
    formDataObj.append('faq_status', formData.faq_status);

    const loadingToast = toast.loading('Updating FAQ...');
    try {
      const res = await trigger({
        url: FAQ_API.updateById(id),
        method: 'put',
        data: formDataObj,
      });

      if (res?.code === 200) {
        toast.dismiss(loadingToast);
        toast.success(res?.msg || 'FAQ updated successfully');
        
        queryClient.invalidateQueries(["faq-list"]);
        queryClient.invalidateQueries(["faq-edit", id]);
        navigate('/faq-list');
        
      } else {
        toast.dismiss(loadingToast);
        toast.error(res?.msg || 'Failed to update FAQ');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      const errors = error?.response?.data?.msg;
      toast.error(errors || 'Something went wrong');
      
      console.error('FAQ update error:', error);
    }
  };

  const handleReset = () => {
    if (faqData?.data) {
      const data = faqData.data;
      setFormData({
        faq_sort: data.faq_sort || '',
        faq_for: data.faq_for || '',
        faq_heading: data.faq_heading || '',
        faq_que: data.faq_que || '',
        faq_ans: data.faq_ans || '',
        faq_status: data.faq_status || 'Active',
      });
      setErrors({});
    }
  };

  if (isLoading || isPageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError || isPageError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading data</p>
        <Button onClick={() => { refetch(); refetchPage(); }} variant="outline" className="mt-4">
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
                    Edit FAQ - ID: {id}
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Update the details below to edit the FAQ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/faq-list")}
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
              <div className="border rounded-lg px-4 py-1 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="">
                    <Label htmlFor="faq_sort" className="text-sm font-medium">
                      Sort Order *
                    </Label>
                    <Input
                      id="faq_sort"
                      name="faq_sort"
                      type="number"
                      min="1"
                      placeholder="Enter sort order"
                      value={formData.faq_sort}
                      onChange={handleInputChange}
                      className={errors.faq_sort ? 'border-red-500' : ''}
                    />
                    {errors.faq_sort && (
                      <p className="text-sm text-red-500">{errors.faq_sort}</p>
                    )}
                  </div>

                  <div className="">
                    <Label htmlFor="faq_for" className="text-sm font-medium">
                      Page *
                    </Label>
                    <Select
                      value={formData.faq_for}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, faq_for: value }))}
                    >
                      <SelectTrigger className={errors.faq_for ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select page" />
                      </SelectTrigger>
                      <SelectContent>
                        {pageTwoOptions.map((page) => (
                          <SelectItem key={page.page_two_url} value={page.page_two_url}>
                            {page.page_two_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.faq_for && (
                      <p className="text-sm text-red-500">{errors.faq_for}</p>
                    )}
                  </div>

                  <div className="">
                    <Label htmlFor="faq_heading" className="text-sm font-medium">
                      <span>Heading * </span>
                      <span className="text-sm text-gray-500">
                        {formData.faq_heading.length}/200 characters
                      </span>
                    </Label>
                    <Input
                      id="faq_heading"
                      name="faq_heading"
                      placeholder="Enter FAQ heading"
                      value={formData.faq_heading}
                      onChange={handleInputChange}
                      className={errors.faq_heading ? 'border-red-500' : ''}
                    />
                    {errors.faq_heading && (
                      <p className="text-sm text-red-500">{errors.faq_heading}</p>
                    )}
                  </div>

                  <div className="">
                    <Label htmlFor="faq_que" className="text-sm font-medium">
                      <span>Question *</span>
                      <span className="text-sm text-gray-500">
                        {formData.faq_que.length}/500 characters
                      </span>
                    </Label>
                    <textarea
                      id="faq_que"
                      name="faq_que"
                      placeholder="Enter FAQ question"
                      value={formData.faq_que}
                      onChange={handleInputChange}
                      className={`w-full min-h-[100px] p-2 border rounded-md ${errors.faq_que ? 'border-red-500' : 'border-gray-300'}`}
                      rows="3"
                    />
                    {errors.faq_que && (
                      <p className="text-sm text-red-500">{errors.faq_que}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="faq_ans" className="text-sm font-medium">
                      <span>Answer *</span>
                      <span className="text-sm text-gray-500">
                        {formData.faq_ans.length}/1000 characters
                      </span>
                    </Label>
                    <textarea
                      id="faq_ans"
                      name="faq_ans"
                      placeholder="Enter FAQ answer"
                      value={formData.faq_ans}
                      onChange={handleInputChange}
                      className={`w-full min-h-[100px] p-2 border rounded-md ${errors.faq_ans ? 'border-red-500' : 'border-gray-300'}`}
                      rows="3"
                    />
                    {errors.faq_ans && (
                      <p className="text-sm text-red-500">{errors.faq_ans}</p>
                    )}
                  </div>

                  <div className="">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="faq_status" className="text-sm font-medium">
                        Status
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {formData.faq_status === 'Active' ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                          checked={formData.faq_status === 'Active'}
                          onCheckedChange={handleStatusChange}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Toggle to change FAQ status between Active and Inactive
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
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
                    'Update FAQ'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset Changes
                </Button>

               
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditFaq;