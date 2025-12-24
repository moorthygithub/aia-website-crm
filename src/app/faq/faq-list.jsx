import React from 'react';
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import ApiErrorPage from "@/components/api-error/api-error";
import { FAQ_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

const FaqList = () => {
  const {
    data: data,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: FAQ_API.list,
    queryKey: ["faq-list"],
  });

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Sort Order",
      accessorKey: "faq_sort",
    },
    {
      header: "Page Name",
      accessorKey: "page_two_name",
    },
    {
      header: "FAQ Heading",
      accessorKey: "faq_heading",
    },
    {
      header: "FAQ Question",
      accessorKey: "faq_que",
    },
    {
      header: "Status",
      accessorKey: "faq_status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.faq_status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {row.original.faq_status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Link title="FAQ edit" to={`/edit-faq/${row.original.id}`} className="cursor-pointer">
            <Edit className="h-4 w-4 hover:text-blue-600" />
          </Link>
        </div>
      ),
    },
  ];
  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;
  return (
    <>
     
      
     
      <DataTable
        data={data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search FAQs..."
        addButton={{
          to: '/add-faq', 
          label: 'Add FAQ' 
        }}
      />
     
    </>
  );
};

export default FaqList;