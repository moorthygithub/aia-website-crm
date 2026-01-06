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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";

const StudentList = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: STUDENT_API.list,
    queryKey: ["student-list"],
  });

  const list = data?.data || [];
  const IMAGE_FOR = "Student";
  const studentBaseUrl = getImageBaseUrl(data?.image_url, IMAGE_FOR);
  const noImageUrl = getNoImageUrl(data?.image_url);

  const courseGroups = useMemo(() => {
    return [...new Set(list.map((item) => item.student_course))];
  }, [list]);

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
    { header: "Sort", accessorKey: "student_sort" },
    { header: "UID", accessorKey: "student_uid" },
    { header: "Name", accessorKey: "student_name" },
    { header: "Course", accessorKey: "student_course" },
    { header: "Designation", accessorKey: "student_designation" },
    {
      header: "Status",
      accessorKey: "student_status",
      cell: ({ row }) => {
        const isActive = row.original.student_status === "Active";
        return (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full inline-block ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.original.student_status}
          </span>
        );
      },
    },
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
    <div className="space-y-4">
      <Tabs defaultValue="ALL">
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          {courseGroups.map((course) => (
            <TabsTrigger key={course} value={course}>
              {course}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="ALL">
          <DataTable
            data={list}
            columns={columns}
            pageSize={10}
            searchPlaceholder="Search student..."
            addButton={{
              to: "/student/create",
              label: "Add Student",
            }}
          />
        </TabsContent>

        {courseGroups.map((course) => {
          const filteredData = list.filter(
            (item) => item.student_course === course
          );
          return (
            <TabsContent key={course} value={course}>
              <DataTable
                data={filteredData}
                columns={columns}
                pageSize={10}
                searchPlaceholder={`Search ${course} students...`}
                addButton={{
                  to: "/student/create",
                  label: "Add Student",
                }}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default StudentList;
