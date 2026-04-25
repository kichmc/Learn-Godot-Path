import { Fragment } from "react";
import { KNOWN_NODE_NAMES, useOpenNode } from "@/lib/node-link";

const KEYWORDS = new Set([
  "var", "func", "if", "elif", "else", "extends", "return", "for", "while",
  "in", "and", "or", "not", "true", "false", "null", "pass", "break",
  "continue", "is", "as", "self", "class_name", "signal", "const",
  "static", "match", "enum", "export",
]);

const TYPES = new Set([
  "int", "float", "String", "bool", "Vector2", "Vector3", "Color",
  "Node", "Node2D", "Node3D", "CharacterBody2D", "CharacterBody3D",
  "Sprite2D", "Area2D", "RigidBody2D", "InputEventScreenTouch",
  "InputEventKey", "InputEventMouseMotion", "InputEventJoypad",
  "InputEvent", "Input",
]);

type Tok = { kind: string; value: string };

function tokenizeLine(line: string): Tok[] {
  const tokens: Tok[] = [];
  let i = 0;
  while (i < line.length) {
    const ch = line[i]!;

    // Comment
    if (ch === "#") {
      tokens.push({ kind: "com", value: line.slice(i) });
      break;
    }

    // String (single or double quoted)
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\" && j + 1 < line.length) j += 2;
        else j++;
      }
      j = Math.min(j + 1, line.length);
      tokens.push({ kind: "str", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j]!)) j++;
      tokens.push({ kind: "num", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier / keyword
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < line.length && /[A-Za-z0-9_]/.test(line[j]!)) j++;
      const word = line.slice(i, j);
      let kind = "id";
      if (KEYWORDS.has(word)) kind = "kw";
      else if (TYPES.has(word)) kind = "id";
      // function call
      if (kind === "id" && line[j] === "(") kind = "fn";
      // type-name capital
      if (kind === "id" && /^[A-Z]/.test(word)) kind = "id";
      tokens.push({ kind, value: word });
      i = j;
      continue;
    }

    // Operator / punctuation
    if (/[=+\-*/%<>!:,.()\[\]{}]/.test(ch)) {
      let j = i;
      while (j < line.length && /[=+\-*/%<>!]/.test(line[j]!)) j++;
      const op = line.slice(i, Math.max(j, i + 1));
      tokens.push({ kind: "op", value: op });
      i = i + op.length;
      continue;
    }

    // Whitespace / fallthrough
    tokens.push({ kind: "ws", value: ch });
    i++;
  }
  return tokens;
}

export function GdCode({ code }: { code: string }) {
  const lines = code.split("\n");
  const onOpenNode = useOpenNode();

  return (
    <pre className="gd-code" data-testid="gd-code">
      <code>
        {lines.map((line, li) => (
          <Fragment key={li}>
            {tokenizeLine(line).map((t, ti) => {
              if (t.kind === "ws") {
                return <Fragment key={ti}>{t.value}</Fragment>;
              }
              const isNodeLink =
                onOpenNode && KNOWN_NODE_NAMES.has(t.value);
              if (isNodeLink) {
                return (
                  <button
                    key={ti}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenNode!(t.value);
                    }}
                    data-testid={`node-link-${t.value}`}
                    title={`Learn about ${t.value}`}
                    className="gd-node-link"
                  >
                    {t.value}
                  </button>
                );
              }
              return (
                <span key={ti} className={t.kind}>
                  {t.value}
                </span>
              );
            })}
            {li < lines.length - 1 ? "\n" : ""}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}
