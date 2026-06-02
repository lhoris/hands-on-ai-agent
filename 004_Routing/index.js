#!/usr/bin/env node
import React, { useState } from 'react';
import { Box, Text, render, useApp, useInput } from 'ink';
import { getLlmMode } from './llm-client.js';
import { runRoutingWorkflow } from './router.js';

function Header() {
  return React.createElement(
    Box,
    {
      borderStyle: 'round',
      borderColor: 'cyan',
      paddingX: 1
    },
    React.createElement(Text, { color: 'cyan', bold: true }, 'Routing Workflow')
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
  if (role === 'route') return 'yellow';
  if (role === 'workflow') return 'magenta';
  if (role === 'error') return 'red';

  return 'white';
}

function Prompt({ value, isRunning }) {
  const inputText = value.length > 0 ? value : 'Ask the router...';

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
  const status = isRunning ? `status: running routing workflow with ${getLlmMode()}` : `status: idle (${getLlmMode()})`;

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

    // UI 계층의 역할:
    // 사용자 입력을 받고, 진행 상태를 보여주고, 실제 workflow 실행은 router.js에 맡깁니다.
    setInput('');
    setIsRunning(true);
    setHistory((current) => [
      ...current,
      { role: 'user', prefix: 'user:', text: trimmed }
    ]);

    try {
      // runRoutingWorkflow()가 routing 로직을 담당합니다.
      // 콜백은 workflow 중간 단계를 UI history에 추가하기 위해 사용합니다.
      const result = await runRoutingWorkflow(trimmed, (item) => {
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
      // Enter를 누르면 하나의 routing workflow가 시작됩니다.
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
