import { Session, Message } from '@/types';

export function exportConversationAsText(session: Session): string {
  const header = `MindMate Conversation Export
Date: ${new Date(session.createdAt).toLocaleString()}
Session ID: ${session.id}
${'='.repeat(50)}

`;

  const messages = session.messages
    .map((msg) => {
      const sender = msg.sender === 'user' ? 'You' : 'MindMate';
      const time = new Date(msg.timestamp).toLocaleTimeString();
      return `[${time}] ${sender}:\n${msg.text}\n`;
    })
    .join('\n');

  const footer = `\n${'='.repeat(50)}
Topics discussed: ${session.context.topics.join(', ') || 'None'}
Total messages: ${session.messages.length}

This conversation was exported from MindMate.
If you're in crisis, please call 988 or text HOME to 741741.
`;

  return header + messages + footer;
}

export function exportConversationAsJSON(session: Session): string {
  return JSON.stringify(session, null, 2);
}

export function exportConversationAsMarkdown(session: Session): string {
  const header = `# MindMate Conversation

**Date:** ${new Date(session.createdAt).toLocaleString()}  
**Session ID:** ${session.id}

---

`;

  const messages = session.messages
    .map((msg) => {
      const sender = msg.sender === 'user' ? '**You**' : '**MindMate**';
      const time = new Date(msg.timestamp).toLocaleTimeString();
      return `### ${sender} _(${time})_\n\n${msg.text}\n`;
    })
    .join('\n');

  const footer = `\n---

**Topics discussed:** ${session.context.topics.join(', ') || 'None'}  
**Total messages:** ${session.messages.length}

> This conversation was exported from MindMate.  
> If you're in crisis, please call 988 or text HOME to 741741.
`;

  return header + messages + footer;
}

export function downloadConversation(
  session: Session,
  format: 'text' | 'json' | 'markdown' = 'text'
) {
  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'json':
      content = exportConversationAsJSON(session);
      mimeType = 'application/json';
      extension = 'json';
      break;
    case 'markdown':
      content = exportConversationAsMarkdown(session);
      mimeType = 'text/markdown';
      extension = 'md';
      break;
    default:
      content = exportConversationAsText(session);
      mimeType = 'text/plain';
      extension = 'txt';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const date = new Date(session.createdAt).toISOString().split('T')[0];
  link.href = url;
  link.download = `mindmate-conversation-${date}.${extension}`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
