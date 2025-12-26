import Login from "@/app/auth/login";
import BannerList from "@/app/banner/banner-list";
import CreateBanner from "@/app/banner/create-banner";
import EditBanner from "@/app/banner/edit-banner";
import BlogList from "@/app/blog/blog-list";
import CreateBlog from "@/app/blog/create-blog";
import CompanyList from "@/app/company/company-list";
// import CreateCompany from "@/app/company/create-company";
// import EditCompany from "@/app/company/edit-company";
import CountryList from "@/app/country/country";
import NotFound from "@/app/errors/not-found";
import CreateFaq from "@/app/faq/create-faq";
import EditFaq from "@/app/faq/edit-faq";
import FaqList from "@/app/faq/faq-list";
import GalleryList from "@/app/gallery/gallery-list";
import LectureYoutubeForm from "@/app/lecture-youtube/lecture-youtube-form";
import LetureYoutubeList from "@/app/lecture-youtube/lecture-youtube-list";
import NewsLetter from "@/app/newsletter/news-letter";
import PopupList from "@/app/popup/popup";
import Settings from "@/app/setting/setting";
import StudentForm from "@/app/student/student-form";
import StudentList from "@/app/student/student-list";
import Maintenance from "@/components/common/maintenance";
import ErrorBoundary from "@/components/error-boundry/error-boundry";
import LoadingBar from "@/components/loader/loading-bar";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import EditBlog from "../app/blog/edit-blog";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          {/* <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ForgotPassword />
              </Suspense>
            }
          /> */}
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/newsletter-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <NewsLetter />
              </Suspense>
            }
          />
          <Route
            path="/country-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <CountryList />
              </Suspense>
            }
          />
          <Route
            path="/lecture-youtube"
            element={
              <Suspense fallback={<LoadingBar />}>
                <LetureYoutubeList />
              </Suspense>
            }
          />
          <Route
            path="/lecture-youtube/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <LectureYoutubeForm />
              </Suspense>
            }
          />
          <Route
            path="/lecture-youtube/:id/edit"
            element={
              <Suspense fallback={<LoadingBar />}>
                <LectureYoutubeForm />
              </Suspense>
            }
          />
          <Route
            path="/student-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <StudentList />
              </Suspense>
            }
          />
          <Route
            path="/student/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <StudentForm />
              </Suspense>
            }
          />
          <Route
            path="/student/:id/edit"
            element={
              <Suspense fallback={<LoadingBar />}>
                <StudentForm />
              </Suspense>
            }
          />

          <Route
            path="/popup-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <PopupList />
              </Suspense>
            }
          />
          <Route
            path="/banner-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <BannerList />
              </Suspense>
            }
          />
          <Route
            path="/add-banner"
            element={
              <Suspense fallback={<LoadingBar />}>
                <CreateBanner />
              </Suspense>
            }
          />
          <Route
            path="/edit-banner/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EditBanner />
              </Suspense>
            }
          />
          <Route
            path="/company-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <CompanyList />
              </Suspense>
            }
          />

          <Route
            path="/faq-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <FaqList />
              </Suspense>
            }
          />
          <Route
            path="/add-faq"
            element={
              <Suspense fallback={<LoadingBar />}>
                <CreateFaq />
              </Suspense>
            }
          />
          <Route
            path="/edit-faq/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EditFaq />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/blog-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <BlogList />
              </Suspense>
            }
          />
          <Route
            path="/add-blog"
            element={
              <Suspense fallback={<LoadingBar />}>
                <CreateBlog />
              </Suspense>
            }
          />
          <Route
            path="/edit-blog/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <EditBlog />
              </Suspense>
            }
          />
          <Route
            path="/gallery-list"
            element={
              <Suspense fallback={<LoadingBar />}>
                <GalleryList />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default AppRoutes;
