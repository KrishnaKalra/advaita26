'use client';

import { ReactNode } from 'react';

export default function SceneStage({ children }: { children: ReactNode }) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                overflow: 'hidden',
                background: 'black',
            }}
        >
            {children}
        </div>
    );
}
