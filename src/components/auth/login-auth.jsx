// import { LOGIN } from "@/constants/apiConstants";
// import { useApiMutation } from "@/hooks/useApiMutation";
// import { setCredentials } from "@/store/auth/authSlice";
// import { setCompanyDetails } from "@/store/auth/companySlice";
// import { motion } from "framer-motion";
// import { Eye, EyeOff, LogIn, ArrowRight, ArrowLeft } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { toast } from "sonner";
// import { Button } from "../ui/button";
// const testimonials = [
//   {
//     image:
//       "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     title: "Empowering Professionals",
//     description:
//       "International certifications with practical knowledge and expert guidance for your career growth.",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     title: "Education for Excellence",
//     description:
//       "Comprehensive training programs designed to help you master internal audit and compliance.",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
//     title: "15 Years of Excellence",
//     description:
//       "Trusted by thousands of professionals. Join the AIA community and advance your career.",
//   },
// ];
// export default function AuthUI() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [testimonialIndex, setTestimonialIndex] = useState(0);
//   const emailInputRef = useRef(null);
//   const [loadingMessage, setLoadingMessage] = useState("");
//   const { trigger: login, loading: isLoading } = useApiMutation();
//   const dispatch = useDispatch();
//   const [autoRotate, setAutoRotate] = useState(true);

//   const loadingMessages = [
//     "Setting things up...",
//     "Checking credentials...",
//     "Preparing dashboard...",
//     "Almost there...",
//   ];

//   useEffect(() => {
//     emailInputRef.current?.focus();
//   }, []);
//   useEffect(() => {
//     if (!autoRotate) return;

//     const interval = setInterval(() => {
//       setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [autoRotate]);
//   useEffect(() => {
//     if (!isLoading) return;
//     let messageIndex = 0;
//     setLoadingMessage(loadingMessages[0]);
//     const interval = setInterval(() => {
//       messageIndex = (messageIndex + 1) % loadingMessages.length;
//       setLoadingMessage(loadingMessages[messageIndex]);
//     }, 800);
//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!email.trim() || !password.trim()) {
//       toast.error("Please enter both username and password.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("username", email);
//     formData.append("password", password);
//     try {
//       const res = await login({
//         url: LOGIN.postLogin,
//         method: "post",
//         data: formData,
//       });
//       if (res?.code === 200) {
//         const { UserInfo, version, year } = res;

//         if (!UserInfo || !UserInfo.token) {
//           toast.error("Login Failed: No token received.");
//           return;
//         }

//         dispatch(
//           setCredentials({
//             token: UserInfo.token,
//             user: UserInfo.user,
//             version: version?.version_panel,
//             currentYear: year?.current_year,
//             tokenExpireAt: UserInfo.token_expires_at,
//           })
//         );
//         dispatch(setCompanyDetails(res.company_details));

//         // navigate("/company-list", { replace: true });
//       } else {
//         toast.error(res.message || "Login Failed: Unexpected response.");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   const current = testimonials[testimonialIndex];

//   const getCarouselRotation = (index) => {
//     const diff = index - testimonialIndex;
//     let position = diff;

//     if (diff > 1) position = diff - testimonials.length;
//     if (diff < -1) position = diff + testimonials.length;

//     return position;
//   };
//   const handleCarouselChange = (direction) => {
//     setAutoRotate(false); // Stop auto-rotation when user interacts
//     if (direction === "left") {
//       setTestimonialIndex(
//         (prev) => (prev - 1 + testimonials.length) % testimonials.length
//       );
//     } else {
//       setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
//     }

//     // Resume auto-rotation after 8 seconds of inactivity
//     setTimeout(() => setAutoRotate(true), 8000);
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
//       {/* Enhanced SVG Background with AIA-inspired design */}
//       <svg
//         className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
//         viewBox="0 0 1000 1000"
//         preserveAspectRatio="xMidYMid slice"
//       >
//         <defs>
//           <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
//             <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
//           </linearGradient>
//           <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
//             <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
//           </linearGradient>
//           <filter id="glow">
//             <feGaussianBlur stdDeviation="3" result="coloredBlur" />
//             <feMerge>
//               <feMergeNode in="coloredBlur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         <motion.circle
//           cx="150"
//           cy="150"
//           r="120"
//           fill="none"
//           stroke="url(#grad1)"
//           strokeWidth="2"
//           filter="url(#glow)"
//           animate={{
//             r: [120, 150, 120],
//             opacity: [0.6, 0.9, 0.6],
//           }}
//           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//         />
//         <motion.circle
//           cx="850"
//           cy="200"
//           r="180"
//           fill="none"
//           stroke="url(#grad2)"
//           strokeWidth="2"
//           filter="url(#glow)"
//           animate={{
//             r: [180, 220, 180],
//             opacity: [0.4, 0.7, 0.4],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 1,
//           }}
//         />
//         <motion.circle
//           cx="100"
//           cy="850"
//           r="100"
//           fill="none"
//           stroke="url(#grad1)"
//           strokeWidth="2"
//           filter="url(#glow)"
//           animate={{
//             r: [100, 140, 100],
//             opacity: [0.5, 0.8, 0.5],
//           }}
//           transition={{
//             duration: 9,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 2,
//           }}
//         />
//         <motion.circle
//           cx="850"
//           cy="800"
//           r="130"
//           fill="none"
//           stroke="url(#grad2)"
//           strokeWidth="2"
//           filter="url(#glow)"
//           animate={{
//             r: [130, 170, 130],
//             opacity: [0.5, 0.8, 0.5],
//           }}
//           transition={{
//             duration: 11,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 0.5,
//           }}
//         />

