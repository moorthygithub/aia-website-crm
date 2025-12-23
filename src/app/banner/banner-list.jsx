
import DataTable from "@/components/common/data-table";
import { BANNER_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

const BannerList = () => {
 
  const {
    data: data,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url:    BANNER_API.list,
    queryKey: ["banner-list"],
  });

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Page One Name",
      accessorKey: "page_one_name",
    },
    {
      header: "Popup Image",
      accessorKey: "popup_image",
    },
    {
      header: "Popup Image",
      accessorKey: "popup_required",
    },
    {
      header: "Popup Heading",
      accessorKey: "popup_heading",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.status}</span>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading banner</div>;

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pageSize={10}
      searchPlaceholder="Search banner..."
    />
  );
};

export default BannerList;
