// import React, { useState } from "react";
// import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
// import { Button } from "../ui/button";
// import api from "@/api";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { setCredentials } from "@/store/auth/authSlice";
// import { setCompanyDetails } from "@/store/auth/companySlice";
// import { motion } from "framer-motion";
// import { Eye, EyeOff, LogIn } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import "swiper/css";
// import "swiper/css/autoplay";
// import "swiper/css/effect-fade";
// import { Autoplay, EffectFade } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// export default function AuthUI() {
//   const [testimonialIndex, setTestimonialIndex] = useState(0);

//   const testimonials = [
//     {
//       quote:
//         "AIA provided me with comprehensive study material that helped me secure international certifications. The faculty guidance was invaluable!",
//       author: "Mas Parjono",
//       role: "Certified Auditor",
//     },
//     {
//       quote:
//         "With AIA's practical approach, I not only obtained certifications but learned real-world applications. Highly professional!",
//       author: "Sarah Chen",
//       role: "Internal Audit Manager",
//     },
//     {
//       quote:
//         "15 years of excellence in education. AIA truly helps you grow professionally!",
//       author: "Alex Rodriguez",
//       role: "Senior Compliance Officer",
//     },
//   ];

//   const current = testimonials[testimonialIndex];

//   const handleNextTestimonial = () => {
//     setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
//   };

//   const handlePrevTestimonial = () => {
//     setTestimonialIndex(
//       (prev) => (prev - 1 + testimonials.length) % testimonials.length
//     );
//   };
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loadingMessage, setLoadingMessage] = useState("");
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();
//   const [showPassword, setShowPassword] = useState(false);
//   const emailInputRef = useRef(null);
//   const loadingMessages = [
//     "Setting things up for you...",
//     "Checking your credentials...",
//     "Preparing your dashboard...",
//     "Almost there...",
//   ];

//   useEffect(() => {
//     if (emailInputRef.current) {
//       emailInputRef.current.focus();
//     }
//   }, []);

//   useEffect(() => {
//     let messageIndex = 0;
//     let intervalId;

//     if (isLoading) {
//       setLoadingMessage(loadingMessages[0]);
//       intervalId = setInterval(() => {
//         messageIndex = (messageIndex + 1) % loadingMessages.length;
//         setLoadingMessage(loadingMessages[messageIndex]);
//       }, 800);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [isLoading]);

//   const handleKeyPress = (event) => {
//     if (event.key === "Enter" && !isLoading) {
//       handleSubmit(event);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!email.trim() || !password.trim()) {
//       toast.error("Please enter both username and password.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("username", email);
//     formData.append("password", password);
//     setIsLoading(true);
//     try {
//       const res = await api.auth.login(formData);

//       if (res?.data?.code === 200) {
//         const { UserInfo, version, year } = res?.data;

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

//         navigate("/company-list", { replace: true });
//       } else {
//         toast.error(res.message || "Login Failed: Unexpected response.");
//         setIsLoading(false);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//       setIsLoading(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
//       style={{
//         background:
//           "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #ddd6fe 100%)",
//       }}
//     >
//       {/* Subtle grid overlay */}
//       <div
//         className="absolute inset-0 opacity-5 pointer-events-none"
//         style={{
//           backgroundImage:
//             "linear-gradient(0deg, transparent 24%, rgba(59,130,246,.05) 25%, rgba(59,130,246,.05) 26%, transparent 27%, transparent 74%, rgba(59,130,246,.05) 75%, rgba(59,130,246,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59,130,246,.05) 25%, rgba(59,130,246,.05) 26%, transparent 27%, transparent 74%, rgba(59,130,246,.05) 75%, rgba(59,130,246,.05) 26%, transparent 77%, transparent)",
//           backgroundSize: "50px 50px",
//         }}
//       ></div>

//       {/* Main Auth Card */}
//       <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-xl flex flex-col md:flex-row max-w-5xl w-full relative z-10 overflow-hidden">
//         {/* Left Panel - Login Form */}
//         <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//           {/* Logo */}
//           <div className="flex items-center gap-1 mb-8">
//             <img src="https://aia.in.net/crm/public/assets/images/logo/new_retina_logos.webp"></img>
//           </div>

