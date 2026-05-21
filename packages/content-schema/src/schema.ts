import { Schema } from "@tiptap/pm/model";
import { EUPHRAT_NODES, EUPHRAT_MARKS } from "./nodes.ts";

export const contentSchema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { group: "block", content: "inline*" },
    heading: {
      group: "block",
      content: "inline*",
      attrs: { level: { default: 1 } },
    },
    blockquote: { group: "block", content: "block+" },
    codeBlock: { group: "block", content: "text*" },
    horizontalRule: { group: "block" },
    bulletList: { group: "block", content: "listItem+" },
    orderedList: { group: "block", content: "listItem+" },
    listItem: { content: "paragraph block*" },
    image: { group: "block", attrs: { src: {}, alt: { default: null } } },
    text: { group: "inline" },
    hardBreak: { group: "inline" },
  },
  marks: {
    bold: {},
    italic: {},
    underline: {},
    strike: {},
    code: {},
    link: { attrs: { href: {}, title: { default: null } } },
  },
});
