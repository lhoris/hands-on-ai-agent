#!/usr/bin/env node
import React, { useState } from 'react';
import { Box, Text, render, useApp, useInput } from 'ink';
import { runPromptChain } from './chain.js';
import { getLlmMode } from './llm-client.js';

function Header() {
  return React.createElement(
    Box,
    {
      borderStyle: 'round',
      borderColor: 'cyan',
      paddingX: 1
    },
    React.createElement(Text, { color: 'cyan', bold: true }, 'Prompt Chaining')
  );
}

function History({ items }) {
  if (items.length === 0) {
    return React.createElement(
      Box,
      { marginY: 1 },
      React.createElement(
        Text,
        { color: 'gray' },
        'Type a request and press Enter. Press Ctrl+C to exit.'
      )
    );
  }

  return React.createElement(
    Box,
    { flexDirection: 'column', marginY: 1 },
    items.map((item, index) =>
      React.createElement(
        Text,
        {
          key: `${item.role}-${index}`,
          color: getMessageColor(item.role)
        },
        `${item.prefix} ${item.text}`
      )
    )
  );
}

function getMessageColor(role) {
  if (role === 'user') return 'green';
  if (role === 'chain') return 'yellow';
  if (role === 'analysis') return 'magenta';
  if (role === 'plan') return 'blue';
  if (role === 'error') return 'red';

  return 'white';
}

function Prompt({ value, isRunning }) {
  const inputText = value.length > 0 ? value : 'Ask the prompt chain...';

  return React.createElement(
    Box,
    {
      borderStyle: 'single',
      borderColor: isRunning ? 'yellow' : 'green',
      paddingX: 1
    },
    React.createElement(Text, { color: 'green' }, '> '),
    React.createElement(Text, { color: value.length > 0 ? 'white' : 'gray' }, inputText),
    !isRunning && React.createElement(Text, { inverse: true }, ' ')
  );
}

function StatusBar({ isRunning }) {
  const status = isRunning ? `status: running prompt chain with ${getLlmMode()}` : `status: idle (${getLlmMode()})`;

  return React.createElement(
    Box,
    { marginTop: 1 },
    React.createElement(Text, { color: isRunning ? 'yellow' : 'gray' }, status)
  );
}

function App() {
  const { exit } = useApp();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  async function submitRequest(request) {
    const trimmed = request.trim();
    if (!trimmed || isRunning) return;

    setInput('');
    setIsRunning(true);
    setHistory((current) => [
      ...current,
      { role: 'user', prefix: 'user:', text: trimmed }
    ]);

    try {
      const result = await runPromptChain(trimmed, (item) => {
        setHistory((current) => [...current, item]);
      });

      setHistory((current) => [
        ...current,
        { role: 'assistant', prefix: 'assistant:', text: result.answer }
      ]);
    } catch (error) {
      setHistory((current) => [
        ...current,
        { role: 'error', prefix: 'error:', text: error.message }
      ]);
    } finally {
      setIsRunning(false);
    }
  }

  useInput((character, key) => {
    if (key.ctrl && character === 'c') {
      exit();
      return;
    }

    if (key.return) {
      submitRequest(input);
      return;
    }

    if (key.backspace || key.delete) {
      setInput((current) => current.slice(0, -1));
      return;
    }

    if (!isRunning && character) {
      setInput((current) => current + character);
    }
  });

  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(Header),
    React.createElement(History, { items: history }),
    React.createElement(Prompt, { value: input, isRunning }),
    React.createElement(StatusBar, { isRunning })
  );
}

render(React.createElement(App), {
  exitOnCtrlC: false
});
