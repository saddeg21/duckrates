export function uploadMedia(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to upload media");
    }
    return res.json();
  });
}
