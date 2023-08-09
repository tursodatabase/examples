export function resizeImage(url: string, height: number, width: number) {
  return url.replace(/\/v[0-9]+/, `/c_lfill,g_center,h_${height},w_${width}`);
}

export function getCategoryImage(category: string) {
  const imageUrl = `https://res.cloudinary.com/djx5h4cjt/image/upload/v1686305552/twitpics/mug-club/${category}-mugs.jpg`;
  return resizeImage(imageUrl, 400, 400);
}

export function formatDate(date: number) {
  const day = new Date(date * 1000);

  const formattedDate = Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(day);

  return formattedDate;
}
