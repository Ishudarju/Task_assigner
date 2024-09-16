"use client"

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export function EventCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(selectedDate) => setDate(selectedDate)}
      className="rounded-md border-2"
    />
  );
}
