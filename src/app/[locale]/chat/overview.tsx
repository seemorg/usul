import { motion } from "framer-motion";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="mx-auto mt-[30vh] flex w-full flex-col gap-2 px-6 md:max-w-3xl"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      {/* logo */}
      <p className="text-3xl font-bold">Hey there</p>
      <p className="text-xl">Welcome to Usul AI</p>
    </motion.div>
  );
};
