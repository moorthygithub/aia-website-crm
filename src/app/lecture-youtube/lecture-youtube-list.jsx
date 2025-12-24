import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import ImageCell from "@/components/common/ImageCell";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { LETUREYOUTUBE_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { getImageBaseUrl, getNoImageUrl } from "@/utils/imageUtils";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LetureYoutubeList = () => {
  const navigate = useNavigate();
  const IMAGE_FOR = "Lecture Youtube";

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: LETUREYOUTUBE_API.list,
    queryKey: ["lecture-youtube-list"],
  });
  const imageBaseUrl = getImageBaseUrl(data?.image_url, IMAGE_FOR);
  const noImageUrl = getNoImageUrl(data?.image_url);
  const columns = [
    { header: "ID", accessorKey: "id" },
    {
      header: "Image",
      accessorKey: "youtube_image",
      cell: ({ row }) => {
        const fileName = row.original.youtube_image;
        const src = fileName ? `${imageBaseUrl}${fileName}` : noImageUrl;

        return (
          <ImageCell
            src={src}
            fallback={noImageUrl}
            alt="Lecture Youtube Image"
          />
        );
      },
    },

    { header: "Page", accessorKey: "page_one_name" },
    { header: "Sort", accessorKey: "youtube_sort" },
    { header: "Course", accessorKey: "youtube_course" },
    {
      header: "Status",
      accessorKey: "youtube_status",
      cell: ({ row }) => {
        const status = row.original.youtube_status;
        const isActive = status === "Active";

        return (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full inline-block
              ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {status}
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
          onClick={() => navigate(`/lecture-youtube/${row.original.id}/edit`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];
  if (isError) {
    return <ApiErrorPage onRetry={() => refetch()} />;
  }
  return (
    <>
      {isLoading && <LoadingBar />}

      <DataTable
        data={data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search lecture youtube..."
        addButton={{
          to: "/lecture-youtube/create",
          label: "Add Lecture Youtube",
        }}
      />
    </>
  );
};

export default LetureYoutubeList;
