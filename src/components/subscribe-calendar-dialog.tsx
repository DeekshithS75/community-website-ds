"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { CalendarPlus, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/u/0/r/settings/addbyurl";

interface SubscribeCalendarDialogProps {
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
}

export function SubscribeCalendarDialog({
  size = "sm",
  className,
}: SubscribeCalendarDialogProps) {
  const [feedUrl, setFeedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    setFeedUrl(`${window.location.origin}/api/v1/calendar/subscribe`);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={size} className={className}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to DK24 Calendar</DialogTitle>
          <DialogDescription>
            Subscribe to our calendar to keep track of upcoming community
            events.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Calendar Feed URL</p>

            <div className="flex gap-2">
              <div className="min-w-0 flex-1 break-all rounded-md border bg-muted p-3 text-sm">
                {feedUrl || "Loading feed URL..."}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!feedUrl}
                aria-label="Copy calendar feed URL"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {copied && (
              <output className="text-sm text-green-600">Copied!</output>
            )}

            {copyError && (
              <p className="text-sm text-destructive" role="alert">
                Unable to copy the URL. Please copy it manually.
              </p>
            )}
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={!feedUrl}
            onClick={() =>
              window.open(GOOGLE_CALENDAR_URL, "_blank", "noopener,noreferrer")
            }
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add to Google Calendar
          </Button>

          <p className="text-xs text-muted-foreground">
            You can also paste the copied URL into Apple Calendar, Outlook, or
            another application that supports subscribed calendars.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
