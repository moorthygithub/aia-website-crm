import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import ImageCell from "@/components/common/ImageCell";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { LETUREYOUTUBE_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { getImageBaseUrl, getNoImageUrl } from "@/utils/imageUtils";
import { Edit } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LetureYoutubeList = () => {
  const navigate = useNavigate();
  const IMAGE_FOR = "Lecture Youtube";

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: LETUREYOUTUBE_API.list,
    queryKey: ["lecture-youtube-list"],
  });

  const list = data?.data || [];

  /* ✅ UNIQUE PAGE GROUPS */
  const pageGroups = useMemo(() => {
    return [...new Set(list.map((item) => item.page_one_name))];
  }, [list]);

  /* ✅ IMAGE BASE URL */
  const imageBaseUrl = getImageBaseUrl(data?.image_url, IMAGE_FOR);
  const noImageUrl = getNoImageUrl(data?.image_url);

  /* ✅ TABLE COLUMNS */
  const columns = [
    {
      header: "Image",
      accessorKey: "youtube_image",
      cell: ({ row }) => {
        const fileName = row.original.youtube_image;
        const src = fileName ? `${imageBaseUrl}${fileName}` : noImageUrl;
        return (
          <ImageCell src={src} fallback={noImageUrl} alt="Youtube Image" />
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
        const isActive = row.original.youtube_status === "Active";
        return (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.original.youtube_status}
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
          onClick={() => navigate(`/youtube/${row.original.id}/edit`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  if (isLoading) return <LoadingBar />;

  return (
    <div className="space-y-4">
      {/* ✅ TABS */}
      <Tabs defaultValue="ALL">
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          {pageGroups.map((page) => (
            <TabsTrigger key={page} value={page}>
              {page}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ✅ ALL TAB */}
        <TabsContent value="ALL">
          <DataTable
            data={list}
            columns={columns}
            pageSize={10}
            searchPlaceholder="Search youtube..."
            addButton={{
              to: "/youtube/create",
              label: "Add Youtube",
            }}
          />
        </TabsContent>

        {/* ✅ GROUPED PAGE TABS */}
        {pageGroups.map((page) => {
          const filteredData = list.filter(
            (item) => item.page_one_name === page
          );
          return (
            <TabsContent key={page} value={page}>
              <DataTable
                data={filteredData}
                columns={columns}
                pageSize={10}
                searchPlaceholder={`Search ${page} youtube...`}
                addButton={{
                  to: "/youtube/create",
                  label: "Add Youtube",
                }}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default LetureYoutubeList;
