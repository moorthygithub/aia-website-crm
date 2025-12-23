import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import DataTable from "@/components/common/DataTable";
import { POPUP_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

const PopupList = () => {
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["popups"],
  //     queryFn: async () => {
  //       const res = await apiClient.get(POPUP_API.list);
  //       return res.data.data;
  //     },
  //   });
  const {
    data: data,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: POPUP_API.list,
    queryKey: ["popups"],
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
  if (isError) return <div>Error loading popups</div>;

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pageSize={10}
      searchPlaceholder="Search popups..."
    />
  );
};

export default PopupList;
