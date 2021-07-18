/*
 * @since 2021-07-18 15:12:44
 * @author junbao <junbao@mymoement.com>
 */

import { hydrate, hydrateStatusBox } from 'amos-persist';
import { useDispatch, useSelector } from 'amos-react';
import { FC, ReactElement, useEffect } from 'react';

export interface PersistGateProps {
  children: ReactElement | null;
  loading?: ReactElement | null;
}

export const PersistGate: FC<PersistGateProps> = (props) => {
  const [hydrateStatus] = useSelector(hydrateStatusBox);
  const dispatch = useDispatch();
  useEffect(() => {
    if (hydrateStatus.status === 'PENDING') {
      dispatch(hydrate());
    }
  }, []);
  return hydrateStatus.status === 'PENDING' || hydrateStatus.status === 'HYDRATING'
    ? props.loading || null
    : props.children;
};