//         <motion.path
//           d="M 0 300 Q 250 250 500 300 T 1000 300"
//           stroke="url(#grad1)"
//           strokeWidth="1.5"
//           fill="none"
//           animate={{
//             opacity: [0.2, 0.5, 0.2],
//           }}
//           transition={{ duration: 6, repeat: Infinity }}
//         />
//         <motion.path
//           d="M 0 700 Q 250 650 500 700 T 1000 700"
//           stroke="url(#grad2)"
//           strokeWidth="1.5"
//           fill="none"
//           animate={{
//             opacity: [0.3, 0.6, 0.3],
//           }}
//           transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
//         />

//         <defs>
//           <pattern
//             id="grid"
//             width="80"
//             height="80"
//             patternUnits="userSpaceOnUse"
//           >
//             <path
//               d="M 80 0 L 0 0 0 80"
//               fill="none"
//               stroke="#3b82f6"
//               strokeWidth="0.5"
//               opacity="0.08"
//             />
//           </pattern>
//         </defs>
//         <rect width="1000" height="1000" fill="url(#grid)" />

//         <motion.path
//           d="M -100 400 Q 0 350 100 400 T 300 400 T 500 400 T 700 400 T 900 400 T 1100 400"
//           stroke="url(#grad2)"
//           strokeWidth="1"
//           fill="none"
//           animate={{
//             x: [0, 100, 0],
//             opacity: [0.1, 0.3, 0.1],
//           }}
//           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//         />
//       </svg>

//       {/* Main Content */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="relative z-10 max-w-6xl w-full"
//       >
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="lg:col-span-2  p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white/5 via-white/5 to-transparent"
//           >
//             <div className="flex items-center gap-1 p-2 rounded-md mb-8 bg-white">
//               <img src="https://aia.in.net/crm/public/assets/images/logo/new_retina_logos.webp"></img>
//             </div>

//             {/* Heading */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//             >
//               <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
//                 Welcome back
//               </h1>
//               <p className="text-blue-200 text-lg mb-10">
//                 Continue your certification journey with AIA
//               </p>
//             </motion.div>

//             <div className="space-y-5">
//               {/* Email Input */}
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <label className="block text-sm font-medium text-blue-100 mb-2">
//                   Username
//                 </label>
//                 <motion.input
//                   ref={emailInputRef}
//                   type="text"
//                   placeholder="Enter your username"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
//                   whileFocus={{ scale: 1.02 }}
//                 />
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.7 }}
//               >
//                 <label className="block text-sm font-medium text-blue-100 mb-2">
//                   Password
//                 </label>
//                 <div className="relative group">
//                   <motion.input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
//                     whileFocus={{ scale: 1.02 }}
//                   />
//                   <motion.button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-[12px]  text-blue-300 transition-colors p-1"
//                     whileHover={{ scale: 1.15 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </motion.button>
//                 </div>
//               </motion.div>

//               <Button className="w-full  py-3" onClick={handleSubmit}>
//                 {isLoading ? (
//                   <motion.span
//                     key={loadingMessage}
//                     initial={{ opacity: 0, y: 5 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -5 }}
//                   >
//                     {loadingMessage}
//                   </motion.span>
//                 ) : (
//                   <>
//                     <LogIn size={18} />
//                     Sign In
//                   </>
//                 )}
//               </Button>
//             </div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1 }}
//               className="mt-8 flex justify-center gap-4 text-sm"
//             >
//               <button
//                 onClick={() => {}}
//                 className="text-blue-300 hover:text-blue-100 transition-colors"
//               >
//                 Forgot password?
//               </button>
//               <span className="text-blue-400/30">•</span>
//             </motion.div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="hidden lg:flex lg:col-span-3 flex-col justify-between p-8 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent border-l border-white/10 relative overflow-hidden"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="mb-6"
//             >
//               <h2 className="text-3xl font-bold text-white">{current.title}</h2>
//               <p className="text-blue-200 text-sm mt-2">
//                 {current.description}
//               </p>
//             </motion.div>

//             <div
//               className="flex-1 flex items-center justify-center perspective"
//               style={{ perspective: "1200px" }}
//             >
//               <div className="relative w-full h-full flex items-center justify-center">
//                 {testimonials.map((item, index) => {
//                   const position = getCarouselRotation(index);
//                   const isCenter = position === 0;
//                   const isLeft = position === -1;
//                   const isRight = position === 1;

