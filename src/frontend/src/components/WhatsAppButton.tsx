import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SiWhatsapp } from "react-icons/si";

export function WhatsAppButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://wa.me/919901563799"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="whatsapp.button"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: "#25D366" }}
            aria-label="Chat on WhatsApp"
          >
            <SiWhatsapp className="w-7 h-7 text-white" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-medium">
          Chat on WhatsApp
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
