
export const EUPHRAT_NODES = [
  "doc",
  "paragraph",
  "heading",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "bulletList",
  "orderedList",
  "listItem",
  "image",
  "hardBreak",
] as const;

export const EUPHRAT_MARKS = [
  "bold",
  "italic",
  "underline",
  "strike",
  "code",
  "link",
] as const;

export type EuphratNodeType = (typeof EUPHRAT_NODES)[number];
export type EuphratMarkType = (typeof EUPHRAT_MARKS)[number];
