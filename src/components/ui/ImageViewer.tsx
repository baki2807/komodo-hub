import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface ImageViewerProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt?: string
}

export function ImageViewer({ isOpen, onClose, imageUrl, alt }: ImageViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={alt || "Image"}
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 