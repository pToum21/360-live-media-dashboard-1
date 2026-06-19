'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  event?: any;
  initialDate?: Date | null;
}

const CATEGORIES = [
  'General',
  'Important Date',
  'ATC Attendee Marketing',
  'ATC Exhibitor Marketing',
  'ASTS Email & Social Marketing',
  'AST Email & Social Marketing',
  'ATC Public Relations',
  'ATC Site Update',
];

const CATEGORY_COLORS: Record<string, string> = {
  'Important Date': '#FF6B6B',
  'ATC Attendee Marketing': '#4ECDC4',
  'ATC Exhibitor Marketing': '#45B7D1',
  'ASTS Email & Social Marketing': '#96CEB4',
  'AST Email & Social Marketing': '#FFEAA7',
  'ATC Public Relations': '#DFE6E9',
  'ATC Site Update': '#A29BFE',
  'General': '#95A5A6',
};

const STATUSES = ['Planned', 'In Progress', 'Completed', 'Cancelled'];

export function CalendarEventDialog({
  open,
  onOpenChange,
  clientId,
  event,
  initialDate,
}: CalendarEventDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    allDay: true,
    category: 'General',
    color: '#95A5A6',
    description: '',
    location: '',
    url: '',
    notes: '',
    status: 'Planned',
  });

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setFormData({
        title: event.title || '',
        date: eventDate.toISOString().split('T')[0],
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        allDay: event.allDay !== false,
        category: event.category || 'General',
        color: event.color || '#95A5A6',
        description: event.description || '',
        location: event.location || '',
        url: event.url || '',
        notes: event.notes || '',
        status: event.status || 'Planned',
      });
    } else if (initialDate) {
      setFormData((prev) => ({
        ...prev,
        date: initialDate.toISOString().split('T')[0],
      }));
    } else {
      // Reset form
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        allDay: true,
        category: 'General',
        color: '#95A5A6',
        description: '',
        location: '',
        url: '',
        notes: '',
        status: 'Planned',
      });
    }
  }, [event, initialDate, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = event ? `/api/calendar/${event.id}` : '/api/calendar';
      const method = event ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      toast({
        title: 'Success',
        description: `Event ${event ? 'updated' : 'created'} successfully`,
      });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData({
      ...formData,
      category,
      color: CATEGORY_COLORS[category] || '#95A5A6',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
          <DialogDescription>
            {event
              ? 'Update the event details below.'
              : 'Create a new calendar event for your marketing activities.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="e.g., Email Campaign Launch"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time (Optional)</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startTime: e.target.value,
                      allDay: false,
                    })
                  }
                  disabled={formData.allDay}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time (Optional)</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endTime: e.target.value,
                      allDay: false,
                    })
                  }
                  disabled={formData.allDay}
                />
              </div>
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allDay"
                checked={formData.allDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allDay: e.target.checked,
                    startTime: e.target.checked ? '' : formData.startTime,
                    endTime: e.target.checked ? '' : formData.endTime,
                  })
                }
                className="rounded"
              />
              <Label htmlFor="allDay" className="cursor-pointer">
                All Day Event
              </Label>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[category] }}
                          />
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the event..."
                rows={3}
              />
            </div>

            {/* Location and URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Conference Room A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes or reminders..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? 'Save Changes' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
