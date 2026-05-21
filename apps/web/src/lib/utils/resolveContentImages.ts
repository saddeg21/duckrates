type PmNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PmNode[];
};

export async function resolveContentImages(
  doc: object,
  uploadFn: (file: File) => Promise<{ url: string }>,
): Promise<object> {
  const clone = JSON.parse(JSON.stringify(doc)) as PmNode;

  async function walk(node: PmNode): Promise<void> {
    if (
      node.type === "image" &&
      typeof node.attrs?.src === "string" &&
      node.attrs.src.startsWith("blob:")
    ) {
      const res = await fetch(node.attrs.src);
      const blob = await res.blob();
      const file = new File([blob], "image", { type: blob.type });
      const { url } = await uploadFn(file);
      node.attrs.src = url;
    }
    if (node.content) {
      await Promise.all(node.content.map(walk));
    }
  }

  await walk(clone);
  return clone;
}
