export const formatTimeRemaining = (dateString: string) => {
  if (!dateString) return;
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `${diffMinutes}mins`;
  } else if (diffHours < 24) {
    return `${diffHours}hours`;
  } else {
    return `${diffDays}days`;
  }
};

export const formatDate = (date: Date | undefined): string => {
  if (!date) return "";

  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const hours = String(newDate.getHours()).padStart(2, "0");
  const minutes = String(newDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const roundToThirdDecimal = (number: number | undefined) => {
  if (!number) return 0;
  return Math.round(number * 100) / 100;
};
