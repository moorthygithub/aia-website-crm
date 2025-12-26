import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "../ui/button";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  emailInputRef,
  handleSubmit,
  isLoading,
  loadingMessage,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white/5 via-white/5 to-transparent"
    >
      <div className="flex items-center gap-1 p-2 rounded-md mb-8 bg-white">
        <img
          src="https://aia.in.net/crm/public/assets/images/logo/new_retina_logos.webp"
          alt="AIA Logo"
        />
      </div>

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
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>

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
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
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

        <Button
          className="w-full py-3"
          onClick={handleSubmit}
          disabled={isLoading}
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
        </Button>
      </div>

      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 flex justify-center gap-4 text-sm"
      >
        <button className="text-blue-300 hover:text-blue-100 transition-colors">
          Forgot password?
        </button>
        <span className="text-blue-400/30">•</span>
      </motion.div> */}
    </motion.div>
  );
}
