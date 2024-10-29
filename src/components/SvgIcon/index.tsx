import React, { useMemo } from 'react';

export interface SvgIconProps {
  name: string;
  prefix?: string;
  color?: string;
  fontSize?: string;
  style?: object;
  className?: string;
  [props: string]: any;
}

export default function SvgIcon({ name, prefix = 'icon', color = 'currentColor', fontSize = '0.24rem', style = {}, className = '', ...props }: SvgIconProps) {
  const symbolId = useMemo(() => `#${prefix}-${name}`, [name]);

  return (
    <svg {...props} className={className} aria-hidden="true" style={{ ...svgStyle, fontSize, ...style }}>
      <use href={symbolId} fill={color} />
    </svg>
  );
}

const svgStyle = {
  overflow: 'hidden',
  fill: 'currentColor', // 颜色值
};
