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
    queryKey: ["newsletter-list"],
  });
  const newsletters = data?.data || [];

  const filteredNewsletters = useMemo(() => {
    if (!searchQuery.trim()) return newsletters;
    const query = searchQuery.toLowerCase();
    return newsletters.filter((item) =>
      item.newsletter_email.toLowerCase().includes(query)
    );
  }, [searchQuery, newsletters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {isLoading && <LoadingBar />}

      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Newsletters</h1>
            <p className="text-gray-600 mt-2">
              Manage and view all newsletter subscribers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search newsletters by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {filteredNewsletters.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="text-center">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  No newsletters found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {searchQuery ? "Try adjusting your search" : "No data yet"}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial={false}
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredNewsletters.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4 p-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="truncate text-sm font-medium text-gray-900">
                        {item.newsletter_email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 shrink-0">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span className="whitespace-nowrap">
                        {moment(item.newsletter_created).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>
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
