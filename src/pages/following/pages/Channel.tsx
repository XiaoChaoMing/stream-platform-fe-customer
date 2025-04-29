import React from "react";

const Channel = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Followed Channels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholder for channels - would be populated from an API in real implementation */}
        {Array(10).fill(0).map((_, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-muted-foreground/20 animate-pulse"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 bg-muted-foreground/20 rounded animate-pulse w-32 mb-1"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-24"></div>
                  </div>
                  <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm">Following</button>
                </div>
                <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-full mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channel;
