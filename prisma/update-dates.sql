UPDATE tickets SET
  "dayLabel" = REPLACE(REPLACE(REPLACE(REPLACE(
    "dayLabel",
    '27 June', '11 July'),
    '28 June', '12 July'),
    '27–28 June', '10–12 July'),
    'Saturday Night', 'Fri/Sat Night'),
  description = REPLACE(REPLACE(REPLACE(REPLACE(
    description,
    'Saturday June 27', 'Saturday July 11'),
    'Sunday June 28', 'Sunday July 12'),
    'June 27 and Sunday June 28', 'July 11 and Sunday July 12'),
    'Spaarnwoude', 'Hilvarenbeek');