//                   return (
//                     <motion.div
//                       key={index}
//                       initial={false}
//                       animate={{
//                         x: isCenter ? 0 : isLeft ? -400 : 400,
//                         z: isCenter ? 0 : isLeft ? -300 : -300,
//                         opacity: isCenter ? 1 : 0.3,
//                         scale: isCenter ? 1 : 0.7,
//                         rotateY: isCenter ? 0 : isLeft ? 35 : -35,
//                       }}
//                       transition={{
//                         type: "spring",
//                         stiffness: 300,
//                         damping: 30,
//                       }}
//                       className="absolute w-80 h-96 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
//                       style={{
//                         transformStyle: "preserve-3d",
//                       }}
//                       onClick={() => {
//                         if (isLeft) {
//                           handleCarouselChange("left");
//                         } else if (isRight) {
//                           handleCarouselChange("right");
//                         }
//                       }}
//                     >
//                       <motion.img
//                         src={item.image}
//                         alt={item.title}
//                         className="w-full h-full object-cover"
//                         animate={{
//                           scale: isCenter ? 1.05 : 1,
//                         }}
//                         transition={{ duration: 0.5 }}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </div>

//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8 }}
//               className="flex gap-3 justify-center mt-8"
//             >
//               <motion.button
//                 onClick={() =>
//                   setTestimonialIndex(
//                     (prev) =>
//                       (prev - 1 + testimonials.length) % testimonials.length
//                   )
//                 }
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center"
//               >
//                 <ArrowLeft size={20} />
//               </motion.button>
//               <motion.button
//                 onClick={() =>
//                   setTestimonialIndex(
//                     (prev) => (prev + 1) % testimonials.length
//                   )
//                 }
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all flex items-center justify-center"
//               >
//                 <ArrowRight size={20} />
//               </motion.button>
//             </motion.div>

//             {/* Decorative SVG */}
//             <svg
//               className="absolute top-0 right-0 w-48 h-48 opacity-5 pointer-events-none"
//               viewBox="0 0 200 200"
//             >
//               <defs>
//                 <linearGradient
//                   id="decorGrad"
//                   x1="0%"
//                   y1="0%"
//                   x2="100%"
//                   y2="100%"
//                 >
//                   <stop offset="0%" stopColor="#3b82f6" />
//                   <stop offset="100%" stopColor="#8b5cf6" />
//                 </linearGradient>
//               </defs>
//               <motion.circle
//                 cx="100"
//                 cy="100"
//                 r="80"
//                 fill="none"
//                 stroke="url(#decorGrad)"
//                 strokeWidth="1"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//               />
//             </svg>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// File: components/auth/AuthUI.jsx
import { LOGIN } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { setCredentials } from "@/store/auth/authSlice";
import { setCompanyDetails } from "@/store/auth/companySlice";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import LoginForm from "./login-form";
import Carousel from "./carousel";
import BackgroundSVG from "./background-svg";
import { toast } from "sonner";

const testimonials = [
  {
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Empowering Professionals",
    description:
      "International certifications with practical knowledge and expert guidance for your career growth.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Education for Excellence",
    description:
      "Comprehensive training programs designed to help you master internal audit and compliance.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "15 Years of Excellence",
    description:
      "Trusted by thousands of professionals. Join the AIA community and advance your career.",
  },
];

export default function AuthUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const emailInputRef = useRef(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { trigger: login, loading: isLoading } = useApiMutation();
  const dispatch = useDispatch();

  const loadingMessages = [
    "Setting things up...",
    "Checking credentials...",
    "Preparing dashboard...",
    "Almost there...",
  ];

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate]);

  useEffect(() => {
    if (!isLoading) return;
    let messageIndex = 0;
    setLoadingMessage(loadingMessages[0]);
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both username and password.");
      return;
    }

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    try {
      const res = await login({
        url: LOGIN.postLogin,
        method: "post",
        data: formData,
      });
      if (res?.code === 200) {
        const { UserInfo, version, year } = res;

        if (!UserInfo || !UserInfo.token) {
          toast.error("Login Failed: No token received.");
          return;
        }

        dispatch(
          setCredentials({
            token: UserInfo.token,
            user: UserInfo.user,
            version: version?.version_panel,
            currentYear: year?.current_year,
            tokenExpireAt: UserInfo.token_expires_at,
          })
        );
        dispatch(setCompanyDetails(res.company_details));
      } else {
        toast.error(res.message || "Login Failed: Unexpected response.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleCarouselChange = (direction) => {
    setAutoRotate(false);
    if (direction === "left") {
      setTestimonialIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
    } else {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }
    setTimeout(() => setAutoRotate(true), 8000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      <BackgroundSVG />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-6xl w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            emailInputRef={emailInputRef}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />

          <Carousel
            testimonials={testimonials}
            testimonialIndex={testimonialIndex}
            handleCarouselChange={handleCarouselChange}
          />
        </div>
      </motion.div>
    </div>
  );
}
