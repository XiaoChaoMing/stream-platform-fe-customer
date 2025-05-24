import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLivestream } from "@/hooks/useLivestreamQuery";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface CreateLivestreamModalProps {
  userId: number;
  onSuccess?: () => void;
}

export const CreateLivestreamModal = ({ userId, onSuccess }: CreateLivestreamModalProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const {
    createLivestream,
    isCreatingLivestream,
    createLivestreamError,
    isCreateSuccess,
    resetCreateState
  } = useCreateLivestream();

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error(t("Title is required"));
      return;
    }

    try {
      await createLivestream({
        title: title.trim(),
        description: description.trim(),
        user_id: userId,
        thumbnail: thumbnail || undefined
      });

      toast.success(t("Livestream profile created successfully"));
      setIsOpen(false);
      onSuccess?.();
      
      // Reset form
      setTitle("");
      setDescription("");
      setThumbnail(null);
      resetCreateState();
    } catch (error) {
      toast.error(t("Failed to create livestream profile"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-red-500 hover:bg-red-600 text-white">
          {t("Create Livestream Profile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Create Livestream Profile")}</DialogTitle>
          <DialogDescription>
            {t("Set up your livestream profile before going live")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {t("Title")} *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder={t("Enter stream title")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t("Description")}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder={t("Enter stream description")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thumbnail" className="text-right">
              {t("Thumbnail")}
            </Label>
            <Input
              id="thumbnail"
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
              accept="image/*"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isCreatingLivestream || !title.trim()}
          >
            {isCreatingLivestream ? t("Creating...") : t("Create Profile")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 