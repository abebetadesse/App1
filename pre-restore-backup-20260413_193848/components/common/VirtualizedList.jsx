import React from 'react';
import { FixedSizeList as List } from 'react-window';

export const VirtualizedList = ({ items, itemHeight, height, width, renderItem }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  );
  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width={width}
    >
      {Row}
    </List>
  );
};
