import React from 'react'

export const MusicLoader = () => {
  return (
    <div className="mt-6">
                    <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/30 border border-border/50 shadow-inner">
                        <div className="w-12 h-12 rounded-md bg-muted animate-pulse"></div>
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium">Loading...</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                                <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
  )
}
