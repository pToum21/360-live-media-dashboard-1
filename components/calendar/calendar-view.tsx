'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEventDialog } from '@/components/forms/calendar-event-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  description?: string | null;
  category?: string | null;
  color?: string | null;
  status?: string | null;
  allDay?: boolean;
}

interface CalendarViewProps {
  events: any[];
  clientId: string;
}

const CATEGORIES = [
  'All Categories',
  'Important Date',
  'ATC Attendee Marketing',
  'ATC Exhibitor Marketing',
  'ASTS Email & Social Marketing',
  'AST Email & Social Marketing',
  'ATC Public Relations',
  'ATC Site Update',
  'General',
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView({ events, clientId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Convert event dates to Date objects
  const parsedEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      date: new Date(event.date),
    }));
  }, [events]);

  // Filter events by category
  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All Categories') {
      return parsedEvents;
    }
    return parsedEvents.filter((event) => event.category === selectedCategory);
  }, [parsedEvents, selectedCategory]);

  // Get calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    // Previous month days
    const prevMonthDays = firstDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      events: CalendarEvent[];
    }> = [];

    // Add previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        events: [],
      });
    }

    // Add current month days
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      const dayEvents = filteredEvents.filter(
        (event) =>
          event.date.getDate() === i &&
          event.date.getMonth() === month &&
          event.date.getFullYear() === year
      );

      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        events: dayEvents,
      });
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        events: [],
      });
    }

    return days;
  }, [currentDate, filteredEvents]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddDialogOpen(true);
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      <Card className="glass-panel">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {monthName}
          </CardTitle>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Event Button */}
            <Button
              onClick={() => {
                setSelectedDate(null);
                setIsAddDialogOpen(true);
              }}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Calendar Grid */}
          <div className="border-t">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b last-in-row:border-r-0 p-2 cursor-pointer transition-colors hover:bg-muted/30 ${
                    !day.isCurrentMonth ? 'bg-muted/10' : ''
                  } ${
                    day.date.toDateString() === new Date().toDateString()
                      ? 'bg-primary/5 border-primary/20'
                      : ''
                  }`}
                  onClick={() => handleDayClick(day.date)}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      !day.isCurrentMonth
                        ? 'text-muted-foreground/40'
                        : day.date.toDateString() === new Date().toDateString()
                        ? 'text-primary font-bold'
                        : 'text-foreground'
                    }`}
                  >
                    {day.dayNumber}
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1">
                    {day.events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1.5 rounded truncate transition-all hover:shadow-sm"
                        style={{
                          backgroundColor: event.color || '#3B82F6',
                          color: 'white',
                        }}
                        title={event.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Could open event detail dialog here
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {day.events.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-1.5">
                        +{day.events.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Event Dialog */}
      <CalendarEventDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        clientId={clientId}
        initialDate={selectedDate}
      />
    </>
  );
}
