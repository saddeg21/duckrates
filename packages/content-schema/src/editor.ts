import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";

export const editorExtensions = [
  StarterKit,
  Image,
  Link.configure({ openOnClick: false }),
  Underline,
];
