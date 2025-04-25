import { useCallback, useRef } from "react";
import { useBoolean } from "usehooks-ts";
import html2canvas from "html2canvas";
import { useToast } from "@/components/ui/use-toast";

export const useExportChat = () => {
  const captureRef = useRef<HTMLDivElement>(null);
  const isSavingImage = useBoolean(false);
  const { toast } = useToast();

  const handleShareChat = useCallback(async () => {
    isSavingImage.setTrue();

    // const height = captureRef.current!.scrollHeight;
    // captureRef.current!.style.height = `${height}px`;

    captureRef.current!.style.width = "700px";
    captureRef.current!.style.height = "fit-content";

    try {
      const canvas = await html2canvas(captureRef.current!, {
        width: 700,
        windowWidth: 1350,
        backgroundColor: "white",
      });

      const link = document.createElement("a");
      link.download = "chat.png";
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast({ description: "Done!" });
    } catch {
      toast({ description: "An error occurred!", variant: "destructive" });
    }

    isSavingImage.setFalse();
    captureRef.current!.style.width = "";
    captureRef.current!.style.height = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { handleShareChat, isSavingImage, captureRef };
};
