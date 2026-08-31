import { useEffect, useMemo, useState } from 'react';

type Habit = {
  id: string;
  name: string;
  createdOn: string;
  completedOn: string[];
};

const STORAGE_KEY = 'streak.habits.v1';

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromKey(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

function shift(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
}

function rangeForWeeks(weeks: number, today: Date) {
  const sunday = shift(today, -today.getDay());
  const start = shift(sunday, -(weeks - 1) * 7);
  return Array.from({ length: weeks * 7 }, (_, index) => shift(start, index));
}

function streaks(habit: Habit, todayKey: string) {
  const done = new Set(habit.completedOn);
  const today = fromKey(todayKey);
  let cursor = done.has(todayKey) ? today : shift(today, -1);
  let current = 0;

  while (dateKey(cursor) >= habit.createdOn && done.has(dateKey(cursor))) {
    current += 1;
    cursor = shift(cursor, -1);
  }

  let best = 0;
  let run = 0;
  for (
    let day = fromKey(habit.createdOn);
    dateKey(day) <= todayKey;
    day = shift(day, 1)
  ) {
    if (done.has(dateKey(day))) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }

  return { current, best };
}

function HistoryGrid({ habit, weeks, todayKey, large = false }: {
  habit: Habit;
  weeks: number;
  todayKey: string;
  large?: boolean;
}) {
  const dates = useMemo(() => rangeForWeeks(weeks, fromKey(todayKey)), [weeks, todayKey]);
  const completed = new Set(habit.completedOn);

  return (
    <div
      className={`history-grid ${large ? 'history-grid--large' : ''}`}
      style={{ '--weeks': weeks } as React.CSSProperties}
      aria-label={`${weeks}-week completion history for ${habit.name}`}
    >
      {dates.map((date) => {
        const key = dateKey(date);
        const isToday = key === todayKey;
        const isFuture = key > todayKey;
        const isUntracked = key < habit.createdOn;
        const isDone = completed.has(key);
        const state = isDone ? 'completed' : isFuture ? 'future' : isUntracked ? 'not tracked' : isToday ? 'not completed yet' : 'missed';

        return (
          <span
            className={`day-cell ${isDone ? 'is-done' : ''} ${isFuture || isUntracked ? 'is-blank' : ''} ${isToday ? 'is-today' : ''}`}
            key={key}
            title={`${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}: ${state}`}
          />
        );
      })}
    </div>
  );
}

export default function StreakApp() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newHabit, setNewHabit] = useState('');
  const [todayKey, setTodayKey] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let savedHabits: Habit[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) savedHabits = JSON.parse(saved) as Habit[];
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    queueMicrotask(() => {
      setTodayKey(dateKey());
      setHabits(savedHabits);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits, ready]);

  useEffect(() => {
    const updateDate = () => setTodayKey(dateKey());
    window.addEventListener('focus', updateDate);
    document.addEventListener('visibilitychange', updateDate);
    return () => {
      window.removeEventListener('focus', updateDate);
      document.removeEventListener('visibilitychange', updateDate);
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    requestAnimationFrame(() => {
      const scroller = document.querySelector<HTMLElement>('.history-scroll');
      if (scroller) scroller.scrollLeft = scroller.scrollWidth;
    });
  }, [selectedId]);

  function addHabit(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    const name = newHabit.trim();
    if (!name) return;
    setHabits((items) => [...items, {
      id: crypto.randomUUID(),
      name: name.slice(0, 60),
      createdOn: todayKey,
      completedOn: [],
    }]);
    setNewHabit('');
  }

  function toggleToday(id: string) {
    setHabits((items) => items.map((habit) => {
      if (habit.id !== id) return habit;
      const completed = new Set(habit.completedOn);
      if (completed.has(todayKey)) completed.delete(todayKey);
      else completed.add(todayKey);
      return { ...habit, completedOn: [...completed].sort() };
    }));
  }

  function deleteHabit(habit: Habit) {
    if (!window.confirm(`Delete “${habit.name}” and all its history?`)) return;
    setHabits((items) => items.filter((item) => item.id !== habit.id));
    setSelectedId(null);
  }

  const selected = habits.find((habit) => habit.id === selectedId);
  const todayLabel = todayKey
    ? fromKey(todayKey).toLocaleDateString(undefined, {
        weekday: 'long', month: 'long', day: 'numeric',
      })
    : '';

  if (selected) {
    const stats = streaks(selected, todayKey);
    const done = selected.completedOn.includes(todayKey);
    return (
      <main className="app-shell">
        <section className="history-view">
          <button className="back-button" onClick={() => setSelectedId(null)}>
            <span aria-hidden="true">←</span> Today
          </button>
          <div className="detail-heading">
            <div>
              <p className="eyebrow">Habit history</p>
              <h1>{selected.name}</h1>
            </div>
            <button
              className={`today-toggle today-toggle--detail ${done ? 'is-complete' : ''}`}
              onClick={() => toggleToday(selected.id)}
              aria-pressed={done}
            >
              <span className="checkmark" aria-hidden="true">✓</span>
              {done ? 'Done today' : 'Mark done'}
            </button>
          </div>

          <div className="stat-row">
            <div className="stat"><strong>{stats.current}</strong><span>Current streak</span></div>
            <div className="stat"><strong>{stats.best}</strong><span>Best streak</span></div>
          </div>

          <section className="year-card" aria-labelledby="year-title">
            <div className="section-heading">
              <h2 id="year-title">Past year</h2>
              <span>53 weeks</span>
            </div>
            <div className="history-scroll">
              <HistoryGrid habit={selected} weeks={53} todayKey={todayKey} large />
            </div>
            <div className="legend" aria-hidden="true">
              <span><i className="day-cell is-done" /> Completed</span>
              <span><i className="day-cell" /> Missed</span>
              <span><i className="day-cell is-blank" /> Future</span>
              <span><i className="day-cell is-today" /> Today</span>
            </div>
          </section>

          <button className="delete-button" onClick={() => deleteHabit(selected)}>Delete habit</button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="today-view">
        <header className="topbar">
          <div>
            <p className="eyebrow">{ready ? todayLabel : 'Your daily habits'}</p>
            <h1>Today</h1>
          </div>
          {habits.length > 0 && (
            <p className="daily-count">
              {habits.filter((habit) => habit.completedOn.includes(todayKey)).length}
              <span> / {habits.length}</span>
            </p>
          )}
        </header>

        <form className="add-form" onSubmit={addHabit}>
          <label className="sr-only" htmlFor="habit-name">Habit name</label>
          <input
            id="habit-name"
            value={newHabit}
            onChange={(event) => setNewHabit(event.target.value)}
            placeholder="Add a daily habit"
            autoComplete="off"
            maxLength={60}
          />
          <button type="submit" disabled={!newHabit.trim()} aria-label="Add habit"><span aria-hidden="true">+</span></button>
        </form>

        {!ready ? (
          <div className="empty-state" aria-label="Loading habits" />
        ) : habits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-grid" aria-hidden="true">
              {Array.from({ length: 28 }, (_, index) => <i key={index} />)}
            </div>
            <h2>Start a chain</h2>
            <p>Add one small thing you want to do every day.</p>
          </div>
        ) : (
          <div className="habit-list">
            {habits.map((habit) => {
              const done = habit.completedOn.includes(todayKey);
              const stats = streaks(habit, todayKey);
              return (
                <article className="habit-card" key={habit.id}>
                  <div className="habit-card__top">
                    <button className="habit-link" onClick={() => setSelectedId(habit.id)}>
                      <span className="habit-name">{habit.name}</span>
                      <span className="habit-streak">{stats.current} day streak <b aria-hidden="true">›</b></span>
                    </button>
                    <button
                      className={`today-toggle ${done ? 'is-complete' : ''}`}
                      onClick={() => toggleToday(habit.id)}
                      aria-label={done ? `Undo ${habit.name} for today` : `Complete ${habit.name} for today`}
                      aria-pressed={done}
                    >
                      <span className="checkmark" aria-hidden="true">✓</span>
                    </button>
                  </div>
                  <button className="mini-history" onClick={() => setSelectedId(habit.id)} aria-label={`Open history for ${habit.name}`}>
                    <HistoryGrid habit={habit} weeks={12} todayKey={todayKey} />
                  </button>
                </article>
              );
            })}
          </div>
        )}
        <p className="storage-note">Saved on this device</p>
      </section>
    </main>
  );
}
