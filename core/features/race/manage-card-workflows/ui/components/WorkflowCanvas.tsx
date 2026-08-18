import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { createPortal } from 'react-dom'
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { AttackSubAction, BuilderNode, WorkflowPaletteItem } from '../../model/workflow.builder'
import { createBuilderNode } from '../../model/workflow.builder'
import { WorkflowNodeCard } from './WorkflowNodeCard'

const nodeTypes = { workflow: WorkflowNodeCard }

type Props = {
  nodes: BuilderNode[]
  edges: Edge[]
  catalog: WorkflowPaletteItem[]
  onNodesChange: OnNodesChange<BuilderNode>
  onEdgesChange: OnEdgesChange<Edge>
  setNodes: React.Dispatch<React.SetStateAction<BuilderNode[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  onSelectNode: (nodeId: string | null) => void
}

const Canvas = ({ catalog, edges, nodes, onEdgesChange, onNodesChange, onSelectNode, setEdges, setNodes }: Props) => {
  const { screenToFlowPosition } = useReactFlow()
  const edgeMenuRef = useRef<HTMLDivElement>(null)
  const [edgeMenu, setEdgeMenu] = useState<{ edgeId: string; left: number; top: number } | null>(null)

  useEffect(() => {
    if (!edgeMenu) return
    const closeMenu = (event: PointerEvent) => {
      if (!edgeMenuRef.current?.contains(event.target as Node)) setEdgeMenu(null)
    }
    window.addEventListener('pointerdown', closeMenu)
    return () => window.removeEventListener('pointerdown', closeMenu)
  }, [edgeMenu])

  const onConnect = useCallback((connection: Connection) => {
    if (connection.target === 'trigger') return
    const source = nodes.find((node) => node.id === connection.source)
    if (source?.data.workflowType === 'attack.execute' && !source.data.config.subAction) return
    setEdges((current) => addEdge({
      ...connection,
      id: crypto.randomUUID(),
      animated: true,
      style: { stroke: '#de3336', strokeWidth: 2 },
    }, current))
  }, [nodes, setEdges])

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault()
    const paletteKey = event.dataTransfer.getData('application/move-workflow-node')
    const item = catalog.find((entry) => (entry.paletteKey ?? entry.type) === paletteKey && !entry.isTrigger)
    if (!item) return
    const node = createBuilderNode(item, screenToFlowPosition({ x: event.clientX, y: event.clientY }))
    setNodes((current) => [...current, node])
    onSelectNode(node.id)
  }, [catalog, onSelectNode, screenToFlowPosition, setNodes])

  const renderedNodes = nodes.map((node) => node.data.workflowType === 'attack.execute'
    ? {
        ...node,
        data: {
          ...node.data,
          onAttackSubActionSelect: (subAction: AttackSubAction) => {
            const previousSubAction = node.data.config.subAction
            setNodes((current) => current.map((item) => item.id === node.id
              ? { ...item, data: { ...item.data, config: { ...item.data.config, subAction } } }
              : item))
            if (previousSubAction && previousSubAction !== subAction) {
              setEdges((current) => current.filter((edge) => edge.source !== node.id))
            }
          },
        },
      }
    : node)

  return (
    <div className="h-full min-h-[520px] bg-[#fcfcfc]">
      <ReactFlow
        fitView
        nodes={renderedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        onEdgeClick={(event, edge) => {
          event.stopPropagation()
          setEdgeMenu({
            edgeId: edge.id,
            left: Math.min(event.clientX, window.innerWidth - 184),
            top: Math.min(event.clientY, window.innerHeight - 64),
          })
        }}
        onPaneClick={() => { onSelectNode(null); setEdgeMenu(null) }}
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move' }}
        onDrop={onDrop}
        defaultEdgeOptions={{ interactionWidth: 24 }}
      >
        <Background color="#e5e5e5" gap={20} size={1} />
        <Controls position="bottom-left" />
      </ReactFlow>
      {edgeMenu ? createPortal(
        <div
          ref={edgeMenuRef}
          role="menu"
          className="fixed z-[140] w-44 rounded-xl border border-[#e5e5e5] bg-white p-1.5 shadow-xl"
          style={{ left: edgeMenu.left, top: edgeMenu.top }}
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#b91c1c] hover:bg-[#fff1f1]"
            onClick={() => {
              setEdges((current) => current.filter((edge) => edge.id !== edgeMenu.edgeId))
              setEdgeMenu(null)
            }}
          >
            Xóa đường nối
          </button>
        </div>,
        document.body,
      ) : null}
    </div>
  )
}

export const WorkflowCanvas = (props: Props) => (
  <ReactFlowProvider><Canvas {...props} /></ReactFlowProvider>
)
