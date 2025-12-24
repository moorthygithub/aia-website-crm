

import DataTable from "@/components/common/data-table";
import ImageCell from "@/components/common/ImageCell";
import LoadingBar from "@/components/loader/loading-bar";
import ApiErrorPage from "@/components/api-error/api-error";
import { BLOG_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { getImageBaseUrl, getNoImageUrl } from "@/utils/imageUtils";
import { Edit } from "lucide-react";

import { Link } from "react-router-dom";

const BlogList = () => {
  const {
    data: data,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: BLOG_API.list,
    queryKey: ["blog-list"],
  });

  const IMAGE_FOR = "Student Company";
  const companyBaseUrl = getImageBaseUrl(data?.image_url, IMAGE_FOR);
  const noImageUrl = getNoImageUrl(data?.image_url);

  const columns = [
    {
      header: "Image",
      accessorKey: "student_company_image",
      cell: ({ row }) => {
        const fileName = row.original.student_company_image;
        const src = fileName ? `${companyBaseUrl}${fileName}` : noImageUrl;

        return (
          <ImageCell
            src={src}
            fallback={noImageUrl}
            alt={`${IMAGE_FOR} Image`}
          />
        );
      },
    },
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Company Name",
      accessorKey: "student_company_name",
    },
    {
      header: "Alt Text",
      accessorKey: "student_company_image_alt",
    },
    {
      header: "Status",
      accessorKey: "student_company_status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.student_company_status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {row.original.student_company_status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div >
           <Link title="company edit" to={`/edit-company/${row.original.id}`} className="cursor-pointer">
                <Edit className=" h-4 w-4 hover:text-blue-600" />
           
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
        searchPlaceholder="Search blogs..."
        addButton={{
          to: '/add-blog', 
          label: 'Add Blog' 
        }}
      />
  
    </>
  );
};

export default BlogList;