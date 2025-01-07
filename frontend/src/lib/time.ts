export function formatDate(createdAt: string): string {
  const date = new Date(createdAt);
  const hours = date.getHours();
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}, ${hours % 12 || 12}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
  return formattedDate;
}
