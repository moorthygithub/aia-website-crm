import { useNavigate } from "react-router-dom";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import ApiErrorPage from "@/components/api-error/api-error";
import ImageCell from "@/components/common/ImageCell";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { STUDENT_API } from "@/constants/apiConstants";
import { getImageBaseUrl, getNoImageUrl } from "@/utils/imageUtils";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentList = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: STUDENT_API.list,
    queryKey: ["student-list"],
  });

  const IMAGE_FOR = "Student";
  const studentBaseUrl = getImageBaseUrl(data?.image_url, IMAGE_FOR);
  const noImageUrl = getNoImageUrl(data?.image_url);

  const columns = [
    {
      header: "Student Image",
      accessorKey: "student_image",
      cell: ({ row }) => {
        const fileName = row.original.student_image;
        if (!fileName) return "-";

        return (
          <ImageCell
            src={`${studentBaseUrl}${fileName}`}
            fallback={noImageUrl}
            alt="Student Image"
          />
        );
      },
    },
    {
      header: "Certificate Image",
      accessorKey: "student_certificate_image",
      cell: ({ row }) => {
        const fileName = row.original.student_certificate_image;
        if (!fileName) return "-";

        return (
          <ImageCell
            src={`${studentBaseUrl}${fileName}`}
            fallback={noImageUrl}
            alt="Certificate Image"
          />
        );
      },
    },
    {
      header: "YouTube Image",
      accessorKey: "student_youtube_image",
      cell: ({ row }) => {
        const fileName = row.original.student_youtube_image;
        if (!fileName) return "-";

        return (
          <ImageCell
            src={`${studentBaseUrl}${fileName}`}
            fallback={noImageUrl}
            alt="YouTube Image"
          />
        );
      },
    },
    { header: "UID", accessorKey: "student_uid" },
    { header: "Sort", accessorKey: "student_sort" },
    { header: "Name", accessorKey: "student_name" },
    { header: "Course", accessorKey: "student_course" },
    { header: "Designation", accessorKey: "student_designation" },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="outline"
          onClick={() => navigate(`/student/${row.original.id}/edit`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pageSize={10}
      searchPlaceholder="Search student..."
      addButton={{
        to: "/student/create",
        label: "Add Student",
      }}
    />
  );
};

export default StudentList;
