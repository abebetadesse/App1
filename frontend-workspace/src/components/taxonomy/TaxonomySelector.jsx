import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';

const TaxonomySelector = ({ onSelect, selectedIds = [], multiLevel = true }) => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    api.get('/taxonomy/tree')
      .then(res => setTree(res.data))
      .catch(err => console.error('Failed to load taxonomy', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (nodeId) => {
    setExpanded(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleSelect = (node) => {
    if (multiLevel) {
      onSelect(prev => {
        const exists = prev.find(n => n.id === node.id);
        if (exists) return prev.filter(n => n.id !== node.id);
        return [...prev, node];
      });
    } else {
      onSelect([node]);
    }
  };

  const renderNode = (node, depth = 0) => {
    const isExpanded = expanded[node.id];
    const isSelected = selectedIds.includes(node.id);
    return (
      <div key={node.id} style={{ marginLeft: depth * 20 }}>
        <div className="taxonomy-node">
          <button onClick={() => toggleExpand(node.id)}>
            {node.children?.length ? (isExpanded ? '▼' : '▶') : '•'}
          </button>
          <label>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelect(node)}
            />
            {node.name}
          </label>
        </div>
        {isExpanded && node.children?.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  if (loading) return <div>Loading taxonomy...</div>;
  return <div className="taxonomy-selector">{tree.map(node => renderNode(node))}</div>;
};

export default TaxonomySelector;
