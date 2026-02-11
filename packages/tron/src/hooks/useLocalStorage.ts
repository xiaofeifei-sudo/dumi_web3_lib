import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { isInBrowser } from '@tronweb3/tronwallet-abstract-adapter';

/**
 * 使用浏览器 LocalStorage 持久化状态的 Hook
 * - 初始化时从 LocalStorage 读取指定 key 的值；若无值则使用默认状态
 * - 当状态变化时自动写入或移除对应的 LocalStorage 项
 *
 * @param key LocalStorage 的键名
 * @param defaultState 默认状态值（当本地无记录时使用）
 * @returns 返回 [state, setState]，行为与 useState 一致
 */
export function useLocalStorage<T>(key: string, defaultState: T): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const value = localStorage.getItem(key);
            if (value) return JSON.parse(value) as T;
        } catch (error: unknown) {
            if (isInBrowser()) {
                console.error(error);
            }
        }

        return defaultState;
    });

    /**
     * 标记首次渲染，避免在挂载阶段立即写入 LocalStorage
     */
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        try {
            // 当状态为 null 时移除对应的键；否则写入序列化后的值
            if (state === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        } catch (error: any) {
            if (isInBrowser()) {
                console.error(error);
            }
        }
    }, [state, key]);

    return [state, setState];
}
