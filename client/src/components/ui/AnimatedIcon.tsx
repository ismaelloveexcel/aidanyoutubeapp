import { motion } from "framer-motion";

export const AnimatedIcon = ({ children, ...props }) => (
  <motion.span
    whileHover={{ scale: 1.2, rotate: 8 }}
    whileTap={{ scale: 0.95, rotate: -8 }}
    transition={{ type: "spring", stiffness: 300 }}
    style={{ display: "inline-block" }}
    {...props}
  >
    {children}
  </motion.span>
);
