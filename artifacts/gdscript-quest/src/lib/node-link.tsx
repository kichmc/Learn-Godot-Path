import { createContext, useContext, type ReactNode } from "react";
import { nodeDocs } from "@/data/nodes";

// Names that should become tappable links inside any GdCode block.
export const KNOWN_NODE_NAMES: ReadonlySet<string> = new Set(
  nodeDocs.map((n) => n.name),
);

type OpenNode = (name: string) => void;

const NodeLinkContext = createContext<OpenNode | null>(null);

export function NodeLinkProvider({
  onOpenNode,
  children,
}: {
  onOpenNode: OpenNode;
  children: ReactNode;
}) {
  return (
    <NodeLinkContext.Provider value={onOpenNode}>
      {children}
    </NodeLinkContext.Provider>
  );
}

export function useOpenNode(): OpenNode | null {
  return useContext(NodeLinkContext);
}
