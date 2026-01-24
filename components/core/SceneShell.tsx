'use client';

import { ReactNode, forwardRef } from 'react';

const SceneShell = forwardRef<HTMLDivElement, { children: ReactNode }>(
    ({ children }, ref) => {
        return (
            <div
                ref={ref}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    willChange: 'transform',
                }}
            >
                {children}
            </div>
        );
    }
);

SceneShell.displayName = 'SceneShell';
export default SceneShell;
