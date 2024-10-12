"use client";

import type { ButtonHTMLAttributes } from "react";
import { useDemo } from "../video-modal/provider";

export default function FooterDemoButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const setDemo = useDemo((s) => s.setIsOpen);

  return <button onClick={() => setDemo(true)} {...props} />;
}
