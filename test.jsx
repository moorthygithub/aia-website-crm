import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { Input } from "@/components/ui/input";
import { NEWSLETTER_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { motion } from "framer-motion";
import { Calendar, Mail, Search } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";

const NewsLetter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: NEWSLETTER_API.list,
    queryKey: ["news-letter-list"],
  });

  const newsletters = data?.data ?? [];

  const filteredNewsletters = useMemo(() => {
    if (!searchQuery.trim()) return newsletters;
    const query = searchQuery.toLowerCase();
    return newsletters.filter((item) =>
      item.newsletter_email.toLowerCase().includes(query)
    );
  }, [searchQuery, newsletters]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return moment(dateString).format("MMM DD, YYYY");
  };

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {isLoading && <LoadingBar />}

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Newsletters</h1>
            <p className="text-gray-600 mt-2">
              Manage and view all newsletter subscribers
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search newsletters by email..."
                className="pl-12"
              />
            </div>
          </motion.div>

          {/* Content */}
          {filteredNewsletters.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl border">
              <div className="text-center">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  No newsletters found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {searchQuery ? "Try adjusting your search" : "No data yet"}
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredNewsletters.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="bg-white border rounded-xl p-4"
                >
                  <div className="flex justify-between mb-3">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                      #{item.id}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(item.newsletter_created)}
                    </div>
                  </div>

                  <p className="text-sm font-medium text-gray-900 break-all">
                    {item.newsletter_email}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsLetter;