//           {/* Heading */}
//           <h1
//             className="text-4xl font-bold mb-2"
//             style={{ color: "hsl(213, 94%, 20%)" }}
//           >
//             Welcome back
//           </h1>
//           <p className="mb-8" style={{ color: "hsl(215, 20%, 60%)" }}>
//             Continue your certification journey with AIA
//           </p>

//           <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
//             <div className="space-y-4 ">
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="email"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Username
//                 </Label>
//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 }}
//                 >
//                   <Input
//                     ref={emailInputRef}
//                     id="email"
//                     type="text"
//                     placeholder="Enter your username"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     minLength={1}
//                     maxLength={50}
//                     required
//                     className="h-10 md:h-11 border-gray-300 focus:border-[var(--color-border)] focus:ring-[var(--color-border)] transition-colors"
//                     autoComplete="username"
//                   />
//                 </motion.div>
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="password"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </Label>
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3 }}
//                 >
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       minLength={1}
//                       maxLength={16}
//                       className="h-10 md:h-11 pr-10 border-gray-300 focus:border-[var(--color-border)] focus:ring-[var(--color-border)] transition-colors"
//                       autoComplete="current-password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                       tabIndex={-1}
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </motion.div>
//               </div>

//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <Button
//                   type="submit"
//                   className="w-full h-10 md:h-11 bg-gradient-to-r from-[var(--team-color)] to-[var(--color-dark)] hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <motion.span
//                       key={loadingMessage}
//                       initial={{ opacity: 0, y: 5 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -5 }}
//                       className="text-sm"
//                     >
//                       {loadingMessage}
//                     </motion.span>
//                   ) : (
//                     <span className="flex items-center justify-center gap-2">
//                       <LogIn size={16} className="md:size-[18px]" />
//                       Sign In
//                     </span>
//                   )}
//                 </Button>
//               </motion.div>
//             </div>
//           </form>
//         </div>

//         <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
//           <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none">
//             <svg viewBox="0 0 100 100" className="w-full h-full">
//               {[...Array(12)].map((_, i) => (
//                 <line
//                   key={i}
//                   x1="50"
//                   y1="50"
//                   x2="50"
//                   y2="5"
//                   stroke="#ffffff"
//                   strokeWidth="1.5"
//                   transform={`rotate(${i * 30} 50 50)`}
//                 />
//               ))}
//             </svg>
//           </div>

//           {/* Testimonial Content */}
//           <div className="relative z-10">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
//               What Our Professionals Say
//             </h2>

//             <div className="mb-8">
//               <p className="text-4xl text-white/30 mb-4">"</p>
//               <p className="text-white/95 leading-relaxed text-lg font-medium">
//                 {current.quote}
//               </p>
//             </div>

