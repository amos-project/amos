/*
 * @since 2024-11-15 00:35:48
 * @author junbao <junbao@moego.pet>
 */

import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
