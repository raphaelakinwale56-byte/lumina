export async function askAI(message: string) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error('AI request failed');
  }

  const data = await res.json();
  return data.reply;
}