//             <div className="mb-8">
//               <p className="text-white font-semibold text-lg">
//                 {current.author}
//               </p>
//               <p className="text-blue-100 text-sm">{current.role}</p>
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex gap-3 relative z-10">
//             <button
//               onClick={handlePrevTestimonial}
//               className="w-12 h-12 rounded-lg text-white flex items-center justify-center transition transform hover:scale-110 active:scale-95 bg-white/20 hover:bg-white/30"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <button
//               onClick={handleNextTestimonial}
//               className="w-12 h-12 rounded-lg text-white flex items-center justify-center transition transform hover:scale-110 active:scale-95"
//               style={{
//                 background: "linear-gradient(135deg, #93c5fd 0%, #c7d2fe 100%)",
//               }}
//             >
//               <ArrowRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Floating Card */}
//         <div className="fixed bottom-8 right-8 w-72 bg-white rounded-2xl p-6 shadow-2xl z-50">
//           <h3
//             className="font-bold text-lg mb-2"
//             style={{ color: "hsl(213, 94%, 20%)" }}
//           >
//             Master International Certifications
//           </h3>
//           <p className="text-sm mb-4" style={{ color: "hsl(215, 20%, 60%)" }}>
//             Join thousands of professionals. Get certified, grow professionally
//             with AIA's proven study material!
//           </p>
//           <div className="flex gap-2">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="w-8 h-8 rounded-full border-2 border-white"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #93c5fd 0%, #c7d2fe 100%)",
//                   marginLeft: i > 0 ? "-12px" : "0",
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  const loadingMessages = [
    "Setting things up...",
    "Checking credentials...",
    "Preparing dashboard...",
    "Almost there...",
  ];

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

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

    setIsLoading(true);
    try {
      // Simulated login - replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Login successful!");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const current = testimonials[testimonialIndex];

  const getCarouselRotation = (index) => {
    const diff = index - testimonialIndex;
    let position = diff;

    if (diff > 1) position = diff - testimonials.length;
    if (diff < -1) position = diff + testimonials.length;

    return position;
  };

  const handleCarouselChange = (direction) => {
    setAutoRotate(false); // Stop auto-rotation when user interacts
    if (direction === "left") {
      setTestimonialIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
    } else {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }

    // Resume auto-rotation after 8 seconds of inactivity
    setTimeout(() => setAutoRotate(true), 8000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Enhanced SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="2"
          filter="url(#glow)"
          animate={{
            r: [120, 150, 120],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="850"
          cy="200"
          r="180"
          fill="none"
          stroke="url(#grad2)"
          strokeWidth="2"
          filter="url(#glow)"
          animate={{
            r: [180, 220, 180],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.circle
          cx="100"
          cy="850"
          r="100"
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="2"
          filter="url(#glow)"
          animate={{
            r: [100, 140, 100],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.circle
          cx="850"
          cy="800"
          r="130"
          fill="none"
          stroke="url(#grad2)"
          strokeWidth="2"
          filter="url(#glow)"
          animate={{
            r: [130, 170, 130],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <motion.path
          d="M 0 300 Q 250 250 500 300 T 1000 300"
          stroke="url(#grad1)"
          strokeWidth="1.5"
          fill="none"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.path
          d="M 0 700 Q 250 650 500 700 T 1000 700"
          stroke="url(#grad2)"
          strokeWidth="1.5"
          fill="none"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
        />

        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.5"
              opacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#grid)" />

        <motion.path
          d="M -100 400 Q 0 350 100 400 T 300 400 T 500 400 T 700 400 T 900 400 T 1100 400"
          stroke="url(#grad2)"
          strokeWidth="1"
          fill="none"
          animate={{
            x: [0, 100, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-6xl w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          {/* Left Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white/5 via-white/5 to-transparent"
          >
            <div className="flex items-center gap-1 mb-8">
              <div className="w-40 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold">
                AIA Logo
              </div>
            </div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Welcome back
              </h1>
              <p className="text-blue-200 text-lg mb-10">
                Continue your certification journey with AIA
              </p>
            </motion.div>

            <div className="space-y-5">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Username
                </label>
                <motion.input
                  ref={emailInputRef}
                  type="text"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[12px] text-blue-300 transition-colors p-1"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <motion.span
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {loadingMessage}
                  </motion.span>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </motion.button>
            </div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex justify-center gap-4 text-sm"
            >
              <button className="text-blue-300 hover:text-blue-100 transition-colors">
                Forgot password?
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side - Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex lg:col-span-3 flex-col justify-between p-8 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent border-l border-white/10 relative overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold text-white">{current.title}</h2>
              <p className="text-blue-200 text-sm mt-2">
                {current.description}
              </p>
            </motion.div>

            {/* 3D Carousel Container */}
            <div
              className="flex-1 flex items-center justify-center perspective"
              style={{ perspective: "1200px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {testimonials.map((item, index) => {
                  const position = getCarouselRotation(index);
                  const isCenter = position === 0;
                  const isLeft = position === -1;
                  const isRight = position === 1;

                  return (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{
                        x: isCenter ? 0 : isLeft ? -400 : 400,
                        z: isCenter ? 0 : isLeft ? -300 : -300,
                        opacity: isCenter ? 1 : 0.3,
                        scale: isCenter ? 1 : 0.7,
                        rotateY: isCenter ? 0 : isLeft ? 35 : -35,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="absolute w-80 h-96 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                      onClick={() => {
                        if (isLeft) {
                          handleCarouselChange("left");
                        } else if (isRight) {
                          handleCarouselChange("right");
                        }
                      }}
                    >
                      <motion.img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        animate={{
                          scale: isCenter ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3 justify-center mt-8"
            >
              <motion.button
                onClick={() => handleCarouselChange("left")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <motion.button
                onClick={() => handleCarouselChange("right")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all flex items-center justify-center"
              >
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>

            {/* Decorative SVG */}
            <svg
              className="absolute top-0 right-0 w-48 h-48 opacity-5 pointer-events-none"
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient
                  id="decorGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="url(#decorGrad)"
                strokeWidth="1"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
