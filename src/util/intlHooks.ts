import React from 'react';

interface DateTimeFormatHookOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
}
export function useDateTimeFormat(
  date: string,
  {
    locale = 'en-us',
    localeMatcher,
    weekday,
    era,
    year,
    month,
    day,
    hour,
    minute,
    second,
    timeZoneName,
    formatMatcher,
    hour12,
    timeZone,
  }: DateTimeFormatHookOptions = {},
) {
  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        localeMatcher,
        weekday,
        era,
        year,
        month,
        day,
        hour,
        minute,
        second,
        timeZoneName,
        formatMatcher,
        hour12,
        timeZone,
      }),
    [
      locale,
      localeMatcher,
      weekday,
      era,
      year,
      month,
      day,
      hour,
      minute,
      second,
      timeZoneName,
      formatMatcher,
      hour12,
      timeZone,
    ],
  );

  return React.useMemo(() => {
    try {
      return formatter.format(new Date(date));
    } catch (e) {
      return date;
    }
  }, [formatter, date]);
}
