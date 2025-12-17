'use client';

import { useEffect, useRef, useState } from 'react';

interface OsintTarget {
  id: string;
  name: string;
  aliases: string[];
  emails: string[];
  phones: string[];
  urls: string[];
  tags: string[];
  notes: string;
  sources: { name: string; url?: string; type?: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Node {
  id: string;
  label: string;
  type: 'target' | 'email' | 'phone' | 'url' | 'alias' | 'tag';
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
}

export function OsintDiagram({ target }: { target: OsintTarget }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    // Build graph data
    const newNodes: Node[] = [];
    const newLinks: Link[] = [];
    const centerX = 400;
    const centerY = 300;

    // Center node (target name)
    newNodes.push({
      id: 'center',
      label: target.name,
      type: 'target',
      x: centerX,
      y: centerY,
    });

    // Calculate positions in circles around center
    const addNodesInCircle = (
      items: string[],
      type: Node['type'],
      radius: number,
      startAngle: number = 0
    ) => {
      items.forEach((item, i) => {
        const angle = startAngle + (i * 2 * Math.PI) / items.length;
        const id = `${type}-${i}`;
        newNodes.push({
          id,
          label: item,
          type,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
        newLinks.push({ source: 'center', target: id });
      });
    };

    // Add different entity types in circles
    if (target.emails.length > 0) addNodesInCircle(target.emails, 'email', 120, 0);
    if (target.phones.length > 0) addNodesInCircle(target.phones, 'phone', 180, Math.PI / 6);
    if (target.urls.length > 0) addNodesInCircle(target.urls, 'url', 240, Math.PI / 3);
    if (target.aliases.length > 0) addNodesInCircle(target.aliases, 'alias', 160, Math.PI / 2);
    if (target.tags.length > 0) addNodesInCircle(target.tags, 'tag', 200, (2 * Math.PI) / 3);

    setNodes(newNodes);
    setLinks(newLinks);
  }, [target]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 1.5;
    links.forEach((link) => {
      const sourceNode = nodes.find((n) => n.id === link.source);
      const targetNode = nodes.find((n) => n.id === link.target);
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isHovered = hoveredNode === node.id;
      const colors: Record<Node['type'], string> = {
        target: '#8B5CF6',
        email: '#3B82F6',
        phone: '#10B981',
        url: '#F59E0B',
        alias: '#EC4899',
        tag: '#6366F1',
      };

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? 12 : 8, 0, 2 * Math.PI);
      ctx.fillStyle = colors[node.type];
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#FFFFFF' : colors[node.type];
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = node.type === 'target' ? 'bold 14px sans-serif' : '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Background for text
      const textWidth = ctx.measureText(node.label).width;
      const padding = 4;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(
        node.x - textWidth / 2 - padding,
        node.y + 15,
        textWidth + padding * 2,
        20
      );

      // Text
      ctx.fillStyle = '#FFFFFF';
      const maxLength = 30;
      const displayLabel =
        node.label.length > maxLength ? node.label.substring(0, maxLength) + '...' : node.label;
      ctx.fillText(displayLabel, node.x, node.y + 25);
    });
  }, [nodes, links, hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find hovered node
    const hovered = nodes.find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 12;
    });

    setHoveredNode(hovered ? hovered.id : null);
  };

  const getTypeIcon = (type: Node['type']) => {
    const icons = {
      target: '🎯',
      email: '📧',
      phone: '📱',
      url: '🔗',
      alias: '👤',
      tag: '🏷️',
    };
    return icons[type];
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Diagrama de Relaciones</h3>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full border border-white/10 rounded-lg bg-neutral-900"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredNode(null)}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Leyenda</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(['target', 'email', 'phone', 'url', 'alias', 'tag'] as const).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <span className="text-lg">{getTypeIcon(type)}</span>
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    type === 'target'
                      ? '#8B5CF6'
                      : type === 'email'
                        ? '#3B82F6'
                        : type === 'phone'
                          ? '#10B981'
                          : type === 'url'
                            ? '#F59E0B'
                            : type === 'alias'
                              ? '#EC4899'
                              : '#6366F1',
                }}
              />
              <span className="text-sm text-neutral-300 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {target.emails.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              📧 Emails ({target.emails.length})
            </h4>
            <ul className="space-y-1">
              {target.emails.map((email, i) => (
                <li key={i} className="text-sm text-neutral-300 truncate">
                  {email}
                </li>
              ))}
            </ul>
          </div>
        )}

        {target.phones.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              📱 Teléfonos ({target.phones.length})
            </h4>
            <ul className="space-y-1">
              {target.phones.map((phone, i) => (
                <li key={i} className="text-sm text-neutral-300">
                  {phone}
                </li>
              ))}
            </ul>
          </div>
        )}

        {target.urls.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              🔗 URLs ({target.urls.length})
            </h4>
            <ul className="space-y-1">
              {target.urls.map((url, i) => (
                <li key={i} className="text-sm text-blue-400 truncate">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {target.aliases.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              👤 Aliases ({target.aliases.length})
            </h4>
            <ul className="space-y-1">
              {target.aliases.map((alias, i) => (
                <li key={i} className="text-sm text-neutral-300">
                  {alias}
                </li>
              ))}
            </ul>
          </div>
        )}

        {target.tags.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              🏷️ Tags ({target.tags.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {target.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {target.notes && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              📝 Notas
            </h4>
            <p className="text-sm text-neutral-300 whitespace-pre-wrap">{target.notes}</p>
          </div>
        )}

        {target.sources && target.sources.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              🔍 Fuentes ({target.sources.length})
            </h4>
            <ul className="space-y-2">
              {target.sources.map((source, i) => (
                <li key={i} className="text-sm">
                  <span className="text-white font-medium">{source.name}</span>
                  {source.type && (
                    <span className="ml-2 text-neutral-400">({source.type})</span>
                  )}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-400 hover:underline"
                    >
                      Ver fuente →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Creado:</span>
            <span className="ml-2 text-white">
              {new Date(target.createdAt).toLocaleString('es-CL')}
            </span>
          </div>
          <div>
            <span className="text-neutral-400">Actualizado:</span>
            <span className="ml-2 text-white">
              {new Date(target.updatedAt).toLocaleString('es-CL')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
