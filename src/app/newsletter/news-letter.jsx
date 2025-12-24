import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import { Input } from "@/components/ui/input";
import { NEWSLETTER_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { motion } from "framer-motion";
import { Calendar, Mail, Search, Users } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";

const NewsLetter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: NEWSLETTER_API.list,
    queryKey: ["news-letter-list"],
  });
  const newsletters = data?.data || [];

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

  const statVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

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

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <motion.div
              variants={statVariants}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Total Subscribers
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {newsletters.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statVariants}
              className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    Found Results
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {filteredNewsletters.length}
                  </p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <Search className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statVariants}
              className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">
                    Last Updated
                  </p>
                  <p className="text-lg font-bold text-purple-900 mt-2">
                    {newsletters?.[0]?.newsletter_created
                      ? moment(newsletters[0].newsletter_created).fromNow()
                      : "No Data"}
                  </p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </motion.div>
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
              initial="hidden"
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
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
                      {item.id}
                    </span>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(item.newsletter_created)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <p className="text-xs text-gray-500 font-semibold">
                          EMAIL
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {item.newsletter_email}
                      </p>
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
