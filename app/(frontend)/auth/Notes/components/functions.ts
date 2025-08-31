import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import { generateHTML } from "@tiptap/html";
import { formatDistanceToNow } from "date-fns";

export function renderHtml(content: string) {
  if (!content) console.log(content);

  // console.log(content);
  return generateHTML(JSON.parse(content), [
    CharacterCount,
    OrderedList,
    BulletList,
    TextAlign,
    Underline,
    StarterKit,
    Heading,
  ]);
}

export function formatDateToNow(createdAt: Date) {
  const distance = formatDistanceToNow(createdAt);

  if (distance.includes("about")) {
    const parts = distance.split(" ");

    return `${parts[1]} ${parts[2]} ago`;
  }

  return `${distance} ago`;
}


export const jsonData = {
  type: 'doc',
  content: [
      {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [{ type: 'text', text: 'Hello World! 🌎️' }]
      },
      {
          type: 'bulletList',
          content: [
              {
                  type: 'listItem',
                  content: [
                      {
                          type: 'paragraph',
                          attrs: { textAlign: 'left' },
                          content: [{ type: 'text', text: 'Welcome to Notes App' }]
                      }
                  ]
              },
              {
                  type: 'listItem',
                  content: [
                      {
                          type: 'paragraph',
                          attrs: { textAlign: 'left' },
                          content: [{ type: 'text', text: 'New Added' }]
                      }
                  ]
              }
          ]
      }
  ]
}
