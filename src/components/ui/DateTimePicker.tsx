import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

/*
 * Pick a day on a month calendar, then a 30-minute slot. The value is a local
 * "YYYY-MM-DD" (day only) or "YYYY-MM-DDTHH:mm" string; "" means nothing picked.
 */

const pad = (n: number) => String(n).padStart(2, '0');
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Parses the value as local time (new Date('YYYY-MM-DD') would be UTC). */
function parseValue(value: string): Date | null {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
}

/** True once both a day and a time have been picked. */
export function hasDateAndTime(value: string) {
  return /T\d{2}:\d{2}$/.test(value);
}

/** True when the picked moment is still in the future. */
export function isFuture(value: string) {
  const d = parseValue(value);
  return !!d && (hasDateAndTime(value) ? d.getTime() > Date.now() : dayKey(d) >= dayKey(new Date()));
}

/** Readable form for the lead record, e.g. "Thu, 24 Sep 2026, 11:30 am (Asia/Kolkata)". */
export function formatDateTimeValue(value: string) {
  const d = value ? parseValue(value) : null;
  if (!d) return '';
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  if (hasDateAndTime(value)) Object.assign(opts, { hour: 'numeric', minute: '2-digit' });
  const text = d.toLocaleString(undefined, opts);
  return hasDateAndTime(value) ? `${text} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : text;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** How many days ahead can be picked. */
  maxDays?: number;
  weekdaysOnly?: boolean;
  firstHour?: number;
  lastHour?: number;
}

export default function DateTimePicker({ value, onChange, maxDays = 60, weekdaysOnly = true, firstHour = 10, lastHour = 18 }: Props) {
  const selected = parseValue(value);
  const selectedDay = selected ? dayKey(selected) : '';
  const selectedTime = hasDateAndTime(value) ? value.slice(11, 16) : '';

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const lastDay = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate() + maxDays), [today, maxDays]);
  const [month, setMonth] = useState(() => {
    const base = selected ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const isDisabled = (d: Date) => {
    if (d < today || d > lastDay) return true;
    if (weekdaysOnly && (d.getDay() === 0 || d.getDay() === 6)) return true;
    // Today only while a slot at least an hour away is left.
    if (dayKey(d) === dayKey(today) && new Date().getHours() + 1 >= lastHour) return true;
    return false;
  };

  // Monday-first grid.
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const blanks = (first.getDay() + 6) % 7;
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array<null>(blanks).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  }, [month]);

  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= lastDay;

  const slots = useMemo(() => {
    if (!selected) return [];
    const cutoff = Date.now() + 60 * 60 * 1000;
    const out: string[] = [];
    for (let h = firstHour; h < lastHour; h++) {
      for (const m of [0, 30]) {
        const t = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), h, m);
        if (t.getTime() >= cutoff) out.push(`${pad(h)}:${pad(m)}`);
      }
    }
    return out;
  }, [selectedDay, firstHour, lastHour]); // eslint-disable-line react-hooks/exhaustive-deps

  const slotLabel = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-rule p-3.5 sm:p-4">
        <div className="flex items-center justify-between mb-2.5">
          <button
            type="button"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            disabled={!canPrev}
            className="p-2 rounded-lg text-ink hover:bg-lav disabled:opacity-25 disabled:hover:bg-transparent"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-display font-bold text-ink" aria-live="polite">
            {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            disabled={!canNext}
            className="p-2 rounded-lg text-ink hover:bg-lav disabled:opacity-25 disabled:hover:bg-transparent"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-[11px] font-display font-semibold uppercase text-muted py-1">
              {w}
            </span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={`blank-${i}`} />;
            const disabled = isDisabled(d);
            const active = dayKey(d) === selectedDay;
            const isToday = dayKey(d) === dayKey(today);
            return (
              <button
                key={dayKey(d)}
                type="button"
                disabled={disabled}
                onClick={() => onChange(dayKey(d))}
                aria-pressed={active}
                aria-label={d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                className={`aspect-square max-h-10 w-full rounded-xl font-display text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-accent text-white shadow-sm shadow-accent/30'
                    : disabled
                    ? 'text-muted/40 cursor-not-allowed'
                    : `text-ink hover:bg-lav ${isToday ? 'ring-1 ring-accent/50' : ''}`
                }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
        {weekdaysOnly && <p className="mt-2.5 text-xs text-muted">Calls run Monday to Friday.</p>}
      </div>

      {selectedDay && (
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-display font-semibold text-ink">
              <Clock className="w-4 h-4 text-accent" /> Pick a time
            </span>
            <span className="text-[11px] text-muted truncate">Your time zone: {tz}</span>
          </div>
          {slots.length ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
              {slots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange(`${selectedDay}T${t}`)}
                  aria-pressed={selectedTime === t}
                  className={`py-2 rounded-xl border text-sm font-display font-semibold transition-colors ${
                    selectedTime === t ? 'bg-ink text-paper border-ink' : 'border-rule text-ink hover:border-accent hover:text-accent'
                  }`}
                >
                  {slotLabel(t)}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No times left on this day. Pick another day.</p>
          )}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl bg-lav px-4 py-3">
        <CalendarDays className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-ink" aria-live="polite">
          {selectedDay ? (
            <>
              <span className="font-display font-semibold">{formatDateTimeValue(value)}</span>
              {!selectedTime && <span className="text-muted"> · now pick a time</span>}
            </>
          ) : (
            <span className="text-muted">No date picked yet.</span>
          )}
        </p>
      </div>
    </div>
  );
}
