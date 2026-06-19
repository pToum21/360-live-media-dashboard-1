import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { CalendarView } from '@/components/calendar/calendar-view';
import { CalendarManagement } from '@/components/dashboard/calendar-management';
import { getSelectedClientId } from '@/lib/get-selected-client';

export default async function CalendarPage() {
  // Get the selected client ID
  const clientId = await getSelectedClientId();

  // Get calendar events for the client
  const events = await prisma.calendarEvent.findMany({
    where: { clientId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { date: 'asc' },
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Plan and track your marketing campaigns and events
          </p>
        </div>
      </div>

      {/* Calendar View */}
      <Suspense fallback={<div>Loading calendar...</div>}>
        <CalendarView events={events} clientId={clientId} />
      </Suspense>

      {/* Event Management Table */}
      <div className="mt-8">
        <CalendarManagement events={events} clientId={clientId} />
      </div>
    </div>
  );
}
