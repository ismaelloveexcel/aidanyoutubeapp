import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "upload" | "filming" | "editing" | "reminder";
  status: "pending" | "completed";
}

export default function Calendar() {
  // Create dates relative to today for the default events
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Film Gaming Video", date: tomorrow, type: "filming", status: "pending" },
    { id: "2", title: "Upload Top 10 Video", date: nextWeek, type: "upload", status: "pending" },
  ]);
  const [showDialog, setShowDialog] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventType, setNewEventType] = useState<CalendarEvent["type"]>("filming");
  const { toast } = useToast();

  const addEvent = () => {
    if (!newEventTitle || !newEventDate) {
      toast({ title: "Error", description: "Please fill all fields" });
      return;
    }

    const newEvent: CalendarEvent = {
      id: Math.random().toString(36),
      title: newEventTitle,
      date: new Date(newEventDate),
      type: newEventType,
      status: "pending",
    };

    setEvents([...events, newEvent]);
    setNewEventTitle("");
    setNewEventDate("");
    setShowDialog(false);

    toast({
      title: "Event Added!",
      description: `"${newEventTitle}" scheduled for ${new Date(newEventDate).toLocaleDateString()}`,
    });
  };

  const toggleStatus = (id: string) => {
    setEvents(events.map(e =>
      e.id === id ? { ...e, status: e.status === "pending" ? "completed" : "pending" } : e
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getTypeEmoji = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "filming": return "🎬";
      case "editing": return "✂️";
      case "upload": return "📤";
      case "reminder": return "⏰";
    }
  };

  const upcomingEvents = events.filter(e => e.date >= new Date() && e.status === "pending");
  const completedEvents = events.filter(e => e.status === "completed");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">📅 Content Calendar</h1>
        <p className="text-gray-400">Plan your uploads and stay consistent</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl">📌 Upcoming</h2>
        <Button onClick={() => setShowDialog(true)}>+ Add Event</Button>
      </div>

      {upcomingEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📆</div>
            <p className="text-gray-400">No upcoming events. Plan your content!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingEvents.map(event => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getTypeEmoji(event.type)} {event.title}
                    </CardTitle>
                    <div className="text-sm text-gray-400 mt-1">
                      {event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(event.id)}>
                      ✓
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
                      🗑️
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {completedEvents.length > 0 && (
        <>
          <h2 className="font-display text-2xl">✅ Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
            {completedEvents.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getTypeEmoji(event.type)} {event.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Calendar Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="e.g., Film new video"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Event Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(["filming", "editing", "upload", "reminder"] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setNewEventType(type)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      newEventType === type
                        ? "border-[hsl(320,100%,50%)] bg-[hsl(320,100%,50%)] bg-opacity-20"
                        : "border-[hsl(240,10%,20%)] hover:border-[hsl(240,10%,30%)]"
                    }`}
                  >
                    {getTypeEmoji(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={addEvent} className="w-full">Add Event</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>💡 Consistency Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Pick a Schedule</h4>
              <p className="text-sm text-gray-400">Upload same day each week (e.g., every Saturday)</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Batch Film</h4>
              <p className="text-sm text-gray-400">Record 2-3 videos in one session</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Edit Ahead</h4>
              <p className="text-sm text-gray-400">Have 1-2 videos ready to upload</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Use Reminders</h4>
              <p className="text-sm text-gray-400">Set calendar alerts so you never miss an upload</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
