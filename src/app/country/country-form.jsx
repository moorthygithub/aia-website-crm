import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiMutation } from "@/hooks/use-mutation";
import { COUNTRY_API } from "@/constants/apiConstants";
import LoadingBar from "@/components/loader/loading-bar";
import { toast } from "sonner";

const initialState = {
  country_name: "",
  country_latitude: "",
  country_longitude: "",
  country_status: "Active",
};

const CountryForm = ({ isOpen, onClose, countryId, refetch }) => {
  const isEditMode = Boolean(countryId);
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const { trigger: fetchCountry, loading } = useApiMutation();
  const { trigger: submitCountry, loading: submitLoading } = useApiMutation();

  useEffect(() => {
    if (!isOpen) return;

    if (!isEditMode) {
      setData(initialState);
      setErrors({});
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchCountry({
          url: COUNTRY_API.byId(countryId),
        });

        setData({
          country_name: res.data.country_name || "",
          country_latitude: res.data.country_latitude || "",
          country_longitude: res.data.country_longitude || "",
          country_status: res.data.country_status || "Active",
        });
      } catch (err) {
        toast.error("Failed to load country data");
      }
    };

    fetchData();
  }, [isOpen, countryId]);

  const validate = () => {
    const newErrors = {};

    if (!data.country_name.trim()) newErrors.country_name = "Required";
    if (!data.country_latitude) newErrors.country_latitude = "Required";
    if (!data.country_longitude) newErrors.country_longitude = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("country_name", data.country_name);
    formData.append("country_latitude", data.country_latitude);
    formData.append("country_longitude", data.country_longitude);
    formData.append("country_status", data.country_status);

    try {
      const res = await submitCountry({
        url: isEditMode ? `${COUNTRY_API.byId(countryId)}` : COUNTRY_API.list,
        method: isEditMode ? "put" : "post",
        data: formData,
      });

      if (
        (isEditMode && res?.code === 200) ||
        (!isEditMode && res?.code === 201)
      ) {
        toast.success(res?.msg || "Saved successfully");
        onClose();
        refetch();
      } else {
        toast.error(res?.msg || "Failed to update country");
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Country" : "Create Country"}
          </DialogTitle>
        </DialogHeader>

        {loading && <LoadingBar />}

        <div className="space-y-4">
          <label className="text-sm font-medium">Country Name *</label>

          <Input
            placeholder="Country name"
            value={data.country_name}
            onChange={(e) => setData({ ...data, country_name: e.target.value })}
          />
          {errors.country_name && (
            <p className="text-xs text-red-500">{errors.country_name}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Latitude *</label>
          <Input
            placeholder="Latitude"
            value={data.country_latitude}
            onChange={(e) =>
              setData({ ...data, country_latitude: e.target.value })
            }
          />
          {errors.country_latitude && (
            <p className="text-xs text-red-500">{errors.country_latitude}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Longitude *</label>

          <Input
            placeholder="Longitude"
            value={data.country_longitude}
            onChange={(e) =>
              setData({ ...data, country_longitude: e.target.value })
            }
          />
          {errors.country_longitude && (
            <p className="text-xs text-red-500">{errors.country_longitude}</p>
          )}
        </div>

        {isEditMode && (
          <>
            <label className="text-sm font-medium">Status *</label>

            <Select
              value={data.country_status}
              onValueChange={(value) =>
                setData({ ...data, country_status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitLoading}>
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CountryForm;
