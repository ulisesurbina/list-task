export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function combineDateTimeAndFormat(date: Date, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const combinedDateTime = new Date(date);
  combinedDateTime.setHours(hours, minutes, 0, 0);
  return formatDate(combinedDateTime);
}

export function parseAndFormatDate(dateString: string): string {
  const date = new Date(dateString);
  return formatDate(date);
}
