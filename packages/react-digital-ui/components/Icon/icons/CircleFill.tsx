import React from 'react';
import BaseIcon, { type IconProps } from '../BaseIcon';

export const CircleFill = (props: IconProps) => (
    <BaseIcon {...props}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-circle-fill"
            viewBox="0 0 16 16"
        >
            <circle cx="8" cy="8" r="8" />
        </svg>
    </BaseIcon>
);
