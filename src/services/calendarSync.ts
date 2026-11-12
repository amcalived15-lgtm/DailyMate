import { Task } from '../types/task';

/**
 * Format Date & Time into iCalendar / Google Calendar UTC string: YYYYMMDDTHHMMSSZ
 */
export function formatCalendarDateTime(dateStr: string, timeStr: string, durationMinutes = 60): { start: string; end: string } {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');

    const toCalString = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    return {
      start: toCalString(startDate),
      end: toCalString(endDate),
    };
  } catch {
    const now = new Date();
    return {
      start: now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: new Date(now.getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    };
  }
}

/**
 * Generate Google Calendar Direct Event Link
 */
export function generateGoogleCalendarUrl(task: Task): string {
  const { start, end } = formatCalendarDateTime(task.date, task.time);
  const title = encodeURIComponent(task.title);
  
  let detailsText = task.notes ? `${task.notes}\n\n` : '';
  detailsText += `Prioritas: ${task.priority}\nKategori: ${task.categoryId}\nPengingat DailyMate`;
  if (task.subtasks && task.subtasks.length > 0) {
    detailsText += `\n\nLangkah-langkah:\n` + task.subtasks.map(s => `- [${s.completed ? 'x' : ' '}] ${s.title}`).join('\n');
  }

  const details = encodeURIComponent(detailsText);
  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;

  // Add recurrence rule if specified
  if (task.recurrence === 'Setiap Hari') {
    url += '&recur=RRULE:FREQ=DAILY';
  } else if (task.recurrence === 'Setiap Senin') {
    url += '&recur=RRULE:FREQ=WEEKLY;BYDAY=MO';
  } else if (task.recurrence === 'Setiap Minggu') {
    url += '&recur=RRULE:FREQ=WEEKLY';
  } else if (task.recurrence === 'Setiap Bulan') {
    url += '&recur=RRULE:FREQ=MONTHLY';
  }

  return url;
}

/**
 * Generate standard .ics (iCalendar) content for Apple Calendar, Outlook, Google Calendar
 */
export function generateICS(tasks: Task[]): string {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DailyMate//Asisten Aktivitas Harian//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:DailyMate Tugas & Aktivitas',
  ];

  tasks.forEach((task) => {
    const { start, end } = formatCalendarDateTime(task.date, task.time);
    const uid = `${task.id}@dailymate.app`;
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let description = task.notes || '';
    if (task.subtasks && task.subtasks.length > 0) {
      description += '\\nLangkah:\\n' + task.subtasks.map(s => `- ${s.title}`).join('\\n');
    }

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:${uid}`);
    ics.push(`DTSTAMP:${now}`);
    ics.push(`DTSTART:${start}`);
    ics.push(`DTEND:${end}`);
    ics.push(`SUMMARY:${task.title}`);
    ics.push(`DESCRIPTION:${description}`);
    ics.push(`CATEGORIES:${task.categoryId}`);

    if (task.recurrence === 'Setiap Hari') {
      ics.push('RRULE:FREQ=DAILY');
    } else if (task.recurrence === 'Setiap Senin') {
      ics.push('RRULE:FREQ=WEEKLY;BYDAY=MO');
    } else if (task.recurrence === 'Setiap Minggu') {
      ics.push('RRULE:FREQ=WEEKLY');
    } else if (task.recurrence === 'Setiap Bulan') {
      ics.push('RRULE:FREQ=MONTHLY');
    }

    // Add alarm/reminder
    if (task.reminderEnabled) {
      ics.push('BEGIN:VALARM');
      ics.push('ACTION:DISPLAY');
      ics.push(`DESCRIPTION:Pengingat DailyMate: ${task.title}`);
      ics.push(`TRIGGER:-PT${task.reminderMinutesBefore || 10}M`);
      ics.push('END:VALARM');
    }

    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

/**
 * Trigger download of .ics file
 */
export function downloadICS(tasks: Task[], filename = 'DailyMate-Jadwal.ics') {
  const content = generateICS(tasks);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Basic ICS file parser to import calendar events into DailyMate tasks
 */
export function parseICS(icsText: string): Partial<Task>[] {
  const lines = icsText.split(/\r\n|\n|\r/);
  const importedTasks: Partial<Task>[] = [];
  let currentTask: Partial<Task> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === 'BEGIN:VEVENT') {
      currentTask = {
        title: 'Tugas Impor',
        completed: false,
        priority: 'Sedang',
        categoryId: 'pribadi',
        reminderEnabled: true,
        reminderMinutesBefore: 10,
        subtasks: [],
      };
    } else if (line === 'END:VEVENT' && currentTask) {
      if (currentTask.title && currentTask.date) {
        importedTasks.push(currentTask);
      }
      currentTask = null;
    } else if (currentTask) {
      if (line.startsWith('SUMMARY:')) {
        currentTask.title = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        currentTask.notes = line.replace('DESCRIPTION:', '').replace(/\\n/g, '\n').trim();
      } else if (line.startsWith('DTSTART:')) {
        const val = line.replace('DTSTART:', '').trim();
        // format YYYYMMDDTHHMMSS or YYYYMMDD
        if (val.length >= 8) {
          const y = val.substring(0, 4);
          const m = val.substring(4, 6);
          const d = val.substring(6, 8);
          currentTask.date = `${y}-${m}-${d}`;
          if (val.includes('T')) {
            const timePart = val.split('T')[1];
            if (timePart.length >= 4) {
              currentTask.time = `${timePart.substring(0, 2)}:${timePart.substring(2, 4)}`;
            }
          }
        }
      }
    }
  }

  return importedTasks;
}
