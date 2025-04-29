import React from "react";

const Video = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Videos</h2>
      <div className="flex mb-4 gap-2">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">All Videos</button>
        <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md">Streams</button>
        <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md">Clips</button>
        <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md">Past Broadcasts</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Placeholder for videos - would be populated from an API in real implementation */}
        {Array(12).fill(0).map((_, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow">
            <div className="aspect-video bg-muted-foreground/20 animate-pulse"></div>
            <div className="p-3">
              <div className="h-4 bg-muted-foreground/20 rounded animate-pulse mb-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted-foreground/20 animate-pulse"></div>
                <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-1/3"></div>
              </div>
              <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-1/2 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Video;
