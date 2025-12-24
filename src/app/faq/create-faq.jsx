import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, User, ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useGetApiMutation } from '@/hooks/useGetApiMutation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FAQ_API, PAGE_TWO_API } from '@/constants/apiConstants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CreateFaq = () => {
  const { trigger, loading: isSubmitting } = useApiMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [faqItems, setFaqItems] = useState([
    {
      faq_sort: '',
      faq_for: '',
      faq_heading: '',
      faq_que: '',
      faq_ans: '',
    }
  ]);

  const [errors, setErrors] = useState([]);
  const [pageTwoOptions, setPageTwoOptions] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

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
    if (isPageError) {
      setIsPageLoading(false);
    }
  }, [isPageError]);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...faqItems];
    updatedItems[index][field] = value;
    setFaqItems(updatedItems);
    
    // Clear error for this field
    if (errors[index] && errors[index][field]) {
      const updatedErrors = [...errors];
      updatedErrors[index][field] = '';
      setErrors(updatedErrors);
    }
  };

  const addNewFaq = () => {
    setFaqItems([
      ...faqItems,
      {
        faq_sort: '',
        faq_for: '',
        faq_heading: '',
        faq_que: '',
        faq_ans: '',
      }
    ]);
  };

  const removeFaq = (index) => {
    if (faqItems.length === 1) {
      toast.error('At least one FAQ item is required');
      return;
    }
    
    const updatedItems = faqItems.filter((_, i) => i !== index);
    setFaqItems(updatedItems);
    
    // Remove corresponding errors
    const updatedErrors = errors.filter((_, i) => i !== index);
    setErrors(updatedErrors);
  };

  const moveFaqUp = (index) => {
    if (index === 0) return;
    
    const updatedItems = [...faqItems];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[index - 1];
    updatedItems[index - 1] = temp;
    
    // Update sort order
    updatedItems.forEach((item, idx) => {
      item.faq_sort = (idx + 1).toString();
    });
    
    setFaqItems(updatedItems);
  };

  const moveFaqDown = (index) => {
    if (index === faqItems.length - 1) return;
    
    const updatedItems = [...faqItems];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[index + 1];
    updatedItems[index + 1] = temp;
    
    // Update sort order
    updatedItems.forEach((item, idx) => {
      item.faq_sort = (idx + 1).toString();
    });
    
    setFaqItems(updatedItems);
  };

  const validateForm = () => {
    const newErrors = [];
    let isValid = true;

    faqItems.forEach((item, index) => {
      const itemErrors = {};

      if (!item.faq_sort.trim()) {
        itemErrors.faq_sort = 'Sort order is required';
        isValid = false;
      } else if (!/^\d+$/.test(item.faq_sort)) {
        itemErrors.faq_sort = 'Sort order must be a number';
        isValid = false;
      }

      if (!item.faq_for.trim()) {
        itemErrors.faq_for = 'Page is required';
        isValid = false;
      }

      if (!item.faq_heading.trim()) {
        itemErrors.faq_heading = 'Heading is required';
        isValid = false;
      } else if (item.faq_heading.length > 200) {
        itemErrors.faq_heading = 'Heading must be less than 200 characters';
        isValid = false;
      }

      if (!item.faq_que.trim()) {
        itemErrors.faq_que = 'Question is required';
        isValid = false;
      } else if (item.faq_que.length > 500) {
        itemErrors.faq_que = 'Question must be less than 500 characters';
        isValid = false;
      }

      if (!item.faq_ans.trim()) {
        itemErrors.faq_ans = 'Answer is required';
        isValid = false;
      } else if (item.faq_ans.length > 1000) {
        itemErrors.faq_ans = 'Answer must be less than 1000 characters';
        isValid = false;
      }

      newErrors.push(itemErrors);
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = {
      faq: faqItems.map(item => ({
        faq_sort: item.faq_sort,
        faq_for: item.faq_for,
        faq_heading: item.faq_heading,
        faq_que: item.faq_que,
        faq_ans: item.faq_ans,
      }))
    };

    const loadingToast = toast.loading('Creating FAQs...');
    try {
      const res = await trigger({
        url: FAQ_API.create,
        method: 'post',
        data: formData,
      });

      if (res?.code === 201) {
        toast.dismiss(loadingToast);
        toast.success(res?.msg || 'FAQs created successfully');
        
    
        setFaqItems([{
          faq_sort: '',
          faq_for: '',
          faq_heading: '',
          faq_que: '',
          faq_ans: '',
        }]);
        setErrors([]);
        
        queryClient.invalidateQueries(["faq-list"]);
        navigate('/faq-list');
        
      } else {
        toast.dismiss(loadingToast);
        toast.error(res?.msg || 'Failed to create FAQs');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      const errors = error?.response?.data?.msg;
      toast.error(errors || 'Something went wrong');
      
      console.error('FAQ creation error:', error);
    }
  };

  const handleReset = () => {
    setFaqItems([{
      faq_sort: '',
      faq_for: '',
      faq_heading: '',
      faq_que: '',
      faq_ans: '',
    }]);
    setErrors([]);
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isPageError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading page data</p>
        <Button onClick={refetchPage} variant="outline" className="mt-4">
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
                    Add New FAQs
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in the details below to create new FAQs
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
              {faqItems.map((item, index) => (
                <div key={index} className="border rounded-lg px-4 py-1 bg-white">
                  <div className="flex items-center justify-between ">
                    <h3 className="text-sm font-medium">FAQ Item {index + 1}</h3>
                    <div className="flex items-center gap-2">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFaqUp(index)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      )}
                      {index < faqItems.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFaqDown(index)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFaq(index)}
                        disabled={faqItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="">
                      <Label htmlFor={`faq_sort_${index}`} className="text-sm font-medium">
                        Sort Order *
                      </Label>
                      <Input
                        id={`faq_sort_${index}`}
                        type="number"
                        min="1"
                        placeholder="Enter sort order"
                        value={item.faq_sort}
                        onChange={(e) => handleInputChange(index, 'faq_sort', e.target.value)}
                        className={errors[index]?.faq_sort ? 'border-red-500' : ''}
                      />
                      {errors[index]?.faq_sort && (
                        <p className="text-sm text-red-500">{errors[index].faq_sort}</p>
                      )}
                    </div>

                    <div className="">
                      <Label htmlFor={`faq_for_${index}`} className="text-sm font-medium">
                        Page *
                      </Label>
                      <Select
                        value={item.faq_for}
                        onValueChange={(value) => handleInputChange(index, 'faq_for', value)}
                      >
                        <SelectTrigger className={errors[index]?.faq_for ? 'border-red-500' : ''}>
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
                      {errors[index]?.faq_for && (
                        <p className="text-sm text-red-500">{errors[index].faq_for}</p>
                      )}
                    </div>

                    <div className="">
                      <Label htmlFor={`faq_heading_${index}`} className="text-sm font-medium  ">
                       <span> Heading * </span><span className="text-sm text-gray-500">
                            {item.faq_heading.length}/200 characters
                          </span>
                      </Label>
                      <Input
                        id={`faq_heading_${index}`}
                        placeholder="Enter FAQ heading"
                        value={item.faq_heading}
                        onChange={(e) => handleInputChange(index, 'faq_heading', e.target.value)}
                        className={errors[index]?.faq_heading ? 'border-red-500' : ''}
                      />
                      <div className="flex justify-between">
                        {errors[index]?.faq_heading && (
                          <p className="text-sm text-red-500">{errors[index].faq_heading}</p>
                        )}
                      </div>
                    </div>

                   
                    <div className=" ">
                    <Label htmlFor={`faq_que_${index}`} className="text-sm font-medium">
               <span>         Question *</span> <span className="text-sm text-gray-500">
                            {item.faq_que.length}/500 characters
                          </span>
                      </Label>
                      <textarea
               id={`faq_que_${index}`}
               placeholder="Enter FAQ question"
               value={item.faq_que}
               onChange={(e) => handleInputChange(index, 'faq_que', e.target.value)}
                        className={`w-full min-h-[100px] p-2 border rounded-md ${errors[index]?.faq_que ? 'border-red-500' : 'border-gray-300'}`}
                        rows="3"
                      />
                      <div className="flex justify-between">
                      {errors[index]?.faq_que && (
                          <p className="text-sm text-red-500">{errors[index].faq_que}</p>
                        ) }
                      </div>
                    </div>

                    <div className=" md:col-span-2">
                      <Label htmlFor={`faq_ans_${index}`} className="text-sm font-medium">
                    <span>    Answer *</span> <span className="text-sm text-gray-500">
                            {item.faq_ans.length}/1000 characters
                          </span>
                      </Label>
                      <textarea
                        id={`faq_ans_${index}`}
                        placeholder="Enter FAQ answer"
                        value={item.faq_ans}
                        onChange={(e) => handleInputChange(index, 'faq_ans', e.target.value)}
                        className={`w-full min-h-[100px] p-2 border rounded-md ${errors[index]?.faq_ans ? 'border-red-500' : 'border-gray-300'}`}
                        rows="3"
                      />
                      <div className="flex justify-between">
                        {errors[index]?.faq_ans && (
                          <p className="text-sm text-red-500">{errors[index].faq_ans}</p>
                        ) }
                      </div>
                    </div>
                  </div>
                </div>
              ))}

             

              <div className="pt-4 flex gap-3">
     
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewFaq}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another FAQ
                </Button>
           
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
                    'Create FAQs'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset Form
                </Button>

               
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFaq;