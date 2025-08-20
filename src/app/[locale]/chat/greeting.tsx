import { LogoIcon } from "@/components/icons/logo";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const Greeting = () => {
  const t = useTranslations();

  return (
    <div
      key="overview"
      className="mx-auto flex size-full max-w-3xl flex-col justify-center px-8 md:mt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        <LogoIcon className="text-primary size-10 dark:text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="mt-5 text-2xl font-semibold"
      >
        {t("chat.greeting.hello")}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.7 }}
        className="text-2xl text-zinc-500"
      >
        {t("chat.greeting.welcome")}
      </motion.div>
    </div>
  );
};
