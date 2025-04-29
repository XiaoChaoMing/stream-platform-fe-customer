import { useEffect, useState } from "react";
import { useSocket } from "@/components/base/socketContext/SocketContext";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { socketService } from "@/config/socketConfig";

export function SocketStatus() {
  const { socketId } = useSocket();
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showDetails) {
      timeout = setTimeout(() => {
        setShowDetails(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [showDetails]);

  const getStatusColor = () => {
    if (socketId) {
      return "text-green-500";
    } else {
      return "text-gray-500";
    }
  };

  const getStatusIcon = () => {
    if (socketId) {
      return <Wifi className="h-5 w-5" />;
    } else {
      return <WifiOff className="h-5 w-5" />;
    }
  };

  const getStatusText = () => {
    if (socketId) {
      return "Connected";
    } else {
      return "Disconnected";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center gap-2 rounded-md border p-2 shadow-sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className={`flex items-center gap-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Click to view connection details</p>
        </TooltipContent>
      </Tooltip>

      {showDetails && (
        <div className="bg-background absolute top-12 right-0 z-50 w-72 rounded-md border p-4 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Socket Connection</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(false)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={getStatusColor()}>{getStatusText()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Connected:</span>
              <span>{socketId ? "Yes" : "No"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Socket ID:</span>
              <span className="max-w-[180px] truncate">
                {socketId || "None"}
              </span>
            </div>
          </div>

          <Button
            className="mt-3 w-full"
            size="sm"
            onClick={() => {
              socketService.reconnect();
              setTimeout(() => setShowDetails(false), 5000);
            }}
          >
            Reconnect
          </Button>
        </div>
      )}
    </TooltipProvider>
  );
}
