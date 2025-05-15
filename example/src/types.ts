import { Highlight, Content } from "./react-pdf-highlighter-optimized";

export interface CommentedHighlight extends Highlight {
  content: Content;
  comment?: string;
}
