import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

type Props = {
  type: string;
  content: string;
  from?: string;
  time?: string;
  isRead: boolean;
};

const Notification = ({ type, content, from, time, isRead }: Props) => {
  return (
    <div className="relative">
      {!isRead && (
        <Badge className="bg-primary absolute -top-2 -right-2 h-2 w-2 rounded-full" />
      )}
      <div className="bg-card flex min-w-[350px] flex-col rounded-md border p-3 shadow-sm">
        <div className="flex flex-col justify-start gap-1">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-foreground font-semibold">{type}</h1>
            {from && <h2 className="text-muted-foreground">- {from}</h2>}
            {time && <h2 className="text-muted-foreground">- {time}</h2>}
          </div>
          <p className="text-muted-foreground max-h-[90px] w-[300px] overflow-hidden text-sm text-ellipsis">
            {content}
          </p>
        </div>
        <div className="mt-2 flex w-full flex-row justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
